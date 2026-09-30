import { describe, expect, it } from "vitest";
import type { FolderDtoInteger } from "@onlyoffice/docspace-api-sdk";

import { convertToItems } from "./AIAgent.utils";

const agent = (id: number, security?: Record<string, boolean>) =>
  ({ id, title: `Agent ${id}`, security }) as unknown as FolderDtoInteger;

describe("convertToItems", () => {
  it("disables nothing without disableBySecurity", () => {
    const [item] = convertToItems([agent(1, { UseChat: false })]);

    expect(item.isDisabled).toBe(false);
  });

  it("disables an agent whose security denies the right", () => {
    const [item] = convertToItems([agent(1, { UseChat: false })], "UseChat");

    expect(item.isDisabled).toBe(true);
  });

  it("keeps an agent whose security grants the right", () => {
    const [item] = convertToItems([agent(1, { UseChat: true })], "UseChat");

    expect(item.isDisabled).toBe(false);
  });

  // A file-only right is never on a folder's security; getAgentList in
  // useAgentsHelper ignores it, and the initial items must agree.
  it("keeps an agent whose security does not carry the right at all", () => {
    const [item] = convertToItems([agent(1, { UseChat: true })], "AskAi");

    expect(item.isDisabled).toBe(false);
  });

  it("disables an agent with no security object", () => {
    const [item] = convertToItems([agent(1)], "UseChat");

    expect(item.isDisabled).toBe(true);
  });
});
