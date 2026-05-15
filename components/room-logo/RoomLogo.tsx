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
