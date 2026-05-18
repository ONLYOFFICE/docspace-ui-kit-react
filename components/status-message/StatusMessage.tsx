/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from "react";
import DangerToastReactSvg from "../../assets/danger.toast.react.svg";

import { IconSizeType } from "../../utils/common-icons-style";
import styles from "./StatusMessage.module.scss";
import { Text } from "../text";

interface StatusMessageProps {
  message: string | React.ReactNode;
  isWarning?: boolean;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
  message,
  isWarning,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const [isShowComponent, setIsShowComponent] = React.useState(!!message);
  const messageRef = React.useRef<HTMLDivElement>(null);
  const prevMessageRef = React.useRef<string | React.ReactNode | undefined>(
    message,
  );
  const prevIsWarningRef = React.useRef<boolean | undefined>(isWarning);
  const shouldShowAfterAnimationRef = React.useRef(false);

  React.useEffect(() => {
    if (prevMessageRef.current) {
      if (!message || prevMessageRef.current !== message) {
        setIsVisible(false);
        shouldShowAfterAnimationRef.current = true;
        return;
      }

      if (!shouldShowAfterAnimationRef.current) {
        setIsVisible(true);
        prevMessageRef.current = message;
        prevIsWarningRef.current = isWarning;
      }

      return;
    }

    prevMessageRef.current = message;
    prevIsWarningRef.current = isWarning;
    if (!message) return;

    setIsShowComponent(true);
    setIsVisible(true);
  }, [message, isWarning]);

  React.useEffect(() => {
    const element = messageRef.current;
    if (!element) return;

    const handleEnd = () => {
      const resetStates = () => {
        shouldShowAfterAnimationRef.current = false;
        prevMessageRef.current = message;
        prevIsWarningRef.current = isWarning;
      };

      if (!message) {
        setIsShowComponent(false);
        resetStates();
        return;
      }

      if (shouldShowAfterAnimationRef.current && prevMessageRef.current) {
        setIsShowComponent(true);
        setIsVisible(true);
        resetStates();
        return;
      }

      if (!prevMessageRef.current) {
        setIsShowComponent(false);
      }
    };

    element.addEventListener("animationend", handleEnd);
    element.addEventListener("transitionend", handleEnd);

    return () => {
      element.removeEventListener("animationend", handleEnd);
      element.removeEventListener("transitionend", handleEnd);
    };
  }, [message]);

  if (!isShowComponent) return null;

  return (
    <div
      ref={messageRef}
      className={`${styles.body} ${!isVisible ? styles.hide : ""} ${prevIsWarningRef.current ? styles.warning : ""}`}
    >
      <DangerToastReactSvg
        className={styles.dangerToastIcon}
        data-size={IconSizeType.medium}
      />
      <Text>{prevMessageRef.current}</Text>
    </div>
  );
};

export { StatusMessage };

