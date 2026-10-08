import BoxDarkSvg from "../../assets/thirdparties/box.dark.svg";
import BoxSvg from "../../assets/thirdparties/box.svg";

import GitHubDarkSvg from "../../assets/thirdparties/github.dark.react.svg";
import GitHubLightSvg from "../../assets/thirdparties/github.light.react.svg";

import { ServerType } from "../../enums";

export const getServerIcon = (
  type: ServerType,
  isBase: boolean,
  portalUrl: string = "",
) => {
  switch (type) {
    case ServerType.Custom:
      return null;
    case ServerType.Portal:
      return <img src={portalUrl + "/logo.ashx?logotype=3"} alt="mcp icon" />;
    case ServerType.GitHub:
      if (isBase) return <GitHubLightSvg />;
      return <GitHubDarkSvg />;
    case ServerType.Box:
      return isBase ? <BoxSvg /> : <BoxDarkSvg />;
    default:
      return null;
  }
};
