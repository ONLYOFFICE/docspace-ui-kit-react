import * as ReactDropzoneNamespace from "react-dropzone";
import type {
  DropzoneOptions,
  DropzoneProps,
  DropzoneRef,
  DropzoneState,
} from "react-dropzone";
import type { ComponentType, RefAttributes } from "react";

import { interopDefault } from "../interop-default";

// See utils/interop-default for why this is needed. react-dropzone needs its
// own shim on top of the generic helper because the broken CJS/ESM interop
// also swallows `useDropzone`: it is not reachable as a top-level named
// export at all under Node's ESM resolver, only nested inside the
// double-wrapped default (`{ ErrorCode, default, useDropzone }`). Every
// consumer imports the component and the hook from here instead of directly
// from "react-dropzone".
type UseDropzone = (options?: DropzoneOptions) => DropzoneState;

type ReactDropzoneWrapped = {
  default: ComponentType<DropzoneProps & RefAttributes<DropzoneRef>>;
  useDropzone: UseDropzone;
};

const namespace = ReactDropzoneNamespace as unknown as {
  default: ReactDropzoneWrapped["default"] | ReactDropzoneWrapped;
  useDropzone?: UseDropzone;
};

export const Dropzone = interopDefault(ReactDropzoneNamespace);

export const useDropzone: UseDropzone =
  namespace.useDropzone ??
  (namespace.default as ReactDropzoneWrapped).useDropzone;
