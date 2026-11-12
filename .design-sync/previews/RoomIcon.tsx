import * as React from "react";
import * as S from "@ds-stories/components/room-icon/RoomIcon.stories";

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

// OWNED: the EmptyState reference shows the logo menu its play function opens
// by clicking the plus button; previews do not run play. Click it once after
// mount (listeners bind after the first effect, hence the delay).
function clickOnMount(Story: any, selector: string) {
  return function Opened() {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      const t = setTimeout(() => {
        const el = ref.current?.querySelector(selector) as Element | null;
        if (!el) return;
        const opts = { bubbles: true, cancelable: true, view: window };
        el.dispatchEvent(new MouseEvent("mousedown", opts));
        el.dispatchEvent(new MouseEvent("mouseup", opts));
        el.dispatchEvent(new MouseEvent("click", opts));
      }, 300);
      return () => clearTimeout(t);
    }, []);
    return (
      <div ref={ref} style={{ display: "contents" }}>
        <Story />
      </div>
    );
  };
}

export const Default = /* Default */ compose(S, "Default");
export const Sizes = /* Sizes */ compose(S, "Sizes");
export const Colors = /* Colors */ compose(S, "Colors");
export const WithEditing = /* With Editing */ compose(S, "WithEditing");
export const EmptyState = /* Empty State */ clickOnMount(
  compose(S, "EmptyState"),
  ".open-plus-logo-icon",
);
export const Archive = /* Archive */ compose(S, "Archive");
export const WithBadge = /* With Badge */ compose(S, "WithBadge");
export const WithTooltip = /* With Tooltip */ compose(S, "WithTooltip");
export const Template = /* Template */ compose(S, "Template");
export const WithHover = /* With Hover */ compose(S, "WithHover");
export const LongTitle = /* Long Title */ compose(S, "LongTitle");
export const WithLogo = /* With Logo */ compose(S, "WithLogo");
export const RightToLeft = /* Right To Left */ compose(S, "RightToLeft");
export const CssCustomization = /* Css Customization */ compose(
  S,
  "CssCustomization",
);
