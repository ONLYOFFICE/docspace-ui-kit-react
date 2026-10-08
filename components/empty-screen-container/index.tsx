import classNames from "classnames";

import { isTablet } from "../../utils";
import { Text } from "../text";

import styles from "./EmptyScreenContainer.module.scss";

import type { EmptyScreenContainerProps } from "./EmptyScreenContainer.types";

const EmptyScreenContainer = (props: EmptyScreenContainerProps) => {
  const {
    imageSrc,
    imageAlt,
    headerText,
    subheadingText,
    descriptionText,
    buttons,
    imageStyle,
    buttonStyle,
    withoutFilter,
    className,
    id,
    style,
    headingLevel = 3,
  } = props;

  return (
    <div
      id={id}
      style={style}
      className={classNames(
        styles.body,
        {
          [styles.withoutFilter]: withoutFilter,
          [styles.withSubheading]: !!subheadingText,
          [styles.withDescription]: !!descriptionText,
        },
        className,
      )}
      data-testid="empty-screen-container"
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        style={!isTablet() ? imageStyle : {}}
        className={classNames(styles.image, "ec-image")}
      />

      {/* A polite live region around the text, so an empty state that
          replaces a list is announced. `display: contents` keeps the lines
          direct flex items of the column. */}
      <div role="status" className={styles.message}>
        {headerText ? (
          <Text
            as={`h${headingLevel}`}
            className={classNames(styles.header, "ec-header")}
          >
            {headerText}
          </Text>
        ) : null}

        {subheadingText ? (
          <Text
            as="p"
            fontWeight="600"
            className={classNames(styles.subheading, "ec-subheading")}
          >
            {subheadingText}
          </Text>
        ) : null}

        {descriptionText ? (
          <Text
            as="div"
            fontSize="12px"
            className={classNames(styles.description, "ec-desc")}
          >
            {descriptionText}
          </Text>
        ) : null}
      </div>

      {buttons ? (
        <div
          className={classNames(styles.buttons, "ec-buttons")}
          style={buttonStyle}
        >
          {buttons}
        </div>
      ) : null}
    </div>
  );
};

export type { EmptyScreenContainerProps };
export { EmptyScreenContainer };
