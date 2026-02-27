// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  FolderType,
  RoomType,
  FilterType,
  ApplyFilterOption,
} from "@onlyoffice/docspace-api-sdk";

import { Toast } from "../../components/toast";
import { toastr } from "../../components/toast/sub-components/Toastr";
import ApiProvider from "../../providers/api/ApiProvider";

import { DeviceType } from "../../enums";
import FilesSelector from ".";
import type {
  TSelectedFileInfo,
  FileEntryDtoIntegerAllOfSecurity,
} from "./FilesSelector.types";
import type { TBreadCrumb } from "../../components/selector";

type StoryArgs = {
  // Connection (stories only)
  url: string;
  apiKey: string;

  // Panel
  isPanelVisible: boolean;
  embedded: boolean;
  currentDeviceType: DeviceType;

  // Navigation
  currentFolderId: number | string;
  rootFolderType: FolderType;
  isRoomsOnly: boolean;
  isThirdParty: boolean;
  roomType?: RoomType | RoomType[];
  isUserOnly?: boolean;
  openRoot?: boolean;
  roomsFolderId?: number;

  // Header
  withHeader?: boolean;
  headerProps?: { headerLabel: string; onCloseClick: () => void };

  // Search & breadcrumbs
  withSearch: boolean;
  withBreadCrumbs: boolean;
  withoutBackButton: boolean;

  // Footer
  withCancelButton: boolean;
  cancelButtonLabel: string;
  withFooterInput: boolean;
  withFooterCheckbox: boolean;
  footerInputHeader: string;
  currentFooterInputValue: string;
  footerCheckboxLabel: string;
  descriptionText: string;
  submitButtonLabel: string;

  // Creation
  withCreate: boolean;
  createDefineRoomLabel?: string;
  createDefineRoomType?: RoomType;

  // Filtering
  disabledItems: (string | number)[];
  filterParam?: string | number;
  applyFilterOption?: ApplyFilterOption;
  disableThirdParty?: boolean;
  disableBySecurity?: string;

  // Misc
  withPadding?: boolean;
  checkCreating?: boolean;
};

const meta: Meta<StoryArgs> = {
  title: "Selectors/FilesSelector",
  parameters: {
    docs: {
      description: {
        component: `FilesSelector is a full file-system browser selector for navigating DocSpace rooms, folders, and files.

### Features

- **Browse rooms & folders**: Navigate the full file hierarchy with breadcrumb trail
- **Search**: Enable with \`withSearch\` — scoped to the current folder/room
- **Room type filter**: Restrict the root list to specific room types via \`roomType\`
- **File type filter**: Filter by extension or type via \`filterParam\`
- **Footer input**: Optionally show a file-name input field in the footer
- **Footer checkbox**: Optional checkbox (e.g., "keep original") in the footer
- **Creation**: Show a create-room button via \`withCreate\` + \`createDefineRoomLabel\`
- **Aside / embedded**: Rendered inside an \`<Aside>\` panel by default; pass \`embedded\` to render inline
- **Portal on mobile**: Automatically renders in a Portal on mobile/tablet devices
- **SSR support**: Pre-populate with server-fetched data via \`withInit\` + \`initItems\`

### Usage

\`\`\`tsx
import FilesSelector from "@docspace/ui-kit/selectors/Files";
import { FolderType } from "@onlyoffice/docspace-api-sdk";
import { DeviceType } from "@docspace/ui-kit/enums";

<FilesSelector
  isPanelVisible={open}
  embedded={false}
  currentFolderId={0}
  rootFolderType={FolderType.VirtualRooms}
  currentDeviceType={DeviceType.desktop}
  isRoomsOnly={false}
  isThirdParty={false}
  withSearch
  withBreadCrumbs
  withoutBackButton={false}
  withCancelButton
  withCreate={false}
  withFooterInput={false}
  withFooterCheckbox={false}
  submitButtonLabel="Select"
  cancelButtonLabel="Cancel"
  footerInputHeader=""
  currentFooterInputValue=""
  footerCheckboxLabel=""
  descriptionText=""
  disabledItems={[]}
  filesSettings={filesSettings}
  onSubmit={(id, title) => console.log(id, title)}
  onCancel={() => setOpen(false)}
  getIsDisabled={(isFirstLoad, isParent, id) => !id || isFirstLoad}
  getFilesArchiveError={(name) => \`\${name} is archived\`}
/>
\`\`\``,
      },
    },
  },
  argTypes: {
    // Connection
    url: {
      control: "text",
      description: "Base URL of the DocSpace instance (used by ApiProvider)",
    },
    apiKey: {
      control: "text",
      description: "API key for authenticating requests (used by ApiProvider)",
    },

    // Panel
    isPanelVisible: {
      control: "boolean",
      description: "Controls visibility of the Aside panel (non-embedded mode)",
      table: { defaultValue: { summary: "true" } },
    },
    embedded: {
      control: "boolean",
      description:
        "Render inline without the Aside/Backdrop wrapper — useful for embedding inside dialogs",
      table: { defaultValue: { summary: "false" } },
    },
    currentDeviceType: {
      control: "select",
      options: [DeviceType.desktop, DeviceType.tablet, DeviceType.mobile],
      description: "Current device type — affects portal rendering on mobile/tablet",
      table: { defaultValue: { summary: "DeviceType.desktop" } },
    },

    // Navigation
    currentFolderId: {
      control: "text",
      description: "ID of the initially opened folder (0 = rooms root)",
      table: { defaultValue: { summary: "0" } },
    },
    rootFolderType: {
      control: "select",
      options: [
        FolderType.VirtualRooms,
        FolderType.USER,
        FolderType.RoomTemplates,
        FolderType.AiAgents,
      ],
      description: "Root folder context type",
    },
    isRoomsOnly: {
      control: "boolean",
      description: "Restrict navigation to rooms level — do not allow descending into folders",
      table: { defaultValue: { summary: "false" } },
    },
    isThirdParty: {
      control: "boolean",
      description: "Whether navigating a third-party storage provider",
      table: { defaultValue: { summary: "false" } },
    },
    roomType: {
      control: "select",
      options: [
        undefined,
        RoomType.CustomRoom,
        RoomType.EditingRoom,
        RoomType.PublicRoom,
        RoomType.VirtualDataRoom,
      ],
      description: "Filter the root rooms list by type",
    },
    isUserOnly: {
      control: "boolean",
      description: "Show only the current user's personal folder tree",
      table: { defaultValue: { summary: "false" } },
    },
    openRoot: {
      control: "boolean",
      description: "Open the selector at the root tree view instead of a specific folder",
      table: { defaultValue: { summary: "false" } },
    },

    // Header
    withHeader: {
      control: "boolean",
      description: "Show the header bar with a label and close button",
      table: { defaultValue: { summary: "false" } },
    },

    // Search & breadcrumbs
    withSearch: {
      control: "boolean",
      description: "Show a search input (hidden at root level)",
      table: { defaultValue: { summary: "true" } },
    },
    withBreadCrumbs: {
      control: "boolean",
      description: "Show the breadcrumb navigation trail",
      table: { defaultValue: { summary: "true" } },
    },
    withoutBackButton: {
      control: "boolean",
      description: "Hide the back button in the breadcrumb bar",
      table: { defaultValue: { summary: "false" } },
    },

    // Footer
    withCancelButton: {
      control: "boolean",
      description: "Show a cancel button in the footer",
      table: { defaultValue: { summary: "true" } },
    },
    cancelButtonLabel: {
      control: "text",
      description: "Label for the cancel button",
    },
    withFooterInput: {
      control: "boolean",
      description: "Show a text input in the footer (e.g., for file/folder name)",
      table: { defaultValue: { summary: "false" } },
    },
    footerInputHeader: {
      control: "text",
      description: "Header label for the footer input",
    },
    currentFooterInputValue: {
      control: "text",
      description: "Default value pre-filled in the footer input",
    },
    withFooterCheckbox: {
      control: "boolean",
      description: "Show a checkbox in the footer",
      table: { defaultValue: { summary: "false" } },
    },
    footerCheckboxLabel: {
      control: "text",
      description: "Label for the footer checkbox",
    },
    descriptionText: {
      control: "text",
      description: "Description text shown below the selector list",
    },
    submitButtonLabel: {
      control: "text",
      description: "Label for the submit / confirm button",
    },

    // Creation
    withCreate: {
      control: "boolean",
      description: "Show a create-room button at the top of the rooms list",
      table: { defaultValue: { summary: "false" } },
    },
    createDefineRoomLabel: {
      control: "text",
      description: "Label for the create-room button (requires withCreate)",
    },
    createDefineRoomType: {
      control: "select",
      options: [
        undefined,
        RoomType.CustomRoom,
        RoomType.EditingRoom,
        RoomType.PublicRoom,
        RoomType.VirtualDataRoom,
      ],
      description: "Room type to pre-select on create (requires withCreate)",
    },

    // Filtering
    disabledItems: {
      control: "object",
      description: "IDs of folders that are disabled as selection targets",
    },
    filterParam: {
      control: "select",
      options: [
        undefined,
        "DOCX",
        "PDF",
        "PDFForm",
        "IMG",
        "XLSX",
        "PPTX",
        "ALL",
        FilterType.DocumentsOnly,
        FilterType.SpreadsheetsOnly,
        FilterType.PresentationsOnly,
        FilterType.ImagesOnly,
        FilterType.MediaOnly,
        FilterType.FoldersOnly,
      ],
      description: "File type filter — restricts the items shown inside folders",
    },
    applyFilterOption: {
      control: "select",
      options: [undefined, ApplyFilterOption.Files, ApplyFilterOption.All],
      description: "Whether filter applies to files only or all items",
    },
    disableBySecurity: {
      control: "text",
      description: "Security key — items without this security permission are disabled",
    },

    // Misc
    withPadding: {
      control: "boolean",
      description: "Add padding inside the selector body",
      table: { defaultValue: { summary: "false" } },
    },
    checkCreating: {
      control: "boolean",
      description:
        "Validate folder write access by creating and deleting a test file on folder open",
      table: { defaultValue: { summary: "false" } },
    },
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

/** Shared helpers */
const getIsDisabled = (
  isFirstLoad: boolean,
  isSelectedParentFolder: boolean,
  selectedItemId: string | number | undefined,
  selectedItemType: "rooms" | "files" | "agents" | undefined,
  isRoot: boolean,
  _selectedItemSecurity: FileEntryDtoIntegerAllOfSecurity | undefined,
  _selectedFileInfo: TSelectedFileInfo,
  isDisabledFolder?: boolean,
) => {
  if (isFirstLoad) return true;
  if (isSelectedParentFolder) return true;
  if (isDisabledFolder) return true;
  if (isRoot) return true;
  if (!selectedItemId) return true;
  if (selectedItemType === "rooms") return true;
  return false;
};

const getFilesArchiveError = (name: string) =>
  `"${name}" is in the archive and cannot be used as a destination.`;

const Template = ({ url, apiKey, ...props }: StoryArgs) => (
  <div
    style={{
      width: "100%",
      height: "600px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <Toast />
    <ApiProvider url={url} apiKey={apiKey}>
      <FilesSelector
        {...(props as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
        getIsDisabled={getIsDisabled}
        getFilesArchiveError={getFilesArchiveError}
        onSubmit={(
          selectedItemId,
          folderTitle,
          _isPublic,
          _breadCrumbs,
          fileName,
          isChecked,
        ) => {
          toastr.success(
            `Saved to "${folderTitle}"${fileName ? ` as "${fileName}"` : ""}${isChecked ? " (checked)" : ""}`,
          );
        }}
        onCancel={() => {
          toastr.info("Cancelled");
        }}
      />
    </ApiProvider>
  </div>
);

// ─── Stories ────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {
    url: "https://eu-test-oauth.onlyoffice.io",
    apiKey: "sk-4cbb9ce8166171b0da120058c59c4343f83ebdc4ca1d291821e3035fb0c6f1a0",
    isPanelVisible: true,
    embedded: true,
    currentDeviceType: DeviceType.desktop,
    currentFolderId: 0,
    rootFolderType: FolderType.VirtualRooms,
    isRoomsOnly: false,
    isThirdParty: false,
    withSearch: true,
    withBreadCrumbs: true,
    withoutBackButton: false,
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
    withCreate: false,
    withFooterInput: false,
    withFooterCheckbox: false,
    submitButtonLabel: "Select",
    footerInputHeader: "",
    currentFooterInputValue: "",
    footerCheckboxLabel: "",
    descriptionText: "",
    disabledItems: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default embedded mode starting at the rooms root. Navigate into any room or folder and " +
          "click **Select** to confirm. The submit button is enabled only when a folder is selected.",
      },
      source: {
        code: `<FilesSelector
  isPanelVisible={true}
  embedded
  currentDeviceType={DeviceType.desktop}
  currentFolderId={0}
  rootFolderType={FolderType.VirtualRooms}
  isRoomsOnly={false}
  isThirdParty={false}
  withSearch
  withBreadCrumbs
  withoutBackButton={false}
  withCancelButton
  cancelButtonLabel="Cancel"
  withCreate={false}
  withFooterInput={false}
  withFooterCheckbox={false}
  submitButtonLabel="Select"
  footerInputHeader=""
  currentFooterInputValue=""
  footerCheckboxLabel=""
  descriptionText=""
  disabledItems={[]}
  filesSettings={filesSettings}
  onSubmit={(id, title) => moveFile(id, title)}
  onCancel={() => setOpen(false)}
  getIsDisabled={getIsDisabled}
  getFilesArchiveError={getArchiveError}
/>`,
      },
    },
  },
};

export const RoomsOnly: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {
    url: "https://eu-test-oauth.onlyoffice.io",
    apiKey: "sk-4cbb9ce8166171b0da120058c59c4343f83ebdc4ca1d291821e3035fb0c6f1a0",
    isPanelVisible: true,
    embedded: true,
    currentDeviceType: DeviceType.desktop,
    currentFolderId: 0,
    rootFolderType: FolderType.VirtualRooms,
    isRoomsOnly: true,
    isThirdParty: false,
    withSearch: true,
    withBreadCrumbs: true,
    withoutBackButton: false,
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
    withCreate: false,
    withFooterInput: false,
    withFooterCheckbox: false,
    submitButtonLabel: "Move here",
    footerInputHeader: "",
    currentFooterInputValue: "",
    footerCheckboxLabel: "",
    descriptionText: "",
    disabledItems: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Rooms-only mode — navigation is restricted to the rooms root level. " +
          "Users cannot descend into individual room folders.",
      },
      source: {
        code: `<FilesSelector
  isRoomsOnly
  embedded
  currentFolderId={0}
  rootFolderType={FolderType.VirtualRooms}
  currentDeviceType={DeviceType.desktop}
  isPanelVisible={true}
  isThirdParty={false}
  withSearch
  withBreadCrumbs
  withoutBackButton={false}
  withCancelButton
  cancelButtonLabel="Cancel"
  withCreate={false}
  withFooterInput={false}
  withFooterCheckbox={false}
  submitButtonLabel="Move here"
  footerInputHeader=""
  currentFooterInputValue=""
  footerCheckboxLabel=""
  descriptionText=""
  disabledItems={[]}
  filesSettings={filesSettings}
  onSubmit={(id, title) => move(id, title)}
  onCancel={() => setOpen(false)}
  getIsDisabled={getIsDisabled}
  getFilesArchiveError={getArchiveError}
/>`,
      },
    },
  },
};

export const WithFooterInput: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {
    url: "https://eu-test-oauth.onlyoffice.io",
    apiKey: "sk-4cbb9ce8166171b0da120058c59c4343f83ebdc4ca1d291821e3035fb0c6f1a0",
    isPanelVisible: true,
    embedded: true,
    currentDeviceType: DeviceType.desktop,
    currentFolderId: 0,
    rootFolderType: FolderType.VirtualRooms,
    isRoomsOnly: false,
    isThirdParty: false,
    withSearch: true,
    withBreadCrumbs: true,
    withoutBackButton: false,
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
    withCreate: false,
    withFooterInput: true,
    footerInputHeader: "File name",
    currentFooterInputValue: "My Document",
    withFooterCheckbox: false,
    submitButtonLabel: "Save",
    footerCheckboxLabel: "",
    descriptionText: "",
    disabledItems: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows an editable file-name input in the footer. Useful for Save As dialogs " +
          "where the user picks a destination folder and can rename the file.",
      },
      source: {
        code: `<FilesSelector
  embedded
  currentFolderId={0}
  rootFolderType={FolderType.VirtualRooms}
  currentDeviceType={DeviceType.desktop}
  isPanelVisible={true}
  isRoomsOnly={false}
  isThirdParty={false}
  withSearch
  withBreadCrumbs
  withoutBackButton={false}
  withCancelButton
  cancelButtonLabel="Cancel"
  withCreate={false}
  withFooterInput
  footerInputHeader="File name"
  currentFooterInputValue={fileName}
  withFooterCheckbox={false}
  submitButtonLabel="Save"
  footerCheckboxLabel=""
  descriptionText=""
  disabledItems={[]}
  filesSettings={filesSettings}
  onSubmit={(id, title, _public, _bc, fileName) => saveAs(id, fileName)}
  onCancel={() => setOpen(false)}
  getIsDisabled={getIsDisabled}
  getFilesArchiveError={getArchiveError}
/>`,
      },
    },
  },
};

export const WithFooterCheckbox: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {
    url: "https://eu-test-oauth.onlyoffice.io",
    apiKey: "sk-4cbb9ce8166171b0da120058c59c4343f83ebdc4ca1d291821e3035fb0c6f1a0",
    isPanelVisible: true,
    embedded: true,
    currentDeviceType: DeviceType.desktop,
    currentFolderId: 0,
    rootFolderType: FolderType.VirtualRooms,
    isRoomsOnly: false,
    isThirdParty: false,
    withSearch: true,
    withBreadCrumbs: true,
    withoutBackButton: false,
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
    withCreate: false,
    withFooterInput: false,
    footerInputHeader: "",
    currentFooterInputValue: "",
    withFooterCheckbox: true,
    footerCheckboxLabel: "Keep original files",
    submitButtonLabel: "Copy here",
    descriptionText: "",
    disabledItems: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows a checkbox in the footer — useful for Copy dialogs with an option " +
          "like 'Keep original files' or 'Delete after copy'.",
      },
      source: {
        code: `<FilesSelector
  embedded
  currentFolderId={0}
  rootFolderType={FolderType.VirtualRooms}
  currentDeviceType={DeviceType.desktop}
  isPanelVisible={true}
  isRoomsOnly={false}
  isThirdParty={false}
  withSearch
  withBreadCrumbs
  withoutBackButton={false}
  withCancelButton
  cancelButtonLabel="Cancel"
  withCreate={false}
  withFooterInput={false}
  footerInputHeader=""
  currentFooterInputValue=""
  withFooterCheckbox
  footerCheckboxLabel="Keep original files"
  submitButtonLabel="Copy here"
  descriptionText=""
  disabledItems={[]}
  filesSettings={filesSettings}
  onSubmit={(id, title, _pub, _bc, _fn, isChecked) => copy(id, isChecked)}
  onCancel={() => setOpen(false)}
  getIsDisabled={getIsDisabled}
  getFilesArchiveError={getArchiveError}
/>`,
      },
    },
  },
};

export const WithFileTypeFilter: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {
    url: "https://eu-test-oauth.onlyoffice.io",
    apiKey: "sk-4cbb9ce8166171b0da120058c59c4343f83ebdc4ca1d291821e3035fb0c6f1a0",
    isPanelVisible: true,
    embedded: true,
    currentDeviceType: DeviceType.desktop,
    currentFolderId: 0,
    rootFolderType: FolderType.VirtualRooms,
    isRoomsOnly: false,
    isThirdParty: false,
    withSearch: true,
    withBreadCrumbs: true,
    withoutBackButton: false,
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
    withCreate: false,
    withFooterInput: false,
    withFooterCheckbox: false,
    submitButtonLabel: "Select file",
    footerInputHeader: "",
    currentFooterInputValue: "",
    footerCheckboxLabel: "",
    descriptionText: "Select a PDF file",
    disabledItems: [],
    filterParam: "PDF",
    applyFilterOption: ApplyFilterOption.Files,
  },
  parameters: {
    docs: {
      description: {
        story:
          "File type filter set to PDF. Only PDF files are shown inside folders. " +
          "Change `filterParam` in the Controls panel to try other types (DOCX, IMG, XLSX, etc.).",
      },
      source: {
        code: `<FilesSelector
  embedded
  currentFolderId={0}
  rootFolderType={FolderType.VirtualRooms}
  currentDeviceType={DeviceType.desktop}
  isPanelVisible={true}
  isRoomsOnly={false}
  isThirdParty={false}
  withSearch
  withBreadCrumbs
  withoutBackButton={false}
  withCancelButton
  cancelButtonLabel="Cancel"
  withCreate={false}
  withFooterInput={false}
  withFooterCheckbox={false}
  submitButtonLabel="Select file"
  footerInputHeader=""
  currentFooterInputValue=""
  footerCheckboxLabel=""
  descriptionText="Select a PDF file"
  disabledItems={[]}
  filterParam="PDF"
  applyFilterOption={ApplyFilterOption.Files}
  filesSettings={filesSettings}
  onSubmit={(id, title, _pub, _bc, _fn, _chk, _node, fileInfo) => open(fileInfo)}
  onCancel={() => setOpen(false)}
  getIsDisabled={getIsDisabled}
  getFilesArchiveError={getArchiveError}
/>`,
      },
    },
  },
};

export const WithRoomCreation: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {
    url: "https://eu-test-oauth.onlyoffice.io",
    apiKey: "sk-4cbb9ce8166171b0da120058c59c4343f83ebdc4ca1d291821e3035fb0c6f1a0",
    isPanelVisible: true,
    embedded: true,
    currentDeviceType: DeviceType.desktop,
    currentFolderId: 0,
    rootFolderType: FolderType.VirtualRooms,
    isRoomsOnly: false,
    isThirdParty: false,
    withSearch: true,
    withBreadCrumbs: true,
    withoutBackButton: false,
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
    withCreate: true,
    createDefineRoomLabel: "Create new room",
    createDefineRoomType: RoomType.CustomRoom,
    withFooterInput: false,
    withFooterCheckbox: false,
    submitButtonLabel: "Select",
    footerInputHeader: "",
    currentFooterInputValue: "",
    footerCheckboxLabel: "",
    descriptionText: "",
    disabledItems: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows a create-room button at the top of the rooms list. Clicking it opens the " +
          "room creation flow with the specified room type pre-selected.",
      },
      source: {
        code: `<FilesSelector
  embedded
  currentFolderId={0}
  rootFolderType={FolderType.VirtualRooms}
  currentDeviceType={DeviceType.desktop}
  isPanelVisible={true}
  isRoomsOnly={false}
  isThirdParty={false}
  withSearch
  withBreadCrumbs
  withoutBackButton={false}
  withCancelButton
  cancelButtonLabel="Cancel"
  withCreate
  createDefineRoomLabel="Create new room"
  createDefineRoomType={RoomType.CustomRoom}
  withFooterInput={false}
  withFooterCheckbox={false}
  submitButtonLabel="Select"
  footerInputHeader=""
  currentFooterInputValue=""
  footerCheckboxLabel=""
  descriptionText=""
  disabledItems={[]}
  filesSettings={filesSettings}
  onSubmit={(id, title) => save(id, title)}
  onCancel={() => setOpen(false)}
  getIsDisabled={getIsDisabled}
  getFilesArchiveError={getArchiveError}
/>`,
      },
    },
  },
};

export const AsidePanel: Story = {
  render: ({ url, apiKey, ...props }: StoryArgs) => (
    <div style={{ width: "100%", height: "600px", position: "relative" }}>
      <Toast />
      <ApiProvider url={url} apiKey={apiKey}>
        <FilesSelector
          {...(props as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
          getIsDisabled={getIsDisabled}
          getFilesArchiveError={getFilesArchiveError}
          onSubmit={(selectedItemId, folderTitle) => {
            toastr.success(`Saved to "${folderTitle}"`);
          }}
          onCancel={() => {
            toastr.info("Cancelled");
          }}
        />
      </ApiProvider>
    </div>
  ),
  args: {
    url: "https://eu-test-oauth.onlyoffice.io",
    apiKey: "sk-4cbb9ce8166171b0da120058c59c4343f83ebdc4ca1d291821e3035fb0c6f1a0",
    isPanelVisible: true,
    embedded: false,
    currentDeviceType: DeviceType.desktop,
    currentFolderId: 0,
    rootFolderType: FolderType.VirtualRooms,
    isRoomsOnly: false,
    isThirdParty: false,
    withSearch: true,
    withBreadCrumbs: true,
    withoutBackButton: false,
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
    withCreate: false,
    withFooterInput: false,
    withFooterCheckbox: false,
    submitButtonLabel: "Select",
    footerInputHeader: "",
    currentFooterInputValue: "",
    footerCheckboxLabel: "",
    descriptionText: "",
    disabledItems: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Non-embedded mode: the selector renders inside an `<Aside>` panel with a backdrop. " +
          "Toggle `isPanelVisible` in the Controls panel to show/hide it.",
      },
      source: {
        code: `<FilesSelector
  isPanelVisible={open}
  embedded={false}
  currentFolderId={0}
  rootFolderType={FolderType.VirtualRooms}
  currentDeviceType={DeviceType.desktop}
  isRoomsOnly={false}
  isThirdParty={false}
  withSearch
  withBreadCrumbs
  withoutBackButton={false}
  withCancelButton
  cancelButtonLabel="Cancel"
  withCreate={false}
  withFooterInput={false}
  withFooterCheckbox={false}
  submitButtonLabel="Select"
  footerInputHeader=""
  currentFooterInputValue=""
  footerCheckboxLabel=""
  descriptionText=""
  disabledItems={[]}
  filesSettings={filesSettings}
  onSubmit={(id, title) => save(id, title)}
  onCancel={() => setOpen(false)}
  getIsDisabled={getIsDisabled}
  getFilesArchiveError={getArchiveError}
/>`,
      },
    },
  },
};

export const WithHeader: Story = {
  render: (args: StoryArgs) => <Template {...args} />,
  args: {
    url: "https://eu-test-oauth.onlyoffice.io",
    apiKey: "sk-4cbb9ce8166171b0da120058c59c4343f83ebdc4ca1d291821e3035fb0c6f1a0",
    isPanelVisible: true,
    embedded: true,
    currentDeviceType: DeviceType.desktop,
    currentFolderId: 0,
    rootFolderType: FolderType.VirtualRooms,
    isRoomsOnly: false,
    isThirdParty: false,
    withHeader: true,
    headerProps: {
      headerLabel: "Select destination",
      onCloseClick: () => {},
    },
    withSearch: true,
    withBreadCrumbs: true,
    withoutBackButton: false,
    withCancelButton: true,
    cancelButtonLabel: "Cancel",
    withCreate: false,
    withFooterInput: false,
    withFooterCheckbox: false,
    submitButtonLabel: "Move here",
    footerInputHeader: "",
    currentFooterInputValue: "",
    footerCheckboxLabel: "",
    descriptionText: "",
    disabledItems: [],
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the optional header bar with a custom label and close button.",
      },
      source: {
        code: `<FilesSelector
  embedded
  withHeader
  headerProps={{ headerLabel: "Select destination", onCloseClick: () => setOpen(false) }}
  currentFolderId={0}
  rootFolderType={FolderType.VirtualRooms}
  currentDeviceType={DeviceType.desktop}
  isPanelVisible={true}
  isRoomsOnly={false}
  isThirdParty={false}
  withSearch
  withBreadCrumbs
  withoutBackButton={false}
  withCancelButton
  cancelButtonLabel="Cancel"
  withCreate={false}
  withFooterInput={false}
  withFooterCheckbox={false}
  submitButtonLabel="Move here"
  footerInputHeader=""
  currentFooterInputValue=""
  footerCheckboxLabel=""
  descriptionText=""
  disabledItems={[]}
  filesSettings={filesSettings}
  onSubmit={(id, title) => move(id, title)}
  onCancel={() => setOpen(false)}
  getIsDisabled={getIsDisabled}
  getFilesArchiveError={getArchiveError}
/>`,
      },
    },
  },
};
