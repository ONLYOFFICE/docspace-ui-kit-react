import React from "react";
import classNames from "classnames";

import { Text } from "../../../components/text";
import { ToggleButton } from "../../../components/toggle-button";
import { Tooltip } from "../../../components/tooltip";

import styles from "../styles/ServiceComponents.module.scss";

interface ServiceToggleSectionProps {
  isEnabled: boolean;
  onToggle: () => void;
  title: React.ReactNode;
  priceText?: string;
  description?: string;
  testId?: string;
  isDisabled?: boolean;
  withBottomMargin?: boolean;
  toggleTooltip?: string;
}

const ServiceToggleSection: React.FC<ServiceToggleSectionProps> = ({
  isEnabled,
  onToggle,
  title,
  priceText,
  description,
  testId,
  isDisabled,
  withBottomMargin,
  toggleTooltip,
}) => {
  const reactId = React.useId().replace(/:/g, "");
  const tooltipId = toggleTooltip
    ? `serviceToggleTooltip_${reactId}`
    : undefined;

  return (
    <div
      className={styles.serviceToggleSection}
      style={withBottomMargin ? { marginBottom: "20px" } : undefined}
    >
      <div
        className={classNames(styles.toggleButton, {
          [styles.toggleButtonWithTooltip]: !!toggleTooltip,
        })}
        {...(tooltipId ? { "data-tooltip-id": tooltipId } : {})}
      >
        <ToggleButton
          isChecked={isEnabled}
          onChange={onToggle}
          dataTestId={testId}
          isDisabled={isDisabled}
          className={toggleTooltip ? styles.serviceToggle : undefined}
        />
      </div>
      <div className={styles.textContent}>
        <div>
          <Text fontSize="12px" fontWeight={600} as="span">
            {title}
          </Text>
          {priceText ? (
            <>
              {" "}
              <Text as="span" fontSize="12px">
                {priceText}
              </Text>
            </>
          ) : null}
        </div>
        {description ? <Text fontSize="12px">{description}</Text> : null}
      </div>
      {toggleTooltip && tooltipId ? (
        <Tooltip
          id={tooltipId}
          place="bottom"
          maxWidth="300px"
          float
          getContent={() => toggleTooltip}
        />
      ) : null}
    </div>
  );
};

export default ServiceToggleSection;
