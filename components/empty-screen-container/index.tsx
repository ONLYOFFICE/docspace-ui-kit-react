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
  } = props;

  return (
    <div
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

      {headerText ? (
        <Text
          as="span"
          fontSize="19px"
          fontWeight="700"
          className={classNames(styles.header, "ec-header")}
        >
          {headerText}
        </Text>
      ) : null}

      {subheadingText ? (
        <Text
          as="span"
          fontWeight="600"
          className={classNames(styles.subheading, "ec-subheading")}
        >
          {subheadingText}
        </Text>
      ) : null}

      {descriptionText ? (
        <Text
          as="span"
          fontSize="12px"
          className={classNames(styles.description, "ec-desc")}
        >
          {descriptionText}
        </Text>
      ) : null}

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

export { EmptyScreenContainer };
