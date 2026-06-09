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

import React from "react";

export type UseAiChatPanelStateOptions = {
  defaultVisible?: boolean;
  defaultFullscreen?: boolean;
  /**
   * When set, the fullscreen flag is read/written to `localStorage`
   * under this key. Useful for remembering the user's preference across
   * sessions without owning a separate state store.
   */
  persistFullscreenKey?: string;
};

export type UseAiChatPanelStateResult = {
  visible: boolean;
  isFullscreen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setFullscreen: (next: boolean) => void;
  toggleFullscreen: () => void;
};

const readPersisted = (key: string | undefined): boolean | undefined => {
  if (!key || typeof window === "undefined") return undefined;
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return undefined;
  }
};

const writePersisted = (key: string | undefined, value: boolean): void => {
  if (!key || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value ? "1" : "0");
  } catch {
    // ignore quota / privacy-mode errors
  }
};

/**
 * Headless state companion for `AiChatPanel`. Encapsulates the
 * visibility + fullscreen pair so consumers without a MobX store
 * (Storybook, tests, ad-hoc surfaces) can wire the panel in one line.
 *
 * Consumers that already own a store can ignore this hook and pass
 * `visible` / `isFullscreen` / handlers manually.
 */
export const useAiChatPanelState = ({
  defaultVisible = false,
  defaultFullscreen = false,
  persistFullscreenKey,
}: UseAiChatPanelStateOptions = {}): UseAiChatPanelStateResult => {
  const [visible, setVisible] = React.useState<boolean>(defaultVisible);
  const [isFullscreen, setIsFullscreenState] = React.useState<boolean>(() => {
    const persisted = readPersisted(persistFullscreenKey);
    return persisted ?? defaultFullscreen;
  });

  const setFullscreen = React.useCallback(
    (next: boolean) => {
      setIsFullscreenState(next);
      writePersisted(persistFullscreenKey, next);
    },
    [persistFullscreenKey],
  );

  const open = React.useCallback(() => setVisible(true), []);
  const close = React.useCallback(() => setVisible(false), []);
  const toggle = React.useCallback(() => setVisible((v) => !v), []);
  const toggleFullscreen = React.useCallback(() => {
    setIsFullscreenState((prev) => {
      const next = !prev;
      writePersisted(persistFullscreenKey, next);
      return next;
    });
  }, [persistFullscreenKey]);

  return {
    visible,
    isFullscreen,
    open,
    close,
    toggle,
    setFullscreen,
    toggleFullscreen,
  };
};
