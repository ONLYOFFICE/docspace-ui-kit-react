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

import React, { useState } from "react";

import SendClockReactSvg from "../../../assets/send.clock.react.svg";
import CatalogSpamReactSvg from "../../../assets/icons/16/catalog.spam.react.svg";

import { IconSizeType } from "../../../utils";
import { Link, LinkType } from "../../link";
import { Checkbox } from "../../checkbox";

import { RowContent } from ".";
import { RowContentProps } from "./RowContent.types";
import { globalColors } from "../../../providers/theme";

import styles from "./RowContent.stories.module.scss";

export default {
  title: "UI/Rows/RowContent",
  component: RowContent,
  parameters: {
    docs: {
      description: {
        component:
          "Component for arranging row content with main section and side elements.",
      },
    },
  },
};

const Template = (args: RowContentProps) => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <>
      <h3>Base demo</h3>
      <div style={{ height: "16px" }} />
      <RowContent {...args}>
        <Link type={LinkType.page} title="Demo" isBold fontSize="15px">
          Demo
        </Link>
        <>
          <SendClockReactSvg
            className={styles.sendClockIcon}
            data-size={IconSizeType.small}
            color={globalColors.lightIcons}
          />
          <CatalogSpamReactSvg
            className={styles.catalogSpamIcon}
            data-size={IconSizeType.small}
            color={globalColors.lightIcons}
          />
        </>
        <Link
          type={LinkType.page}
          title="Demo"
          fontSize="12px"
          color={globalColors.gray}
        >
          Demo
        </Link>
        <Link
          // containerWidth="160px"
          type={LinkType.action}
          title="Demo"
          fontSize="12px"
          color={globalColors.gray}
        >
          Demo
        </Link>
        <Link
          type={LinkType.page}
          title="0 000 0000000"
          fontSize="12px"
          color={globalColors.gray}
        >
          0 000 0000000
        </Link>
        <Link
          // containerWidth="160px"
          type={LinkType.page}
          title="demo@demo.com"
          fontSize="12px"
          color={globalColors.gray}
        >
          demo@demo.com
        </Link>
      </RowContent>
      <RowContent>
        <Link type={LinkType.page} title="Demo Demo" isBold fontSize="15px">
          Demo Demo
        </Link>

        <CatalogSpamReactSvg
          className={styles.catalogSpamIcon}
          data-size={IconSizeType.small}
          color={globalColors.lightIcons}
        />

        <Link
          // containerWidth="160px"
          type={LinkType.action}
          title="Demo Demo"
          fontSize="12px"
          color={globalColors.gray}
        >
          Demo Demo
        </Link>
        <Link
          type={LinkType.action}
          title="0 000 0000000"
          fontSize="12px"
          color={globalColors.gray}
        >
          0 000 0000000
        </Link>
        <Link
          // containerWidth="160px"
          type={LinkType.action}
          title="demo.demo@demo.com"
          fontSize="12px"
          color={globalColors.gray}
        >
          demo.demo@demo.com
        </Link>
      </RowContent>
      <RowContent>
        <Link
          type={LinkType.action}
          title="Demo Demo Demo"
          isBold
          fontSize="15px"
        >
          Demo Demo Demo
        </Link>

        <Link
          // containerWidth="160px"
          type={LinkType.action}
          title="Demo Demo Demo"
          fontSize="12px"
          color={globalColors.gray}
        >
          Demo Demo Demo
        </Link>
        <Link
          type={LinkType.action}
          title="0 000 0000000"
          fontSize="12px"
          color={globalColors.gray}
        >
          0 000 0000000
        </Link>
        <Link
          // containerWidth="160px"
          type={LinkType.action}
          title="demo.demo.demo@demo.com"
          fontSize="12px"
          color={globalColors.gray}
        >
          demo.demo.demo@demo.com
        </Link>
      </RowContent>
      <RowContent>
        <Link
          type={LinkType.action}
          title="Demo Demo Demo Demo"
          isBold
          fontSize="15px"
        >
          Demo Demo Demo Demo
        </Link>

        <SendClockReactSvg
          className={styles.sendClockIcon}
          data-size={IconSizeType.small}
          color={globalColors.lightIcons}
        />

        <Link
          type={LinkType.action}
          title="Demo"
          fontSize="12px"
          color={globalColors.gray}
        >
          Demo
        </Link>
        <Link
          // containerWidth="160px"
          type={LinkType.action}
          title="Demo Demo Demo Demo"
          fontSize="12px"
          color={globalColors.gray}
        >
          Demo Demo Demo Demo
        </Link>
        <Link
          type={LinkType.action}
          title="0 000 0000000"
          fontSize="12px"
          color={globalColors.gray}
        >
          0 000 0000000
        </Link>
        <Link
          // containerWidth="160px"
          type={LinkType.action}
          title="demo.demo.demo.demo@demo.com"
          fontSize="12px"
          color={globalColors.gray}
        >
          demo.demo.demo.demo@demo.com
        </Link>
      </RowContent>
      <div style={{ height: "36px" }} />
      <h3>Custom elements</h3>
      <div style={{ height: "16px" }} />
      <RowContent disableSideInfo>
        <Link type={LinkType.action} title="John Doe" isBold fontSize="15px">
          John Doe
        </Link>

        <Checkbox
          id="1"
          name="sample"
          isChecked={isChecked}
          onChange={() => {
            setIsChecked(!isChecked);
          }}
        />
      </RowContent>
    </>
  );
};

export const basic = Template.bind({});
