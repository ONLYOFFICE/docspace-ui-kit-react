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

import React, { use } from "react";

import classNames from "classnames";
import { RoomType } from "@onlyoffice/docspace-api-sdk";

import PlusReactSvg from "../../../assets/icons/12/plus.svg";
import UpReactSvg from "../../../assets/up.svg";
import ClearEmptyFilterReactSvg from "../../../assets/clear.empty.filter.svg";

import { getCommonTranslation } from "../../../utils";

import { Heading } from "../../heading";
import { Text } from "../../text";
import { IconButton } from "../../icon-button";
import { Link, LinkType } from "../../link";

import useCreateDropDown from "../hooks/useCreateDropDown";
import { EmptyScreenContext } from "../contexts/EmptyScreen";
import { BreadCrumbsContext } from "../contexts/BreadCrumbs";

import NewItemDropDown from "./NewItemDropDown";
import { SearchContext, SearchDispatchContext } from "../contexts/Search";
import EmptyScreenFormRoom from "./EmptySreen/EmptyScreenFormRoom";

import styles from "../Selector.module.scss";
import type { EmptyScreenProps } from "../Selector.types";

const linkStyles = {
  noHover: true,
  isHovered: false,
  type: LinkType.action,
  fontWeight: "600",
  className: "empty-folder_link",
  display: "flex",
};

const EmptyScreen = ({
  withSearch,
  items,
  inputItemVisible,
  hideBackButton,
}: EmptyScreenProps) => {
  const {
    emptyScreenImage,
    emptyScreenHeader,
    emptyScreenDescription,
    searchEmptyScreenImage,
    searchEmptyScreenHeader,
    searchEmptyScreenDescription,
  } = use(EmptyScreenContext);
  const { withBreadCrumbs, breadCrumbs, onSelectBreadCrumb } =
    React.use(BreadCrumbsContext);

  const { onClearSearch } = use(SearchContext);
  const setIsSearch = use(SearchDispatchContext);
  const { isOpenDropDown, setIsOpenDropDown, onCloseDropDown } =
    useCreateDropDown();

  const currentImage = withSearch ? searchEmptyScreenImage : emptyScreenImage;
  const currentHeader = withSearch
    ? searchEmptyScreenHeader
    : emptyScreenHeader;
  const currentDescription = withSearch
    ? searchEmptyScreenDescription
    : emptyScreenDescription;

  const createItem = items.length > 0 ? items[0] : null;

  const onCreateClickAction = () => {
    if (
      !createItem ||
      (!createItem.onCreateClick && !createItem.dropDownItems) ||
      isOpenDropDown ||
      inputItemVisible
    )
      return;

    if (createItem.dropDownItems) return setIsOpenDropDown(true);

    createItem.onCreateClick?.();
  };

  const onBackClick = () => {
    onSelectBreadCrumb?.(breadCrumbs?.[breadCrumbs.length - 2]);
  };

  if (
    !withSearch &&
    createItem?.isRoomsOnly &&
    (createItem.createDefineRoomType === RoomType.FillingFormsRoom ||
      createItem.createDefineRoomType === RoomType.VirtualDataRoom)
  )
    return (
      <EmptyScreenFormRoom
        onCreateClickAction={onCreateClickAction}
        createDefineRoomType={createItem.createDefineRoomType}
      />
    );

  return (
    <div
      className={classNames(styles.emptyScreen, {
        [styles.withSearch]: withSearch,
      })}
    >
      {typeof currentImage === "string" ? (
        <img className="empty-image" src={currentImage} alt="empty-screen" />
      ) : React.isValidElement(currentImage) ? (
        React.cloneElement(
          currentImage as React.ReactElement<{ className?: string }>,
          {
            className: classNames(
              "empty-image",
              (currentImage as React.ReactElement<{ className?: string }>).props
                .className,
            ),
          },
        )
      ) : (
        currentImage
      )}

      <Heading level={3} className="empty-header">
        {currentHeader}
      </Heading>

      <Text className="empty-description">{currentDescription}</Text>
      <div className="buttons">
        {createItem ? (
          <div
            className="empty-folder_container-links"
            onClick={onCreateClickAction}
          >
            <IconButton
              className="empty-folder_container-icon"
              size={12}
              iconNode={<PlusReactSvg />}
              isFill
            />
            <Link {...linkStyles}>{items[0].label}</Link>
            {isOpenDropDown && createItem && createItem.dropDownItems ? (
              <NewItemDropDown
                dropDownItems={createItem.dropDownItems}
                isEmpty
                onCloseDropDown={onCloseDropDown}
              />
            ) : null}
          </div>
        ) : null}

        {(withBreadCrumbs || createItem) && (!hideBackButton || withSearch) ? (
          <div
            className="empty-folder_container-links"
            onClick={
              withSearch
                ? () => onClearSearch?.(() => setIsSearch(false))
                : onBackClick
            }
          >
            <IconButton
              className="empty-folder_container-icon"
              size={12}
              iconNode={
                withSearch ? <ClearEmptyFilterReactSvg /> : <UpReactSvg />
              }
              isFill
            />

            <Link {...linkStyles}>
              {withSearch
                ? getCommonTranslation("ClearFilter") || ""
                : getCommonTranslation("Back") || ""}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export { EmptyScreen };
