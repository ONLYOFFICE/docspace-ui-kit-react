import { useEffect, useState } from "react";
import classNames from "classnames";

import { Text } from "../text";

import { MCPIconSize } from "./MCPIcon.enum";
import styles from "./MCPIcon.module.scss";

export type MCPIconProps = {
  /** Name of the server. It is the icon's accessible name, with or without an image; its first character is drawn while there is no image. */
  title: string;
  /** One of the four square sizes: 16, 24, 32 or 48px, each with its own font size and corner radius.
   * @default MCPIconSize.Large */
  size?: MCPIconSize;
  /** Image to draw instead of the letter. A failure to load falls back to the letter on its own. */
  imgSrc?: string;
  /** Image as a node, used instead of `imgSrc` when both are set. An `<img>` inside it that fails to load falls back to the letter too. */
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

  const showImg = (!!imgSrc || !!imgNode) && !imgError;

  useEffect(() => {
    if (imgSrc && imgError) {
      setImgError(false);
    }
  }, [imgSrc]);

  const onImageError = () => setImgError(true);

  const name = title?.trim();

  // The tile is one image named after the server; what is inside it - the
  // picture or the letter - is hidden from assistive technology.
  return (
    <div
      data-testid={dataTestId}
      role={name ? "img" : undefined}
      aria-label={name || undefined}
      aria-hidden={name ? undefined : true}
      className={classNames(className, styles.mcpIcon, styles[size], {
        [styles.withText]: !showImg,
      })}
    >
      {showImg ? (
        imgNode ? (
          // React passes an <img>'s error event up its tree, so a broken
          // picture inside the node is caught here.
          <div className={styles.image} aria-hidden onError={onImageError}>
            {imgNode}
          </div>
        ) : (
          <img
            className={styles.image}
            src={imgSrc}
            alt=""
            onError={onImageError}
          />
        )
      ) : (
        <Text className={styles.title} noSelect aria-hidden>
          {getFirstChar(title)}
        </Text>
      )}
    </div>
  );
};
