export * from "./device";

export * from "./uuid";

export * from "./common-icons-style";

export * from "./use-click-outside";

export { default as DomHelpers } from "./dom-helpers";

export * from "./get-text-color";

export * from "./trim-separator";

export * from "./calculateRoomLogoParams";

export * from "./i18n";

export * from "./common";

export * from "./email";

export * from "./context";

export * from "./edge-scrolling";

export * from "./hasOwnProperty";

export * from "./encoder";

export * from "./getErrorMessage";

export * from "./pipe";

export * from "./parse-locale-constants";

export * from "./ai";

export * from "./combineUrl";

export * from "./cookie";

export * from "./date";

export * from "./get-oauth-token";

export * from "./get-system-theme";

export { default as getFilesFromEvent } from "./getFilesFromEvent";

export * from "./getLogoUrl";

export * from "./getTitleWithoutExtension";

export * from "./image-helpers";

export * from "./openingNewTab";

export * from "./presentInArray";

// Only the hook: the raw react-dropzone component this module also wraps would
// collide with the kit's own `Dropzone` in components/dropzone, which is the one
// a consumer wants. See utils/react-dropzone-interop for why the shim exists.
export { useDropzone } from "./react-dropzone-interop";

export * from "./typeGuards";
