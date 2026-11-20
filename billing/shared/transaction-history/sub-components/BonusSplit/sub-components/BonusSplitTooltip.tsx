import {
  Tooltip,
  usePinnedTooltip,
} from "../../../../../../components/tooltip";
import type { TGetTooltipContent } from "../../../../../../components/tooltip";

import { BONUS_SPLIT_TOOLTIP_ID, parseBonusSplit } from "../../../utils";

import { BonusSplitContent } from "./BonusSplitContent";

const TOOLTIP_TEST_ID = "bonus_split_tooltip";

export const BonusSplitTooltip = () => {
  const pinnedProps = usePinnedTooltip(BONUS_SPLIT_TOOLTIP_ID, TOOLTIP_TEST_ID);

  const getContent = ({ content }: TGetTooltipContent) => {
    const split = parseBonusSplit(content);

    return split ? <BonusSplitContent split={split} /> : null;
  };

  return (
    <Tooltip
      id={BONUS_SPLIT_TOOLTIP_ID}
      place="bottom"
      maxWidth="280px"
      getContent={getContent}
      {...pinnedProps}
      dataTestId={TOOLTIP_TEST_ID}
    />
  );
};
