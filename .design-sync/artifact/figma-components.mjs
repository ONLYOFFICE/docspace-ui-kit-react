// Downloads the components a Figma file publishes and their variant
// properties, through the Figma REST API.
//
//   node .design-sync/artifact/figma-components.mjs <fileKey> --out <components.json> [--geometry]
//
// Needs FIGMA_TOKEN, like figma-styles.mjs; the token is sent only to
// api.figma.com and never printed.
//
// Two kinds of call, with different limits. The component listings
// (/components, /component_sets) are light and enough for names, pages and
// variants: a variant component is named "Size=Small, State=Hover", so the
// set's properties and their options are read from its variants' names. The
// node contents (/nodes) are a heavy call that Figma limits hard for seats
// without edit rights - a Pro "low" seat gets a handful a month - so the
// variants' sizes (height, auto-layout padding and gap, corner radius) are
// fetched only with --geometry, from a token whose seat allows it.
//
// Writes
//   { file, fetched, pages, geometry: bool,
//     sets: [{ id, name, page, frame, description, properties:
//              { <name>: { options } }, variants: [{ id, name, values,
//              geometry? }] }],
//     components: [{ id, name, page, frame, description }] }
// where `components` are the published components outside any set.
import fs from "node:fs";

const argv = process.argv.slice(2);
const fileKey = argv.find((a) => !a.startsWith("--"));
const out = argv[argv.indexOf("--out") + 1];
const withGeometry = argv.includes("--geometry");
const token = process.env.FIGMA_TOKEN;
if (!fileKey || !argv.includes("--out")) {
  console.error(
    "usage: figma-components.mjs <fileKey> --out <components.json> [--geometry]",
  );
  process.exit(2);
}
if (!token) {
  console.error("FIGMA_TOKEN is not set");
  process.exit(2);
}

const api = async (path) => {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(`https://api.figma.com${path}`, {
      headers: { "X-Figma-Token": token },
    });
    if (res.status === 429) {
      const wait = Number(res.headers.get("retry-after") ?? 15);
      // A wait of hours means a spent monthly allowance, not a burst limit.
      if (wait > 300)
        throw new Error(
          `GET ${path.split("?")[0]}: rate limited for ${Math.round(wait / 3600)} h (seat ${res.headers.get("x-figma-plan-tier")}/${res.headers.get("x-figma-rate-limit-type")}); run it with a token whose seat allows this call`,
        );
      console.error(`rate limited, waiting ${wait}s`);
      await new Promise((r) => setTimeout(r, wait * 1000));
      continue;
    }
    if (res.status !== 200)
      throw new Error(`GET ${path.split("?")[0]}: HTTP ${res.status}`);
    return res.json();
  }
  throw new Error(`gave up on ${path} after repeated rate limits`);
};

// Page names carry a status emoji ("🟢Buttons"); keep the words.
const page = (cf) => (cf?.pageName ?? "").replace(/^[^A-Za-z(]+/u, "").trim();
// "Size=Small, State=Hover" -> { Size: "Small", State: "Hover" }
const valuesOf = (name) =>
  Object.fromEntries(
    name
      .split(/,\s*/)
      .map((kv) => kv.split("="))
      .filter((p) => p.length === 2)
      .map(([k, v]) => [k.trim(), v.trim()]),
  );

const setsMeta = (await api(`/v1/files/${fileKey}/component_sets`)).meta
  .component_sets;
const compsMeta = (await api(`/v1/files/${fileKey}/components`)).meta
  .components;
console.error(
  `${setsMeta.length} component sets, ${compsMeta.length} components`,
);

const sets = setsMeta.map((s) => {
  const variants = compsMeta
    .filter(
      (c) => c.containing_frame?.containingStateGroup?.nodeId === s.node_id,
    )
    .map((c) => ({ id: c.node_id, name: c.name, values: valuesOf(c.name) }));
  const properties = {};
  for (const v of variants)
    for (const [k, val] of Object.entries(v.values)) {
      properties[k] ??= { options: [] };
      if (!properties[k].options.includes(val)) properties[k].options.push(val);
    }
  return {
    id: s.node_id,
    name: s.name,
    page: page(s.containing_frame),
    frame: s.containing_frame?.name,
    description: s.description || undefined,
    properties,
    variants,
  };
});

if (withGeometry) {
  const byId = new Map(sets.flatMap((s) => s.variants.map((v) => [v.id, v])));
  const ids = [...byId.keys()];
  const r2 = (n) => (n == null ? undefined : Math.round(n * 100) / 100);
  for (let i = 0; i < ids.length; i += 100) {
    const batch = ids.slice(i, i + 100);
    const res = await api(
      `/v1/files/${fileKey}/nodes?depth=0&ids=${encodeURIComponent(batch.join(","))}`,
    );
    for (const id of batch) {
      const v = res.nodes?.[id]?.document;
      if (!v) continue;
      const b = v.absoluteBoundingBox ?? {};
      byId.get(id).geometry = {
        width: r2(b.width),
        height: r2(b.height),
        padding: v.layoutMode
          ? [v.paddingTop, v.paddingRight, v.paddingBottom, v.paddingLeft].map(
              (n) => r2(n ?? 0),
            )
          : undefined,
        gap: v.layoutMode ? r2(v.itemSpacing ?? 0) : undefined,
        radius:
          v.rectangleCornerRadii ??
          (v.cornerRadius != null ? r2(v.cornerRadius) : undefined),
      };
    }
    console.error(`  geometry: ${Math.min(i + 100, ids.length)}/${ids.length}`);
  }
}

const components = compsMeta
  .filter((c) => !c.containing_frame?.containingStateGroup)
  .map((c) => ({
    id: c.node_id,
    name: c.name,
    page: page(c.containing_frame),
    frame: c.containing_frame?.name,
    description: c.description || undefined,
  }));

const pages = [
  ...new Set([...sets, ...components].map((x) => x.page).filter(Boolean)),
].sort();
fs.writeFileSync(
  out,
  `${JSON.stringify(
    {
      file: fileKey,
      fetched: new Date().toISOString(),
      geometry: withGeometry,
      pages,
      sets,
      components,
    },
    null,
    2,
  )}\n`,
);
console.error(
  `wrote ${out}: ${pages.length} pages, ${sets.length} sets (${sets.reduce((n, s) => n + s.variants.length, 0)} variants), ${components.length} standalone components${withGeometry ? ", with geometry" : ""}`,
);
