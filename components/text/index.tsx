import classNames from "classnames";

import { withTooltip } from "../tooltip";

import styles from "./Text.module.scss";
import type { TextProps } from "./Text.types";

export type { TextProps };

const TextUi = ({
  ref,
  title,
  tag,
  as,
  fontSize,
  fontWeight,
  color,
  textAlign,
  onClick,
  dir,
  children,
  view,
  isInline,
  isBold,
  isItalic,
  lineHeight,
  noSelect,
  backgroundColor,
  truncate,
  className,
  style,
  dataTestId,
  ...rest
}: TextProps) => {
  const elementType = !as && tag ? tag : as;
  const isAutoDir = dir === "auto";
  const dirProps = isAutoDir ? {} : { dir };

  const textStyles = {
    fontSize,
    fontWeight: isBold ? 700 : fontWeight,
    color,
    textAlign,
    lineHeight,
    backgroundColor,
    ...style,
  };

  const textClassName = classNames(
    styles.text,
    {
      [styles.inline]: isInline,
      [styles.italic]: isItalic,
      [styles.bold]: isBold,
      [styles.noSelect]: noSelect,
      [styles.truncate]: truncate,
    },
    className,
  );

  const Element = elementType || "p";

  return (
    <Element
      ref={ref}
      title={title}
      data-testid={dataTestId ?? "text"}
      onClick={onClick}
      className={textClassName}
      style={textStyles}
      {...dirProps}
      {...rest}
    >
      {isAutoDir ? (
        <span
          className={classNames(styles.autoDirSpan, {
            [styles.tile]: view === "tile",
          })}
          dir="auto"
        >
          {children}
        </span>
      ) : (
        children
      )}
    </Element>
  );
};

const Text = withTooltip(TextUi);

export { Text, TextUi };
