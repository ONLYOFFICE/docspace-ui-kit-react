export type { RoomLogoProps } from "./RoomLogo.types";
// `RoomLogoPure`, the unmemoised inner component, is deliberately not re-exported:
// the root barrel is the plugin API surface, and a name that reaches it cannot be
// withdrawn without breaking plugins that have no compile step against this package.
export { RoomLogo } from "./RoomLogo";
