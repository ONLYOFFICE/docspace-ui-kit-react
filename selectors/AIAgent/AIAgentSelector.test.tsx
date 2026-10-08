import React from "react";
import { act, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RoomType } from "@onlyoffice/docspace-api-sdk";
import type { FolderDtoInteger } from "@onlyoffice/docspace-api-sdk";

import type { TSelectorItem } from "../../components/selector";

/** The subset of the Selector contract these tests observe. */
type CapturedProps = {
  items: TSelectorItem[];
  disableFirstFetch?: boolean;
  loadNextPage: (startIndex: number) => void;
  onSearch: (value: string, callback?: () => void) => void;
};

const mocks = vi.hoisted(() => {
  const request = vi.fn();

  return {
    request,
    // Stable across renders, as the real provider's clients are.
    api: { apiClient: { request } },
    lastProps: null as unknown as CapturedProps,
  };
});

vi.mock("../../providers/api/ApiProvider", () => ({
  useApi: () => mocks.api,
}));

vi.mock("../../context/ThemeContext", () => ({
  useTheme: () => ({ isBase: true }),
}));

vi.mock("../utils/hooks/useSocketHelper", () => ({
  default: () => ({ subscribe: () => {} }),
}));

// The real Selector is virtualized and measures the DOM, which jsdom reports
// as zero-height. The stub records its props and reproduces the one behaviour
// under test: page 0 is requested from an effect keyed on `loadNextPage`, so
// it runs on mount and again after a search rebuilds the callback.
vi.mock("../../components/selector", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../components/selector")>();

  const SelectorStub = (props: CapturedProps) => {
    mocks.lastProps = props;

    const { loadNextPage, disableFirstFetch } = props;

    React.useEffect(() => {
      if (disableFirstFetch) return;
      loadNextPage(0);
    }, [loadNextPage, disableFirstFetch]);

    return null;
  };

  return { ...actual, Selector: SelectorStub };
});

const { default: AIAgentSelector } = await import("./index");

const agent = (id: number, title: string): FolderDtoInteger => ({
  id,
  title,
  roomType: RoomType.CustomRoom,
  shared: false,
  parentId: 0,
  filesCount: 0,
  foldersCount: 0,
  security: { UseChat: true } as FolderDtoInteger["security"],
  logo: { medium: "", large: "", small: "", color: "5299e0", original: "" },
});

const portalPage = (titles: string[]) => ({
  response: {
    folders: titles.map((title, index) => agent(100 + index, title)),
    current: { id: 1, title: "Agents" },
    pathParts: [],
    total: titles.length,
    count: titles.length,
  },
});

const labels = () => mocks.lastProps.items.map((item) => item.label);

describe("<AIAgentSelector withInit />", () => {
  beforeEach(() => {
    mocks.request.mockReset();
    mocks.request.mockResolvedValue(portalPage(["From the portal"]));
  });

  it("keeps initItems instead of fetching the first page over them", async () => {
    render(
      <AIAgentSelector
        withInit
        initItems={[agent(1, "Test agent"), agent(2, "Support agent")]}
        initTotal={2}
        initHasNextPage={false}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    // Give a stray request every chance to land.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(mocks.request).not.toHaveBeenCalled();
    expect(labels()).toEqual(["Test agent", "Support agent"]);
  });

  it("still asks the portal once the reader searches", async () => {
    render(
      <AIAgentSelector
        withInit
        initItems={[agent(1, "Test agent")]}
        initTotal={1}
        initHasNextPage={false}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    act(() => mocks.lastProps.onSearch("portal"));

    await waitFor(() => expect(mocks.request).toHaveBeenCalledTimes(1));
    expect(mocks.request.mock.calls[0][0]).toContain("filterValue=portal");
    await waitFor(() => expect(labels()).toContain("From the portal"));
  });

  it("fetches the first page on mount without withInit", async () => {
    render(<AIAgentSelector onSubmit={vi.fn()} onClose={vi.fn()} />);

    await waitFor(() => expect(mocks.request).toHaveBeenCalledTimes(1));
  });
});
