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
  // announced, so the region mounts empty and the label follows once it is
  // on the page. A decorative loader is no region and shows its text at once.
  const liveLabel = useLiveRegionText(label);
  const shownLabel = isDecorative ? label : liveLabel;

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
        return (
          <span style={{ ...style }}>
            <Text color={color} fontSize={size}>
              {shownLabel}
            </Text>
          </span>
        );
    }
  };

  // The animations are decorative (aria-hidden); the label is the text of
  // the status region, filled in after mount, so it is what assistive
  // technology reads and announces. The base type shows the label itself. A
  // decorative loader is hidden whole: its host control carries the busy
  // state.
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
      {type !== LoaderTypes.base ? (
        <span className={styles.visuallyHidden} data-testid="loader-label">
          {liveLabel}
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
