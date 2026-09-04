import React from "react";
import { Text } from "../../text";
import { Link } from "../../link";
import { TemplateTileProps, TemplateItem } from "./TemplateTile.types";
import { TileItem } from "../tile-container/TileContainer.types";
import { BaseTile } from "../base-tile";
import styles from "./TemplateTile.module.scss";
import { useCommonTranslation } from "../../../utils/i18n";

const isTemplateItem = (item: TileItem): item is TemplateItem => {
  return "title" in item && typeof item.title === "string";
};

export const TemplateTile = ({
  item,
  children,
  showStorageInfo,
  openUser,
  badges,
  SpaceQuotaComponent,
  onSelect,
  ...rest
}: TemplateTileProps) => {
  const t = useCommonTranslation();
  const childrenArray = React.Children.toArray(children);
  const [TileContent] = childrenArray;

  const handleSelect = onSelect
    ? (checked: boolean, baseItem: TileItem) => {
        if (isTemplateItem(baseItem)) {
          onSelect(checked, baseItem);
        }
      }
    : undefined;

  const topContent = (
    <>
      {TileContent}
      {badges}
    </>
  );

  const bottomContent = (
    <div className={styles.wrapper}>
      <div className={styles.field}>
        <Text truncate fontSize="13px" fontWeight={400} className={styles.text}>
          {t("Owner")}
        </Text>
        {showStorageInfo ? (
          <Text
            truncate
            fontSize="13px"
            fontWeight={400}
            className={styles.text}
          >
            {t("Storage")}
          </Text>
        ) : null}
      </div>
      <div className={styles.field}>
        {item.createdBy ? (
          <div>
            <Link
              isHovered
              truncate
              fontSize="13px"
              fontWeight={600}
              className={styles.text}
              onClick={openUser}
            >
              {item.createdBy.displayName}
            </Link>
          </div>
        ) : null}
        {showStorageInfo && SpaceQuotaComponent ? (
          <SpaceQuotaComponent
            className={styles.spaceQuota}
            item={item}
            type="room"
            isReadOnly={!item?.security?.EditRoom}
          />
        ) : null}
      </div>
    </div>
  );

  return (
    <BaseTile
      {...rest}
      item={item}
      onSelect={handleSelect}
      topContent={topContent}
      bottomContent={bottomContent}
      className={styles.templateTile}
    />
  );
};
