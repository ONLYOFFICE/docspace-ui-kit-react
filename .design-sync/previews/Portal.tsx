import * as React from "react";
import * as S from "@ds-stories/components/portal/Portal.stories";

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
  const story = decorators.reduce(
    (inner: any, dec: any) => () => {
      const out = dec(inner, ctx);
      return out === undefined ? inner() : out;
    },
    render,
  );
  // OWNED: the portal popups are position:fixed at top 30/50/70% of the
  // viewport. In the preview their containing block is the transformed
  // .ds-single wrapper, only as tall as the story, so they bunched near the
  // top. A viewport-tall box (700 - 2x24 padding) puts them where Storybook
  // draws them.
  return () =>
    React.createElement("div", { style: { minHeight: 652 } }, story());
}

export const Default = /* Default */ compose(S, "Default");
export const Hidden = /* Hidden */ compose(S, "Hidden");
export const CustomContainer = /* Custom Container */ compose(
  S,
  "CustomContainer",
);
export const MultiplePortals = /* Multiple Portals */ compose(
  S,
  "MultiplePortals",
);
export const ToggleVisibility = /* Toggle Visibility */ compose(
  S,
  "ToggleVisibility",
);
export const IntoDocumentBody = /* Into Document Body */ compose(
  S,
  "IntoDocumentBody",
);
export const CssCustomization = /* Css Customization */ compose(
  S,
  "CssCustomization",
);
