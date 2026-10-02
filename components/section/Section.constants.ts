import { DeviceType } from "../../enums";

export const SECTION_HEADER_NAME = "SectionHeader";
export const SECTION_FILTER_NAME = "SectionFilter";
export const SECTION_BODY_NAME = "SectionBody";
export const SECTION_FOOTER_NAME = "SectionFooter";
export const SECTION_INFO_PANEL_BODY_NAME = "InfoPanelBody";
export const SECTION_INFO_PANEL_HEADER_NAME = "InfoPanelHeader";
export const SECTION_CHAT_PANEL_NAME = "ChatPanel";
export const SECTION_WARNING_NAME = "SectionWarning";
export const SECTION_SUBMENU_NAME = "SectionSubmenu";
export const SECTION_BANNER_NAME = "SectionBanner";

export const SECTION_HEADER_HEIGHT: Readonly<Record<DeviceType, string>> = {
  [DeviceType.desktop]: "69px",
  [DeviceType.tablet]: "61px",
  [DeviceType.mobile]: "53px",
} as const;
