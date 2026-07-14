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

import RefreshIcon from "../../assets/icons/16/refresh.react.svg";
import DuplicateIcon from "../../assets/icons/16/duplicate.react.svg";
import DownloadIcon from "../../assets/icons/16/download.react.svg";
import CopyIcon from "../../assets/icons/16/copy.react.svg";
import OtherOperationsIcon from "../../assets/icons/16/other-operations.react.svg";
import ListIcon from "../../assets/icons/16/mark-as-read.react.svg";
import DeletePermanentlyIcon from "../../assets/icons/16/delete-permanently.react.svg";
import ExportIndexIcon from "../../assets/icons/16/export-index.react.svg";
import MoveIcon from "../../assets/icons/16/move.react.svg";
import UploadIcon from "../../assets/icons/16/upload.react.svg";
import TrashIcon from "../../assets/icons/16/trash.react.svg";

import { ProgressBar } from "./ProgressBar";
import { Operation } from "./OperationsProgressButton.types";
import { OPERATIONS_NAME } from "../../constants";

interface ProgressListProps {
  onOpenPanel: () => void;
  operations: Operation[];
  panelOperations?: Operation[];
  clearOperationsData?: (
    operationId: string | null,
    operation: string,
    operationItem?: Operation,
  ) => void;
  clearPanelOperationsData?: (
    operationId: string | null,
    operation: string,
  ) => void;
  onCancel?: () => void;
  cancelSecondaryOperationById?: (
    operation: string,
    operationId: string,
  ) => void;
}

const getIcon = (icon: string): React.ReactNode => {
  switch (icon) {
    case OPERATIONS_NAME.download:
      return <DownloadIcon />;
    case OPERATIONS_NAME.convert:
      return <RefreshIcon />;
    case OPERATIONS_NAME.copy:
      return <CopyIcon />;
    case OPERATIONS_NAME.duplicate:
      return <DuplicateIcon />;
    case OPERATIONS_NAME.markAsRead:
      return <ListIcon />;
    case OPERATIONS_NAME.deletePermanently:
      return <DeletePermanentlyIcon />;
    case OPERATIONS_NAME.exportIndex:
      return <ExportIndexIcon />;
    case OPERATIONS_NAME.move:
      return <MoveIcon />;
    case OPERATIONS_NAME.upload:
    case OPERATIONS_NAME.syncDatabase:
      return <UploadIcon />;
    case OPERATIONS_NAME.trash:
    case OPERATIONS_NAME.deleteVersionFile:
      return <TrashIcon />;
    default:
      return <OtherOperationsIcon />;
  }
};

const getOperationKey = (item: Operation) => {
  if (item.id) return item.id;

  return `${item.operation}-${item.items?.[0]?.operationId ?? ""}-${
    item.completed
  }`;
};

const ProgressList = ({
  operations,
  panelOperations,
  clearOperationsData,
  clearPanelOperationsData,
  onCancel,
  cancelSecondaryOperationById,
  onOpenPanel,
}: ProgressListProps) => {
  const onOpenPanelOperation = (item: Operation) => {
    if (!item.showPanel) return;

    item.showPanel(true);
    onOpenPanel();
  };

  return (
    <div className="progress-container">
      {operations.map((item) => {
        const operationId = item.items?.[0]?.operationId;
        return (
          <div
            key={getOperationKey(item)}
            className={`progress-list ${item.showPanel ? "withHover" : ""}`}
          >
            <ProgressBar
              completed={item.completed}
              label={item.label}
              alert={item.alert}
              open
              icon={getIcon(item.operation)}
              onOpenPanel={() => {
                if (item.showPanel) {
                  item.showPanel(true);
                  onOpenPanel();
                }
              }}
              withoutProgress
              onClearProgress={(operationId, operation) =>
                clearOperationsData?.(operationId, operation, item)
              }
              onCancel={
                !item.completed && cancelSecondaryOperationById && operationId
                  ? () =>
                      cancelSecondaryOperationById(item.operation, operationId)
                  : undefined
              }
              operation={item.operation}
              operationId={operationId}
            />
          </div>
        );
      })}
      {panelOperations?.map((item) => (
        <div
          key={`${item.operation}`}
          className={`progress-list ${item.showPanel ? "withHover" : ""}`}
        >
          <ProgressBar
            completed={item.completed}
            label={item.label}
            alert={item.alert}
            percent={item.percent}
            open
            icon={getIcon(item.operation)}
            onClearProgress={clearPanelOperationsData}
            operation={item.operation}
            onCancel={onCancel}
            onOpenPanel={() => onOpenPanelOperation(item)}
            withoutStatus={item.withoutStatus}
            withoutProgress={item.withoutProgress}
          />
        </div>
      ))}
    </div>
  );
};

export default ProgressList;

