import { RoomType } from "@onlyoffice/docspace-api-sdk";

import FormRoomEmptyDarkImage from "../../../../assets/selector.form.room.empty.screen.dark.react.svg";
import FormRoomEmptyLightImage from "../../../../assets/selector.form.room.empty.screen.light.react.svg";
import Plus16ReactSvg from "../../../../assets/icons/16/plus.svg";

import { useCommonTranslation } from "../../../../utils/i18n";
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
  const t = useCommonTranslation();
  const { isBase } = useTheme();

  const FormRoomEmptyScreenImage = isBase
    ? FormRoomEmptyLightImage
    : FormRoomEmptyDarkImage;

  const description =
    createDefineRoomType === RoomType.FillingFormsRoom
      ? t("SelectorFormRoomEmptyScreenDescription") || ""
      : t("SelectorVDREmptyScreenDescription") || "";

  const buttonLabel =
    createDefineRoomType === RoomType.FillingFormsRoom
      ? t("CreateFormFillingRoom") || ""
      : t("CreateVirtualDataRoom") || "";

  return (
    <section className={styles.newEmptyScreen}>
      <FormRoomEmptyScreenImage className="empty-image" />
      <Heading level={3} className="empty-header">
        {t("NoRoomsFound") || ""}
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
