import * as React from "react";
import * as S from "@ds-stories/components/modal-dialog/ModalDialog.stories";

function compose(S: any, key: string) {
  const meta: any = S.default ?? {};
  const st: any = S[key];
  // OWNED: every story opens its dialog from the play function, which previews
  // do not run, so the cells showed only the "Show" trigger. Open it here -
  // the state the play function reaches.
  const args: any = {
    ...(meta.args ?? {}),
    ...(st && st.args ? st.args : {}),
    visible: true,
  };
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

export const Default = /* Default */ compose(S, "Default");
export const AsideDisplay = /* Aside Display */ compose(S, "AsideDisplay");
export const LoadingState = /* Loading State */ compose(S, "LoadingState");
export const AsideLoadingState = /* Aside Loading State */ compose(
  S,
  "AsideLoadingState",
);
export const LargeModal = /* Large Modal */ compose(S, "LargeModal");
export const HugeModal = /* Huge Modal */ compose(S, "HugeModal");
export const AutoSizeModal = /* Auto Size Modal */ compose(S, "AutoSizeModal");
export const WithFooterBorder = /* With Footer Border */ compose(
  S,
  "WithFooterBorder",
);
export const NonCloseable = /* Non Closeable */ compose(S, "NonCloseable");
export const AsideScrollLocked = /* Aside Scroll Locked */ compose(
  S,
  "AsideScrollLocked",
);
export const AsideWithBodyScroll = /* Aside With Body Scroll */ compose(
  S,
  "AsideWithBodyScroll",
);
export const AsideNonCloseable = /* Aside Non Closeable */ compose(
  S,
  "AsideNonCloseable",
);
export const WithBackButton = /* With Back Button */ compose(
  S,
  "WithBackButton",
);
export const BackdropClickDisabled = /* Backdrop Click Disabled */ compose(
  S,
  "BackdropClickDisabled",
);
export const FormDialog = /* Form Dialog */ compose(S, "FormDialog");
export const TwoFooterRows = /* Two Footer Rows */ compose(S, "TwoFooterRows");
export const AsideWithContainer = /* Aside With Container */ compose(
  S,
  "AsideWithContainer",
);
export const RightToLeft = /* Right To Left */ compose(S, "RightToLeft");
export const CssCustomization = /* Css Customization */ compose(
  S,
  "CssCustomization",
);
