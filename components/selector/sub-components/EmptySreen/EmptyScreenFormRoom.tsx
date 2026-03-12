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

import { RoomType } from "@onlyoffice/docspace-api-sdk";

import FormRoomEmptyDarkImage from "../../../../assets/selector.form.room.empty.screen.dark.react.svg";
import FormRoomEmptyLightImage from "../../../../assets/selector.form.room.empty.screen.light.react.svg";
import Plus16ReactSvg from "../../../../assets/icons/16/plus.svg";

import { getCommonTranslation } from "../../../../utils";
import { useTheme } from "../../../../context/ThemeContext";

import { Text } from "../../../text";
import { Heading } from "../../../heading";
import { AddButton } from "../../../add-button";

import styles from "../../Selector.module.scss";
import type { EmptyScreenFormRoomProps } from "../../Selector.types";

const EmptyScreenFormRoom = ({
  onCreateClickAction,
  createDefineRoomType,
}: EmptyScreenFormRoomProps) => {
  const { isBase } = useTheme();

  const FormRoomEmptyScreenImage = isBase
    ? FormRoomEmptyLightImage
    : FormRoomEmptyDarkImage;

  const description =
    createDefineRoomType === RoomType.FillingFormsRoom
      ? getCommonTranslation("SelectorFormRoomEmptyScreenDescription") || "" // t("SelectorFormRoomEmptyScreenDescription")
      : getCommonTranslation("SelectorVDREmptyScreenDescription") || ""; // t("SelectorVDREmptyScreenDescription")

  const buttonLabel =
    createDefineRoomType === RoomType.FillingFormsRoom
      ? getCommonTranslation("CreateFormFillingRoom") || ""
      : getCommonTranslation("CreateVirtualDataRoom") || "";

  return (
    <section className={styles.newEmptyScreen}>
      <FormRoomEmptyScreenImage className="empty-image" />
      <Heading level={3} className="empty-header">
        {/* t("NoRoomsFound") */}
        {getCommonTranslation("NoRoomsFound") || ""}
      </Heading>
      <Text className="empty-description">{description}</Text>
      <div className="empty_button-wrapper" onClick={onCreateClickAction}>
        <AddButton
          isAction
          iconSize={16}
          className="empty-button"
          iconNode={<Plus16ReactSvg />}
          title={buttonLabel}
          label={buttonLabel}
          size="36px"
          noSelect
        />
      </div>
    </section>
  );
};

export default EmptyScreenFormRoom;
