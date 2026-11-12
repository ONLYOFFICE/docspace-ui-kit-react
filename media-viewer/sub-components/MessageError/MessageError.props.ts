import type { ContextMenuModel } from "../../../components/context-menu";

interface PlayerMessageErrorProps {
  errorTitle: string;
  model: ContextMenuModel[];
  onMaskClick?: VoidFunction;
  isMobile: boolean;
  className?: string;
}

export default PlayerMessageErrorProps;
