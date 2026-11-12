import { ContextMenuRefType } from "../../../components/context-menu";
import type { ContextMenuModel } from "../../../components/context-menu";

interface MobileDetailsProps {
  ref?: React.RefObject<ContextMenuRefType | null>;
  icon: string;
  title: string;
  isError: boolean;
  isPreviewFile?: boolean;
  isPublicFile?: boolean;
  onHide: VoidFunction;
  onMaskClick: VoidFunction;
  onContextMenu: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  contextModel: () => ContextMenuModel[];
}

export default MobileDetailsProps;
