import { isValidElement, useState } from "react";
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

// What a failed load is remembered by. A node is usually built afresh on
// every render -- a context menu model is -- so an element with a string
// `src` is known by that src, not by its identity, or the broken picture
// would be tried, and flash, again on every render.
const getSourceKey = (imgNode: React.ReactNode, imgSrc?: string): unknown => {
  if (imgNode == null || imgNode === false) return imgSrc;
  if (isValidElement<{ src?: unknown }>(imgNode)) {
    const { src } = imgNode.props;
    if (typeof src === "string") return `node:${src}`;
  }
  return imgNode;
};

export const MCPIcon = (props: MCPIconProps) => {
  const {
    size = MCPIconSize.Large,
    title,
    imgSrc,
    imgNode,

    className,
    dataTestId = "mcp-icon",
  } = props;

  // The picture that failed to load. The error belongs to that source, so a
  // new `imgSrc` or a different `imgNode` is tried afresh.
  const source = getSourceKey(imgNode, imgSrc);
  const [failedSource, setFailedSource] = useState<unknown>(null);
  const imgError = !!source && failedSource === source;

  const showImg = !!source && !imgError;

  const onImageError = () => setFailedSource(source);

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
