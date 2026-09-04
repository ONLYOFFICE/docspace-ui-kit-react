import CrossReactSvg from "../../assets/icons/12/cross.react.svg";
import InfoReactSvg from "../../assets/danger.toast.react.svg";

import React from "react";
import ReactDOM from "react-dom/client";
import Countdown, { zeroPad } from "react-countdown";
import classNames from "classnames";
import xss from "xss";

import { Heading, HeadingSize } from "../heading";
import { Text } from "../text";

import { BarConfig, SnackbarProps } from "./Snackbar.types";
import styles from "./Snackbar.module.scss";

declare global {
  interface Window {
    snackbar?: object;
  }
}

class SnackBar extends React.Component<SnackbarProps, { isLoaded: boolean }> {
  static show(barConfig: BarConfig) {
    const { parentElementId, ...rest } = barConfig;

    let parentElementNode =
      parentElementId && document.getElementById(parentElementId);

    if (!parentElementNode) {
      const snackbarNode = document.createElement("div");
      snackbarNode.id = "snackbar";
      document.body.appendChild(snackbarNode);
      parentElementNode = snackbarNode;
    }

    window.snackbar = barConfig;

    ReactDOM.createRoot(parentElementNode).render(<SnackBar {...rest} />);
  }

  static close() {
    const config = window.snackbar as BarConfig | undefined;
    if (config && config.parentElementId) {
      const snackbar = document.querySelector("#snackbar-container");
      if (snackbar) snackbar.remove();
      // ReactDOM.unmountComponentAtNode(window.snackbar.parentElementId);
    }
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
          <div
            className={classNames(styles.actionWrapper, styles.action)}
            onClick={this.onActionClick}
          >
            <CrossReactSvg className={styles.crossIcon} />
          </div>
        ) : null}
      </div>
    ) : (
      <div
        {...rest}
        data-testid="snackbar-container"
        id="snackbar-container"
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
                <Text className={styles.button} onClick={this.onActionClick}>
                  {btnText}
                </Text>
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
            type="submit"
            onClick={this.onActionClick}
          >
            <CrossReactSvg className={styles.crossIcon} />
          </button>
        ) : null}
      </div>
    );
  }
}

export { SnackBar };
