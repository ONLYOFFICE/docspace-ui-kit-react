export interface Operation {
  /** Identity of the row in the list. Without it a key is built from the operation and its first item. */
  id?: string;
  /** Which operation this is: a key of `OPERATIONS_NAME`, which picks the icon. */
  operation: string;
  /** Text of the row, and of the tooltip while this is the only operation. */
  label: string;
  /** Second line of the tooltip. Its presence suppresses the alert and completed wording. */
  description?: string;
  /** Whether the operation failed: the badge becomes a warning triangle. */
  alert: boolean;
  /** Whether an upload was cancelled by the user. Read only for `panelOperations`. */
  canceled?: boolean;
  /** Whether the operation is finished. The button hides itself a few seconds later. */
  completed: boolean;
  /** Whether the operation was aborted. It wins over `alert` and `completed`. */
  stopped?: boolean;
  /** How much of the ring is filled, 0–100. Only the first operation's is drawn. */
  percent?: number;
  /** Whether the status badge is suppressed. Read only when the panel cannot be opened. */
  withoutStatus?: boolean;
  /** Whether the row in the list is drawn without its progress ring. */
  withoutProgress?: boolean;
  /** Opens this operation's own panel. Without it the row is inert and the button does not react. */
  showPanel?: (open: boolean) => void;
  /** Sub-operations. The first one's `operationId` is what the per-row cancel is called with. */
  items?: Array<{
    operationId: string;
    percent: number;
  }>;
  /** How many files failed, for the upload's error wording in the tooltip. */
  errorCount?: number;
  /** Identifier of the drag that started this upload, used to play the drop animation once. */
  dragged?: string | null;
  /** URL of an image drawn instead of the built-in icon. */
  iconUrl?: string;
}

export interface OperationsProgressProps {
  /** Operations that own a panel — the upload. Their progress is the one the ring shows. */
  panelOperations?: Operation[];
  /** Secondary operations: copy, move, delete and the rest. Listed without a ring. */
  operations?: Operation[];
  /** Whether any operation failed: the badge becomes a warning triangle. */
  operationsAlert?: boolean;
  /** Whether an upload was cancelled. Treated as stopped. */
  operationsCanceled?: boolean;
  /** Whether everything is finished: the button plays its hide animation and then clears. */
  operationsCompleted?: boolean;
  /** Whether an operation was aborted. Treated as stopped, which wins over alert and completed. */
  operationsStopped?: boolean;
  /** Called once the hide animation ends, to drop the secondary operations. */
  clearOperationsData?: (
    operationId?: string | null,
    operation?: string | null,
    operationItem?: Operation,
  ) => void;
  /** Called once the hide animation ends, to drop the panel operations. */
  clearPanelOperationsData?: (operation?: string | null) => void;
  /** Called when the drag preview button is done with, to forget the drop target. */
  clearDropPreviewLocation?: () => void;
  /** Called with the translation function when the cancel cross is clicked. */
  cancelUpload?: (
    t: (
      key: string,
      interpolation?: Record<string, string | number> | undefined,
    ) => string | undefined,
  ) => void;
  /** Called with the operation and the id of its first item, from a row's own cancel. */
  cancelSecondaryOperationById?: (
    operation: string,
    operationId: string,
  ) => void;
  /** Ignored. Nothing reads this prop; the panel is opened through `Operation.showPanel`. */
  onOpenPanel?: () => void;
  /** Whether the mobile main button is on screen, which lifts this one clear of it. */
  mainButtonVisible?: boolean;
  /** Whether a completed run may still hold errors, which stops the button from auto-hiding. */
  needErrorChecking?: boolean;
  /** Whether the cancel cross is offered. Only while there is exactly one operation. */
  showCancelButton?: boolean;
  /** Ignored. Nothing reads this prop; the cross calls `cancelUpload`. */
  onCancelOperation?: (callback: () => void) => void;
  /** Ignored. Nothing reads this prop; the ring reads the first operation's `percent`. */
  percent?: number;
  /** Whether the info panel is open, which moves the button 424px in from the trailing edge. */
  isInfoPanelVisible?: boolean;
  /** Name of the folder under the pointer, shown by the drag preview button. */
  dropTargetFolderName?: string | null;
  /** Whether a drag is in progress, which raises the drag preview button. */
  isDragging?: boolean;
}
export interface ProgressBarMobileProps {
  /** Display text for the progress bar */
  label?: string;
  /** Alert status */
  alert?: boolean;
  /** Status text to display */
  status?: string;
  /** Progress completion percentage */
  percent?: number;
  /** Controls visibility of the progress bar */
  open?: boolean;
  /** The function that facilitates hiding the button */
  onCancel?: () => void;
  /** Icon URL or component */
  icon?: React.ReactNode;
  /** The function called after the progress header is clicked */
  onClickAction?: () => void;
  /** The function that facilitates hiding the button */
  hideButton?: () => void;
  /** Changes the progress bar color, if set to true */
  error?: boolean;
  /** Hides the progress bar */
  withoutProgress?: boolean;
  /** Icon URL */
  iconUrl?: string;
  /** Indicates if the operation is completed */
  completed?: boolean;
  /** Indicates if the operation was stopped by user */
  stopped?: boolean;
  /** Callback function for clearing progress */
  onClearProgress?: (operationId: string | null, operation: string) => void;
  /** Unique identifier for the operation */
  operationId?: string;
  /** Type of operation */
  operation?: string;
  /** The function called after the progress header is clicked */
  onOpenPanel?: () => void;
  withoutStatus?: boolean;
}
