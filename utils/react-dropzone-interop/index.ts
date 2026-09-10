import * as ReactDropzoneNamespace from "react-dropzone";
import type { DropzoneProps, DropzoneRef, DropzoneState } from "react-dropzone";
import type { ComponentType, RefAttributes } from "react";

// react-dropzone@11 ships only a minified UMD build with no `exports` map
// (`main` points straight at it). Node's `cjs-module-lexer` -- the static
// scanner that synthesises named exports for a CJS module viewed from ESM --
// cannot parse its mangled `exports.default = ...` assignment, so the
// synthetic namespace it builds puts the *entire* `module.exports` object
// (`{ ErrorCode, default, useDropzone }`) behind `.default`, instead of the
// `Dropzone` component itself. `import Dropzone from "react-dropzone"` and
// `import { useDropzone } from "react-dropzone"` then silently bind to the
// wrong values everywhere this runs under real Node ESM resolution --
// Vitest included, since it resolves this package the same way a plain
// `node --experimental-vm-modules` run would.
//
// Bundler dev/prod builds (Vite's esbuild pre-bundling, webpack) use their
// own CJS/ESM interop and are not affected, but the package still has to
// behave correctly under Node's resolver for tests and any Node-side
// rendering (Next.js SSR) to work. Every consumer imports the component and
// the hook from here instead of directly from "react-dropzone".
type ReactDropzoneNamespaceShape = {
  default: ComponentType<DropzoneProps & RefAttributes<DropzoneRef>>;
  useDropzone: (options?: unknown) => DropzoneState;
};

const wrapped = ReactDropzoneNamespace.default as unknown as
  | ReactDropzoneNamespaceShape
  | ReactDropzoneNamespaceShape["default"];

const isDoubleWrapped = (
  value: typeof wrapped,
): value is ReactDropzoneNamespaceShape =>
  typeof value === "object" && value !== null && "useDropzone" in value;

export const Dropzone = isDoubleWrapped(wrapped)
  ? wrapped.default
  : (wrapped as ReactDropzoneNamespaceShape["default"]);

export const useDropzone = isDoubleWrapped(wrapped)
  ? wrapped.useDropzone
  : ReactDropzoneNamespace.useDropzone;
