import React from "react";
import { observer } from "mobx-react";

import {
  ModalDialog,
  ModalDialogType,
} from "../../../../components/modal-dialog";
import { Button, ButtonSize } from "../../../../components/button";
import { Text } from "../../../../components/text";
import { useCommonTranslation } from "../../../../utils/i18n";
import { getConstName } from "../../../../constants/consts";

import AIChatIcon from "../../../../assets/icons/32/ai-chat.svg";
import AIAgentsIcon from "../../../../assets/icons/32/ai-agents.svg";
import McpToolIcon from "../../../../assets/icons/16/mcp.connect.react.svg";

import WriteTagIcon from "../../../../assets/icons/16/ai-feature-write.react.svg";
import SummarizeTagIcon from "../../../../assets/icons/16/ai-feature-summarize.react.svg";
import OcrTagIcon from "../../../../assets/icons/16/ai-feature-ocr.react.svg";
import PdfFormTagIcon from "../../../../assets/icons/16/ai-feature-pdf-form.react.svg";
import GrammarTagIcon from "../../../../assets/icons/16/ai-feature-grammar.react.svg";
import InsightsTagIcon from "../../../../assets/icons/16/ai-feature-insights.react.svg";
import WebSearchTagIcon from "../../../../assets/icons/16/ai-feature-web-search.react.svg";

import styles from "../../styles/AIFeaturesDialog.module.scss";

export interface AIFeaturesDialogProps {
  visible: boolean;
  onClose: () => void;
  onActivate: () => void;
  isCardLinkedToPortal: boolean;
  isActivating?: boolean;
}

const AIFeaturesDialog: React.FC<AIFeaturesDialogProps> = ({
  visible,
  onClose,
  onActivate,
  isCardLinkedToPortal,
  isActivating,
}) => {
  const t = useCommonTranslation();

  const cards = [
    {
      id: "chat",
      icon: (
        <div className={styles.cardIcon}>
          <AIChatIcon />
        </div>
      ),
      title: t("AIChatInAnyApp"),
      description: t("AIChatInAnyAppDescription"),
    },
    {
      id: "agents",
      icon: (
        <div className={styles.cardIcon}>
          <AIAgentsIcon />
        </div>
      ),
      title: t("AIAgents"),
      description: t("AIAgentsCardDescription"),
    },
    {
      id: "mcp",
      icon: (
        <div className={styles.mcpIcon}>
          <McpToolIcon />
        </div>
      ),
      title: t("ConnectMCPServersTitle"),
      description: t("ConnectMCPServersCardDescription"),
    },
  ];

  const tags = [
    { label: t("AIFeatureWriteRewriteTranslate"), icon: <WriteTagIcon /> },
    { label: t("AIFeatureSummarizeDocuments"), icon: <SummarizeTagIcon /> },
    { label: getConstName("OCR"), icon: <OcrTagIcon /> },
    { label: t("AIFeaturePDFForms"), icon: <PdfFormTagIcon /> },
    { label: t("AIFeatureCheckGrammar"), icon: <GrammarTagIcon /> },
    { label: t("AIFeatureFormInsights"), icon: <InsightsTagIcon /> },
    { label: t("AIFeatureWebSearch"), icon: <WebSearchTagIcon /> },
  ];

  return (
    <ModalDialog
      visible={visible}
      onClose={onClose}
      displayType={ModalDialogType.modal}
      autoMaxWidth
      autoMaxHeight
      withBodyScroll
    >
      <ModalDialog.Header>{t("AIFeatures")}</ModalDialog.Header>
      <ModalDialog.Body>
        <div className={styles.content}>
          <div className={styles.intro}>
            <Text
              fontSize="16px"
              fontWeight={700}
              className={styles.introTitle}
            >
              {t("UnlockAIAcrossWorkspace")}
            </Text>
            <Text fontSize="13px" className={styles.introDescription}>
              {t("UnlockAIDescription")}
            </Text>
          </div>

          <div className={styles.cards}>
            {cards.map((card) => (
              <div key={card.id} className={styles.card}>
                {card.icon}
                <div className={styles.cardText}>
                  <Text
                    fontSize="14px"
                    fontWeight={700}
                    className={styles.cardTitle}
                  >
                    {card.title}
                  </Text>
                  <Text fontSize="12px" className={styles.cardDescription}>
                    {card.description}
                  </Text>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <Text className={styles.dividerLabel}>{t("PlusLabel")}</Text>
            <span className={styles.dividerLine} />
          </div>

          <div className={styles.tags}>
            {tags.map((tag) => (
              <Text
                as="span"
                key={tag.label}
                fontWeight={600}
                className={styles.tag}
              >
                <Text as="span" className={styles.tagIcon}>
                  {tag.icon}
                </Text>
                {tag.label}
              </Text>
            ))}
            <Text as="span" fontWeight={600} className={styles.andMore}>
              {t("AndMuchMore")}
            </Text>
          </div>
        </div>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button
          label={
            !isCardLinkedToPortal
              ? t("TopUpAndActivate")
              : t("ActivateAIFeatures")
          }
          size={ButtonSize.normal}
          onClick={onActivate}
          primary
          isLoading={isActivating}
          testId="ai-features-dialog-activate-button"
        />
        <Button
          label={t("CancelButton")}
          size={ButtonSize.normal}
          onClick={onClose}
          isDisabled={isActivating}
          testId="ai-features-dialog-cancel-button"
        />
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default observer(AIFeaturesDialog);

