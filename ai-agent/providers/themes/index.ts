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

  inputBackgroundColor: string;
  inputBorderHoverColor: string;
  inputBorderFocusColor: string;
  inputErrorColor: string;

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
  chatComposerActionSendColor: string;
  toggleButtonOffCircleColor: string;
  inputPlaceholderColor: string;
  chatComposerActionSendBackgroundColor: string;
  chatComposerActionSendBackgroundHoverColor: string;
  chatComposerActionSendBackgroundPressedColor: string;
};

const buildTokens = (
  p: BasePalette,
): Partial<ThemeTokens> & Record<string, string> => ({
  // Foundation — surfaces
  "--background-accent-button": p.backgroundAccentButton,
  "--background-normal": p.backgroundNormal,
  "--background-normal-element": p.backgroundNormalElement,
  "--background-normal-element-light": p.backgroundNormalElementLight,
  "--background-primary-button": p.backgroundPrimaryButton,
  "--background-scrim": p.backgroundScrim,
  "--background-scroll-thumb": p.backgroundScrollThumb,

  // Foundation — borders
  "--border-control-focus": p.borderControlFocus,
  "--border-divider": p.borderDivider,
  "--border-error": p.borderError,
  "--border-regular-control": p.borderRegularControl,
  "--border-sidebar-icon": p.borderSidebarIcon,

  // Foundation — highlights (hover / pressed)
  "--highlight-accent-button-hover": p.highlightAccentButtonHover,
  "--highlight-accent-button-pressed": p.highlightAccentButtonPressed,
  "--highlight-button-hover": p.highlightButtonHover,
  "--highlight-button-hover-on-active": p.highlightButtonHoverOnActive,
  "--highlight-button-pressed": p.highlightButtonPressed,
  "--highlight-button-pressed-on-active": p.highlightButtonPressedOnActive,
  "--highlight-primary-button-hover": p.highlightPrimaryButtonHover,
  "--highlight-primary-button-pressed": p.highlightPrimaryButtonPressed,
  "--highlight-scroll-thumb-hover": p.highlightScrollThumbHover,
  "--highlight-scroll-track-hover": p.highlightScrollTrackHover,
  "--highlight-toolbar-tab-underline-document":
    p.highlightToolbarTabUnderlineDocument,

  // Foundation — text
  "--text-contrast-background": p.textContrastBackground,
  "--text-inverse": p.textInverse,
  "--text-link": p.textLink,
  "--text-negative": p.textNegative,
  "--text-normal": p.textNormal,
  "--text-normal-pressed": p.textNormalPressed,
  "--text-secondary": p.textSecondary,
  "--text-tertiary": p.textTertiary,

  // Icon button
  "--icon-button-background-color": "transparent",
  "--icon-button-color": p.iconButtonColor,
  "--icon-button-hover-background-color": "var(--highlight-button-hover)",
  "--icon-button-hover-color": p.iconButtonHoverColor,
  "--icon-button-hover-on-active-background-color": "transparent",
  "--icon-button-pressed-background-color": "var(--highlight-button-pressed)",
  "--icon-button-pressed-on-active-background-color":
    "var(--highlight-button-pressed-on-active)",

  // Foundation — icons
  "--icon-gray-secondary": p.iconSecondary,
  "--icon-normal": p.iconNormal,
  "--icon-success": p.iconSuccess,

  // Layout
  "--layout-background-color": "var(--background-normal)",

  // Header
  "--header-background-color": "var(--background-normal)",
  "--header-border-color": "var(--border-divider)",
  "--header-color": "var(--text-normal)",

  // Button
  "--button-background-color": "var(--background-accent-button)",
  "--button-background-hover-color": "var(--highlight-accent-button-hover)",
  "--button-background-pressed-color": "var(--highlight-accent-button-pressed)",
  "--button-border-focus-color": "var(--text-contrast-background)",
  "--button-color": "var(--text-contrast-background)",
  "--button-default-background-color": "var(--background-normal)",
  "--button-default-border-color": "var(--highlight-button-pressed)",
  "--button-default-color": "var(--text-normal)",
  "--button-default-disabled-background-color": "var(--background-normal)",
  "--button-default-disabled-border-color": "var(--border-regular-control)",
  "--button-default-disabled-color": "var(--text-normal)",
  "--button-default-focus-shadow": p.buttonDefaultFocusShadow,
  "--button-default-hover-background-color":
    "var(--background-normal-element-light)",
  "--button-default-pressed-background-color": "var(--highlight-button-hover)",
  "--button-shadow-focus": p.buttonShadowFocus,

  // Input
  "--input-active-background-color": p.inputBackgroundColor,
  "--input-active-border-color": p.inputBorderFocusColor,
  "--input-background-color": p.inputBackgroundColor,
  "--input-border-color": "var(--border-regular-control)",
  "--input-border-radius": "3px",
  "--input-color": "var(--text-normal)",
  "--input-error-color": p.inputErrorColor,
  "--input-height": "32px",
  "--input-hover-background-color": p.inputBackgroundColor,
  "--input-hover-border-color": p.inputBorderHoverColor,
  "--input-placeholder-color": "var(--text-tertiary)",
  "--input-padding-start": "8px",
  "--input-padding-end": "8px",

  // Combo box

  "--combo-box-height": "32px",
  "--combo-box-padding-end": "8px",
  "--combo-box-padding-start": "8px",

  // Checkbox
  "--checkbox-active-color": "var(--background-accent-button)",
  "--checkbox-active-hover-color": "var(--highlight-accent-button-hover)",
  "--checkbox-active-icon-color": "var(--background-normal)",
  "--checkbox-active-pressed-color": "var(--highlight-accent-button-pressed)",
  "--checkbox-background-checked": p.checkboxBackgroundChecked,
  "--checkbox-bg-color": "var(--background-normal)",
  "--checkbox-bg-hover-color": "var(--highlight-button-hover)",
  "--checkbox-bg-pressed-color": "var(--highlight-button-pressed)",
  "--checkbox-border-normal": p.checkboxBorderNormal,
  "--checkbox-check-mark-background": p.checkboxCheckMarkBackground,
  "--checkbox-color": "var(--checkbox-border-normal)",

  // Radio button
  "--radio-button-active-color": "var(--background-accent-button)",
  "--radio-button-color": "var(--checkbox-border-normal)",

  // Toggle button
  "--toggle-button-background-color": "var(--background-accent-button)",
  "--toggle-button-background-hover-color":
    "var(--highlight-accent-button-hover)",
  "--toggle-button-circle-color": p.toggleButtonOffCircleColor,
  "--toggle-button-off-background-color": "var(--checkbox-border-normal)",
  "--toggle-button-off-border-color": "transparent",
  "--toggle-button-off-circle-color": p.toggleButtonOffCircleColor,

  // Tabs
  "--tabs-active-background-color": "var(--background-normal)",
  "--tabs-active-border-color": "var(--background-accent-button)",
  "--tabs-border-color": "var(--border-divider)",
  "--tabs-border-radius": "4px",
  "--tabs-border-width": "1px",
  "--tabs-color": "var(--text-normal)",
  "--tabs-hover-border-color": "var(--checkbox-border-normal)",
  "--tabs-list-background-color": "var(--background-normal-element)",

  // Drop-down menu
  "--drop-down-menu-background-color": "var(--background-normal)",
  "--drop-down-menu-border-color": p.dropDownMenuBorderColor,
  "--drop-down-menu-item-active-color": "var(--highlight-button-pressed)",
  "--drop-down-menu-item-color": "var(--text-normal)",
  "--drop-down-menu-item-hover-color": "var(--highlight-button-hover)",
  "--drop-down-menu-separator-color": "var(--border-divider)",
  "--drop-down-menu-shadow": p.dropDownMenuShadow,

  // Dropdown trigger
  "--dropdown-trigger-color": p.dropdownTriggerColor,
  "--dropdown-trigger-hover-color": p.dropdownTriggerHoverColor,

  // Modal dialog
  "--modal-dialog-background-color": "var(--background-normal)",
  "--modal-dialog-footer-border-color": "var(--border-divider)",
  "--modal-dialog-header-color": "var(--text-normal)",
  "--modal-dialog-overlay-background": "var(--background-scrim)",
  "--modal-dialog-shadows": p.modalDialogShadows,

  // Field container
  "--field-container-error-color": "var(--text-negative)",
  "--field-container-header-color": "var(--text-normal)",

  // Tooltip
  "--tooltip-background-color": "var(--background-normal)",
  "--tooltip-border-color": "var(--border-divider)",
  "--tooltip-shadow": p.tooltipShadow,
  "--tooltip-text-color": "var(--text-normal)",

  // Link
  "--link-color": "var(--text-tertiary)",
  "--link-primary-color": "var(--background-accent-button)",

  // Loader
  "--loader-border-color": "var(--background-accent-button)",

  // Tool fallback
  "--tool-fallback-color": "var(--text-normal)",

  // Model config card
  "--model-config-card-background-color": "var(--layout-background-color)",
  "--model-config-card-border-color": "var(--border-divider)",
  "--model-config-card-border-radius": "8px",
  "--model-config-card-border-width": "1px",

  // Model card
  "--model-card-background-color": "var(--background-normal)",
  "--model-card-border-color": "var(--border-divider)",
  "--model-card-border-radius": "8px",
  "--model-card-color": "var(--text-normal)",
  "--model-card-description-color": "var(--text-secondary)",
  "--model-card-logo-border-color": "var(--border-divider)",
  "--model-card-logo-border-radius": "6px",

  // Servers
  "--servers-available-tools-border-color": "var(--border-divider)",
  "--servers-available-tools-border-radius": "8px",
  "--servers-available-tools-border-width": "1px",
  "--servers-available-tools-current-tool-color": "var(--text-normal)",
  "--servers-available-tools-header-color": "var(--text-normal)",
  "--servers-available-tools-item-active-background-color":
    "var(--highlight-button-pressed)",
  "--servers-available-tools-item-background-color":
    "var(--background-normal-element-light)",
  "--servers-available-tools-item-border-radius": "4px",
  "--servers-available-tools-item-hover-background-color":
    "var(--highlight-button-hover)",
  "--servers-available-tools-item-name-color": "var(--text-normal)",
  "--servers-available-tools-sub-header-color": "var(--text-tertiary)",
  "--servers-description-color": "var(--text-tertiary)",
  "--servers-edit-config-buttons-border-color": "var(--border-divider)",
  "--servers-edit-config-json-background-color":
    "var(--background-normal-element-light)",
  "--servers-edit-config-json-editor-background-color":
    "var(--background-normal)",
  "--servers-edit-config-json-editor-border-color": "var(--border-divider)",
  "--servers-edit-config-json-header-color": "var(--text-secondary)",
  "--servers-edit-config-json-lang-color": "var(--text-tertiary)",
  "--servers-logs-dialog-border-color": "var(--border-divider)",
  "--servers-logs-dialog-log-color": "var(--text-normal)",

  // Empty screen
  "--empty-screen-color": "var(--text-normal)",
  "--empty-screen-description-color": "var(--text-secondary)",

  // Settings
  "--settings-description-color": "var(--text-tertiary)",
  "--settings-header-color": "var(--text-normal)",

  // AI provider item
  "--ai-provider-item-background-color": "var(--background-normal)",
  "--ai-provider-item-color": "var(--text-normal)",
  "--ai-provider-item-description-color": "var(--text-secondary)",
  "--ai-provider-item-shadow": p.aiProviderItemShadow,

  // File items
  "--file-items-background-color": "var(--background-normal)",
  "--file-items-border-color": "var(--border-divider)",
  "--file-items-chat-background-color": "var(--background-normal-element)",
  "--file-items-chat-hover-background-color": "var(--highlight-button-hover)",
  "--file-items-chat-pressed-background-color":
    "var(--highlight-button-pressed)",
  "--file-items-color": "var(--text-normal)",
  "--file-items-ext-color": "var(--text-secondary)",

  // Chat list
  "--chat-list-border-right": "var(--border-divider)",
  "--chat-list-color": "var(--text-normal)",
  "--chat-list-empty-color": "var(--text-tertiary)",
  "--chat-list-group-header-color": p.chatListGroupHeaderColor,
  "--chat-list-group-header-font-size": "14px",
  "--chat-list-group-header-font-weight": "600",
  "--chat-list-item-active-background-color": "var(--highlight-button-pressed)",
  "--chat-list-item-color": "var(--text-normal)",
  "--chat-list-item-font-size": "12px",
  "--chat-list-item-font-weight": "600",
  "--chat-list-item-hover-background-color": "var(--highlight-button-hover)",
  "--chat-list-title-font-size": "16px",
  "--chat-list-title-font-weight": "600",

  // Chat welcome
  "--chat-welcome-color": "var(--text-normal)",
  "--chat-welcome-description-color": "var(--text-secondary)",

  // Chat composer
  "--chat-composer-action-send-background-color":
    p.chatComposerActionSendBackgroundColor,
  "--chat-composer-action-send-background-hover-color":
    p.chatComposerActionSendBackgroundHoverColor,
  "--chat-composer-action-send-background-pressed-color":
    p.chatComposerActionSendBackgroundPressedColor,
  "--chat-composer-action-send-color": p.chatComposerActionSendColor,
  "--chat-composer-active-border-color": "var(--background-accent-button)",
  "--chat-composer-background-color": "var(--background-normal-element-light)",
  "--chat-composer-border-color": "var(--border-divider)",
  "--chat-composer-hover-border-color": "var(--highlight-button-hover)",
  "--chat-composer-placeholder-color": "var(--text-secondary)",
  "--chat-composer-text-color": "var(--text-normal)",

  // Chat input
  "--chat-input-actions-height": "32px",
  "--chat-input-font-size": "15px",
  "--chat-input-font-weight": "400",
  "--chat-input-min-height": "40px",
  "--chat-input-placeholder": p.inputPlaceholderColor,

  // Chat thread
  "--chat-thread-max-width": "824px",
  "--chat-thread-padding-x": "16px",

  // Chat user message
  "--chat-user-message-background": "var(--highlight-button-hover)",
  "--chat-user-message-color": "var(--text-normal)",

  // Chat message
  "--chat-message-actions-gap": "20px",
  "--chat-message-analyze-color": "var(--text-normal)",
  "--chat-message-blockquote-color": "var(--border-control-focus)",
  "--chat-message-code-block-background-color":
    "var(--background-normal-element-light)",
  "--chat-message-code-block-border-color": "var(--border-divider)",
  "--chat-message-code-block-header-color": "var(--text-secondary)",
  "--chat-message-code-block-pre-background-color": "var(--background-normal)",
  "--chat-message-color": "var(--text-normal)",
  "--chat-message-divider-color": "var(--border-divider)",
  "--chat-message-error-border-color": "var(--border-error)",
  "--chat-message-error-color": "var(--text-negative)",
  "--chat-message-link-color": "var(--text-link)",
  "--chat-message-td-color": "var(--text-normal)",
  "--chat-message-th-color": "var(--text-normal)",
  "--chat-message-tool-call-body-background-color":
    "var(--background-normal-element-light)",
  "--chat-message-tool-call-body-color": "var(--text-secondary)",
  "--chat-message-tool-call-header-color": "var(--text-normal)",
  "--chat-message-tool-call-name-background-color":
    "var(--background-normal-element)",
  "--chat-message-tool-call-name-color": "var(--text-normal)",
  "--chat-message-tool-call-pre-background-color": "var(--background-normal)",
  "--chat-message-tool-call-pre-border-color": "var(--border-divider)",
  "--chat-message-tool-call-pre-color": "var(--text-normal)",

  // Composer action buttons
  "--attachment-button-color": p.attachmentButtonColor,
  "--prompt-button-color": p.promptButtonColor,

  // Misc
  "--action-gap": "16px",
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

  inputBackgroundColor: globalColors.white,
  inputBorderHoverColor: globalColors.gray,
  inputBorderFocusColor: globalColors.lightSecondMain,
  inputErrorColor: globalColors.lightErrorStatus,

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
  chatComposerActionSendColor: globalColors.white,
  // DocSpace toggleButton.fillCircleColorOff = white (base.ts).
  toggleButtonOffCircleColor: globalColors.white,
  inputPlaceholderColor: globalColors.gray,
  chatComposerActionSendBackgroundColor: globalColors.lightBlueMain,
  chatComposerActionSendBackgroundHoverColor: globalColors.lightBlueMainHover,
  chatComposerActionSendBackgroundPressedColor:
    globalColors.lightBlueMainPressed,
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

  inputBackgroundColor: globalColors.darkGrayLight,
  inputBorderHoverColor: globalColors.grayDark,
  inputBorderFocusColor: globalColors.white,
  inputErrorColor: globalColors.darkErrorStatus,

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
  chatComposerActionSendColor: globalColors.black,
  // DocSpace toggleButton.fillCircleColorOff = white (dark.ts).
  toggleButtonOffCircleColor: globalColors.white,
  inputPlaceholderColor: globalColors.grayDarkText,
  chatComposerActionSendBackgroundColor: globalColors.paleGray,
  chatComposerActionSendBackgroundHoverColor: globalColors.grayLightMid,
  chatComposerActionSendBackgroundPressedColor: globalColors.lightGraySelected,
};

export const portalThemes: Record<
  string,
  Partial<ThemeTokens> & Record<string, string>
> = {
  [PORTAL_BASE_THEME_ID]: buildTokens(portalBasePalette),
  [PORTAL_DARK_THEME_ID]: buildTokens(portalDarkPalette),
};
