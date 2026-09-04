import classNames from "classnames";

import { Scrollbar } from "../../scrollbar";
import { DeviceType } from "../../../enums";

import { SectionContainerProps } from "../Section.types";
import styles from "../Section.module.scss";

const SectionContainer = ({
  ref: forwardRef,
  withBodyScroll,
  children,
  currentDeviceType,
  isInfoPanelVisible,
  isSectionHeaderAvailable,
  bannerContent,
  scrollableBanner = false,
  stickyTableHeader = false,
  inert,
}: SectionContainerProps) => {
  return (
    <div
      ref={forwardRef}
      id="section"
      inert={inert}
      className={classNames(styles.sectionContainer, {
        [styles.withBodyScroll]: withBodyScroll,
        [styles.infoPanelVisible]: isInfoPanelVisible,
        [styles.withoutSectionHeader]: !isSectionHeaderAvailable,
        [styles.stickyTableHeader]: stickyTableHeader,
      })}
    >
      {/* Pinned banner: sits above the scroll container. The scrollable banner
          variant is rendered inside the section body instead (see Section). */}
      {bannerContent && !scrollableBanner ? (
        <div className="section-banner">{bannerContent}</div>
      ) : null}
      {withBodyScroll && currentDeviceType !== DeviceType.mobile ? (
        <Scrollbar id="sectionScroll" scrollClass="section-scroll" fixedSize>
          {children}
        </Scrollbar>
      ) : (
        children
      )}
    </div>
  );
};

SectionContainer.displayName = "SectionContainer";

export default SectionContainer;
