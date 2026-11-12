import * as React from "react";
import * as S from "@ds-stories/components/help-button/HelpButton.stories";

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
  // OWNED: cardMode single wraps the card in .ds-single (transform), the
  // containing block for the fixed-position overlay; with no in-flow height
  // the card measured 0px tall. A box as tall as the 700px capture viewport
  // minus the wrapper padding gives it the height Storybook has.
  return () =>
    React.createElement("div", { style: { minHeight: 652 } }, story());
}

// OWNED: the reference shows the tooltip each story's play function opens by
// clicking the icon; previews do not run play. Click the n-th match of the
// selector once after mount (TooltipPositions: play ends on the last icon,
// so the left tooltip is the one left open).
function clickOnMount(
  Story: any,
  selector: string,
  pick: "first" | "last" = "first",
) {
  return function Opened() {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      // react-tooltip binds its anchor listeners after mount; click once they exist.
      const t = setTimeout(() => {
        const all = ref.current?.querySelectorAll(selector);
        if (!all || all.length === 0) return;
        const el = (pick === "last" ? all[all.length - 1] : all[0]) as Element;
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

const ICON = '[data-testid="help-button"] svg';

export const Default = /* Default */ clickOnMount(compose(S, "Default"), ICON);
export const CustomStyle = /* Custom Style */ compose(S, "CustomStyle");
export const WithCustomContent = /* With Custom Content */ clickOnMount(
  compose(S, "WithCustomContent"),
  ICON,
);
export const TooltipPositions = /* Tooltip Positions */ clickOnMount(
  compose(S, "TooltipPositions"),
  ICON,
  "last",
);
export const WithTextContent = /* With Text Content */ clickOnMount(
  compose(S, "WithTextContent"),
  "[data-testid=\"help-button\"] [data-tooltip-id='info-tooltip']",
);
// play clicks the "Storage" label, which is the anchor div itself.
export const WithCustomAnchor = /* With Custom Anchor */ clickOnMount(
  compose(S, "WithCustomAnchor"),
  '[data-testid="help-button"] > div',
);
export const OpensOnHover = /* Opens On Hover */ compose(S, "OpensOnHover");
export const CssCustomization = /* Css Customization */ compose(
  S,
  "CssCustomization",
);
