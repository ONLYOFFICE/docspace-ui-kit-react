export type DialogSkeletonProps = {
  isLarge: boolean;
  withFooterBorder: boolean;
};

export type DialogAsideSkeletonProps = {
  isPanel: boolean;
  withoutAside?: boolean;
  withFooterBorder: boolean;
  isInvitePanelLoader?: boolean;
  onClose?: VoidFunction;
};
