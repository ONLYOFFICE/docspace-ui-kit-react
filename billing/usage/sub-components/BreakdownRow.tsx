import classNames from "classnames";

import { Text } from "../../../components/text";
import { IconButton } from "../../../components/icon-button";
import { Loader } from "../../../components/loader";
import { LoaderTypes } from "../../../components/loader/Loader.enums";

import ChevronIcon from "../../../assets/icons/12/right-arrow.react.svg";
import DownloadIcon from "../../../assets/icons/16/download.react.svg";

import SpendAmount from "../../shared/spend-amount";

import styles from "../styles/Usage.module.scss";

type BreakdownRowProps = {
  title: string;
  subLabel?: string;
  amount: number;
  currency?: string;
  amountTooltipId: string;
  percent?: number;
  onExpand?: () => void;
  onDownload?: () => void;
  isDownloading?: boolean;
  isDownloadDisabled?: boolean;
};

const BreakdownRow = ({
  title,
  subLabel,
  amount,
  currency,
  amountTooltipId,
  percent,
  onExpand,
  onDownload,
  isDownloading = false,
  isDownloadDisabled = false,
}: BreakdownRowProps) => {
  return (
    <div className={styles.row}>
      <div className={styles.serviceInfo}>
        {onExpand ? (
          <Text
            as="span"
            className={styles.titleRow}
            onClick={onExpand}
            dataTestId="usage_row_expand"
          >
            <Text
              as="span"
              fontSize="14px"
              fontWeight={600}
              truncate
              className={styles.title}
            >
              {title}
            </Text>
            <ChevronIcon className={styles.chevron} />
          </Text>
        ) : (
          <Text
            as="span"
            fontSize="14px"
            fontWeight={600}
            truncate
            className={styles.title}
          >
            {title}
          </Text>
        )}
        {subLabel ? (
          <Text
            fontSize="12px"
            fontWeight={600}
            truncate
            className={styles.subLabel}
          >
            {subLabel}
          </Text>
        ) : null}
      </div>

      <div className={styles.progress}>
        {percent !== undefined ? (
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
            />
          </div>
        ) : null}
      </div>

      <SpendAmount
        amount={amount}
        currency={currency}
        className={styles.amount}
        fontSize="14px"
        fontWeight={700}
        tooltipId={amountTooltipId}
      />

      {isDownloading ? (
        <div className={styles.download}>
          <Loader type={LoaderTypes.track} size="16px" />
        </div>
      ) : onDownload ? (
        <IconButton
          className={classNames(styles.download, {
            [styles.downloadDisabled]: isDownloadDisabled,
          })}
          size={16}
          iconNode={<DownloadIcon />}
          onClick={onDownload}
          isDisabled={isDownloadDisabled}
          isClickable
          dataTestId="usage_row_download"
        />
      ) : (
        <div className={styles.download} />
      )}
    </div>
  );
};

export default BreakdownRow;

