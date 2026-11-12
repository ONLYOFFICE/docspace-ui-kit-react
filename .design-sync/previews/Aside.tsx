import * as React from "react";
import * as S from "@ds-stories/components/aside/Aside.stories";

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
  // OWNED: in the single-story card the wrapper (transform) is the
  // containing block for position:fixed content and has no in-flow height
  // when only fixed layers render, so the card was 0px tall. A box as tall as
  // the 700px capture viewport minus the wrapper's 24px padding gives it the
  // height Storybook's viewport has (same pattern as AppLoader).
  return () =>
    React.createElement("div", { style: { minHeight: 652 } }, story());
}

// OWNED: the stories below open their overlay only from the play function,
// which previews do not run. Click the trigger once after mount - the state
// the play function leaves the reference in.
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
export const Settings = /* Settings */ openOnMount(
  compose(S, "Settings"),
  "button",
);
export const UserProfile = /* User Profile */ openOnMount(
  compose(S, "UserProfile"),
  "button",
);
export const FileDetails = /* File Details */ openOnMount(
  compose(S, "FileDetails"),
  "button",
);
export const WithBackButton = /* With Back Button */ compose(
  S,
  "WithBackButton",
);
export const WithoutHeader = /* Without Header */ compose(S, "WithoutHeader");
export const Scaled = /* Scaled */ compose(S, "Scaled");
export const RightToLeft = /* Right To Left */ compose(S, "RightToLeft");
export const CssCustomization = /* Css Customization */ compose(
  S,
  "CssCustomization",
);
