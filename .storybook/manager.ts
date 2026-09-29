import { addons } from "storybook/manager-api";

import lightTheme from "./lightTheme";
import "./addons/ApiConfigTool";
import "./addons/DocsOnlyToggle";

addons.setConfig({
  theme: lightTheme,
});
