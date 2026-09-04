import React from "react";

import AiChatReactSvg from "../../../../assets/icons/16/ai-chat.react.svg";
import PriceIcon from "../../../../assets/icons/16/price.react.svg";
import WalletIcon from "../../../../assets/icons/16/wallet.react.svg";

import { Link, LinkTarget } from "../../../../components/link";
import { Text } from "../../../../components/text";
import { CommonTrans } from "../../../../utils/i18n/CommonTrans";
import { useCommonTranslation } from "../../../../utils/i18n";

import styles from "./ChatAiBenefits.module.scss";

const OPENROUTER_PRICING_URL = "https://openrouter.ai/models";

/**
 * What a SaaS portal gets once AI chat is activated: the intro line plus the
 * three-row card shown under the description of the chat activation screen.
 * Standalone portals bring their own AI service, so the pricing/wallet rows do
 * not apply there and the screen omits this block entirely.
 */
export const ChatAiBenefits = () => {
  const t = useCommonTranslation();

  return (
    <div className={styles.benefits} data-testid="chat-ai-benefits">
      <Text as="p" fontSize="12px" lineHeight="16px" className={styles.intro}>
        {t("AIChatBenefitsTitle")}
      </Text>

      <ul className={styles.list}>
        <li className={styles.item}>
          <AiChatReactSvg className={styles.icon} />
          <Text as="span" fontSize="12px" fontWeight="600" lineHeight="16px">
            {t("AIChatBenefitWorkWithContent")}
          </Text>
        </li>

        <li className={styles.item}>
          <PriceIcon className={styles.icon} />
          <Text as="span" fontSize="12px" fontWeight="600" lineHeight="16px">
            <CommonTrans
              i18nKey="AIOpenRouterPricingNote"
              components={{
                1: (
                  <Link
                    fontSize="12px"
                    fontWeight={600}
                    color="accent"
                    textDecoration="underline dotted"
                    href={OPENROUTER_PRICING_URL}
                    target={LinkTarget.blank}
                    dataTestId="ai_openrouter_pricing_link"
                  />
                ),
              }}
            />
          </Text>
        </li>

        <li className={styles.item}>
          <WalletIcon className={styles.icon} />
          <Text as="span" fontSize="12px" fontWeight="600" lineHeight="16px">
            {t("PayAsYouGoFromWallet")}
          </Text>
        </li>
      </ul>
    </div>
  );
};

