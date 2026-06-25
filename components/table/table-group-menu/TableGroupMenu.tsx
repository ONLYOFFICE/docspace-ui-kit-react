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

import { FC, memo, useCallback } from "react";
import equal from "fast-deep-equal";
import classNames from "classnames";
import { useCommonTranslation } from "../../../utils";

import TriangleNavigationDownReactSvg from "../../../assets/triangle.navigation.down.react.svg";
import PanelReactSvg from "../../../assets/panel.react.svg";
import CrossIconSvg from "../../../assets/icons/16/cross.react.svg";

import { EMPTY_ARRAY, EMPTY_OBJECT, FUNCTION_EMPTY } from "../../../constants";

import { Text } from "../../text";
import { Checkbox } from "../../checkbox";
import { ComboBox, TOption } from "../../combobox";
import { IconButton } from "../../icon-button";
import { Scrollbar } from "../../scrollbar";

import { GroupMenuItem } from "../sub-components/group-menu-item";
import type { TableGroupMenuProps, TGroupMenuProps } from "../Table.types";

import styles from "./TableGroupMenu.module.scss";

const GroupMenu: FC<TGroupMenuProps> = memo(
  ({ headerMenu, isBlocked, isMobileView }) => {
    return (
      <Scrollbar className={styles.scrollBar}>
        {headerMenu.map((item) => (
          <GroupMenuItem
            key={item.id || item.label}
            item={{ ...item, isMobileView: item.isMobileView ?? isMobileView }}
            isBlocked={isBlocked}
            dataTestId={`table_group_menu_item_${item.id}`}
          />
        ))}
      </Scrollbar>
    );
  },
  equal,
);

const TableGroupMenu = memo((props: TableGroupMenuProps) => {
  const t = useCommonTranslation();

  const {
    isChecked,
    isIndeterminate,
    headerMenu,
    onChange,
    checkboxOptions,
    checkboxMargin,
    isInfoPanelVisible,
    toggleInfoPanel,
    withoutInfoPanelToggler,
    isMobileView,
    isBlocked,
    withComboBox = true,
    headerLabel,
    isCloseable,
    onCloseClick,
    onClick,
  } = props;

  const onCheckboxChange = useCallback(() => {
    onChange?.(!isChecked);
  }, [isChecked, onChange]);

  const toggleIconColor = isInfoPanelVisible ? "accent" : undefined;

  return (
    <div
      className={classNames(
        styles.tableGroupMenu,
        "table-container_group-menu",
      )}
      style={
        {
          "--table-group-menu-checkbox-margin": checkboxMargin,
        } as React.CSSProperties
      }
      onClick={onClick}
      data-testid="table-group-menu"
    >
      {headerLabel ? (
        <Text
          fontSize="14px"
          lineHeight="16px"
          fontWeight={600}
          className={styles.labelElement}
        >
          {headerLabel}
        </Text>
      ) : (
        <Checkbox
          id="menu-checkbox_selected-all-file"
          dataTestId="table_group_menu_checkbox"
          className={classNames(
            styles.checkbox,
            "table-container_group-menu-checkbox",
          )}
          onChange={onCheckboxChange}
          isChecked={isChecked}
          isIndeterminate={isIndeterminate}
          title={t("MainHeaderSelectAll")}
        />
      )}

      {withComboBox ? (
        <ComboBox
          id="menu-combobox"
          comboIcon={<TriangleNavigationDownReactSvg />}
          noBorder
          advancedOptions={checkboxOptions}
          className={classNames(styles.combobox, "not-selectable")}
          options={EMPTY_ARRAY}
          selectedOption={EMPTY_OBJECT as TOption}
          manualY="42px"
          manualX="-32px"
          title={t("TitleSelectFile")}
          isMobileView={isMobileView}
          onSelect={FUNCTION_EMPTY}
          dataTestId="table_group_menu_combobox"
          withBackground={isMobileView}
        />
      ) : null}
      <div
        className={classNames(
          styles.separator,
          "table-container_group-menu-separator",
        )}
      />
      <GroupMenu
        headerMenu={headerMenu}
        isBlocked={isBlocked}
        isMobileView={isMobileView}
      />
      {isCloseable ? (
        <div className={styles.tableHeaderIcon}>
          <IconButton
            className={styles.tableHeaderIconButton}
            size={16}
            onClick={onCloseClick}
            iconNode={<CrossIconSvg />}
            isFill
            dataTestId="close-button"
          />
        </div>
      ) : null}
      {!withoutInfoPanelToggler ? (
        <div
          className={classNames(
            styles.infoPanelToggleWrapper,
            styles.tableHeaderIcon,
            {
              [styles.isInfoPanelVisible]: isInfoPanelVisible,
            },
          )}
        >
          <div
            className={classNames(
              styles.infoPanelToggleBg,
              "info-panel-toggle-bg",
            )}
          >
            <IconButton
              id="info-panel-toggle--open"
              className={classNames(
                styles.infoPanelToggle,
                styles.tableHeaderIconButton,
                "info-panel-toggle",
              )}
              iconNode={<PanelReactSvg />}
              size={16}
              isFill
              onClick={toggleInfoPanel}
              color={toggleIconColor}
              hoverColor={toggleIconColor}
              dataTestId="info-panel-toggle-button"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}, equal);

export { TableGroupMenu };
