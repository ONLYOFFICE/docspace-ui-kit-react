import { addons } from "storybook/manager-api";

import lightTheme from "./lightTheme";
import "./addons/ApiConfigTool";

addons.setConfig({
  theme: lightTheme,
});
