import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import ApiProvider from "../../providers/api/ApiProvider";
import { SectionList } from "./SectionList";
import type { SectionKind } from "./source";

// No portal: an empty url is what the Storybook decorator hands every story
// until one is picked in the API Config toolbar, and it selects the demo.
const renderSection = (kind: SectionKind, withFolderPicker = false) =>
  render(
    <ApiProvider url="" apiKey="" initSocket={false}>
      <SectionList kind={kind} withFolderPicker={withFolderPicker} />
    </ApiProvider>,
  );

// The list behind the picker carries the same names, so every look inside
// the picker is scoped to it.
const openPicker = async () => {
  await userEvent.click(await screen.findByTestId("section-select-folder"));
  return within(await screen.findByTestId("selector"));
};

const submitButton = () => screen.getByTestId("selector_submit_button");

// With `isRooms` the panel shows its skeleton for 500ms before the groups,
// so a tag is waited for rather than the dialog around it.
const findTag = (key: string) =>
  screen.findByTestId(`filter_tag_${key}`, {}, { timeout: 2000 });

const openFilter = () =>
  userEvent.click(screen.getByTestId("filter_icon_button"));

describe("SectionList", () => {
  it.each<[SectionKind, string]>([
    ["files", "Notes.docx"],
    ["rooms", "Finance department"],
    ["forms", "Job applications"],
  ])("renders the %s demo with no create button", async (kind, row) => {
    renderSection(kind);

    expect(await screen.findByText(row)).toBeInTheDocument();
    expect(screen.getByText("Demo data")).toBeInTheDocument();
    expect(screen.queryByTestId("main-button")).not.toBeInTheDocument();
  });

  it.each<[SectionKind, string[]]>([
    ["files", ["folders", "pdf"]],
    ["rooms", ["public", "me"]],
    ["forms", ["me"]],
  ])("opens the %s filter panel with its groups", async (kind, tags) => {
    renderSection(kind);
    await screen.findByText("Demo data");

    await openFilter();

    for (const tag of tags) {
      expect(await findTag(tag)).toBeInTheDocument();
    }
  });

  it("applies 'Owner: Me' to rooms, and clears it again", async () => {
    renderSection("rooms");
    await screen.findByText("Finance department");

    await openFilter();
    await userEvent.click(await findTag("me"));
    await act(async () => {
      await userEvent.click(screen.getByTestId("filter_apply_button"));
    });

    await waitFor(() =>
      expect(screen.queryByText("Finance department")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Marketing")).toBeInTheDocument();

    // Picked again in the panel, the chip is dropped like any other tag.
    await openFilter();
    await userEvent.click(await findTag("me"));
    await act(async () => {
      await userEvent.click(screen.getByTestId("filter_apply_button"));
    });

    expect(await screen.findByText("Finance department")).toBeInTheDocument();
  });

  it("opens a room and a folder in it, and comes back by the arrow", async () => {
    const { container } = renderSection("rooms");

    await userEvent.click(await screen.findByText("Finance department"));
    expect(await screen.findByText("Reports 2026")).toBeInTheDocument();
    expect(screen.queryByText("Marketing")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Reports 2026"));
    expect(await screen.findByText("Budget overview.xlsx")).toBeInTheDocument();

    const back = () => {
      const arrow = container.querySelector(".arrow-button");
      if (!arrow) throw new Error("no back arrow");
      return userEvent.click(arrow);
    };

    await back();
    expect(await screen.findByText("Q4 budget.xlsx")).toBeInTheDocument();

    await back();
    expect(await screen.findByText("Marketing")).toBeInTheDocument();
    expect(container.querySelector(".arrow-button")).toBeNull();
  });

  it("offers a file type filter once inside a room", async () => {
    renderSection("forms");

    await userEvent.click(await screen.findByText("Job applications"));
    await screen.findByText("Application form.pdf");
    await openFilter();

    expect(await findTag("pdf")).toBeInTheDocument();
    expect(screen.queryByTestId("filter_tag_me")).not.toBeInTheDocument();
  });

  it("has no Select folder button unless asked for one", async () => {
    renderSection("rooms");
    await screen.findByText("Finance department");

    expect(screen.queryByTestId("section-select-folder")).toBeNull();
  });

  it("roots the picker at the section alone, and opens what is picked", async () => {
    renderSection("rooms", true);
    await screen.findByText("Finance department");

    const picker = await openPicker();
    // The picker's root holds Rooms and nothing else, and choosing needs a
    // step inside it.
    expect(picker.getByText("Rooms")).toBeInTheDocument();
    expect(picker.queryByText("Files")).toBeNull();
    expect(picker.queryByText("Forms")).toBeNull();
    expect(submitButton()).toBeDisabled();

    await userEvent.click(picker.getByText("Rooms"));
    await userEvent.click(await picker.findByText("Finance department"));

    // Folders only: a file is not somewhere to go.
    expect(await picker.findByText("Reports 2026")).toBeInTheDocument();
    expect(picker.queryByText("Q4 budget.xlsx")).toBeNull();
    expect(submitButton()).toBeEnabled();

    await userEvent.click(submitButton());

    // The list now stands in the picked room.
    expect(await screen.findByText("Q4 budget.xlsx")).toBeInTheDocument();
    expect(screen.queryByTestId("selector_submit_button")).toBeNull();
  });

  it("can pick the section itself", async () => {
    renderSection("files", true);
    await screen.findByText("Notes.docx");

    // Walk into a folder first, then pick Files from the picker.
    await userEvent.click(screen.getByText("Templates"));
    await screen.findByText("Letter.docx");

    const picker = await openPicker();
    await userEvent.click(picker.getByText("Files"));
    await waitFor(() => expect(submitButton()).toBeEnabled());
    await userEvent.click(submitButton());

    expect(await screen.findByText("Notes.docx")).toBeInTheDocument();
    expect(screen.queryByText("Letter.docx")).toBeNull();
  });

  it("gives each row a read-only context menu", async () => {
    renderSection("files");
    await screen.findByText("Notes.docx");

    const [first] = screen.getAllByTestId("context-menu-button");
    await userEvent.click(first);

    expect(await screen.findByText("Open")).toBeInTheDocument();
    // No portal, so nothing to copy a link to.
    expect(screen.queryByText("Copy link")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Open"));
    // The first row is the Templates folder, which the menu opens in place.
    expect(await screen.findByText("Letter.docx")).toBeInTheDocument();
  });
});
