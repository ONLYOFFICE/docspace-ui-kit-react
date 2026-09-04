import React, { use } from "react";

import classNames from "classnames";
import { RoomType } from "@onlyoffice/docspace-api-sdk";

import PlusReactSvg from "../../../assets/icons/12/plus.svg";
import UpReactSvg from "../../../assets/up.svg";
import ClearEmptyFilterReactSvg from "../../../assets/clear.empty.filter.svg";

import { useCommonTranslation } from "../../../utils/i18n";

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
  const t = useCommonTranslation();
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
              {withSearch ? t("ClearFilter") || "" : t("Back") || ""}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export { EmptyScreen };
