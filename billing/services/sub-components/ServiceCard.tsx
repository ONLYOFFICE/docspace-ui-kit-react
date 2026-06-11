/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
  onToggle: (e: React.MouseEvent | React.ChangeEvent<HTMLInputElement>) => void;
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
  withoutIcon?:boolean;
  className?: string;
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
}) => {
  const tooltipId = tooltip ? `serviceCardTooltip_${id}` : undefined;

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
                  !isErrorColor,
                [styles.inactiveColor]: isInactiveColor,
              })}
              {...(priceTooltip && { "data-tooltip-id": "serviceTooltip" })}
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
              {priceTooltip ? (
                <Tooltip
                  id="serviceTooltip"
                  place="bottom"
                  maxWidth="300px"
                  float
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

