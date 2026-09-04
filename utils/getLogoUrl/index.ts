import { WhiteLabelLogoType } from "../../enums";

export const getLogoUrl = (
  logoType: WhiteLabelLogoType,
  dark: boolean = false,
  def: boolean = false,
  culture?: string,
  update: boolean = false,
) => {
  let logoTimestamp = "";

  if (update) {
    const timestamp = window.sessionStorage?.getItem("logoUpdateTimestamp");
    if (timestamp) logoTimestamp = `&t=${timestamp}`;
  }

  const url = `/logo.ashx?logotype=${logoType}&dark=${dark}&default=${def}${culture ? `&culture=${culture}` : ""}${logoTimestamp}`;

  return url;
};
