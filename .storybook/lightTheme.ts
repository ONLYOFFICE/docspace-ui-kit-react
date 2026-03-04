import { create } from "storybook/theming/create";

import { globalColors } from "../providers/theme/themes/globalColors";

export default create({
  base: "light",
  barTextColor: globalColors.lightErrorStatus,

  brandTitle: "DocSpace UI Kit",
  brandUrl: "https://www.onlyoffice.com/docspace.aspx",
  brandTarget: "_self",
});
