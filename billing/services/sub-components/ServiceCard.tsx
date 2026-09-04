import React from "react";
import classNames from "classnames";
import { ToggleButton } from "../../../components/toggle-button";
import { Text } from "../../../components/text";
import { Tooltip } from "../../../components/tooltip";
import styles from "../styles/AdditionalStorage.module.scss";

import CheckIcon from "../../../assets/icons/16/check.round.react.svg";
import InfoIcon from "../../../assets/info.outline.react.svg";
interface ServiceCardProps {
  onClick: (e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>) => void;
  onToggle?: (e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>) => void;
  priceTitle?: string | null;
  id?: string | null;
  image?: string | null;
  serviceTitle?: string | null;
  priceDescription?: string | React.ReactNode | null;
  children?: React.ReactNode;
  toggleDisabled?: boolean;
  cardDisabled?: boolean;
  isEnabled?: boolean;
  tooltip?: React.ReactNode;
  isWarningColor?: boolean;
  isErrorColor?: boolean;
  isInactiveColor?: boolean;
  priceTooltip?: React.ReactNode;
  icon?: React.ReactNode;
  withoutIcon?: boolean;
  className?: string;
  withoutGreenColor?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  cardDisabled,
  onClick,
  onToggle,
  priceTitle,
  children,
  toggleDisabled,
  isEnabled,
  id = "",
  image = "",
  serviceTitle,
  priceDescription,
  tooltip,
  isWarningColor,
  isErrorColor,
  isInactiveColor,
  priceTooltip,
  icon,
  withoutIcon,
  className,
  withoutGreenColor,
}) => {
  const tooltipId = tooltip ? `serviceCardTooltip_${id}` : undefined;
  const priceTooltipId = priceTooltip
    ? `servicePriceTooltip_${id}`
    : undefined;

  return (
    <div
      key={id}
      className={classNames(styles.serviceContainer, className, {
        [styles.disabled]: cardDisabled,
      })}
      {...(!cardDisabled ? { onClick } : {})}
      data-testid={`storage_service_${id}`}
      data-id={id}
      {...(cardDisabled && tooltipId ? { "data-tooltip-id": tooltipId } : {})}
    >
      <div className={styles.headerContainer}>
        <div className={styles.iconWrapper}>
          <div
            // biome-ignore lint/security/noDangerouslySetInnerHtml: TODO fix
            dangerouslySetInnerHTML={{ __html: image ?? "" }}
            className={styles.iconsContainer}
          />
        </div>

        <div
          onClick={onToggle}
          className={styles.toggleWrapper}
          data-id={id}
          data-enabled={isEnabled}
          data-disabled={toggleDisabled}
          {...(tooltipId ? { "data-tooltip-id": tooltipId } : {})}
        >
          <ToggleButton
            isChecked={isEnabled}
            className={styles.serviceToggle}
            isDisabled={toggleDisabled}
            dataTestId={`storage_service_${id}_toggle`}
          />
        </div>
      </div>

      <div className={styles.contentContainer}>
        <Text
          fontWeight={600}
          fontSize="14px"
          className={styles.containerTitle}
        >
          {serviceTitle}
        </Text>

        <div className={styles.middleBlock}>
          <Text fontSize="12px" className={styles.priceDescription}>
            {priceTitle}
          </Text>

          {children}

          <div className={styles.priceContainer}>
            <div
              className={classNames(styles.additionalInfo, {
                [styles.warningColor]: isWarningColor,
                [styles.errorColor]: !isInactiveColor && isErrorColor,
                [styles.greenColor]:
                  isEnabled &&
                  !isWarningColor &&
                  !isInactiveColor &&
                  !isErrorColor &&
                  !withoutGreenColor,
                [styles.inactiveColor]: isInactiveColor,
              })}
              {...(priceTooltipId && { "data-tooltip-id": priceTooltipId })}
            >
              {withoutIcon ? null : icon ? (
                icon
              ) : isWarningColor || isErrorColor ? (
                <InfoIcon />
              ) : isEnabled ? (
                <CheckIcon />
              ) : null}
              <Text fontWeight={600} fontSize="12px">
                {priceDescription}
              </Text>
              {priceTooltipId ? (
                <Tooltip
                  id={priceTooltipId}
                  place="bottom"
                  maxWidth="300px"
                  float
                  offset={20}
                  getContent={() => priceTooltip}
                  dataTestId="service_change_shedule_tooltip"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {tooltip && tooltipId ? (
        <Tooltip
          id={tooltipId}
          place="bottom"
          maxWidth="300px"
          float
          getContent={() => tooltip}
        />
      ) : null}
    </div>
  );
};

export default ServiceCard;

