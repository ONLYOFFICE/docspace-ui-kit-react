export interface Operation {
  id?: string;
  operation: string;
  label: string;
  description?: string;
  alert: boolean;
  canceled?: boolean;
  completed: boolean;
  stopped?: boolean;
  percent?: number;
  withoutStatus?: boolean;
  showPanel?: (open: boolean) => void;
  withoutProgress?: boolean;
  items?: Array<{
    operationId: string;
    percent: number;
  }>;
  errorCount?: number;
  dragged?: string | null;
  iconUrl?: string;
}

export interface OperationsProgressProps {
  panelOperations?: Operation[];
  operations?: Operation[];
  operationsAlert?: boolean;
  operationsCanceled?: boolean;
  operationsCompleted?: boolean;
  operationsStopped?: boolean;
  clearOperationsData?: (
    operationId?: string | null,
    operation?: string | null,
    operationItem?: Operation,
  ) => void;
  clearPanelOperationsData?: (operation?: string | null) => void;
  clearDropPreviewLocation?: () => void;
  cancelUpload?: (
    t: (
      key: string,
      interpolation?: Record<string, string | number> | undefined,
    ) => string | undefined,
  ) => void;
  cancelSecondaryOperationById?: (
    operation: string,
    operationId: string,
  ) => void;
  onOpenPanel?: () => void;
  mainButtonVisible?: boolean;
  needErrorChecking?: boolean;
  showCancelButton?: boolean;
  onCancelOperation?: (callback: () => void) => void;
  percent?: number;
  isInfoPanelVisible?: boolean;
  dropTargetFolderName?: string | null;
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
