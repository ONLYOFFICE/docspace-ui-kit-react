import { Text } from "../text";

import { Oval } from "./sub-components/Oval";
import { DualRing } from "./sub-components/DualRing";
import { Rombs } from "./sub-components/Rombs";
import { Track } from "./sub-components/Track";

import type { LoaderProps } from "./Loader.types";
import { LoaderTypes } from "./Loader.enums";
import styles from "./Loader.module.scss";

export { LoaderTypes };

const DEFAULT_LABEL = "Loading content, please wait.";

const Loader = (props: LoaderProps) => {
  const {
    type = LoaderTypes.oval,
    color,
    size,
    label = DEFAULT_LABEL,
    className,
    style,
    id,
  } = props;

  const animationProps = { ...props, type, label };

  const svgRenderer = (t: LoaderTypes) => {
    switch (t) {
      case LoaderTypes.oval:
        return <Oval {...animationProps} />;
      case LoaderTypes.dualRing:
        return <DualRing {...animationProps} />;
      case LoaderTypes.rombs:
        return <Rombs {...animationProps} />;
      case LoaderTypes.track:
        return <Track {...animationProps} />;
      default:
        return (
          <span style={{ ...style }}>
            <Text color={color} fontSize={size}>
              {label}
            </Text>
          </span>
        );
    }
  };

  // The animations are decorative (aria-hidden); the label is the text of
  // the status region, so it is what assistive technology reads. The base
  // type shows the label itself.
  return (
    <div
      role="status"
      className={className}
      style={style}
      id={id}
      data-testid="loader"
    >
      {svgRenderer(type)}
      {type !== LoaderTypes.base && label ? (
        <span className={styles.visuallyHidden} data-testid="loader-label">
          {label}
        </span>
      ) : null}
    </div>
  );
};

Loader.default = {
  type: LoaderTypes.oval,
  size: "40px",
  label: DEFAULT_LABEL,
};

export { Loader };
