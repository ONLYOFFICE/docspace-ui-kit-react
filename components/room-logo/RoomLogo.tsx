import React from "react";
import classNames from "classnames";

import { isMobile } from "react-device-detect";

import ArchiveSvg from "../../assets/icons/32/room/archive.svg";
import CustomSvg from "../../assets/icons/32/room/custom.svg";
import EditingSvg from "../../assets/icons/32/room/editing.svg";
import PublicRoomSvg from "../../assets/icons/32/room/public.svg";
import FormRoomSvg from "../../assets/icons/32/room/form.svg";
import VirtualDataRoomSvg from "../../assets/icons/32/room/virtual-data.svg";
import TemplateRoomsSvg from "../../assets/icons/32/room/template.react.svg";
import AIRoomSvg from "../../assets/icons/32/room/ai.svg";
import CollaborationTemplateSvg from "../../assets/icons/32/template/collaboration.svg";
import CustomTemplateSvg from "../../assets/icons/32/template/custom.svg";
import FormTemplateSvg from "../../assets/icons/32/template/form.svg";
import PublicTemplateSvg from "../../assets/icons/32/template/public.svg";
import VirtualDataTemplateSvg from "../../assets/icons/32/template/virtual-data.svg";

import { RoomsType } from "../../enums";

import { Checkbox } from "../checkbox";

import type { RoomLogoProps } from "./RoomLogo.types";
import styles from "./RoomLogo.module.scss";

const RoomLogoPure = ({
  id,
  className,
  style,
  type,

  isArchive = false,
  isTemplate = false,
  withCheckbox = false,
  isChecked = false,
  isIndeterminate = false,
  isTemplateRoom = false,
  onChange,
}: RoomLogoProps) => {
  const getIcon = (): React.FC<React.SVGProps<SVGSVGElement>> | null => {
    if (isArchive) {
      return ArchiveSvg;
    }

    if (isTemplate) {
      return TemplateRoomsSvg;
    }

    if (isTemplateRoom) {
      switch (type) {
        case RoomsType.EditingRoom:
          return CollaborationTemplateSvg;
        case RoomsType.CustomRoom:
          return CustomTemplateSvg;
        case RoomsType.PublicRoom:
          return PublicTemplateSvg;
        case RoomsType.VirtualDataRoom:
          return VirtualDataTemplateSvg;
        case RoomsType.FormRoom:
          return FormTemplateSvg;
        case RoomsType.AIRoom:
          return AIRoomSvg;
        default:
          return null;
      }
    }

    switch (type) {
      case RoomsType.EditingRoom:
        return EditingSvg;
      case RoomsType.CustomRoom:
        return CustomSvg;
      case RoomsType.PublicRoom:
        return PublicRoomSvg;
      case RoomsType.VirtualDataRoom:
        return VirtualDataRoomSvg;
      case RoomsType.FormRoom:
        return FormRoomSvg;
      case RoomsType.AIRoom:
        return AIRoomSvg;
      default:
        return null;
    }
  };

  const onSelect = () => {
    if (!isMobile) return;

    onChange?.();
  };

  const Icon = getIcon();

  return (
    <div
      id={id}
      className={classNames(className, styles.container)}
      style={style}
      data-testid="room-logo"
    >
      <div
        className={classNames("room-logo_icon-container", styles.container)}
        onClick={onSelect}
      >
        {Icon ? <Icon className="room-logo_icon" /> : null}
      </div>

      {withCheckbox ? (
        <Checkbox
          className="room-logo_checkbox checkbox"
          isChecked={isChecked}
          isIndeterminate={isIndeterminate}
          onChange={onChange}
        />
      ) : null}
    </div>
  );
};

export { RoomLogoPure };

const RoomLogo = React.memo(RoomLogoPure);

export { RoomLogo };
