import * as React from "react";
import * as S from "@ds-stories/components/context-menu/ContextMenu.stories";

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

// OWNED: Dynamic Model's play function right-clicks the trigger, toggles
// "Add to favorites" and right-clicks again, leaving the menu open on
// "Remove from favorites". Previews do not run play, so replay that sequence
// after mount - the state the reference captures.
function replayDynamicModel(Story: any) {
  return function Opened() {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      const timers: any[] = [];
      const rightClick = () => {
        const t = ref.current?.querySelector(
          '[data-testid="trigger"]',
        ) as HTMLElement | null;
        if (!t) return;
        const b = t.getBoundingClientRect();
        t.dispatchEvent(
          new MouseEvent("contextmenu", {
            bubbles: true,
            cancelable: true,
            clientX: b.left + b.width / 2,
            clientY: b.top + b.height / 2,
          }),
        );
      };
      const findItem = (text: string) =>
        Array.from(document.querySelectorAll('[role="menuitem"]')).find((el) =>
          el.textContent?.includes(text),
        ) as HTMLElement | undefined;
      // Driven by DOM changes rather than fixed delays: the capture settles
      // quickly, so each step runs as soon as the previous one has landed.
      let phase = 0;
      const step = () => {
        if (phase === 0) {
          const add = findItem("Add to favorites");
          if (add) {
            phase = 1;
            add.click();
          }
        } else if (phase === 1) {
          if (!findItem("Add to favorites")) {
            phase = 2;
            rightClick();
          }
        }
      };
      const mo = new MutationObserver(step);
      mo.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
      });
      timers.push(setInterval(step, 30));
      rightClick();
      timers.push(
        setTimeout(() => {
          mo.disconnect();
          timers.forEach(clearInterval);
        }, 3000),
      );
      return () => {
        mo.disconnect();
        timers.forEach((t) => {
          clearTimeout(t);
          clearInterval(t);
        });
      };
    }, []);
    // The single-story card (primaryStory DynamicModel) wraps this in
    // .ds-single, whose transform makes it the containing block for the
    // position:fixed menu; with no in-flow height the card was 0px tall.
    // A box as tall as the 700px capture viewport minus the wrapper's 24px
    // padding gives it the height Storybook's viewport has.
    return (
      <div style={{ minHeight: 652 }}>
        <div ref={ref} style={{ display: "contents" }}>
          <Story />
        </div>
      </div>
    );
  };
}

export const Default = /* Default */ compose(S, "Default");
export const SimpleMenu = /* Simple Menu */ compose(S, "SimpleMenu");
export const WithBackdrop = /* With Backdrop */ compose(S, "WithBackdrop");
export const WithItemDescriptions = /* With Item Descriptions */ compose(
  S,
  "WithItemDescriptions",
);
export const ItemVariants = /* Item Variants */ compose(S, "ItemVariants");
export const DynamicModel = /* Dynamic Model */ replayDynamicModel(
  compose(S, "DynamicModel"),
);
export const AttachedToDocument = /* Attached To Document */ compose(
  S,
  "AttachedToDocument",
);
export const MaxHeight = /* Max Height */ compose(S, "MaxHeight");
export const MobileWithHeader = /* Mobile With Header */ compose(
  S,
  "MobileWithHeader",
);
export const MobileWithAvatarHeader = /* Mobile With Avatar Header */ compose(
  S,
  "MobileWithAvatarHeader",
);
export const AnchoredToElement = /* Anchored To Element */ compose(
  S,
  "AnchoredToElement",
);
export const RightToLeft = /* Right To Left */ compose(S, "RightToLeft");
export const CssCustomization = /* Css Customization */ compose(
  S,
  "CssCustomization",
);
