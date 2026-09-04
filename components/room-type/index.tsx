import { useTranslation } from "react-i18next";
import classNames from "classnames";

import ArrowReactSvg from "../../assets/arrow.react.svg";

import { RoomsType } from "../../enums";

import { RoomLogo } from "../room-logo";
import { IconButton } from "../icon-button";
import { Text } from "../text";
import { TooltipContainer } from "../tooltip";

import {
  getRoomTypeDescriptionTranslation,
  getRoomTypeTitleTranslation,
} from "./RoomType.utils";
import styles from "./RoomType.module.scss";
import type { RoomTypeProps } from "./RoomType.types";

const RoomType = ({
  roomType,
  onClick,
  type = "listItem",
  isOpen,
  id,
  selectedId,
  disabledFormRoom,
  disabledPublicRoom,
  isTemplate,
  isTemplateRoom,
  isFormSection,
}: RoomTypeProps) => {
  const { t } = useTranslation(["Common"]);

  const room = {
    type: roomType,
    title: getRoomTypeTitleTranslation(t, roomType, isTemplate, isFormSection),
    description: getRoomTypeDescriptionTranslation(
      t,
      roomType,
      isTemplate,
      isFormSection,
    ),
  };

  const isFormRoom = roomType === RoomsType.FormRoom;
  const isPublicRoom = roomType === RoomsType.PublicRoom;

  const disabled =
    (isFormRoom && disabledFormRoom) || (isPublicRoom && disabledPublicRoom);

  const arrowClassName =
    type === "dropdownButton"
      ? "choose_room-forward_btn dropdown-button"
      : type === "dropdownItem"
        ? "choose_room-forward_btn dropdown-item"
        : "choose_room-forward_btn";

  const content = (
    <>
      <div className="choose_room-logo_wrapper">
        <RoomLogo
          type={room.type}
          isTemplate={isTemplate}
          isTemplateRoom={isTemplateRoom}
        />
      </div>

      <div className="choose_room-info_wrapper">
        <div className="choose_room-title">
          <Text className="choose_room-title-text">{room.title}</Text>
        </div>
        <Text className="choose_room-description">{room.description}</Text>
      </div>

      <IconButton
        className={arrowClassName}
        iconNode={<ArrowReactSvg />}
        size={16}
        onClick={onClick}
      />
    </>
  );

  return type === "listItem" ? (
    <TooltipContainer
      as="div"
      className={classNames(styles.roomType, styles.listItem, {
        [styles.isOpen]: isOpen,
        [styles.disabled]: disabled,
      })}
      id={id}
      title={disabled ? "" : room.title}
      onClick={onClick}
      data-tooltip-id={disabled ? "create-room-tooltip" : undefined}
      data-testid="room-type-list-item"
      data-selected-id={selectedId}
    >
      {content}
    </TooltipContainer>
  ) : type === "dropdownButton" ? (
    <TooltipContainer
      as="div"
      id={id}
      title={room.title}
      onClick={onClick}
      className={classNames(styles.roomType, styles.dropDownButton, {
        [styles.isOpen]: isOpen,
      })}
      data-selected-id={selectedId}
      data-testid="room-type-dropdown-button"
    >
      {content}
    </TooltipContainer>
  ) : type === "dropdownItem" ? (
    <TooltipContainer
      as="div"
      id={id}
      title={disabled ? "" : room.title}
      onClick={onClick}
      data-selected-id={selectedId}
      data-tooltip-id={disabled ? "create-room-tooltip" : undefined}
      className={classNames(styles.roomType, styles.dropDownItem, {
        [styles.isOpen]: isOpen,
        [styles.disabled]: disabled,
      })}
      data-testid="room-type-dropdown-item"
    >
      {content}
    </TooltipContainer>
  ) : (
    <TooltipContainer
      as="div"
      id={id}
      title={room.title}
      data-selected-id={selectedId}
      className={classNames(styles.roomType, styles.displayItem, {
        [styles.isOpen]: isOpen,
      })}
    >
      {content}
    </TooltipContainer>
  );
};

export default RoomType;
