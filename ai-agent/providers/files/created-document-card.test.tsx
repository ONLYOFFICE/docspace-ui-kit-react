import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ToolResultRenderProps } from "@onlyoffice/ai-chat";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue?: string; name?: string }) =>
      (options?.defaultValue ?? key).replace("{{name}}", options?.name ?? ""),
  }),
}));

const { openAttachedFile } = vi.hoisted(() => ({ openAttachedFile: vi.fn() }));
vi.mock("./open-file", () => ({ openAttachedFile }));

import { CreatedDocumentsRenderer } from "./created-document-card";
import {
  CreatedDocumentsContext,
  createdDocumentsOf,
  type CreatedDocumentsContextValue,
} from "./created-documents";

const DOCUMENT_AGENT_RESULT = {
  data: {
    summary: "Drafted the proposal.",
    files: [
      {
        id: "101",
        title: "Proposal for Acme Corp.docx",
        url: "/doceditor?fileId=101",
        folderId: "9",
        fileExst: ".docx",
      },
      { id: "102", title: "Budget.xlsx", url: "/doceditor?fileId=102" },
    ],
  },
};

const props = (
  parsedResult: unknown,
  isRunning = false,
): ToolResultRenderProps => ({
  toolName: "document_agent",
  name: "document_agent",
  serverType: "document-agent",
  toolCallId: "call-1",
  args: {},
  result: JSON.stringify(parsedResult),
  parsedResult,
  isRunning,
  isError: false,
});

const renderCards = (
  parsedResult: unknown,
  context: CreatedDocumentsContextValue = { agentName: null },
  isRunning = false,
) =>
  render(
    <CreatedDocumentsContext.Provider value={context}>
      <CreatedDocumentsRenderer {...props(parsedResult, isRunning)} />
    </CreatedDocumentsContext.Provider>,
  );

describe("createdDocumentsOf", () => {
  it("reads the files of the document agent", () => {
    expect(createdDocumentsOf(DOCUMENT_AGENT_RESULT)).toEqual([
      { id: "101", title: "Proposal for Acme Corp.docx", fileExst: ".docx" },
      // The extension comes from the title when the file was not read back.
      { id: "102", title: "Budget.xlsx", fileExst: ".xlsx" },
    ]);
  });

  it("keeps the files saved before an unfinished task failed", () => {
    expect(
      createdDocumentsOf({
        error: "Timed out",
        data: { files: [{ id: 7, title: "Draft.docx" }] },
      }),
    ).toEqual([{ id: 7, title: "Draft.docx", fileExst: ".docx" }]);
  });

  it("reads the file of an editor generate tool", () => {
    expect(
      createdDocumentsOf({
        data: {
          id: 55,
          title: "Report.docx",
          parentId: 3,
          parentTitle: "My documents",
          url: "/doceditor?fileId=55",
        },
      }),
    ).toEqual([{ id: 55, title: "Report.docx", fileExst: ".docx" }]);
  });

  it("names nothing for a failure before anything was saved", () => {
    expect(createdDocumentsOf("Document agent is not configured")).toEqual([]);
    expect(createdDocumentsOf({ error: "Forbidden" })).toEqual([]);
    expect(createdDocumentsOf({ data: { error: "Forbidden" } })).toEqual([]);
    expect(createdDocumentsOf({ data: { files: [] } })).toEqual([]);
    expect(createdDocumentsOf(undefined)).toEqual([]);
  });
});

describe("CreatedDocumentsRenderer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("draws a card with the name for each document created", () => {
    renderCards(DOCUMENT_AGENT_RESULT);
    const cards = screen.getAllByTestId("created-document-card");
    expect(cards).toHaveLength(2);
    expect(cards[0].textContent).toContain("Proposal for Acme Corp.docx");
    // No page count, and no "created by" for the default agent.
    expect(screen.queryByTestId("created-document-author")).toBeNull();
  });

  it("says which agent created the document in a chat on an agent", () => {
    renderCards(DOCUMENT_AGENT_RESULT, { agentName: "Legal Reviewer" });
    expect(
      screen.getAllByTestId("created-document-author")[0].textContent,
    ).toBe("created by Legal Reviewer");
  });

  it("opens the document on a click", () => {
    renderCards(DOCUMENT_AGENT_RESULT);
    fireEvent.click(screen.getAllByTestId("created-document-open")[0]);
    expect(openAttachedFile).toHaveBeenCalledWith(
      "101/Proposal for Acme Corp.docx",
      "Proposal for Acme Corp.docx",
    );
  });

  it("copies the document to a room from Save to room..., without opening it", () => {
    const onSaveToRoom = vi.fn();
    renderCards(DOCUMENT_AGENT_RESULT, { agentName: null, onSaveToRoom });
    const [save] = screen.getAllByTestId("created-document-save-to-room");
    expect(save.textContent).toContain("Save to room...");
    fireEvent.click(save);
    expect(onSaveToRoom).toHaveBeenCalledWith({
      id: "101",
      title: "Proposal for Acme Corp.docx",
    });
    expect(openAttachedFile).not.toHaveBeenCalled();
  });

  it("draws nothing while the tool runs, or when it saved no file", () => {
    const { container, rerender } = renderCards(undefined, undefined, true);
    expect(container.innerHTML).toBe("");
    rerender(
      <CreatedDocumentsContext.Provider value={{ agentName: null }}>
        <CreatedDocumentsRenderer {...props({ error: "Forbidden" })} />
      </CreatedDocumentsContext.Provider>,
    );
    expect(container.innerHTML).toBe("");
  });
});
