import React from "react";
import { observer } from "mobx-react";

import { Row, RowContent } from "../../../../../components/rows";
import { Text } from "../../../../../components/text";
import PencilIcon from "../../../../../assets/pencil.react.svg";
import type { TUpcomingPayment } from "../../../../types";

import styles from "./UpcomingPaymentsRow.module.scss";

type UpcomingPaymentRowProps = {
  sectionWidth: number;
  title: string;
  renewalDate: string;
  details: string;
  amount: string;
  actionType?: TUpcomingPayment["actionType"];
  actionRoute?: TUpcomingPayment["actionRoute"];
};

const UpcomingPaymentRow: React.FC<UpcomingPaymentRowProps> = ({
  sectionWidth,
  title,
  renewalDate,
  details,
  amount,
  actionType,
  actionRoute,
}) => {
  const onAction = () => {
    if (actionRoute) window.DocSpace?.navigate(actionRoute);
  };

  const getRowChildren = () => [
    <Text key="title" fontWeight={600} fontSize="14px">
      {title}
    </Text>,
    <div key="spacer" />,
    <Text key="date" fontWeight={600} fontSize="12px">
      {renewalDate}
    </Text>,
    <Text key="details" fontWeight={600} fontSize="12px">
      {details}
    </Text>,
  ];

  return (
    <Row
      className={styles.row}
      badgesComponent={
        <div className={styles.badges}>
          <Text fontWeight={600} fontSize="13px">
            {amount}
          </Text>
          {actionType ? (
            <div
              className={styles.action}
              onClick={onAction}
              role="button"
              tabIndex={0}
            >
              <PencilIcon />
            </div>
          ) : null}
        </div>
      }
    >
      <RowContent
        sectionWidth={sectionWidth}
        sideColor="var(--payment-inactive-color)"
      >
        {getRowChildren()}
      </RowContent>
    </Row>
  );
};

export default observer(UpcomingPaymentRow);

