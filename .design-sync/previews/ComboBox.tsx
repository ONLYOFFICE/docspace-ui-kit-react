import * as React from "react";
import * as S from "@ds-stories/components/combobox/ComboBox.stories";

function compose(S: any, key: string) {
  const meta: any = S.default ?? {};
  const st: any = S[key];
  const args: any = { ...(meta.args ?? {}), ...(st && st.args ? st.args : {}) };
  // Storybook resolves argTypes.mapping (control value -> real arg) before
  // rendering; mirror that so mapped args don't render raw.
  const at: any = {
    ...(meta.argTypes ?? {}),
    ...(st && st.argTypes ? st.argTypes : {}),
  };
  for (const k of Object.keys(args)) {
    const m = at[k] && at[k].mapping;
    if (m && typeof m === "object" && args[k] in m) args[k] = m[args[k]];
  }
  const title: string = typeof meta.title === "string" ? meta.title : "";
  const ctx: any = {
    args,
    name: key,
    title,
    kind: title,
    id: "",
    componentId: "",
    globals: {},
    viewMode: "story",
    parameters: (st && st.parameters) ?? meta.parameters ?? {},
  };
  let render: (() => any) | null = null;
  if (st && typeof st.render === "function")
    render = () => st.render(args, ctx);
  else if (typeof st === "function") render = () => st(args, ctx);
  else if (typeof meta.render === "function")
    render = () => meta.render(args, ctx);
  else {
    const C = (st && st.component) || meta.component;
    if (C) render = () => React.createElement(C, args);
  }
  if (!render) return () => null;
  // [].concat: a single function is legal CSF decorator shorthand. A
  // decorator returning undefined (stubbed addon) falls through to the inner
  // render — otherwise one unrecognized addon blanks the cell silently.
  const decorators: any[] = ([] as any[])
    .concat((st && st.decorators) ?? [])
    .concat(meta.decorators ?? []);
  return decorators.reduce(
    (inner: any, dec: any) => () => {
      const out = dec(inner, ctx);
      return out === undefined ? inner() : out;
    },
    render,
  );
}

// OWNED: the story's play function opens the list/calendar, which previews do
// not run, so the cell showed only the closed trigger. Click the trigger once
// after mount - the state the play function reaches.
function openOnMount(Story: any, selector: string) {
  return function Opened() {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      const el = ref.current?.querySelector(selector) as HTMLElement | null;
      el?.click();
    }, []);
    return (
      <div ref={ref} style={{ display: "contents" }}>
        <Story />
      </div>
    );
  };
}

export const Default = /* Default */ compose(S, "Default");
export const DifferentSizes = /* Different Sizes */ compose(
  S,
  "DifferentSizes",
);
export const WithIcons = /* With Icons */ compose(S, "WithIcons");
export const WithOptionDescriptions =
  /* With Option Descriptions */ openOnMount(
    compose(S, "WithOptionDescriptions"),
    '[aria-expanded="false"]',
  );
export const Disabled = /* Disabled */ compose(S, "Disabled");
export const WithSelectedOption = /* With Selected Option */ compose(
  S,
  "WithSelectedOption",
);
export const CustomStyling = /* Custom Styling */ compose(S, "CustomStyling");
export const LoadingState = /* Loading State */ compose(S, "LoadingState");
export const RightToLeft = /* Right To Left */ compose(S, "RightToLeft");
export const CssCustomization = /* Css Customization */ compose(
  S,
  "CssCustomization",
);
