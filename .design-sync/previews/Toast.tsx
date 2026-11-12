import * as React from "react";
import * as S from "@ds-stories/components/toast/Toast.stories";

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

// OWNED: every Toast story opens its toast from `play` (a click on the
// story's trigger button), and toastr renders the toast fixed at the
// viewport's top-right. Previews never run play, so they showed only the
// trigger. Click the story's first button once after mount (300ms: the
// ToastContainer subscribes in an effect), as the play does.
function openOnMount(Story: any) {
  return function Opened() {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      const t = setTimeout(() => {
        const el = ref.current?.querySelector("button") as HTMLElement | null;
        el?.click();
      }, 300);
      return () => clearTimeout(t);
    }, []);
    return (
      <div ref={ref} style={{ minHeight: 652 }}>
        <Story />
      </div>
    );
  };
}

export const Default = /* Default */ openOnMount(compose(S, "Default"));
export const Success = /* Success */ openOnMount(compose(S, "Success"));
export const ErrorToast = /* Error Toast */ openOnMount(
  compose(S, "ErrorToast"),
);
export const Warning = /* Warning */ openOnMount(compose(S, "Warning"));
export const Info = /* Info */ openOnMount(compose(S, "Info"));
export const WithCloseButton = /* With Close Button */ openOnMount(
  compose(S, "WithCloseButton"),
);
export const KeyboardDismiss = /* Keyboard Dismiss */ openOnMount(
  compose(S, "KeyboardDismiss"),
);
export const AllTypes = /* All Types */ openOnMount(compose(S, "AllTypes"));
export const CustomContent = /* Custom Content */ openOnMount(
  compose(S, "CustomContent"),
);
export const DefaultTitles = /* Default Titles */ openOnMount(
  compose(S, "DefaultTitles"),
);
export const RightToLeft = /* Right To Left */ openOnMount(
  compose(S, "RightToLeft"),
);
export const CssCustomization = /* Css Customization */ openOnMount(
  compose(S, "CssCustomization"),
);
