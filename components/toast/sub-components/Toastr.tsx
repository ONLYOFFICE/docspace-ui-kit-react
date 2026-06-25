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

"use client";

import React from "react";
import { type Id, toast, type ToastPosition } from "react-toastify";
import classNames from "classnames";

import CheckToastReactSvg from "../../../assets/check.toast.react.svg";
import DangerToastReactSvg from "../../../assets/danger.toast.react.svg";
import InfoToastReactSvg from "../../../assets/info.toast.react.svg";
import CrossIconReactSvg from "../../../assets/icons/12/cross.react.svg";

import { IconSizeType } from "../../../utils/common-icons-style";
import { getCommonTranslation } from "../../../utils/i18n";

import { Text } from "../../text";
import { IconButton } from "../../icon-button";

import { ToastType } from "../Toast.enums";
import type { TData } from "../Toast.types";
import styles from "../Toast.module.scss";

const DEFAULT_TIMEOUT = 5000;
const MIN_TIMEOUT_THRESHOLD = 750;

type TitleKey = "Done" | "Warning" | "Alert" | "Info";

interface NotifyConfig {
  type: ToastType;
  defaultTitleKey: TitleKey;
}

const TOAST_CONFIGS: Record<ToastType, NotifyConfig> = {
  [ToastType.success]: { type: ToastType.success, defaultTitleKey: "Done" },
  [ToastType.error]: { type: ToastType.error, defaultTitleKey: "Warning" },
  [ToastType.warning]: { type: ToastType.warning, defaultTitleKey: "Alert" }, // t("Alert")
  [ToastType.info]: { type: ToastType.info, defaultTitleKey: "Info" },
};

const Icon = ({ type, size }: { type: ToastType; size: IconSizeType }) => {
  const iconMap = {
    [ToastType.success]: (
      <CheckToastReactSvg
        data-size={size}
        className="toastr_icon toastr_success"
      />
    ),
    [ToastType.error]: (
      <DangerToastReactSvg
        data-size={size}
        className={classNames(styles.toastrIcon, "toastr_icon toastr_error")}
      />
    ),
    [ToastType.warning]: (
      <DangerToastReactSvg
        data-size={size}
        className={classNames(styles.toastrIcon, "toastr_icon toastr_warning")}
      />
    ),
    [ToastType.info]: (
      <InfoToastReactSvg
        data-size={size}
        className={classNames(styles.toastrIcon, "toastr_icon toastr_info")}
      />
    ),
  };

  return iconMap[type] || iconMap[ToastType.info];
};

const CloseButton = ({ closeToast }: { closeToast?: () => void }) => (
  <IconButton
    className={`${styles.iconButton} closeButton`}
    onClick={closeToast}
    iconNode={<CrossIconReactSvg />}
    size={12}
  />
);

const createToastContent = (
  type: ToastType,
  data: string | React.ReactNode,
  title: string,
) => (
  <div
    data-testId="toast-content"
    className={styles.toastContent}
    data-type={type}
  >
    <div className="icon-wrapper">
      <Icon size={IconSizeType.medium} type={type} />
    </div>
    <div className="toast-text-container">
      {title ? <Text className="toast-title">{title}</Text> : null}
      {typeof data === "string"
        ? data && <Text className="toast-text">{data}</Text>
        : data}
    </div>
  </div>
);

const getToastOptions = (
  type: ToastType,
  data: string | React.ReactNode,
  timeout: number,
  withCross: boolean,
  centerPosition: boolean,
) => {
  return {
    data,
    type,
    closeOnClick: !withCross,
    closeButton: withCross && <CloseButton />,
    autoClose: (timeout === 0
      ? false
      : timeout < MIN_TIMEOUT_THRESHOLD
        ? DEFAULT_TIMEOUT
        : timeout || 5000) as number | false,
    position: centerPosition ? ("top-center" as ToastPosition) : undefined,
    containerId: "toast-container",
  };
};

const notify = (
  type: ToastType,
  data: string | React.ReactNode,
  title: string,
  timeout = DEFAULT_TIMEOUT,
  withCross = false,
  centerPosition = false,
) => {
  const content = createToastContent(type, data, title);
  const options = getToastOptions(
    type,
    data,
    timeout,
    withCross,
    centerPosition,
  );
  return toast(content, options);
};

const processErrorData = (
  data: string | TData | React.ReactNode,
): string | React.ReactNode => {
  if (
    typeof data === "string" ||
    React.isValidElement(data) ||
    Array.isArray(data)
  ) {
    return data;
  }

  if (
    data &&
    typeof data === "object" &&
    ("response" in data || "statusText" in data || "message" in data)
  ) {
    return (
      data?.response?.data?.error?.message ||
      data?.statusText ||
      data?.message ||
      ""
    );
  }

  return "";
};

const createToastMethod =
  (type: ToastType) =>
  (
    data: string | TData | React.ReactNode,
    title?: string | null,
    timeout?: number,
    withCross?: boolean,
    centerPosition?: boolean,
  ) => {
    const message = processErrorData(data);
    const config = TOAST_CONFIGS[type];
    const finalTitle =
      title === null
        ? ""
        : (title ?? getCommonTranslation(config.defaultTitleKey) ?? "");

    return notify(
      type,
      message,
      finalTitle,
      timeout ?? DEFAULT_TIMEOUT,
      withCross,
      centerPosition,
    );
  };

const toastr = {
  success: createToastMethod(ToastType.success),
  error: createToastMethod(ToastType.error),
  warning: createToastMethod(ToastType.warning),
  info: createToastMethod(ToastType.info),
  clear: () => toast.dismiss(),
  isActive: (id: Id) => toast.isActive(id),
} as const;

export { toastr };
