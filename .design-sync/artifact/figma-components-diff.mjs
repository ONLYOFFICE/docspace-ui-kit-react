// Compares the components a Figma file publishes with the kit's components,
// and their variant properties with what the kit supports.
//
//   node .design-sync/artifact/figma-components-diff.mjs <components.json> --out <diff.json>
//
// <components.json> comes from figma-components.mjs. Every Figma component
// set (a component with variants) is matched to a kit component, then every
// option of every variant property is checked against the kit.
//
// Matching a set: SET_RULES below, written by hand from what each Figma set
// draws and what each kit component is (its README's first sentence). Only
// clear one-to-one cases are listed; every other set is reported unmatched -
// most of those are product screens and blocks (a concrete dialog, a panel),
// not components. The rules are part of the output, so they can be checked.
//
// An option is "in the kit" when (first that applies):
//   - it is a value of a kit prop of the same name (Type=Primary -> type);
//   - it is a number and the prop's documentation gives that px size
//     (Size=40: "`normal` 40px");
//   - it names a boolean prop (Disabled -> isDisabled, Checked -> isChecked);
//   - it is an interaction state the component's stylesheet styles
//     (Hover -> :hover, Pressed/Click -> :active, Focus -> :focus);
//   - it is a neutral value (Default, False, Off);
//   - the property is Theme and the value Light or Dark: the theme comes from
//     ThemeProviderComponent, not from a prop.
// Anything else is reported as not in the kit, with the property and value.
import fs from "node:fs";
import path from "node:path";

import { kitComponents } from "./kit-components.mjs";

const argv = process.argv.slice(2);
const input = argv.find((a) => !a.startsWith("--"));
const out = argv[argv.indexOf("--out") + 1];
if (!input || !argv.includes("--out")) {
  console.error(
    "usage: figma-components-diff.mjs <components.json> --out <diff.json>",
  );
  process.exit(2);
}
const F = JSON.parse(fs.readFileSync(input, "utf8"));
const repo = process.cwd();
const kit = kitComponents(repo);
const kitByName = new Map(kit.map((c) => [c.name, c]));

// [page (exact name), set name (regexp, whole name), kit components]
export const SET_RULES = [
  ["Buttons", /Main buttons/, ["Button"]],
  ["Buttons", /Link buttons/, ["Link"]],
  ["Buttons", /Icon buttons.*/, ["IconButton"]],
  ["Buttons", /Add buttons/, ["AddButton"]],
  ["Avatar", /Userpic/, ["Avatar"]],
  ["Badges", /.*/, ["Badge"]],
  ["Checkbox", /Checkbox( \+ Text)?/, ["Checkbox"]],
  ["Radiobuttons", /Radiobuttons( \+ Text)?/, ["RadioButton"]],
  ["Switches", /Switcher/, ["ToggleButton"]],
  ["Scrolls", /Scrolls/, ["Scrollbar"]],
  ["Slider", /Circle|Zoom|Volume|Rectangle/, ["Slider"]],
  ["Slider", /Color/, ["ColorPicker"]],
  ["Tabs", /Tabs/, ["Tabs"]],
  ["Tabs", /Item/, ["TabItem"]],
  ["Tags", /Сhips|Room tags|Filter tags/, ["Tag"]],
  ["Toast", /Toast/, ["Toast"]],
  ["Tooltip", /Tooltip/, ["Tooltip"]],
  ["Text Field", /States|Input|Placeholder|Type/, ["TextInput"]],
  ["Text Field", /Label/, ["Label"]],
  ["Text Area", /Text Area|V2/, ["Textarea"]],
  ["Search", /Search/, ["SearchInput"]],
  ["Loader", /Loader|Small loader|big loader/, ["Loader"]],
  ["Loader", /Progress/, ["ProgressBar"]],
  ["Calendar", /Calendar/, ["Calendar"]],
  ["Context Menu", /Items|States|Types/, ["ContextMenu"]],
  ["Menu", /Item/, ["DropDownItem"]],
  ["Bread crumbs", /.*/, ["Navigation"]],
  ["Floating Action Button (FAB)", /.*/, ["FloatingButton"]],
  ["Table Header", /Headlines/, ["TableHeader"]],
  ["Rows (Table & Sidebar)", /Rows/, ["Row"]],
  ["Thumbnail", /File&Folder/, ["FileTile", "FolderTile"]],
  ["Thumbnail", /Room/, ["RoomTile"]],
  ["Empty Screen", /Content area/, ["EmptyView"]],
  ["Action Menu. Touch", /.*/, ["MainButtonMobile"]],
];
// Pages that are not components: the file's own sections.
const NOT_COMPONENTS = new Set([
  "Changelog",
  "Draft",
  "Effects",
  "Icons",
  "System components",
  "Preview Theme",
]);
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const ruleFor = (s) =>
  SET_RULES.find(
    ([page, name]) =>
      page === s.page && new RegExp(`^(?:${name.source})$`).test(s.name),
  );

// Interaction states per kit folder, from its stylesheets.
const cssStates = new Map();
const statesOf = (folder) => {
  if (!folder) return new Set();
  if (cssStates.has(folder)) return cssStates.get(folder);
  const s = new Set();
  const dir = path.join(repo, folder);
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".scss") && !e.name.includes(".stories.")) {
        const t = fs.readFileSync(p, "utf8");
        for (const st of [
          "hover",
          "active",
          "focus",
          "focus-visible",
          "disabled",
          "checked",
        ])
          if (t.includes(`:${st}`)) s.add(st);
        // Layout that changes with the screen: the kit's device mixins or a
        // media query.
        if (
          /mixins\.(mobile|tablet|desktop|touch)|@media|@include (mobile|tablet)/.test(
            t,
          )
        )
          s.add("responsive");
      } else if (/\.tsx$/.test(e.name) && !/\.(stories|test)\./.test(e.name)) {
        if (
          /\bisMobile\b|\bisTablet\b|\bisTouchDevice\b/.test(
            fs.readFileSync(p, "utf8"),
          )
        )
          s.add("responsive");
      }
    }
  };
  if (fs.existsSync(dir)) walk(dir);
  cssStates.set(folder, s);
  return s;
};

const STATE_CSS = {
  hover: "hover",
  hovered: "hover",
  pressed: "active",
  press: "active",
  click: "active",
  clicked: "active",
  active: "active",
  actived: "active",
  focus: "focus",
  focused: "focus",
  disabled: "disabled",
  checked: "checked",
};
const STATE_PROP = {
  hover: ["ishovered"],
  hovered: ["ishovered"],
  pressed: ["isclicked", "isactive", "ispressed"],
  click: ["isclicked"],
  clicked: ["isclicked"],
  active: ["isactive", "isclicked"],
  actived: ["isactive", "isclicked"],
  disabled: ["isdisabled"],
  disable: ["isdisabled"],
  error: ["haserror"],
  warning: ["haswarning"],
  checked: ["ischecked"],
  selected: ["isselected", "ischecked"],
  indeterminate: ["isindeterminate"],
  loading: ["isloading"],
  loader: ["isloading"],
  readonly: ["isreadonly"],
  open: ["isopen", "open", "visible", "opened"],
  opened: ["isopen", "open", "opened"],
};
const NEUTRAL = new Set([
  "default",
  "normal",
  "regular",
  "base",
  "false",
  "off",
  "no",
  "none",
  "enabled",
  "rest",
]);

function optionInKit(prop, option, comps) {
  const o = norm(option);
  const p = norm(prop);
  const props = comps.flatMap((c) => c.props);
  if (p === "theme" && (o === "light" || o === "dark"))
    return "тема приложения (ThemeProvider)";
  // Device=Desktop|Tablet|Mobile|Touchscreen: the component adapts itself.
  if (p === "device" && comps.some((c) => statesOf(c.folder).has("responsive")))
    return "адаптивная вёрстка (сам компонент)";
  // same-named prop with this value
  for (const k of props.filter((k) =>
    [p, `is${p}`, `has${p}`].includes(norm(k.name)),
  ))
    if (k.values?.some((v) => norm(v) === o))
      return `${k.name}: ${k.values.find((v) => norm(v) === o)}`;
  // px size in the prop's documentation: "`normal` 40px"
  const px = /^(\d+(?:\.\d+)?)(?:px)?$/.exec(option.trim())?.[1];
  if (px) {
    for (const k of props) {
      const m = new RegExp(`\`(\\w+)\`\\s*\\(?${px}px`).exec(k.doc ?? "");
      if (m) return `${k.name}: ${m[1]} (${px}px)`;
    }
  }
  // A yes/partial value of a property named for a state: Selected=Yes ->
  // isChecked, Selected=Partial -> isIndeterminate, Off/On=True -> isChecked.
  const TRUTHY = new Set(["true", "yes", "on"]);
  if (TRUTHY.has(o) || o === "partial") {
    const want =
      o === "partial"
        ? ["isindeterminate"]
        : [...(STATE_PROP[p] ?? []), ...(p === "offon" ? ["ischecked"] : [])];
    const k = props.find(
      (k) => k.values?.[0] === "true" && want.includes(norm(k.name)),
    );
    if (k) return k.name;
  }
  const bool = props.find(
    (k) =>
      k.values?.[0] === "true" &&
      ([o, `is${o}`, `has${o}`].includes(norm(k.name)) ||
        (STATE_PROP[o] ?? []).includes(norm(k.name))),
  );
  if (bool) return `${bool.name}`;
  const css = STATE_CSS[o];
  if (css && comps.some((c) => statesOf(c.folder).has(css)))
    return `CSS :${css}`;
  if (NEUTRAL.has(o)) return "по умолчанию";
  if (
    (o === "true" || o === "on" || o === "yes") &&
    props.some((k) => norm(k.name).includes(p))
  )
    return `${props.find((k) => norm(k.name).includes(p)).name}`;
  // a value of any prop (Type=Primary when the kit says primary: boolean)
  const anyBool = props.find(
    (k) => k.values?.[0] === "true" && norm(k.name) === o,
  );
  if (anyBool) return anyBool.name;
  for (const k of props)
    if (
      k.values &&
      k.values[0] !== "true" &&
      k.values.some((v) => norm(v) === o)
    )
      return `${k.name}: ${k.values.find((v) => norm(v) === o)}`;
  return null;
}

// The kit has a prop of this name, with other values: named differently, not
// missing. Returns the kit's values, or null.
// Props that pass an HTML attribute through (an input's type, a button's
// type, a link's target) share a name with design properties by accident.
const HTML_VALUES = new Set([
  "text",
  "password",
  "email",
  "tel",
  "button",
  "submit",
  "reset",
  "blank",
  "self",
  "parent",
  "top",
  "ltr",
  "rtl",
]);
function renamedIn(prop, comps) {
  const p = norm(prop);
  const k = comps
    .flatMap((c) => c.props)
    .find(
      (k) =>
        norm(k.name) === p &&
        k.values &&
        k.values[0] !== "true" &&
        !k.values.some((v) => HTML_VALUES.has(norm(v))),
    );
  return k ? `${k.name}: ${k.values.join(" / ")}` : null;
}

const result = {
  fetched: F.fetched,
  rules: SET_RULES.map(([p, n, k]) => ({
    page: p.replace(/\\/g, ""),
    set: n.source,
    kit: k,
  })),
  notComponents: [...NOT_COMPONENTS],
  sets: [],
  pages: [],
  kitOnly: [],
  kitFolders: kit.map((c) => ({ name: c.name, folder: c.folder ?? null })),
};
const matchedKit = new Set();
for (const s of F.sets) {
  if (NOT_COMPONENTS.has(s.page)) continue;
  const rule = ruleFor(s);
  const comps = rule
    ? rule[2].map((n) => kitByName.get(n)).filter(Boolean)
    : [];
  const how = comps.length ? "rule" : "none";
  comps.forEach((c) => matchedKit.add(c.name));
  const props = Object.entries(s.properties).map(([name, p]) => {
    const renamed = comps.length ? renamedIn(name, comps) : null;
    return {
      name,
      options: p.options.map((option) => {
        const kitHas = comps.length ? optionInKit(name, option, comps) : null;
        return {
          option,
          status: !comps.length
            ? "unmatched"
            : kitHas
              ? "ok"
              : renamed
                ? "renamed"
                : "missing",
          kit: kitHas ?? renamed,
        };
      }),
    };
  });
  result.sets.push({
    page: s.page,
    name: s.name,
    frame: s.frame,
    variants: s.variants.length,
    match: how,
    kit: comps.map((c) => c.name),
    props,
  });
}
for (const p of [
  ...new Set(F.sets.map((s) => s.page).concat(F.components.map((c) => c.page))),
].sort()) {
  if (NOT_COMPONENTS.has(p)) continue;
  const sets = result.sets.filter((s) => s.page === p);
  result.pages.push({
    page: p,
    sets: sets.length,
    matched: sets.filter((s) => s.match !== "none").length,
    standalone: F.components.filter((c) => c.page === p).length,
    kit: [...new Set(sets.flatMap((s) => s.kit))],
  });
}
for (const c of kit)
  if (!matchedKit.has(c.name))
    result.kitOnly.push({
      name: c.name,
      group: c.group ?? null,
      folder: c.folder ?? null,
    });

fs.writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`);
const opts = result.sets.flatMap((s) => s.props.flatMap((p) => p.options));
const by = (h) => result.sets.filter((s) => s.match === h).length;
console.error(
  `sets ${result.sets.length}: by rule ${by("rule")}, unmatched ${by("none")}; options ${opts.length}, ok ${opts.filter((o) => o.status === "ok").length}, renamed ${opts.filter((o) => o.status === "renamed").length}, missing ${opts.filter((o) => o.status === "missing").length}; kit components with no Figma set ${result.kitOnly.length}`,
);
