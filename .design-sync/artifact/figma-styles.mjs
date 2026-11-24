// Downloads the colour, text and effect styles a Figma file publishes, with their
// exact values, through the Figma REST API.
//
//   node .design-sync/artifact/figma-styles.mjs <fileKey> --out <styles.json>
//
// Needs a personal access token in FIGMA_TOKEN (read-only scope is enough).
// The token is sent only to api.figma.com and never printed. Writes
// [{id, name, type, description, value, page?}] where value is
//   FILL:   ["#rrggbb" | "rgba(...)" | "linear-gradient(...)", ...]
//   TEXT:   {fontFamily, fontSize, fontWeight, lineHeight, letterSpacing}
//   EFFECT: ["0px 8px 16px 0px rgba(...)", ...] (drop and inner shadows)
//   GRID:   the raw layout grids
// Local variables are fetched too when the plan allows it (Enterprise);
// otherwise the file records that they were not available.
import fs from "node:fs";

const argv = process.argv.slice(2);
const fileKey = argv.find((a) => !a.startsWith("--"));
const out = argv[argv.indexOf("--out") + 1];
const token = process.env.FIGMA_TOKEN;
if (!fileKey || !argv.includes("--out")) {
  console.error("usage: figma-styles.mjs <fileKey> --out <styles.json>");
  process.exit(2);
}
if (!token) {
  console.error("FIGMA_TOKEN is not set");
  process.exit(2);
}

const api = async (path) => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(`https://api.figma.com${path}`, {
      headers: { "X-Figma-Token": token },
    });
    if (res.status === 429) {
      const wait = Number(res.headers.get("retry-after") ?? 10);
      console.error(`rate limited, waiting ${wait}s`);
      await new Promise((r) => setTimeout(r, wait * 1000));
      continue;
    }
    const body = await res.json().catch(() => ({}));
    return { status: res.status, body };
  }
  throw new Error(`gave up on ${path} after repeated rate limits`);
};

const hex2 = (n) =>
  Math.round(n * 255)
    .toString(16)
    .padStart(2, "0");
const colour = ({ r, g, b, a = 1 }, opacity = 1) => {
  const alpha = +(a * opacity).toFixed(3);
  return alpha >= 1
    ? `#${hex2(r)}${hex2(g)}${hex2(b)}`
    : `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
};
const paint = (p) => {
  if (p.visible === false) return null;
  if (p.type === "SOLID") return colour(p.color, p.opacity ?? 1);
  if (p.type?.startsWith("GRADIENT"))
    return `${p.type.toLowerCase()}(${p.gradientStops
      .map(
        (s) =>
          `${colour(s.color, p.opacity ?? 1)} ${+(s.position * 100).toFixed(1)}%`,
      )
      .join(", ")})`;
  return p.type;
};
const px = (n) => `${+n.toFixed(2)}px`;
const effect = (e) =>
  e.visible === false
    ? null
    : e.type === "DROP_SHADOW" || e.type === "INNER_SHADOW"
      ? `${e.type === "INNER_SHADOW" ? "inset " : ""}${px(e.offset.x)} ${px(e.offset.y)} ${px(e.radius)} ${px(e.spread ?? 0)} ${colour(e.color)}`
      : `${e.type.toLowerCase()} ${px(e.radius)}`;

const file = await api(`/v1/files/${fileKey}?depth=1`);
if (file.status !== 200) {
  console.error(
    `GET file: HTTP ${file.status} ${file.body?.err ?? file.body?.message ?? ""}`,
  );
  process.exit(1);
}
// The styles the file publishes as a library, by the node that defines each.
const published = await api(`/v1/files/${fileKey}/styles`);
if (published.status !== 200) {
  console.error(`GET styles: HTTP ${published.status}`);
  process.exit(1);
}
const styleMeta = {};
for (const s of published.body.meta?.styles ?? [])
  styleMeta[s.node_id] = {
    name: s.name,
    styleType: s.style_type,
    description: s.description,
  };
const ids = Object.keys(styleMeta);
console.error(`${file.body.name}: ${ids.length} published styles`);

const styles = [];
for (let i = 0; i < ids.length; i += 100) {
  const batch = ids.slice(i, i + 100);
  const res = await api(
    `/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(batch.join(","))}`,
  );
  if (res.status !== 200) {
    console.error(`GET nodes: HTTP ${res.status}`);
    process.exit(1);
  }
  for (const id of batch) {
    const meta = styleMeta[id];
    const doc = res.body.nodes?.[id]?.document;
    let value = null;
    if (doc) {
      if (meta.styleType === "FILL")
        value = (doc.fills ?? []).map(paint).filter(Boolean);
      else if (meta.styleType === "TEXT") {
        const s = doc.style ?? {};
        value = {
          fontFamily: s.fontFamily,
          fontSize: s.fontSize != null ? px(s.fontSize) : undefined,
          fontWeight: s.fontWeight,
          lineHeight:
            s.lineHeightUnit === "PIXELS" || s.lineHeightPx
              ? px(s.lineHeightPx)
              : undefined,
          letterSpacing: s.letterSpacing ? px(s.letterSpacing) : undefined,
        };
      } else if (meta.styleType === "EFFECT")
        value = (doc.effects ?? []).map(effect).filter(Boolean);
      else value = doc.layoutGrids ?? null;
    }
    styles.push({
      id,
      name: meta.name,
      type: meta.styleType,
      description: meta.description || undefined,
      value,
    });
  }
}

const vars = await api(`/v1/files/${fileKey}/variables/local`);
const variables =
  vars.status === 200
    ? vars.body.meta
    : {
        unavailable:
          `HTTP ${vars.status}: ${vars.body?.message ?? vars.body?.err ?? ""}`.trim(),
      };

fs.writeFileSync(
  out,
  `${JSON.stringify(
    {
      file: file.body.name,
      lastModified: file.body.lastModified,
      version: file.body.version,
      fetched: new Date().toISOString(),
      styles,
      variables,
    },
    null,
    2,
  )}\n`,
);
const by = {};
for (const s of styles) by[s.type] = (by[s.type] ?? 0) + 1;
console.error(
  `wrote ${out}: ${Object.entries(by)
    .map(([k, n]) => `${k} ${n}`)
    .join(
      ", ",
    )}; variables ${variables.unavailable ? `not available (${variables.unavailable})` : "fetched"}`,
);
