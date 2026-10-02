import type { ComponentOverrides } from "@onlyoffice/ai-chat";

import { ButtonOverride } from "./button";
import { DialogContentOverride } from "./dialog-content";
import { DialogFooterOverride } from "./dialog-footer";
import { TabsOverride } from "./tabs";

export const componentOverrides: ComponentOverrides = {
  Tabs: TabsOverride,
  Button: ButtonOverride,
  DialogContent: DialogContentOverride,
  DialogFooter: DialogFooterOverride,
};
