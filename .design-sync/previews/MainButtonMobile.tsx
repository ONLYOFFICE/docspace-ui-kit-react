import * as React from "react";
import * as S from "@ds-stories/components/main-button-mobile/MainButtonMobile.stories";

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
  // OWNED: the button is position:fixed at bottom/right. In the single-story
  // card its containing block is the card wrapper (transform), which is
  // zero-height when the only child is fixed, so `bottom: 24px` put the
  // button above the card. A phone-tall box gives the wrapper a height.
  return () =>
    React.createElement("div", { style: { minHeight: 640 } }, story());
}

export const Default = /* Default */ compose(S, "Default");
// WithAlert play ends by opening the menu (the badge hides while open).
export const WithAlert = /* With Alert */ clickTextOnMount(
  compose(S, "WithAlert"),
  "",
  '[data-testid="floating-button"]',
);
// OWNED: WithSubmenu play clicks "New form", folding its nested items; that
// re-measure is also what flips the menu above the button (directionY top).
// Without it the first measure runs at the not-ready top:0 and the menu stays
// below. Replay the click once after mount, then the resize Storybook sends.
function clickTextOnMount(Story: any, text: string, selector?: string) {
  return function Clicked() {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      const t = setTimeout(() => {
        const all = Array.from(document.querySelectorAll("*")) as HTMLElement[];
        const el = selector
          ? (document.querySelector(selector) as HTMLElement | null)
          : all.find(
              (e) => e.children.length === 0 && e.textContent?.trim() === text,
            );
        el?.click();
        // Storybook's iframe resizes after load; DropDown re-checks its
        // direction on resize and flips above the button. Mirror that.
        setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
      }, 300);
      return () => clearTimeout(t);
    }, []);
    return React.createElement(
      "div",
      { ref, style: { display: "contents" } },
      React.createElement(Story),
    );
  };
}

export const WithSubmenu = /* With Submenu */ clickTextOnMount(
  compose(S, "WithSubmenu"),
  "New form",
);
export const WithoutMenu = /* Without Menu */ compose(S, "WithoutMenu");
export const CssCustomization = /* Css Customization */ compose(
  S,
  "CssCustomization",
);
