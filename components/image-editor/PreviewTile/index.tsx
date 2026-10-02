import React from "react";
import classNames from "classnames";

import { Tags } from "../../tags";
import { Tag } from "../../tag";

import styles from "./PreviewTile.module.scss";

const PreviewTile = ({
  title,
  previewIcon,
  tags,
  defaultTagLabel,
}: {
  title: string;
  previewIcon: string;
  tags: string[];
  defaultTagLabel: string;
}) => {
  return (
    <div className={styles.previewTile}>
      <div className={styles.tileHeader}>
        <div
          className={classNames(styles.tileHeaderIcon, {
            [styles.isGeneratedPreview]: !previewIcon,
          })}
        >
          <img src={previewIcon} alt={title} />
        </div>
        <div className={styles.tileHeaderTitle}>{title}</div>
      </div>
      <div className={styles.tileTags}>
        {tags.length ? (
          <Tags columnCount={2} tags={tags} onSelectTag={() => {}} />
        ) : (
          <Tag
            className={styles.typeTag}
            tag="script"
            label={defaultTagLabel}
            isDefault
          />
        )}
      </div>
    </div>
  );
};

export default PreviewTile;
