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
import { ReactSVG } from "react-svg";
import classNames from "classnames";

import { useCommonTranslation } from "../../../utils/i18n";
import { TooltipContainer } from "../../tooltip";
import styles from "../Filter.module.scss";

export type TViewSelectorOption = {
  value: string;
  icon: string | React.ReactElement;
  id?: string;
  callback?: () => void;
};

type PickedDivProps = Pick<
  React.ComponentPropsWithRef<"div">,
  "className" | "id" | "style"
>;

export type ViewSelectorProps = PickedDivProps & {
  /** Disables the button default functionality */
  isDisabled?: boolean;
  /** Sets a callback function that is triggered when the button is clicked */
  onChangeView: (view: string) => void;
  /** Array that contains the view settings  */
  viewSettings: TViewSelectorOption[];
  /** Current application view */
  viewAs: string;
  /** Displays only available selector options  */
  isFilter?: boolean;
};

const ViewSelector = ({
  isDisabled,
  isFilter,
  viewSettings,
  viewAs,
  onChangeView,
  className,
  style,
  ...rest
}: ViewSelectorProps) => {
  const t = useCommonTranslation();
  const onChangeViewHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled) return;

    const target = e.target as HTMLDivElement;

    const el = target.closest(`.${styles.iconWrapper}`) as HTMLDivElement;
    if (!el) return;

    const view = el.dataset?.view;

    if (view !== viewAs && view) {
      const option = viewSettings.find(
        (setting: TViewSelectorOption) => view === setting.value,
      );
      if (option) option.callback?.();
      onChangeView(view);
    }
  };

  const lastIndx = viewSettings && viewSettings.length - 1;

  const renderFewIconView = () => {
    return viewSettings.map((el: TViewSelectorOption, indx: number) => {
      const { value, icon, id } = el;

      return (
        <TooltipContainer
          as="div"
          className={classNames(styles.iconWrapper, {
            "view-selector-icon": true,
            [styles.disabled]: isDisabled,
            [styles.checked]: viewAs === value,
            [styles.firstItem]: indx === 0,
            [styles.lastItem]: indx === lastIndx,
          })}
          id={id}
          key={value}
          data-view={value}
          title={
            value === "row"
              ? (t("SwitchViewToCompact") ?? "")
              : (t("SwitchToThumbnails") ?? "")
          }
          data-testid="view-selector-icon"
        >
          {typeof icon === "string" ? <ReactSVG src={icon} /> : icon}
        </TooltipContainer>
      );
    });
  };

  const renderOneIconView = () => {
    const element = viewSettings.find(
      (el: TViewSelectorOption) => el.value !== viewAs,
    );

    if (element) {
      const { value, icon } = element;

      return (
        <TooltipContainer
          as="div"
          className={classNames(styles.iconWrapper, {
            [styles.disabled]: isDisabled,
            [styles.filter]: isFilter,
          })}
          key={value}
          data-view={value}
          title={
            value === "row"
              ? (t("SwitchViewToCompact") ?? "")
              : (t("SwitchToThumbnails") ?? "")
          }
          data-testid="view-selector-icon"
        >
          {typeof icon === "string" ? <ReactSVG src={icon} /> : icon}
        </TooltipContainer>
      );
    }

    return null;
  };

  return (
    <div
      style={
        {
          "--view-selector-items-count": viewSettings.length,
          ...style,
        } as React.CSSProperties
      }
      className={classNames(styles.viewSelector, className, {
        [styles.filter]: isFilter,
        [styles.countItemsMoreThan2]: viewSettings.length > 2,
      })}
      {...rest}
      onClick={onChangeViewHandler}
      data-testid="view-selector"
    >
      {viewSettings
        ? isFilter
          ? renderOneIconView()
          : renderFewIconView()
        : null}
    </div>
  );
};

export { ViewSelector };
