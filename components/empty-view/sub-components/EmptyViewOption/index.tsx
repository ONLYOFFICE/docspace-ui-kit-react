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

import type React from "react";
import classNames from "classnames";

import { Link, LinkType } from "../../../link";
import { Button, ButtonSize } from "../../../button";

import { EmptyViewItem } from "../EmptyViewItem";
import {
  isEmptyActionOption,
  isEmptyButtonOption,
  isEmptyLinkOptions,
  isEmptySeparatorOption,
} from "../../EmptyView.utils";
import styles from "../../EmptyView.module.scss";

import type { EmptyViewOptionProps } from "../../EmptyView.types";

const EmptyViewOption = ({ option, LinkRouter }: EmptyViewOptionProps) => {
  if (isEmptyLinkOptions(option)) {
    if (option.isNext || !LinkRouter)
      return (
        <Link
          type={LinkType.action}
          id={option.key.toString()}
          className={classNames(styles.link, option.className)}
          onClick={(e) =>
            option.onClick?.(e as React.MouseEvent<HTMLAnchorElement>)
          }
        >
          {option.icon}
          <span>{option.description}</span>
        </Link>
      );
    return (
      <LinkRouter
        id={option.key.toString()}
        className={classNames(styles.link, option.className)}
        to={option.to}
        state={option.state}
        onClick={option.onClick}
      >
        {option.icon}
        <span>{option.description}</span>
      </LinkRouter>
    );
  }

  if (isEmptySeparatorOption(option)) {
    return (
      <span className={styles.separator} id={option.key.toString()}>
        {option.text}
      </span>
    );
  }

  if (isEmptyActionOption(option)) {
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (typeof option.onClick === "function") {
        (option.onClick as (e?: React.MouseEvent<HTMLDivElement>) => void)(e);
      }
    };

    return (
      <div
        id={option.key.toString()}
        className={classNames(styles.action, {
          [styles.secondary]: option.className === "secondary",
        })}
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        {option.icon}
        <span>{option.title}</span>
      </div>
    );
  }

  if (isEmptyButtonOption(option)) {
    return (
      <Button
        className={classNames(styles.button, option.className)}
        id={option.key.toString()}
        onClick={option.onClick}
        label={option.title}
        primary={option.primary ?? true}
        size={ButtonSize.small}
      />
    );
  }

  const { key, ...other } = option;
  return <EmptyViewItem id={key.toString()} {...other} />;
};

export default EmptyViewOption;
