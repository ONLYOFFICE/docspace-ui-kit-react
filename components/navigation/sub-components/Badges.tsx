import React from "react";
import { ReactSVG } from "react-svg";

import { Text } from "../../text";
import { Tooltip } from "../../tooltip";
import { TBadgesProps } from "../Navigation.types";

const Badges = ({
  titleIcon,
  isRootFolder,
  titleIconTooltip,
}: TBadgesProps) => {
  const getContent = () => (
    <Text fontSize="12px" fontWeight={400} noSelect>
      {titleIconTooltip}
    </Text>
  );

  return (
    <>
      {titleIcon && !isRootFolder ? (
        <ReactSVG
          style={{ height: 16 }}
          data-tooltip-id="iconTooltip"
          className="title-icon"
          src={titleIcon}
        />
      ) : null}

      {titleIconTooltip ? (
        <Tooltip
          id="iconTooltip"
          place="bottom"
          getContent={getContent}
          maxWidth="300px"
        />
      ) : null}
    </>
  );
};

export default React.memo(Badges);
