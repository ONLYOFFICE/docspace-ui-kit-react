import {
  Tooltip,
  usePinnedTooltip,
} from "../../../../../../components/tooltip";
import type { TGetTooltipContent } from "../../../../../../components/tooltip";

import { TOKEN_USAGE_TOOLTIP_ID, parseTokenUsage } from "../../../utils";

import { TokenUsageContent } from "./TokenUsageContent";

const TOOLTIP_TEST_ID = "token_usage_tooltip";

export const TokenUsageTooltip = () => {
  const pinnedProps = usePinnedTooltip(TOKEN_USAGE_TOOLTIP_ID, TOOLTIP_TEST_ID);

  const getContent = ({ content }: TGetTooltipContent) => {
    const usage = parseTokenUsage(content);

    return usage ? <TokenUsageContent usage={usage} /> : null;
  };

  return (
    <Tooltip
      id={TOKEN_USAGE_TOOLTIP_ID}
      place="bottom"
      maxWidth="320px"
      getContent={getContent}
      {...pinnedProps}
      dataTestId={TOOLTIP_TEST_ID}
    />
  );
};
