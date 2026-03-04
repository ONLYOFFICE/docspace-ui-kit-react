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

import { useEffect, useMemo, useRef, useState } from "react";
import type { Meta, StoryContext, StoryObj } from "@storybook/react-vite";
import { FilterType } from "@onlyoffice/docspace-api-sdk";

import { DocumentEditor } from "./DocumentEditor";
import type { DocumentEditorProps } from "./DocumentEditor.types";

import ErrorContainer from "../components/error-container/ErrorContainer";
import { Button, ButtonSize } from "../components/button";
import { InputSize } from "../components/text-input";
import { FileInput } from "../components/file-input";
import { ComboBox, ComboBoxSize } from "../components/combobox";
import type { TOption } from "../components/combobox/ComboBox.types";

import FilesSelector from "../selectors/Files";

import { dataSets, getIsDisabled } from "./DocumentEditor.story.helper";

type StoryArgs = DocumentEditorProps;

type StoryWrapperProps = {
  Story: React.ComponentType<{ args: StoryArgs }>;
  context: StoryContext<StoryArgs>;
  onLoadComponentError: (code: number, errorDescription: string) => void;
  storyKey: string;
};

const StoryWrapper = ({
  Story,
  context,
  onLoadComponentError,
  storyKey,
}: StoryWrapperProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      const node = containerRef.current;
      if (!node) return;
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
    };
  }, [storyKey]);

  return (
    <div key={storyKey} ref={containerRef}>
      <Story
        key={storyKey}
        args={{
          ...context.args,
          onLoadComponentError,
        }}
      />
    </div>
  );
};

const meta: Meta<StoryArgs> = {
  title: "Components/Document Editor",
  component: DocumentEditor,
  decorators: [
    (Story, context) => {
      const [error, setError] = useState<string | null>(null);

      const onLoadComponentError = useMemo(
        () => (_: number, errorDescription: string) => {
          setError(errorDescription);
        },
        [],
      );

      useEffect(() => {
        setError(null);
      }, [context.args.fileId, context.args.id]);

      if (error) {
        return (
          <ErrorContainer
            headerText={error}
            bodyText="Make sure fileId, config, and docServiceUrl are valid and reachable"
          />
        );
      }

      const storyKey = `${context.args.fileId}-${context.args.id}`;

      return (
        <StoryWrapper
          Story={Story}
          context={context}
          onLoadComponentError={onLoadComponentError}
          storyKey={storyKey}
        />
      );
    },
  ],
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
  render: (args: StoryArgs) => <DocumentEditor {...args} />,
  args: {
    id: "editor",
    fileId: 1,
    width: "100%",
    height: "600px",
  },
};

export const ViewMode: Story = {
  render: (args: StoryArgs) => <DocumentEditor {...args} />,
  args: {
    id: "viewer",
    fileId: 4,
    width: "100%",
    height: "600px",
    isView: true,
  },
};

export const WithCustomEvent: Story = {
  render: (args: StoryArgs) => {
    const onDocumentReady = () => {
      const documentEditor = window.DocEditor.instances[args.id];
      documentEditor.showMessage("Welcome to ONLYOFFICE Editor!");
    };

    return (
      <DocumentEditor events_onDocumentReady={onDocumentReady} {...args} />
    );
  },
  args: {
    id: "custom-event",
    fileId: 3,
    width: "100%",
    height: "600px",
    isView: true,
  },
};

export const FillSpreadsheetWithData: Story = {
  render: (args: StoryArgs) => {
    const [isOpen, setIsOpen] = useState(false);
    const [fileId, setFileId] = useState<number | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [selectedDataSet, setSelectedDataSet] = useState<TOption>({
      key: dataSets[0].key,
      label: dataSets[0].label,
    });

    const onSubmit = (selectedItemId: string | number | undefined) => {
      setFileId(Number(selectedItemId));
    };

    if (!fileId)
      return (
        <>
          <FileInput
            scale
            fromStorage
            placeholder="Choose file"
            size={InputSize.base}
            onClick={() => setIsOpen(true)}
          />
          {/* @ts-expect-error need pass all props */}
          <FilesSelector
            key="select-file-dialog"
            isPanelVisible={isOpen}
            onCancel={() => setIsOpen(false)}
            onSubmit={onSubmit}
            submitButtonLabel="Select"
            isMultiSelect={false}
            withRecentTreeFolder
            withFavoritesTreeFolder
            withAIAgentsTreeFolder
            openRoot
            withBreadCrumbs
            withSearch
            getIsDisabled={getIsDisabled}
            filterParam={FilterType.SpreadsheetsOnly}
          />
        </>
      );

    const onDocumentReady = () => {
      setIsReady(true);
    };

    const fillSpreadsheetData = () => {
      // @ts-ignore - DocEditor is provided by ONLYOFFICE at runtime
      const documentEditor = window.DocEditor?.instances?.[args.id];
      const currentDataSet = dataSets.find(
        (ds) => ds.key === selectedDataSet.key,
      );

      if (!documentEditor || !currentDataSet) return;

      try {
        const connector = documentEditor.createConnector();

        // @ts-ignore - Asc.scope is provided by ONLYOFFICE connector API
        window.Asc.scope.headers = currentDataSet.headers;
        // @ts-ignore - Asc.scope is provided by ONLYOFFICE connector API
        window.Asc.scope.data = currentDataSet.data;

        connector.callCommand(() => {
          // @ts-ignore - Asc.scope is provided by ONLYOFFICE connector API
          const headers = Asc.scope.headers;
          // @ts-ignore - Asc.scope is provided by ONLYOFFICE connector API
          const data = Asc.scope.data;

          // @ts-ignore - Api is provided by ONLYOFFICE connector API
          const oWorksheet = Api.GetActiveSheet();

          for (let i = 0; i < headers.length; i++) {
            const headerCell = oWorksheet.GetRangeByNumber(0, i);
            headerCell.SetValue(headers[i]);
            headerCell.SetBold(true);
            // @ts-ignore - Api is provided by ONLYOFFICE connector API
            headerCell.SetFillColor(Api.CreateColorFromRGB(200, 200, 200));

            const columnData = Array.isArray(data[i]) ? data[i] : [];
            for (let j = 0; j < columnData.length; j++) {
              oWorksheet.GetRangeByNumber(j + 1, i).SetValue(columnData[j]);
            }
          }

          oWorksheet.SetColumnWidth(0, 15);
          oWorksheet.SetColumnWidth(1, 20);
          oWorksheet.SetColumnWidth(2, 15);
          oWorksheet.SetColumnWidth(3, 15);
          oWorksheet.SetColumnWidth(4, 15);
        });
      } catch (error) {
        documentEditor.showMessage("Automation command failed: " + error);
      }
    };

    const dataSetOptions: TOption[] = dataSets.map((ds) => ({
      key: ds.key,
      label: ds.label,
    }));

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          height: "100%",
        }}
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <ComboBox
            options={dataSetOptions}
            selectedOption={selectedDataSet}
            onSelect={(option) => setSelectedDataSet(option)}
            scaled={false}
            scaledOptions
            size={ComboBoxSize.huge}
            directionY="bottom"
            isDisabled={!isReady}
            withoutBackground
          />
          <Button
            onClick={fillSpreadsheetData}
            label="Fill Spreadsheet"
            isDisabled={!isReady}
            size={ButtonSize.small}
            primary
          />
          <Button
            label="Reset file"
            size={ButtonSize.small}
            onClick={() => setFileId(null)}
          />
        </div>
        <DocumentEditor
          fileId={fileId}
          events_onDocumentReady={onDocumentReady}
          {...args}
        />
      </div>
    );
  },
  args: {
    id: "fill-spreadsheet",
    width: "100%",
    height: "600px",
  },
};
