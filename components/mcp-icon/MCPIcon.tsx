import { useEffect, useState } from "react";
import classNames from "classnames";

import { Text } from "../text";

import { MCPIconSize } from "./MCPIcon.enum";
import styles from "./MCPIcon.module.scss";

export type MCPIconProps = {
  /** Name of the server. Only its first character is drawn, and only while there is no image; it is not an accessible name. */
  title: string;
  /** One of the four square sizes: 16, 24, 32 or 48px, each with its own font size and corner radius.
   * @default MCPIconSize.Large */
  size?: MCPIconSize;
  /** Image to draw instead of the letter. A failure to load falls back to the letter on its own. */
  imgSrc?: string;
  /** Image as a node, used instead of `imgSrc` when both are set. It gets no load-failure fallback. */
  imgNode?: React.ReactNode;
  /** Added before the component's own classes, on the outer element. */
  className?: string;
  /** Value of `data-testid` on the outer element.
   * @default "mcp-icon" */
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
