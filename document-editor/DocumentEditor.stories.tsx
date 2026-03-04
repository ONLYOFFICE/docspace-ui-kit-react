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

import { DocumentEditor } from "./DocumentEditor";
import type { DocumentEditorProps } from "./DocumentEditor.types";

type StoryArgs = DocumentEditorProps;

const meta: Meta<StoryArgs> = {
  title: "Components/Document Editor",
  component: DocumentEditor,
  parameters: {
    docs: {
      description: {
        component: `DocumentEditor wraps the \`@onlyoffice/document-editor-react\` component, embedding an ONLYOFFICE Document Server editor into the UI.`,
      },
    },
  },
  argTypes: {
    id: {
      control: "text",
      description: "Unique identifier for the editor DOM element",
    },
    fileId: {
      control: "number",
      description: "ID of the file to open in the editor",
    },
    width: {
      control: "text",
      description: "Width of the editor container",
      table: { defaultValue: { summary: "100%" } },
    },
    height: {
      control: "text",
      description: "Height of the editor container",
      table: { defaultValue: { summary: "100%" } },
    },
    shardkey: {
      control: "text",
      description: "Shard key for Document Server load balancing",
    },
    onLoadComponentError: {
      action: "onLoadComponentError",
      description: "Callback invoked when the component fails to load",
    },
  },
};

type Story = StoryObj<StoryArgs>;

export default meta;

export const Default: Story = {
  render: (args: StoryArgs) => {
    const { ...editorProps } = args;

    return (
      <DocumentEditor
        key={editorProps.fileId}
        {...(editorProps as DocumentEditorProps)}
      />
    );
  },
  args: {
    id: "editor",
    fileId: 1,
    width: "100%",
    height: "600px",
    onLoadComponentError: (errorCode: number, errorDescription: string) => {
      console.error(`Editor load error [${errorCode}]: ${errorDescription}`);
    },
  },
};
