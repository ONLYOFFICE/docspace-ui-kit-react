import { Text } from "../text";
import { useCommonTranslation } from "../../utils/i18n";
import { useLiveRegionText } from "../../hooks/useLiveRegionText";

import { Oval } from "./sub-components/Oval";
import { DualRing } from "./sub-components/DualRing";
import { Rombs } from "./sub-components/Rombs";
import { Track } from "./sub-components/Track";

import type { LoaderProps } from "./Loader.types";
import { LoaderTypes } from "./Loader.enums";
import styles from "./Loader.module.scss";

export { LoaderTypes };

// The English fallback when no translations are loaded.
const DEFAULT_LABEL = "Loading...";

const Loader = (props: LoaderProps) => {
  const t = useCommonTranslation();
  const {
    type = LoaderTypes.oval,
    color,
    size,
    label: labelProp,
    className,
    style,
    id,
    isDecorative = false,
  } = props;

  const label = labelProp ?? (t("LoadingProcessing") || DEFAULT_LABEL);
  // A status region inserted together with its text is usually not
  // announced, so the region's hidden label stays empty for a moment and
  // the label follows (useLiveRegionText). What is drawn is not delayed.
  const liveLabel = useLiveRegionText(label);

  const { isDecorative: _isDecorative, ...rest } = props;
  const animationProps = { ...rest, type, label };

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
        // Drawn at once and hidden from assistive technology, which reads
        // the region's own label instead.
        return (
          <span style={{ ...style }} aria-hidden="true">
            <Text color={color} fontSize={size}>
              {label}
            </Text>
          </span>
        );
    }
  };

  // The animations, and the base type's drawn text, are hidden from
  // assistive technology; the region's visually hidden label, filled in
  // shortly after mount, is what it reads and announces. A decorative loader
  // is hidden whole: its host control carries the busy state.
  if (isDecorative) {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={style}
        id={id}
        data-testid="loader"
      >
        {svgRenderer(type)}
      </div>
    );
  }

  return (
    <div
      role="status"
      className={className}
      style={style}
      id={id}
      data-testid="loader"
    >
      {svgRenderer(type)}
      <span className={styles.visuallyHidden} data-testid="loader-label">
        {liveLabel}
      </span>
    </div>
  );
};

Loader.default = {
  type: LoaderTypes.oval,
  size: "40px",
  label: DEFAULT_LABEL,
};

export { Loader };
