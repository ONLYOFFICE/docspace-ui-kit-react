import { addons } from "storybook/manager-api";

import lightTheme from "./lightTheme";
import "./addons/ApiConfigTool";
import "./addons/DocsOnlyToggle";
import "./addons/ResetDraggedViewport";

addons.setConfig({
  theme: lightTheme,
});
