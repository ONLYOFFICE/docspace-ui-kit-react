import {
  Tooltip,
  usePinnedTooltip,
} from "../../../../../../components/tooltip";
import type { TGetTooltipContent } from "../../../../../../components/tooltip";

import { BYOK_TOOLTIP_ID, parseByokOperation } from "../../../utils";

import { ByokMarkContent } from "./ByokMarkContent";

const TOOLTIP_TEST_ID = "byok_tooltip";

export const ByokMarkTooltip = () => {
  const pinnedProps = usePinnedTooltip(BYOK_TOOLTIP_ID, TOOLTIP_TEST_ID);

  const getContent = ({ content }: TGetTooltipContent) => {
    const operation = parseByokOperation(content);

    return operation ? <ByokMarkContent operation={operation} /> : null;
  };

  return (
    <Tooltip
      id={BYOK_TOOLTIP_ID}
      place="bottom"
      maxWidth="320px"
      getContent={getContent}
      {...pinnedProps}
      dataTestId={TOOLTIP_TEST_ID}
    />
  );
};
