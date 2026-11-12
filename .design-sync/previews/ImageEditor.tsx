import * as React from "react";
import * as S from "@ds-stories/components/image-editor/ImageEditor.stories";

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

// OWNED: Default's play function ends by uploading the default user photo
// through #customFileInput, which turns the URL source into a File and brings
// the zoom row. Previews do not run play; replay that upload once after mount.
import DefaultUserPhotoUrl from "@ds-stories/assets/default_user_photo_size_82-82.png";

function uploadOnMount(Story: any) {
  return function Uploaded() {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      let cancelled = false;
      const t = setTimeout(async () => {
        const input = ref.current?.querySelector(
          "#customFileInput",
        ) as HTMLInputElement | null;
        if (!input || cancelled) return;
        const blob = await (await fetch(DefaultUserPhotoUrl)).blob();
        const dt = new DataTransfer();
        dt.items.add(new File([blob], "photo.png", { type: "image/png" }));
        input.files = dt.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }, 300);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }, []);
    return (
      <div ref={ref} style={{ display: "contents" }}>
        <Story />
      </div>
    );
  };
}

export const Default = /* Default */ uploadOnMount(compose(S, "Default"));
export const ProfileAvatar = /* Profile Avatar */ compose(S, "ProfileAvatar");
export const WithZoomControls = /* With Zoom Controls */ compose(
  S,
  "WithZoomControls",
);
export const DisabledState = /* Disabled State */ compose(S, "DisabledState");
export const FixedFraming = /* Fixed Framing */ compose(S, "FixedFraming");
