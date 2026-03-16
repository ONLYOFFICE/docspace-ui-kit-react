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

import React, { useState } from "react";

import cn from "classnames";

import ToolFinishIcon from "../../../../../../../assets/tool.finish.svg";
import TriangleDownIcon from "../../../../../../../assets/arrow.right.react.svg";

import { IconSizeType } from "../../../../../../../utils";
import { useCommonTranslation } from "../../../../../../../utils/i18n";

import { Loader, LoaderTypes } from "../../../../../../../components/loader";
import { Text } from "../../../../../../../components/text";

import styles from "./Think.module.scss";

const Think = ({
  children,
  isFirst,
  isFinished,
}: {
  children: React.ReactNode;
  isFirst?: boolean;
  isFinished?: boolean;
}) => {
  const t = useCommonTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = () => {
    setIsOpen((val) => !val);
  };

  return (
    <div
      className={cn(styles.think, { [styles.withMarginTop]: !isFirst })}
      data-testid="think"
    >
      <div
        onClick={onToggle}
        className={cn(styles.thinkTitle, { [styles.thinkTitleOpened]: isOpen })}
        data-testid="think-title"
      >
        {isFinished ? (
          <ToolFinishIcon
            className={styles.toolFinishIcon}
            data-testid="think-finished-icon"
          />
        ) : (
          <Loader
            type={LoaderTypes.track}
            size="12px"
            data-testid="think-loader"
          />
        )}

        <Text fontSize="13px" lineHeight="15px" fontWeight={600}>
          {t("Thinking")}
        </Text>

        <TriangleDownIcon
          data-size={IconSizeType.scale}
          className={cn(styles.icon, { [styles.iconOpened]: isOpen })}
          data-testid="think-arrow-icon"
        />
      </div>

      {isOpen ? (
        <div className={styles.thinkBlock} data-testid="think-content">
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default Think;
