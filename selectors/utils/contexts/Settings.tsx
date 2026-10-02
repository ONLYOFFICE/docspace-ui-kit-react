import type { FilesSettingsDto } from "@onlyoffice/docspace-api-sdk";
import React, { createContext, useMemo, type ReactNode } from "react";

import type { TGetIcon } from "../types";
import useFilesSettings from "../hooks/useFilesSettings";

export const SettingsContext = createContext<{
  getIcon: (
    fileExst: string,
    size?: number,
  ) => React.FC<React.SVGProps<SVGSVGElement>> | string | null;
  filesSettingsLoading: boolean;
  extsWebEdited: string[];
  displayFileExtension: boolean;
}>({
  getIcon: () => null,
  extsWebEdited: [],
  filesSettingsLoading: false,
  displayFileExtension: false,
});

export const SettingsContextProvider = ({
  settings,
  getIcon: getIconProp,
  children,
}: {
  settings?: FilesSettingsDto;
  getIcon?: TGetIcon;
  children: ReactNode;
}) => {
  const { getIcon, extsWebEdited, isLoading, displayFileExtension } =
    useFilesSettings(getIconProp, settings);

  let displayExts = displayFileExtension;

  if (
    typeof window !== "undefined" &&
    window.DocSpace &&
    "displayFileExtension" in window.DocSpace
  ) {
    displayExts = window.DocSpace.displayFileExtension as boolean;
  }

  const value = useMemo(
    () => ({
      getIcon,
      extsWebEdited: extsWebEdited ?? [],
      filesSettingsLoading: isLoading!,
      displayFileExtension: displayExts ?? false,
    }),
    [getIcon, extsWebEdited, isLoading, displayExts],
  );

  return <SettingsContext value={value}>{children}</SettingsContext>;
};
