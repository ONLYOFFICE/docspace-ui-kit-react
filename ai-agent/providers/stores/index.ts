import type { StoreKeys } from "@onlyoffice/ai-chat";

const PREFIX = "docspace.ai-agent";

export const storeKeys: StoreKeys = {
  defaultProfile: `${PREFIX}.defaultProfile`,
  chatProfile: `${PREFIX}.chatProfile`,
  summarizationProfile: `${PREFIX}.summarizationProfile`,
  translationProfile: `${PREFIX}.translationProfile`,
  textAnalysisProfile: `${PREFIX}.textAnalysisProfile`,
  imageGenerationProfile: `${PREFIX}.imageGenerationProfile`,
  ocrProfile: `${PREFIX}.ocrProfile`,
  visionProfile: `${PREFIX}.visionProfile`,
  deepMode: `${PREFIX}.deepMode`,
  mcpServers: `${PREFIX}.mcpServers`,
  disabledTools: `${PREFIX}.disabledTools`,
};
