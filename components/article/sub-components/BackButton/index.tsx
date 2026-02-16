/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 */

import ArrowIcon from "../../../../assets/arrow-left.react.svg";
import ArrowTabletIcon from "../../../../assets/arrow-left.long.react.svg";

import { IconButton } from "../../../icon-button";
import { Text } from "../../../text";
import { DeviceType } from "../../../../enums";
import { getCommonTranslation } from "../../../../utils";

import { ArticleHeaderLoader } from "../../skeletons";

import styles from "../../Article.module.scss";

const BackButton = ({
  showText,
  currentDeviceType,
  onLogoClickAction,
  isLoading,
  toggleArticleOpen,
  navigate,
}: {
  showText: boolean;
  currentDeviceType: DeviceType;
  onLogoClickAction?: () => void;
  isLoading?: boolean;
  toggleArticleOpen?: () => void;
  navigate?: (path: string) => void;
}) => {
  const onClickBack = () => {
    onLogoClickAction?.();

    if (toggleArticleOpen && currentDeviceType === DeviceType.mobile)
      toggleArticleOpen();

    if (navigate) navigate("/");
    else window.location.href = "/";
  };

  const icon =
    currentDeviceType === DeviceType.desktop ? (
      <ArrowIcon />
    ) : (
      <ArrowTabletIcon />
    );

  if (isLoading)
    return (
      <ArticleHeaderLoader
        height="18px"
        width="211px"
        showText={showText}
        className={styles.backButton}
      />
    );
  return (
    <div
      className={styles.backButton}
      data-show-article={showText ? "true" : "false"}
      onClick={onClickBack}
    >
      <IconButton className={styles.arrowIcon} iconNode={icon} isClickable />
      {showText ? <Text truncate>{getCommonTranslation("Back")}</Text> : null}
    </div>
  );
};

export default BackButton;
