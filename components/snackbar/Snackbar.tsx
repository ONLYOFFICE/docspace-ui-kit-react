import CrossReactSvg from "../../assets/icons/12/cross.react.svg";
import InfoReactSvg from "../../assets/danger.toast.react.svg";

import React from "react";
import { createRoot, type Root } from "react-dom/client";
import * as ReactCountdownNamespace from "react-countdown";
import { zeroPad } from "react-countdown";
import classNames from "classnames";
import xss from "xss";

import { interopDefault } from "../../utils/interop-default";
import { Heading, HeadingSize } from "../heading";
import { Text } from "../text";

import { BarConfig, SnackbarProps } from "./Snackbar.types";
import styles from "./Snackbar.module.scss";

// See utils/interop-default: react-countdown's default export is broken
// under Node's ESM resolver (Vitest, Next.js SSR).
const Countdown = interopDefault(ReactCountdownNamespace);

declare global {
  interface Window {
    snackbar?: object;
  }
}

// The one root the static `show` renders into, the node it lives on, and
// whether `show` created that node (and so has to remove it again).
let staticRoot: Root | null = null;
let staticNode: HTMLElement | null = null;
let ownsStaticNode = false;

class SnackBar extends React.Component<SnackbarProps, { isLoaded: boolean }> {
  static show(barConfig: BarConfig) {
    const { parentElementId, ...rest } = barConfig;

    const target = parentElementId
      ? document.getElementById(parentElementId)
      : null;

    // A bar already shown somewhere else is closed first; one shown in the
    // same place is re-rendered in its existing root.
    if (staticRoot && (target ? staticNode !== target : !ownsStaticNode)) {
      SnackBar.close();
    }

    if (!staticRoot) {
      let node = target;
      let owns = false;

      if (!node) {
        node = document.createElement("div");
        node.id = "snackbar";
        document.body.appendChild(node);
        owns = true;
      }

      staticRoot = createRoot(node);
      staticNode = node;
      ownsStaticNode = owns;
    }

    window.snackbar = barConfig;

    staticRoot.render(<SnackBar {...rest} />);
  }

  static close() {
    if (staticRoot) {
      staticRoot.unmount();
      staticRoot = null;
    }

    if (ownsStaticNode && staticNode) staticNode.remove();

    staticNode = null;
    ownsStaticNode = false;
    window.snackbar = undefined;
  }

  constructor(props: SnackbarProps) {
    super(props);
    this.state = { isLoaded: false };
  }

  componentDidMount() {
    const { onLoad } = this.props;
    onLoad?.();
    const skipBlur = this.props.skipBlur ?? false;
    if (!skipBlur) window.addEventListener("blur", this.onClickIFrame);
  }

  componentWillUnmount() {
    window.removeEventListener("blur", this.onClickIFrame);
  }

  onActionClick = (e?: React.MouseEvent) => {
    const { onAction } = this.props;
    onAction?.(e);
  };

  onClickIFrame = () => {
    if (
      document.activeElement &&
      document.activeElement.nodeName.toLowerCase() === "iframe"
    ) {
      setTimeout(() => this.onActionClick(), 500);
    }
  };

  // Renderer callback with condition
  countDownRenderer = ({
    minutes,
    seconds,
    completed,
  }: {
    minutes: string | number;
    seconds: string | number;
    completed: boolean;
  }) => {
    if (completed) return null;
    const { fontSize, fontWeight } = this.props;

    // Render a countdown
    return (
      <Text as="p" fontSize={fontSize} fontWeight={fontWeight}>
        {zeroPad(minutes)}:{zeroPad(seconds)}
      </Text>
    );
  };

  render() {
    const {
      text,
      headerText,
      btnText,
      showIcon,
      fontSize,
      fontWeight,
      textAlign,
      htmlContent,
      style,
      countDownTime,
      isCampaigns,
      additionalHeaderText,
      sectionWidth,
      opacity,
      backgroundImg,
      onAction: _onAction, // Excluded from rest to prevent DOM warning
      onLoad: _onLoad, // Excluded from rest to prevent DOM warning
      isMaintenance: _isMaintenance, // Not a DOM attribute
      onClose: _onClose, // Not a DOM attribute
      skipBlur: _skipBlur, // Not a DOM attribute
      closeButtonLabel = "Close",
      id = "snackbar-container",
      ...rest
    } = this.props;

    const headerStyles = headerText ? {} : { display: "none" };

    const snackbarStyle = {
      "--opacity": opacity,
      "--background-image": backgroundImg,
      ...style,
    } as React.CSSProperties;

    const { isLoaded } = this.state;

    return isCampaigns ? (
      <div id="bar-banner" style={{ position: "relative" }}>
        <iframe
          id="bar-frame"
          data-testid="snackbar-iframe"
          className={styles.iframe}
          style={{ "--section-width": sectionWidth } as React.CSSProperties}
          src={htmlContent}
          scrolling="no"
          onLoad={() => {
            this.setState({ isLoaded: true });
          }}
        />
        {isLoaded ? (
          <button
            type="button"
            className={classNames(styles.actionWrapper, styles.action)}
            onClick={this.onActionClick}
            aria-label={closeButtonLabel}
            data-testid="snackbar-close"
          >
            <CrossReactSvg className={styles.crossIcon} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    ) : (
      <div
        {...rest}
        data-testid="snackbar-container"
        id={id}
        role="status"
        aria-live="polite"
        style={snackbarStyle}
        className={styles.snackbar}
      >
        {htmlContent ? (
          <div
            className={styles.iframe}
            style={{ "--section-width": sectionWidth } as React.CSSProperties}
            data-testid="snackbar-html-content"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: htmlContent is sanitized with xss library
            dangerouslySetInnerHTML={{
              __html: xss(htmlContent),
            }}
          />
        ) : (
          <div
            className={styles.textContainer}
            style={{ "--text-align": textAlign } as React.CSSProperties}
          >
            <div className={styles.headerBody} style={{ textAlign }}>
              {showIcon ? (
                <div className={styles.logo}>
                  <InfoReactSvg
                    className={styles.infoIcon}
                    data-testid="snackbar-icon"
                  />
                </div>
              ) : null}
              <div className={styles.headerContainer}>
                <Heading
                  size={HeadingSize.xsmall}
                  isInline
                  className={styles.textHeader}
                  style={headerStyles}
                  data-testid="snackbar-header"
                >
                  {headerText}
                </Heading>
                {additionalHeaderText ? (
                  <Text
                    as="span"
                    isInline
                    fontSize="12px"
                    data-testid="snackbar-additional-info"
                  >
                    {additionalHeaderText}
                  </Text>
                ) : null}
              </div>
            </div>
            <div className={styles.textBody}>
              <Text
                as="p"
                className={styles.text}
                fontSize={fontSize}
                fontWeight={fontWeight}
                data-testid="snackbar-message"
              >
                {text}
              </Text>

              {btnText ? (
                <button
                  type="button"
                  className={styles.button}
                  onClick={this.onActionClick}
                  data-testid="snackbar-action"
                >
                  {btnText}
                </button>
              ) : null}

              {countDownTime > -1 ? (
                <Countdown
                  date={Date.now() + countDownTime}
                  renderer={this.countDownRenderer}
                  onComplete={this.onActionClick}
                />
              ) : null}
            </div>
          </div>
        )}
        {!btnText ? (
          <button
            className={styles.action}
            type="button"
            onClick={this.onActionClick}
            aria-label={closeButtonLabel}
            data-testid="snackbar-close"
          >
            <CrossReactSvg className={styles.crossIcon} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    );
  }
}

export { SnackBar };
