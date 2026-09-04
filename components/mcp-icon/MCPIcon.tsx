import { useEffect, useState } from "react";
import classNames from "classnames";

import { Text } from "../text";

import { MCPIconSize } from "./MCPIcon.enum";
import styles from "./MCPIcon.module.scss";

export type MCPIconProps = {
  title: string;
  size?: MCPIconSize;
  imgSrc?: string;
  imgNode?: React.ReactNode;
  className?: string;
  dataTestId?: string;
};

const getFirstChar = (title: string) => title?.at(0)?.toUpperCase() ?? "";

export const MCPIcon = (props: MCPIconProps) => {
  const {
    size = MCPIconSize.Large,
    title,
    imgSrc,
    imgNode,

    className,
    dataTestId = "mcp-icon",
  } = props;

  const [imgError, setImgError] = useState(false);

  const showImg = (imgSrc && !imgError) || imgNode;

  useEffect(() => {
    if (imgSrc && imgError) {
      setImgError(false);
    }
  }, [imgSrc]);

  return (
    <div
      data-testid={dataTestId}
      className={classNames(className, styles.mcpIcon, styles[size], {
        [styles.withText]: !showImg,
      })}
    >
      {showImg ? (
        imgNode ? (
          <div className={styles.image}>{imgNode}</div>
        ) : (
          <img
            className={styles.image}
            src={imgSrc}
            alt="mcp icon"
            onError={() => setImgError(true)}
          />
        )
      ) : (
        <Text className={styles.title} noSelect>
          {getFirstChar(title)}
        </Text>
      )}
    </div>
  );
};
