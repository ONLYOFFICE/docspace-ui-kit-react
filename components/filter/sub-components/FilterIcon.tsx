import type React from "react";
import FilterReactSvg from "../../../assets/filter.react.svg";
import classNames from "classnames";
import styles from "../Filter.module.scss";

import { activateOnButtonKey } from "../../../utils/keyboard-activation";

import { IconButton } from "../../icon-button";
import { TooltipContainer } from "../../tooltip";

type FilterIconProps = {
  onClick: () => void;
  isShowIndicator?: boolean;
  isOpen?: boolean;
  id?: string;
  title?: string;
  dataTestId?: string;
};

const FilterIcon = ({
  id,
  title,
  onClick,
  isOpen,
  isShowIndicator,
  dataTestId,
}: FilterIconProps) => {
  return (
    <TooltipContainer
      as="div"
      id={id}
      onClick={onClick}
      title={title}
      role="button"
      tabIndex={0}
      aria-label={title}
      aria-expanded={!!isOpen}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
        activateOnButtonKey(e, onClick)
      }
      className={classNames({
        [styles.button]: true,
        [styles.isOpen]: isOpen,
      })}
      data-testid={dataTestId ?? "filter_icon_button"}
    >
      <IconButton iconNode={<FilterReactSvg />} size={16} />
      {isShowIndicator ? (
        <div className={styles.indicator} data-testid="filter_icon_indicator" />
      ) : null}
    </TooltipContainer>
  );
};

export default FilterIcon;
