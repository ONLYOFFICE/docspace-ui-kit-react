import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import useEmptyScreenProps from "./useEmptyScreenProps";

const texts = (selectedItemType?: string) => {
  const { result } = renderHook(() =>
    useEmptyScreenProps({ selectedItemType }),
  );
  const {
    emptyScreenHeader,
    emptyScreenDescription,
    searchEmptyScreenHeader,
    searchEmptyScreenDescription,
  } = result.current;

  return {
    emptyScreenHeader,
    emptyScreenDescription,
    searchEmptyScreenHeader,
    searchEmptyScreenDescription,
  };
};

describe("useEmptyScreenProps", () => {
  it("speaks of agents, not of a chat, at the agents root", () => {
    // The Files selector picks a destination here: there is no chat to
    // continue, which is what the AI agent selector's description is about.
    expect(texts("agents")).toEqual({
      emptyScreenHeader: "No AI agents available",
      emptyScreenDescription:
        "Create a new agent to move files to its knowledge base.",
      searchEmptyScreenHeader: "No AI agents found",
      searchEmptyScreenDescription:
        "No agents match your current filter. Adjust the filter or clear it to see all available agents.",
    });
  });

  it("shows the agents illustration for an empty search too", () => {
    const { result } = renderHook(() =>
      useEmptyScreenProps({ selectedItemType: "agents" }),
    );

    expect(result.current.searchEmptyScreenImage).toBe(
      result.current.emptyScreenImage,
    );
  });

  it("keeps the rooms texts outside the agents root", () => {
    const { emptyScreenDescription, searchEmptyScreenHeader } = texts("rooms");

    expect(emptyScreenDescription).not.toMatch(/agent/i);
    expect(searchEmptyScreenHeader).not.toMatch(/agent/i);
  });
});
