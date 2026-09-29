import React, { useCallback, useEffect, useState } from "react";
import {
  addons,
  types,
  useStorybookApi,
  useStorybookState,
} from "storybook/manager-api";
import { IconButton } from "storybook/internal/components";
import { DocumentIcon } from "@storybook/icons";

// A toolbar switch between two sidebars: every component with its Docs page
// and each of its stories listed underneath, or the Docs page alone. The Docs
// page already renders every story of the component inline, so the second
// view loses nothing a reader can see -- only the per-story canvases leave the
// sidebar. They are still there: a deep link to a story opens it, the
// Playwright specs still find it by ID, and the Docs page still embeds it.
// This is a sidebar filter, not a change to the index.

const ADDON_ID = "docspace/docs-only";
const TOOL_ID = `${ADDON_ID}/tool`;
const STORAGE_KEY = "docspace-docs-only";

// Docs only is the default; the stories are listed once someone asks for them.
const readStored = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
};

const writeStored = (docsOnly: boolean) => {
  try {
    localStorage.setItem(STORAGE_KEY, String(docsOnly));
  } catch {
    // Storage may be unavailable; the switch then lasts for the session.
  }
};

const DocsOnlyToggle = () => {
  const api = useStorybookApi();
  const { index } = useStorybookState();
  const [docsOnly, setDocsOnly] = useState<boolean>(readStored);

  useEffect(() => {
    api.experimental_setFilters({
      [ADDON_ID]: docsOnly ? (item) => item.type !== "story" : () => true,
    });
  }, [api, docsOnly]);

  const toggle = useCallback(() => {
    const next = !docsOnly;

    // Hiding the story that is open would leave the sidebar with no
    // selection, so move to the component's Docs page before the filter
    // applies. Every component here has one: preview.tsx tags the whole
    // project `autodocs`.
    if (next) {
      const current = api.getCurrentStoryData();

      if (current?.type === "story") {
        const docs = Object.values(index ?? {}).find(
          (entry) => entry.type === "docs" && entry.parent === current.parent,
        );

        if (docs) api.selectStory(docs.id);
      }
    }

    writeStored(next);
    setDocsOnly(next);
  }, [api, docsOnly, index, setDocsOnly]);

  // The label carries the state: `active` alone is too faint to read.
  return (
    <IconButton
      key="docs-only"
      active={docsOnly}
      title={
        docsOnly
          ? "Sidebar: Docs pages only. Click to list the stories as well"
          : "Sidebar: Docs pages and stories. Click to keep only the Docs pages"
      }
      onClick={toggle}
    >
      <DocumentIcon />
      {docsOnly ? "Docs only" : "Docs + stories"}
    </IconButton>
  );
};

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: "Docs only",
    match: () => true,
    render: () => <DocsOnlyToggle />,
  });
});
