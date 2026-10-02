import { useState, useEffect } from "react";

import { isMobile } from "../../../../utils/device";
import { RectangleSkeleton } from "../../../rectangle";
import styles from "./Dialog.module.scss";

export const DialogInvitePanelSkeleton = () => {
  const [isMobileView, setIsMobileView] = useState(isMobile());

  const checkWidth = () => setIsMobileView(isMobile());

  useEffect(() => {
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return (
    <div
      className={styles.dialogInviteLoader}
      data-testid="dialog-invite-panel-skeleton"
    >
      <div className="dialog-loader-header">
        <RectangleSkeleton height="29px" />
      </div>

      <div className={styles.externalLinksLoader}>
        <div className="external-links-loader">
          <RectangleSkeleton width="177px" height="22px" />
          <RectangleSkeleton className="check-box" width="28px" height="16px" />
        </div>

        <RectangleSkeleton
          className="external-links-loader__description"
          width="320px"
          height="16px"
        />
      </div>

      <div className={styles.inviteInputLoader}>
        <div className={styles.invitePanelLoaderHeader}>
          <RectangleSkeleton
            width={isMobileView ? "156px" : "212px"}
            height="22px"
          />
          <RectangleSkeleton
            width={isMobileView ? "79px" : "122px"}
            height="19px"
          />
        </div>
        <RectangleSkeleton width="100%" height="32px" />
        <div className={styles.invitePanelLoaderFooter}>
          <RectangleSkeleton
            height="32px"
            width={isMobileView ? "237px" : "342px"}
          />
          <RectangleSkeleton width="98px" height="32px" />
        </div>
      </div>

      <div className="dialog-loader-footer">
        <RectangleSkeleton height="40px" />
        <RectangleSkeleton height="40px" />
      </div>
    </div>
  );
};
