import React, { useState } from "react";

import cn from "classnames";

import ToolFinishIcon from "../../../assets/tool.finish.svg";
import TriangleDownIcon from "../../../assets/arrow.right.react.svg";

import { IconSizeType } from "../../../utils";
import { useCommonTranslation } from "../../../utils/i18n";

import { Loader, LoaderTypes } from "../../../components/loader";
import { Text } from "../../../components/text";

import styles from "./Think.module.scss";

const Think = ({
  children,
  isFirst,
  isFinished,
}: {
  children: React.ReactNode;
  isFirst?: boolean;
  isFinished?: boolean;
}) => {
  const t = useCommonTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = () => {
    setIsOpen((val) => !val);
  };

  return (
    <div
      className={cn(styles.think, { [styles.withMarginTop]: !isFirst })}
      data-testid="think"
    >
      <div
        onClick={onToggle}
        className={cn(styles.thinkTitle, { [styles.thinkTitleOpened]: isOpen })}
        data-testid="think-title"
      >
        {isFinished ? (
          <ToolFinishIcon
            className={styles.toolFinishIcon}
            data-testid="think-finished-icon"
          />
        ) : (
          <Loader
            type={LoaderTypes.track}
            size="12px"
            data-testid="think-loader"
          />
        )}

        <Text fontSize="13px" lineHeight="15px" fontWeight={600}>
          {t("Thinking")}
        </Text>

        <TriangleDownIcon
          data-size={IconSizeType.scale}
          className={cn(styles.icon, { [styles.iconOpened]: isOpen })}
          data-testid="think-arrow-icon"
        />
      </div>

      {isOpen ? (
        <div className={styles.thinkBlock} data-testid="think-content">
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default Think;
