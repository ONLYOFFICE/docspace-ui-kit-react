import { match } from "ts-pattern";

import InfoIcon from "../../assets/info.outline.react.svg";

import PublicRoomBar from "../../components/public-room-bar";
import { Text } from "../../components/text";
import { Link, LinkType } from "../../components/link";
import { Loader, LoaderTypes } from "../../components/loader";

import styles from "./ChatInfoBlock.module.scss";
import { useCommonTranslation } from "../../utils/i18n";

export type ChatInfoBlockProps = {
  standalone: boolean;
  isPortalAdmin: boolean;
  isCardLinkedToPortal?: boolean;
  onActivateAI?: () => void;
  onTopUpAndActivateAI?: () => void;
  onShowAIBenefits?: () => void;
  isActivating?: boolean;
};

export const ChatInfoBlock = ({
  standalone,
  isPortalAdmin,
  onActivateAI,
  // onShowAIBenefits,
  isActivating,
}: ChatInfoBlockProps) => {
  const t = useCommonTranslation();

  const headerText =
    standalone && isPortalAdmin
      ? t("AIFeaturesAreCurrentlyDisabled")
      : t("AIFeaturesNotActive");

  // shared intro for the SaaS admin variants: what AI gives + wallet notice
  const activateIntro = (
    <Text as="span">{`${t("AIDisabledInfoBlockActivateWalletDescription")} `}</Text>
  );

  const bodyText = match([standalone, isPortalAdmin])
    // standalone admin
    .with([true, true], () =>
      t("AIDisabledInfoBlockStandaloneDescription"),
    )
    // saas admin
    .with([false, true], () => (
      <>
        {activateIntro}
        {isActivating ? (
          <Text
            as="span"
            style={{ display: "inline-flex", verticalAlign: "middle" }}
          >
            <Loader type={LoaderTypes.track} size="16px" />
          </Text>
        ) : (
          <>
            <Link
              type={LinkType.action}
              color="accent"
              textDecoration={"underline"}
              onClick={onActivateAI}
            >
              {t("Activate")}
            </Link>
            {/* {" | "}
            <Link
              type={LinkType.action}
              color="accent"
              onClick={onShowAIBenefits}
              textDecoration={"underline"}
            >
              {t("Benefits")}
            </Link> */}
          </>
        )}
      </>
    ))
    // standalone/saas user
    .otherwise(() =>
      t("AIDisabledInfoBlockContactAdminDescription"),
    );

  return (
    <PublicRoomBar
      className={styles.chatInfoBlock}
      headerText={headerText}
      bodyText={bodyText}
      iconName={<InfoIcon />}
      dataTestId="chat-info-block"
    />
  );
};

