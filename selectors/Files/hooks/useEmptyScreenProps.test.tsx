import { renderHook } from "@testing-library/react";
import { FolderType } from "@onlyoffice/docspace-api-sdk";
import { describe, expect, it } from "vitest";

import useEmptyScreenProps from "./useEmptyScreenProps";

const texts = (
  selectedItemType?: string,
  args: Omit<
    Parameters<typeof useEmptyScreenProps>[0],
    "selectedItemType"
  > = {},
) => {
  const { result } = renderHook(() =>
    useEmptyScreenProps({ selectedItemType, ...args }),
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
  it("speaks of rooms in a rooms section", () => {
    const rooms = texts("rooms");

    expect(rooms.emptyScreenHeader).toBe("No rooms here yet");
    expect(rooms.searchEmptyScreenHeader).toBe("Nothing found");
  });

  it("names the Knowledge folder and leaves the files root bare", () => {
    const knowledge = texts("files", {
      selectedTreeNode: { id: 1, type: FolderType.Knowledge },
    });
    const filesRoot = texts("files");

    expect(knowledge.emptyScreenHeader).toBe("No files here yet");
    expect(filesRoot.emptyScreenHeader).toBe("No files and folders here yet");
    expect(filesRoot.emptyScreenDescription).toBe("");
  });
});
