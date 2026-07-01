// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type { ThemeTokens } from "@onlyoffice/ai-chat";

import { globalColors } from "../../../providers/theme/themes";

export const PORTAL_BASE_THEME_ID = "theme-portal-base";
export const PORTAL_DARK_THEME_ID = "theme-portal-dark";

type BasePalette = {
  backgroundNormal: string;
  backgroundNormalElement: string;
  backgroundNormalElementLight: string;
  backgroundAccentButton: string;
  backgroundPrimaryButton: string;
  backgroundScrim: string;
  backgroundScrollThumb: string;

  borderDivider: string;
  borderRegularControl: string;
  borderControlFocus: string;
  borderError: string;
  borderSidebarIcon: string;

  highlightButtonHover: string;
  highlightButtonPressed: string;
  highlightButtonHoverOnActive: string;
  highlightButtonPressedOnActive: string;
  highlightAccentButtonHover: string;
  highlightAccentButtonPressed: string;
  highlightPrimaryButtonHover: string;
  highlightPrimaryButtonPressed: string;
  highlightScrollThumbHover: string;
  highlightScrollTrackHover: string;
  highlightToolbarTabUnderlineDocument: string;

  checkboxCheckMarkBackground: string;
  checkboxBackgroundChecked: string;
  checkboxBorderNormal: string;

  iconNormal: string;
  iconSuccess: string;
  iconSecondary: string;
  iconButtonColor: string;
  iconButtonHoverColor: string;

  textNormal: string;
  textNormalPressed: string;
  textSecondary: string;
  textTertiary: string;
  textLink: string;
  textInverse: string;
  textContrastBackground: string;
  textNegative: string;

  buttonShadowFocus: string;
  buttonDefaultFocusShadow: string;
  modalDialogShadows: string;
  dropDownMenuBorderColor: string;
  dropDownMenuShadow: string;
  aiProviderItemShadow: string;
  tooltipShadow: string;

  chatListGroupHeaderColor: string;
  dropdownTriggerColor: string;
  dropdownTriggerHoverColor: string;
  attachmentButtonColor: string;
  promptButtonColor: string;
};

const buildTokens = (
  p: BasePalette,
): Partial<ThemeTokens> & Record<string, string> => ({
  // Base palette
  "--background-normal": p.backgroundNormal,
  "--background-normal-element": p.backgroundNormalElement,
  "--background-normal-element-light": p.backgroundNormalElementLight,
  "--background-accent-button": p.backgroundAccentButton,
  "--background-primary-button": p.backgroundPrimaryButton,
  "--background-scrim": p.backgroundScrim,
  "--background-scroll-thumb": p.backgroundScrollThumb,

  "--border-divider": p.borderDivider,
  "--border-regular-control": p.borderRegularControl,
  "--border-control-focus": p.borderControlFocus,
  "--border-error": p.borderError,
  "--border-sidebar-icon": p.borderSidebarIcon,

  "--highlight-button-hover": p.highlightButtonHover,
  "--highlight-button-pressed": p.highlightButtonPressed,
  "--highlight-button-hover-on-active": p.highlightButtonHoverOnActive,
  "--highlight-button-pressed-on-active": p.highlightButtonPressedOnActive,
  "--highlight-accent-button-hover": p.highlightAccentButtonHover,
  "--highlight-accent-button-pressed": p.highlightAccentButtonPressed,
  "--highlight-primary-button-hover": p.highlightPrimaryButtonHover,
  "--highlight-primary-button-pressed": p.highlightPrimaryButtonPressed,
  "--highlight-scroll-thumb-hover": p.highlightScrollThumbHover,
  "--highlight-scroll-track-hover": p.highlightScrollTrackHover,
  "--highlight-toolbar-tab-underline-document":
    p.highlightToolbarTabUnderlineDocument,

  "--checkbox-check-mark-background": p.checkboxCheckMarkBackground,
  "--checkbox-background-checked": p.checkboxBackgroundChecked,
  "--checkbox-border-normal": p.checkboxBorderNormal,

  "--icon-normal": p.iconNormal,
  "--icon-success": p.iconSuccess,
  "--icon-gray-secondary": p.iconSecondary,

  "--text-normal": p.textNormal,
  "--text-normal-pressed": p.textNormalPressed,
  "--text-secondary": p.textSecondary,
  "--text-tertiary": p.textTertiary,
  "--text-link": p.textLink,
  "--text-inverse": p.textInverse,
  "--text-contrast-background": p.textContrastBackground,
  "--text-negative": p.textNegative,

  // Component tokens — cascade via var() references (same structure as
  // @onlyoffice/ai-chat built-in theme-white/theme-night).

  "--layout-background-color": "var(--background-normal)",

  "--header-color": "var(--text-normal)",
  "--header-background-color": "var(--background-normal)",
  "--header-border-color": "var(--border-divider)",

  "--chat-list-color": "var(--text-normal)",
  "--chat-list-border-right": "var(--border-divider)",
  "--chat-list-empty-color": "var(--text-tertiary)",

  "--chat-list-item-color": "var(--text-normal)",
  "--chat-list-item-hover-background-color": "var(--highlight-button-hover)",
  "--chat-list-item-active-background-color": "var(--highlight-button-pressed)",

  "--icon-button-color": p.iconButtonColor,
  "--icon-button-hover-color": p.iconButtonHoverColor,
  "--icon-button-background-color": "transparent",
  "--icon-button-hover-background-color": "var(--highlight-button-hover)",
  "--icon-button-pressed-background-color": "var(--highlight-button-pressed)",
  "--icon-button-hover-on-active-background-color": "transparent",
  "--icon-button-pressed-on-active-background-color":
    "var(--highlight-button-pressed-on-active)",

  "--button-color": "var(--text-contrast-background)",
  "--button-background-color": "var(--background-accent-button)",
  "--button-background-hover-color": "var(--highlight-accent-button-hover)",
  "--button-background-pressed-color": "var(--highlight-accent-button-pressed)",
  "--button-border-focus-color": "var(--text-contrast-background)",
  "--button-shadow-focus": p.buttonShadowFocus,

  "--button-default-color": "var(--text-normal)",
  "--button-default-background-color": "var(--background-normal)",
  "--button-default-border-color": "var(--highlight-button-pressed)",
  "--button-default-hover-background-color":
    "var(--background-normal-element-light)",
  "--button-default-pressed-background-color": "var(--highlight-button-hover)",
  "--button-default-focus-shadow": p.buttonDefaultFocusShadow,
  "--button-default-disabled-border-color": "var(--border-regular-control)",
  "--button-default-disabled-color": "var(--text-normal)",
  "--button-default-disabled-background-color": "var(--background-normal)",

  "--input-background-color": "var(--background-normal-element)",
  "--input-placeholder-color": "var(--text-tertiary)",
  "--input-color": "var(--text-normal)",
  "--input-border-color": "var(--border-regular-control)",
  "--input-hover-background-color": "var(--highlight-button-hover)",
  "--input-hover-border-color": "var(--checkbox-border-normal)",
  "--input-active-border-color": "var(--background-accent-button)",
  "--input-active-background-color": "var(--background-normal)",
  "--input-error-color": "var(--border-error)",

  "--link-color": "var(--text-tertiary)",
  "--link-primary-color": "var(--background-accent-button)",

  "--model-config-card-background-color": "var(--layout-background-color)",
  "--model-config-card-border-color": "var(--border-divider)",
  "--model-config-card-border-width": "1px",
  "--model-config-card-border-radius": "8px",

  "--model-card-background-color": "var(--background-normal)",
  "--model-card-color": "var(--text-normal)",
  "--model-card-description-color": "var(--text-secondary)",
  "--model-card-border-color": "var(--border-divider)",
  "--model-card-border-radius": "8px",
  "--model-card-logo-border-color": "var(--border-divider)",
  "--model-card-logo-border-radius": "6px",

  "--servers-available-tools-border-width": "1px",
  "--servers-available-tools-border-radius": "8px",
  "--servers-available-tools-item-border-radius": "4px",

  "--tabs-border-width": "1px",
  "--tabs-border-radius": "4px",
  "--tabs-color": "var(--text-normal)",
  "--tabs-border-color": "var(--border-divider)",
  "--tabs-hover-border-color": "var(--checkbox-border-normal)",
  "--tabs-active-border-color": "var(--background-accent-button)",
  "--tabs-list-background-color": "var(--background-normal-element)",
  "--tabs-active-background-color": "var(--background-normal)",

  "--modal-dialog-background-color": "var(--background-normal)",
  "--modal-dialog-footer-border-color": "var(--border-divider)",
  "--modal-dialog-header-color": "var(--text-normal)",
  "--modal-dialog-shadows": p.modalDialogShadows,
  "--modal-dialog-overlay-background": "var(--background-scrim)",

  "--field-container-header-color": "var(--text-normal)",
  "--field-container-error-color": "var(--text-negative)",

  "--drop-down-menu-background-color": "var(--background-normal)",
  "--drop-down-menu-border-color": p.dropDownMenuBorderColor,
  "--drop-down-menu-shadow": p.dropDownMenuShadow,
  "--drop-down-menu-item-color": "var(--text-normal)",
  "--drop-down-menu-separator-color": "var(--border-divider)",
  "--drop-down-menu-item-hover-color": "var(--highlight-button-hover)",
  "--drop-down-menu-item-active-color": "var(--highlight-button-pressed)",

  "--radio-button-color": "var(--checkbox-border-normal)",
  "--radio-button-active-color": "var(--background-accent-button)",

  "--toggle-button-background-color": "var(--background-accent-button)",
  "--toggle-button-background-hover-color":
    "var(--highlight-accent-button-hover)",
  "--toggle-button-off-background-color": "var(--checkbox-border-normal)",
  "--toggle-button-circle-color": "var(--background-normal)",

  "--file-items-background-color": "var(--background-normal)",
  "--file-items-color": "var(--text-normal)",
  "--file-items-ext-color": "var(--text-secondary)",
  "--file-items-border-color": "var(--border-divider)",
  "--file-items-chat-background-color": "var(--background-normal-element)",
  "--file-items-chat-hover-background-color": "var(--highlight-button-hover)",
  "--file-items-chat-pressed-background-color":
    "var(--highlight-button-pressed)",

  "--tooltip-background-color": "var(--background-normal)",
  "--tooltip-text-color": "var(--text-normal)",
  "--tooltip-border-color": "var(--border-divider)",
  "--tooltip-shadow": p.tooltipShadow,

  "--loader-border-color": "var(--background-accent-button)",
  "--tool-fallback-color": "var(--text-normal)",

  "--checkbox-color": "var(--checkbox-border-normal)",
  "--checkbox-bg-color": "var(--background-normal)",
  "--checkbox-bg-hover-color": "var(--highlight-button-hover)",
  "--checkbox-bg-pressed-color": "var(--highlight-button-pressed)",
  "--checkbox-active-color": "var(--background-accent-button)",
  "--checkbox-active-hover-color": "var(--highlight-accent-button-hover)",
  "--checkbox-active-pressed-color": "var(--highlight-accent-button-pressed)",
  "--checkbox-active-icon-color": "var(--background-normal)",

  "--empty-screen-color": "var(--text-normal)",
  "--empty-screen-description-color": "var(--text-secondary)",

  "--settings-header-color": "var(--text-normal)",
  "--settings-description-color": "var(--text-tertiary)",

  "--ai-provider-item-color": "var(--text-normal)",
  "--ai-provider-item-description-color": "var(--text-secondary)",
  "--ai-provider-item-background-color": "var(--background-normal)",
  "--ai-provider-item-shadow": p.aiProviderItemShadow,

  "--servers-description-color": "var(--text-tertiary)",
  "--servers-edit-config-json-background-color":
    "var(--background-normal-element-light)",
  "--servers-edit-config-json-header-color": "var(--text-secondary)",
  "--servers-edit-config-json-lang-color": "var(--text-tertiary)",
  "--servers-edit-config-json-editor-border-color": "var(--border-divider)",
  "--servers-edit-config-json-editor-background-color":
    "var(--background-normal)",
  "--servers-edit-config-buttons-border-color": "var(--border-divider)",
  "--servers-available-tools-border-color": "var(--border-divider)",
  "--servers-available-tools-header-color": "var(--text-normal)",
  "--servers-available-tools-item-name-color": "var(--text-normal)",
  "--servers-available-tools-sub-header-color": "var(--text-tertiary)",
  "--servers-available-tools-current-tool-color": "var(--text-normal)",
  "--servers-available-tools-item-background-color":
    "var(--background-normal-element-light)",
  "--servers-available-tools-item-hover-background-color":
    "var(--highlight-button-hover)",
  "--servers-available-tools-item-active-background-color":
    "var(--highlight-button-pressed)",
  "--servers-logs-dialog-border-color": "var(--border-divider)",
  "--servers-logs-dialog-log-color": "var(--text-normal)",

  "--chat-welcome-color": "var(--text-normal)",
  "--chat-welcome-description-color": "var(--text-secondary)",

  "--chat-composer-background-color": "var(--background-normal-element-light)",
  "--chat-composer-border-color": "var(--border-divider)",
  "--chat-composer-hover-border-color": "var(--highlight-button-hover)",
  "--chat-composer-active-border-color": "var(--background-accent-button)",
  "--chat-composer-text-color": "var(--text-normal)",
  "--chat-composer-placeholder-color": "var(--text-secondary)",
  "--chat-composer-action-send-color": "var(--text-contrast-background)",
  "--chat-composer-action-send-background-color":
    "var(--background-accent-button)",
  "--chat-composer-action-send-background-hover-color":
    "var(--highlight-accent-button-hover)",
  "--chat-composer-action-send-background-pressed-color":
    "var(--highlight-accent-button-pressed)",

  "--chat-user-message-background": "var(--highlight-button-hover)",
  "--chat-user-message-color": "var(--text-normal)",
  "--chat-message-color": "var(--text-normal)",
  "--chat-message-blockquote-color": "var(--border-control-focus)",
  "--chat-message-link-color": "var(--text-link)",
  "--chat-message-divider-color": "var(--border-divider)",
  "--chat-message-th-color": "var(--text-normal)",
  "--chat-message-td-color": "var(--text-normal)",
  "--chat-message-code-block-background-color":
    "var(--background-normal-element-light)",
  "--chat-message-code-block-border-color": "var(--border-divider)",
  "--chat-message-code-block-header-color": "var(--text-secondary)",
  "--chat-message-code-block-pre-background-color": "var(--background-normal)",
  "--chat-message-error-color": "var(--text-negative)",
  "--chat-message-error-border-color": "var(--border-error)",
  "--chat-message-tool-call-header-color": "var(--text-normal)",
  "--chat-message-tool-call-name-color": "var(--text-normal)",
  "--chat-message-tool-call-name-background-color":
    "var(--background-normal-element)",
  "--chat-message-tool-call-body-background-color":
    "var(--background-normal-element-light)",
  "--chat-message-tool-call-body-color": "var(--text-secondary)",
  "--chat-message-tool-call-pre-border-color": "var(--border-divider)",
  "--chat-message-tool-call-pre-background-color": "var(--background-normal)",
  "--chat-message-tool-call-pre-color": "var(--text-normal)",
  "--chat-message-analyze-color": "var(--text-normal)",
  "--chat-list-item-font-size": "12px",
  "--chat-list-title-font-size": "16px",
  "--chat-list-group-header-font-size": "14px",
  "--chat-list-group-header-color": p.chatListGroupHeaderColor,
  "--chat-list-title-font-weight": "600",
  "--chat-list-group-header-font-weight": "600",
  "--chat-list-item-font-weight": "600",
  "--dropdown-trigger-color": p.dropdownTriggerColor,
  "--dropdown-trigger-hover-color": p.dropdownTriggerHoverColor,
  "--chat-input-min-height": "40px",
  "--chat-input-actions-height": "32px",
  "--action-gap": "16px",
  "--attachment-button-color": p.attachmentButtonColor,
  "--prompt-button-color": p.promptButtonColor,
});

// DocSpace Base — light palette. Mapped from globalColors to mirror the
// component tokens used in the DocSpace base theme (see providers/theme/
// themes/base.ts — input/modalDialog/scrollbar/checkbox/toggleButton).
const portalBasePalette: BasePalette = {
  // surfaces — matches base.ts modalDialog/input/aside backgrounds
  backgroundNormal: globalColors.white,
  backgroundNormalElement: globalColors.grayLight,
  backgroundNormalElementLight: globalColors.lightGrayHover,
  backgroundAccentButton: globalColors.lightBlueMain,
  backgroundPrimaryButton: globalColors.lightBlueMain,
  backgroundScrim: globalColors.blurLight,
  backgroundScrollThumb: globalColors.lightScroll,

  // borders — divider = grayLightMid, input = grayStrong (base.ts input)
  borderDivider: globalColors.grayLightMid,
  borderRegularControl: globalColors.grayStrong,
  borderControlFocus: globalColors.lightGrayDark,
  borderError: globalColors.mainRed,
  borderSidebarIcon: globalColors.grayLightMid,

  // states — baseHover=lightGrayHover, baseActive=grayLightMid (button tokens)
  highlightButtonHover: globalColors.lightGrayHover,
  highlightButtonPressed: globalColors.grayLightMid,
  highlightButtonHoverOnActive: globalColors.grayLightMid,
  highlightButtonPressedOnActive: globalColors.lightGrayHover,
  highlightAccentButtonHover: globalColors.lightBlueMainHover,
  highlightAccentButtonPressed: globalColors.lightBlueMainPressed,
  highlightPrimaryButtonHover: globalColors.lightBlueMainHover,
  highlightPrimaryButtonPressed: globalColors.lightBlueMainPressed,
  highlightScrollThumbHover: globalColors.lightScrollHover,
  highlightScrollTrackHover: "rgba(0, 0, 0, 0.04)",
  highlightToolbarTabUnderlineDocument: globalColors.lightBlueMain,

  // checkbox — base.ts checkbox: fill=white, border=grayStrong, mark=black
  checkboxCheckMarkBackground: globalColors.white,
  checkboxBackgroundChecked: globalColors.lightBlueMain,
  checkboxBorderNormal: globalColors.grayStrong,

  iconNormal: globalColors.black,
  iconSuccess: globalColors.mainGreen,

  // text — base.ts text.color=black, text.secondary.color=gray,
  // input.placeholderColor=gray (swap to match ai-chat contrast semantics:
  // secondary more prominent than tertiary).
  textNormal: globalColors.black,
  textNormalPressed: globalColors.black,
  textSecondary: globalColors.lightGrayDark,
  textTertiary: globalColors.gray,
  textLink: globalColors.lightBlueMain,
  textInverse: globalColors.white,
  textContrastBackground: globalColors.white,
  textNegative: globalColors.mainRed,

  buttonShadowFocus: "0px 0px 0px 2px rgba(71, 129, 209, 0.75)",
  buttonDefaultFocusShadow: "0px 0px 0px 2px rgba(71, 129, 209, 0.5)",
  modalDialogShadows: `0px 8px 16px 0px ${globalColors.boxShadowDarkColor}, 0px 0px 4px 0px #040f1b1f`,
  dropDownMenuBorderColor: globalColors.grayLightMid,
  dropDownMenuShadow: `0px 8px 16px 0px ${globalColors.boxShadowColor}, 0px 0px 4px 0px #040f1b0a`,
  aiProviderItemShadow: "0px 1px 2px 0px #0000000f, 0px 1px 3px 0px #0000001a",
  tooltipShadow: "0px 1px 4px -1px rgba(0, 0, 0, 0.2)",

  iconSecondary: globalColors.gray,
  chatListGroupHeaderColor: globalColors.gray,

  // IconButton.module.scss (light): rest = gray, hover = lightGrayDark.
  iconButtonColor: globalColors.gray,
  iconButtonHoverColor: globalColors.lightGrayDark,

  dropdownTriggerColor: globalColors.gray,
  dropdownTriggerHoverColor: globalColors.lightGrayDark,
  attachmentButtonColor: globalColors.lightGrayDark,
  promptButtonColor: globalColors.lightGrayDark,
};

// DocSpace Dark — dark palette.
// Key surface mapping: base surface = `black` (#333333) — used for modal,
// layout, aside backgrounds in dark.ts. `darkGrayLight` (#282828) is the
// recessed surface for inputs. `lightDarkGrayHover` (#3D3D3D) is the hover
// state for buttons/file items.
const portalDarkPalette: BasePalette = {
  backgroundNormal: globalColors.black,
  backgroundNormalElement: globalColors.darkGrayLight,
  backgroundNormalElementLight: globalColors.lightDarkGrayHover,
  backgroundAccentButton: globalColors.lightBlueMain,
  backgroundPrimaryButton: globalColors.lightBlueMain,
  backgroundScrim: globalColors.blurDark,
  backgroundScrollThumb: globalColors.darkScroll,

  // borders — dark.ts modalDialog headerBorder=grayDarkStrong, input border=grayDarkStrong
  borderDivider: globalColors.grayDarkStrong,
  borderRegularControl: globalColors.grayDarkStrong,
  borderControlFocus: globalColors.white,
  borderError: globalColors.darkErrorStatus,
  borderSidebarIcon: globalColors.grayDarkStrong,

  // states — dark.ts toggle hoverFillColorOff=lightDarkGrayHover
  highlightButtonHover: globalColors.lightDarkGrayHover,
  highlightButtonPressed: globalColors.grayDarkStrong,
  highlightButtonHoverOnActive: globalColors.darkActive,
  highlightButtonPressedOnActive: globalColors.lightDarkGrayHover,
  highlightAccentButtonHover: globalColors.lightBlueMainHover,
  highlightAccentButtonPressed: globalColors.lightBlueMainPressed,
  highlightPrimaryButtonHover: globalColors.lightBlueMainHover,
  highlightPrimaryButtonPressed: globalColors.lightBlueMainPressed,
  highlightScrollThumbHover: globalColors.darkScrollHover,
  highlightScrollTrackHover: "rgba(255, 255, 255, 0.05)",
  highlightToolbarTabUnderlineDocument: globalColors.lightBlueMain,

  // checkbox — dark.ts: fill=darkGrayLight, border=grayDarkStrong, mark=white
  checkboxCheckMarkBackground: globalColors.white,
  checkboxBackgroundChecked: globalColors.lightBlueMain,
  checkboxBorderNormal: globalColors.grayDarkStrong,

  iconNormal: globalColors.white,
  iconSuccess: globalColors.mainGreen,

  // text — dark.ts text.color=white, text.secondary=grayDark, placeholder=grayDark
  textNormal: globalColors.white,
  textNormalPressed: globalColors.white,
  textSecondary: globalColors.darkGrayDark,
  textTertiary: globalColors.grayDark,
  textLink: globalColors.lightBlueMain,
  textInverse: globalColors.black,
  textContrastBackground: globalColors.white,
  textNegative: globalColors.darkErrorStatus,

  buttonShadowFocus: "0px 0px 0px 2px rgba(71, 129, 209, 0.75)",
  buttonDefaultFocusShadow: "0px 0px 0px 2px rgba(71, 129, 209, 0.5)",
  modalDialogShadows: `0px 8px 16px 0px ${globalColors.boxShadowColor}, 0px 0px 4px 0px rgba(0, 0, 0, 0.3)`,
  dropDownMenuBorderColor: globalColors.grayDarkStrong,
  dropDownMenuShadow:
    "0px 8px 16px 0px rgba(0, 0, 0, 0.3), 0px 0px 4px 0px rgba(0, 0, 0, 0.2)",
  aiProviderItemShadow:
    "0px 1px 2px 0px rgba(0, 0, 0, 0.2), 0px 1px 3px 0px rgba(0, 0, 0, 0.3)",
  tooltipShadow: "0px 1px 4px -1px rgba(0, 0, 0, 0.4)",

  iconSecondary: globalColors.gray,
  chatListGroupHeaderColor: globalColors.gray,

  // IconButton.module.scss (dark): rest = grayDark, hover = white.
  iconButtonColor: globalColors.grayDark,
  iconButtonHoverColor: globalColors.white,

  dropdownTriggerColor: globalColors.grayDark,
  dropdownTriggerHoverColor: globalColors.white,
  attachmentButtonColor: globalColors.lightSilver,
  promptButtonColor: globalColors.lightSilver,
};

export const portalThemes: Record<
  string,
  Partial<ThemeTokens> & Record<string, string>
> = {
  [PORTAL_BASE_THEME_ID]: buildTokens(portalBasePalette),
  [PORTAL_DARK_THEME_ID]: buildTokens(portalDarkPalette),
};
