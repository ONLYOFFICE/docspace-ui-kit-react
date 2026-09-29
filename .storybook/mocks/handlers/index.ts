import type { AnyHandler } from "msw";

import { aiHandlers } from "./ai";
import { billingHandlers } from "./billing";
import { filesHandlers } from "./files";
import { peopleHandlers } from "./people";

// One list per area of the portal. The worker tries them in this order, and
// anything on the demo portal none of them answers gets a 404 and a warning.
export const handlers: AnyHandler[] = [
  ...peopleHandlers,
  ...filesHandlers,
  ...aiHandlers,
  ...billingHandlers,
];
