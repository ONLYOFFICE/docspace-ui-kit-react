import React from "react";

import MediaZoomInIcon from "../assets/media.zoomin.react.svg";
import MediaZoomOutIcon from "../assets/media.zoomout.react.svg";
import MediaRotateLeftIcon from "../assets/media.rotateleft.react.svg";
import MediaRotateRightIcon from "../assets/media.rotateright.react.svg";
import MediaDeleteIcon from "../assets/media.delete.react.svg";
import MediaDownloadIcon from "../assets/icons/16/download.react.svg";
import ViewerSeparator from "../assets/viewer.separator.react.svg";
import PanelReactSvg from "../assets/panel.react.svg";
import EyeIcon from "../assets/eye.react.svg";
import CopyIcon from "../assets/icons/16/copy.react.svg";
import AccessEditIcon from "../assets/access.edit.react.svg";
import InvitationLinkIcon from "../assets/invitation.link.react.svg";
import DownloadIcon from "../assets/icons/16/download.react.svg";
import DownloadAsIcon from "../assets/download-as.react.svg";
import RenameIcon from "../assets/rename.react.svg";
import TrashIcon from "../assets/icons/16/trash.react.svg";
import DuplicateIcon from "../assets/icons/16/duplicate.react.svg";
import InfoOutlineIcon from "../assets/info.outline.react.svg";
import MoveIcon from "../assets/icons/16/move.react.svg";
import type { TFile } from "./MediaViewer.types";

import { ToolbarActionType } from "./MediaViewer.enums";
import type { ContextFunctions, TranslationType } from "./MediaViewer.types";
import type { ContextMenuModel } from "../components/context-menu";

// Spec: private-rooms/file-operations, "Rename withheld for encrypted files"
const isRenameWithheld = (file?: TFile) => !!file?.encrypted;

const withIcon = (
  iconNode: React.ReactElement,
): { iconNode?: React.ReactNode } => ({ iconNode });

export const getPDFContextModel = (
  t: TranslationType,
  item: TFile,
  funcs: Omit<ContextFunctions, "onShowInfoPanel">,
) => {
  const options: ContextMenuModel[] = [
    {
      id: "option_edit",
      key: "edit",
      label: t("Common:EditButton"),
      iconNode: <AccessEditIcon />,
      onClick: () => funcs.onClickLinkEdit?.(item),
      disabled: !item.viewAccessibility.WebEdit,
    },
    {
      id: "option_preview",
      key: "preview",
      label: t("Common:Preview"),
      iconNode: <EyeIcon />,
      onClick: () => funcs.onPreviewClick?.(item),
      disabled: !item.security.Read,
    },
    {
      key: "separator0",
      isSeparator: true,
      disabled: false,
    },
    {
      id: "option_link-for-room-members",
      key: "link-for-room-members",
      label: t("Common:CopyLink"),
      iconNode: <InvitationLinkIcon />,
      onClick: () => funcs.onCopyLink?.(item, t),
      disabled: false,
    },
    {
      id: "option_copy-to",
      key: "copy-to",
      label: t("Common:Copy"),
      iconNode: <CopyIcon />,
      onClick: funcs.onCopyAction,
      disabled: !item.security.Copy,
    },
    {
      id: "option_create-copy",
      key: "copy",
      label: t("Common:Duplicate"),
      iconNode: <DuplicateIcon />,
      onClick: () => funcs.onDuplicate?.(item, t),
      disabled: !item.security.Duplicate,
    },
    {
      key: "download",
      label: t("Common:Download"),
      iconNode: <DownloadIcon />,
      onClick: () => funcs.onClickDownload?.(item, t),
      disabled: !item.security.Download,
    },
    {
      id: "option_download-as",
      key: "download-as",
      label: t("Common:DownloadAs"),
      iconNode: <DownloadAsIcon />,
      onClick: funcs.onClickDownloadAs,
      disabled: !item.security.Download,
    },
    {
      id: "option_rename",
      key: "rename",
      label: t("Common:Rename"),
      iconNode: <RenameIcon />,
      onClick: () => funcs.onClickRename?.(item),
      disabled: !item.security.Rename || isRenameWithheld(item),
    },
    {
      key: "separator1",
      isSeparator: true,
      disabled: false,
    },
    {
      key: "delete",
      label: t("Common:Delete"),
      iconNode: <TrashIcon />,
      onClick: () => funcs.onClickDelete?.(item, t),
      disabled: !item.security.Delete,
    },
  ];

  return options;
};

export const getMobileMediaContextModel = (
  t: TranslationType,
  targetFile: TFile,
  isPublicFile: boolean,
  funcs: Omit<
    ContextFunctions,
    "onClickDownloadAs" | "onCopyLink" | "onPreviewClick" | "onClickLinkEdit"
  >,
) => {
  const {
    onShowInfoPanel,
    onClickDownload,
    onMoveAction,
    onCopyAction,
    onDuplicate,
    onClickRename,
    onClickDelete,
  } = funcs;

  const options = [
    {
      id: "option_room-info",
      key: "room-info",
      label: t("Common:Info"),
      ...withIcon(<InfoOutlineIcon />),
      onClick: () => {
        return onShowInfoPanel?.(targetFile);
      },
      disabled: isPublicFile,
    },
    {
      key: "download",
      label: t("Common:Download"),
      ...withIcon(<DownloadIcon />),
      onClick: () => onClickDownload?.(targetFile, t),
      disabled: !targetFile?.security?.Download,
    },
    {
      key: "move-to",
      label: t("Common:MoveTo"),
      ...withIcon(<MoveIcon />),
      onClick: onMoveAction,
      disabled: !targetFile?.security?.Move || isPublicFile,
    },
    {
      id: "option_copy-to",
      key: "copy-to",
      label: t("Common:Copy"),
      ...withIcon(<CopyIcon />),
      onClick: onCopyAction,
      disabled: !targetFile?.security?.Copy || isPublicFile,
    },
    {
      id: "option_create-copy",
      key: "copy",
      label: t("Common:Duplicate"),
      ...withIcon(<DuplicateIcon />),
      onClick: () => onDuplicate?.(targetFile, t),
      disabled: !targetFile?.security?.Duplicate || isPublicFile,
    },
    {
      key: "rename",
      label: t("Common:Rename"),
      ...withIcon(<RenameIcon />),
      onClick: () => onClickRename?.(targetFile),
      disabled:
        !targetFile?.security?.Rename ||
        isPublicFile ||
        isRenameWithheld(targetFile),
    },

    {
      key: "separator0",
      isSeparator: true,
      disabled: !targetFile?.security?.Delete || isPublicFile,
    },
    {
      key: "delete",
      label: t("Common:Delete"),
      ...withIcon(<TrashIcon />),
      onClick: () => onClickDelete?.(targetFile, t),
      disabled: !targetFile?.security?.Delete || isPublicFile,
    },
  ];

  return options;
};

export const getDesktopMediaContextModel = (
  t: TranslationType,
  targetFile: TFile,
  archiveRoom: boolean,
  isPublicFile: boolean,
  funcs: Pick<
    ContextFunctions,
    "onClickDownload" | "onClickRename" | "onClickDelete"
  >,
) => {
  const { onClickDelete, onClickDownload, onClickRename } = funcs;

  const options = [
    {
      key: "download",
      label: t("Common:Download"),
      ...withIcon(<DownloadIcon />),
      onClick: () => onClickDownload?.(targetFile, t),
      disabled: !targetFile?.security?.Download,
    },
    {
      key: "rename",
      label: t("Common:Rename"),
      ...withIcon(<RenameIcon />),
      onClick: () => onClickRename?.(targetFile),
      disabled: archiveRoom || isPublicFile || isRenameWithheld(targetFile),
    },
    {
      key: "delete",
      label: t("Common:Delete"),
      ...withIcon(<TrashIcon />),
      onClick: () => onClickDelete?.(targetFile, t),
      disabled: archiveRoom || isPublicFile || !targetFile?.security?.Delete,
    },
  ];

  return options;
};

export const getCustomToolbar = (
  targetFile: TFile,
  isEmptyContextMenu: boolean,
  onDeleteClick?: VoidFunction,
  onDownloadClick?: VoidFunction,
) => {
  return [
    {
      key: "zoomOut",
      percent: true,
      actionType: ToolbarActionType.ZoomOut,
      render: (
        <div className="iconContainer zoomOut">
          <MediaZoomOutIcon />
        </div>
      ),
    },
    {
      key: "percent",
      actionType: ToolbarActionType.Reset,
    },
    {
      key: "zoomIn",
      actionType: ToolbarActionType.ZoomIn,
      render: (
        <div className="iconContainer zoomIn">
          <MediaZoomInIcon />
        </div>
      ),
    },
    {
      key: "rotateLeft",
      actionType: ToolbarActionType.RotateLeft,
      render: (
        <div className="iconContainer rotateLeft">
          <MediaRotateLeftIcon />
        </div>
      ),
    },
    {
      key: "rotateRight",
      actionType: ToolbarActionType.RotateRight,
      render: (
        <div className="iconContainer rotateRight">
          <MediaRotateRightIcon />
        </div>
      ),
    },
    {
      key: "separator download-separator",
      actionType: -1,
      noHover: true,
      render: (
        <div className="separator" style={{ height: "16px" }}>
          <ViewerSeparator />
        </div>
      ),
      disabled: !targetFile?.security?.Download,
    },
    {
      key: "download",
      actionType: ToolbarActionType.Download,
      render: (
        <div className="iconContainer download" style={{ height: "16px" }}>
          <MediaDownloadIcon />
        </div>
      ),
      onClick: onDownloadClick,
      disabled: !targetFile?.security?.Download,
    },
    {
      key: "context-separator",
      actionType: -1,
      noHover: true,
      render: (
        <div className="separator" style={{ height: "16px" }}>
          <ViewerSeparator />
        </div>
      ),
      disabled: isEmptyContextMenu,
    },
    {
      key: "context-menu",
      actionType: -1,
      disabled: isEmptyContextMenu,
    },
    {
      key: "delete",
      actionType: 103,
      render: (
        <div className="iconContainer viewer-delete">
          <MediaDeleteIcon />
        </div>
      ),
      onClick: onDeleteClick,
      disabled: !targetFile?.security?.Delete,
    },
  ];
};

export const getPDFToolbar = (): ReturnType<typeof getCustomToolbar> => {
  return [
    {
      key: "panel",
      actionType: ToolbarActionType.Panel,
      render: (
        <div className="iconContainer zoomOut panelToggle">
          <PanelReactSvg transform="rotate(180)" />
        </div>
      ),
    },
    {
      key: "context-separator-panel",
      actionType: -1,
      noHover: true,
      render: (
        <div className="separator" style={{ height: "16px" }}>
          <ViewerSeparator />
        </div>
      ),
      disabled: false,
    },
    {
      key: "zoomOut",
      percent: true,
      actionType: ToolbarActionType.ZoomOut,
      render: (
        <div className="iconContainer zoomOut">
          <MediaZoomOutIcon />
        </div>
      ),
    },
    {
      key: "percent",
      actionType: ToolbarActionType.Reset,
    },
    {
      key: "zoomIn",
      actionType: ToolbarActionType.ZoomIn,
      render: (
        <div className="iconContainer zoomIn">
          <MediaZoomInIcon />
        </div>
      ),
    },
    // {
    //   key: "context-separator-zoom",
    //   actionType: -1,
    //   noHover: true,
    //   render: (
    //     <div className="separator" style={{ height: "16px" }}>
    //       <ViewerSeparator  />
    //     </div>
    //   ),
    // },
    // {
    //   key: "rotateLeft",
    //   actionType: ToolbarActionType.RotateLeft,
    //   render: (
    //     <div className="iconContainer rotateLeft">
    //       <MediaRotateLeftIcon  />
    //     </div>
    //   ),
    // },
    // {
    //   key: "rotateRight",
    //   actionType: ToolbarActionType.RotateRight,
    //   render: (
    //     <div className="iconContainer rotateRight">
    //       <MediaRotateRightIcon  />
    //     </div>
    //   ),
    // },
    {
      key: "context-separator-rotate",
      actionType: -1,
      noHover: true,
      render: (
        <div className="separator" style={{ height: "16px" }}>
          <ViewerSeparator />
        </div>
      ),
      disabled: false,
    },
    {
      key: "context-menu",
      actionType: -1,
      disabled: false,
    },
  ];
};
