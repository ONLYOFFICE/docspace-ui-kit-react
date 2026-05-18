/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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

import { FilesSelector } from "../selectors/Files";
import type { TSelectedFileInfo } from "../selectors/Files/FilesSelector.types";

import { dataSets, getIsDisabled } from "./DocumentEditor.story.helper";

type FileSelectorWrapperProps = {
  children: (fileId: number) => React.ReactNode;
  filterParam?: string | number;
};

const FileSelectorWrapper = ({
  children,
  filterParam = FilterType.FilesOnly,
}: FileSelectorWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileId, setFileId] = useState<number | null>(null);

  const onSubmit = (
    _selectedItemId: string | number | undefined,
    _folderTitle: string,
    _isPublic: boolean,
    _breadCrumbs: unknown,
    _fileName: string,
    _isChecked: boolean,
    _selectedTreeNode: unknown,
    selectedFileInfo: TSelectedFileInfo,
  ) => {
    if (selectedFileInfo?.id !== undefined) {
      setFileId(Number(selectedFileInfo.id));
    }
  };

  if (!fileId)
    return (
      <>
        <FileInput
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
          filterParam={filterParam}
        />
      </>
    );

  return (
    <>
      {children(fileId)}
      <Button
        label="Change file"
        size={ButtonSize.small}
        onClick={() => setFileId(null)}
        style={{ marginTop: "8px" }}
      />
    </>
  );
};

type StoryArgs = DocumentEditorProps & {
  filterParam?: string | number;
};

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

  const { filterParam, ...editorArgs } = context.args;

  return (
    <div key={storyKey} ref={containerRef}>
      <Story
        key={storyKey}
        args={{
          ...editorArgs,
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
            buttonText="Try again"
            onClickButton={() => window.location.reload()}
          />
        );
      }

      const storyKey = `${context.args.fileId}-${context.args.id}`;

      return (
        <FileSelectorWrapper filterParam={context.args.filterParam}>
          {(fileId) => (
            <StoryWrapper
              Story={Story}
              context={{ ...context, args: { ...context.args, fileId } }}
              onLoadComponentError={onLoadComponentError}
              storyKey={storyKey}
            />
          )}
        </FileSelectorWrapper>
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
    width: "100%",
    height: "600px",
  },
};

export const ViewMode: Story = {
  render: (args: StoryArgs) => <DocumentEditor {...args} />,
  args: {
    id: "viewer",
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
    width: "100%",
    height: "600px",
    isView: true,
  },
};

export const FillSpreadsheetWithData: Story = {
  render: (args: StoryArgs) => {
    const [isReady, setIsReady] = useState(false);
    const [selectedDataSet, setSelectedDataSet] = useState<TOption>({
      key: dataSets[0].key,
      label: dataSets[0].label,
    });

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
        </div>
        <DocumentEditor events_onDocumentReady={onDocumentReady} {...args} />
      </div>
    );
  },
  args: {
    id: "fill-spreadsheet",
    width: "100%",
    height: "600px",
    filterParam: FilterType.SpreadsheetsOnly,
  },
};
