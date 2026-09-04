import React from "react";

import type { FilesSettingsDto } from "@onlyoffice/docspace-api-sdk";
import { useApi } from "../../../providers/api/ApiProvider";
import { presentInArray } from "../../../utils/presentInArray";
import {
  iconSize32,
  iconSize64,
  iconSize96,
} from "../../../utils/image-helpers";
import { HTML_EXST, EBOOK_EXST } from "../../../constants";
import { toastr, type TData } from "../../../components/toast";

import type { TGetIcon } from "../types";

const IconSizes: Record<
  number,
  Map<string, React.FC<React.SVGProps<SVGSVGElement>>>
> = {
  32: iconSize32,
  64: iconSize64,
  96: iconSize96,
};

const useFilesSettings = (
  getIconProp?: TGetIcon,
  settings?: FilesSettingsDto,
) => {
  const { filesSettingsApi } = useApi();
  const [filesSettings, setFilesSettings] = React.useState<
    FilesSettingsDto | undefined
  >(settings);
  const [isLoading, setIsLoading] = React.useState(false);

  const getFileSettings = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await filesSettingsApi.getFilesSettings();

      setFilesSettings(res.data.response);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      toastr.error(e as TData);
    }
  }, [filesSettingsApi]);

  React.useEffect(() => {
    if (!settings) getFileSettings();
  }, [getFileSettings, settings]);

  const isArchive = React.useCallback(
    (extension: string) =>
      presentInArray(filesSettings?.extsArchive ?? [], extension),
    [filesSettings?.extsArchive],
  );

  const isImage = React.useCallback(
    (extension: string) =>
      presentInArray(filesSettings?.extsImage ?? [], extension),
    [filesSettings?.extsImage],
  );

  const isSound = React.useCallback(
    (extension: string) =>
      presentInArray(filesSettings?.extsAudio ?? [], extension),
    [filesSettings?.extsAudio],
  );

  const isHtml = React.useCallback(
    (extension: string) => presentInArray(HTML_EXST, extension),
    [],
  );

  const isEbook = React.useCallback(
    (extension: string) => presentInArray(EBOOK_EXST, extension),
    [],
  );

  const determineIconPath = React.useCallback(
    (fileExst: string): string => {
      if (isArchive(fileExst)) return "archive.svg";
      if (isImage(fileExst)) return "image.svg";
      if (isSound(fileExst)) return "sound.svg";
      if (isHtml(fileExst)) return "html.svg";
      if (isEbook(fileExst)) return "ebook.svg";
      return `${fileExst.replace(/^\./, "")}.svg`;
    },
    [isArchive, isImage, isSound, isHtml, isEbook],
  );

  const getIcon = React.useCallback(
    (
      fileExst: string,
      size = 32,
    ): React.FC<React.SVGProps<SVGSVGElement>> | string | null => {
      if (getIconProp) return getIconProp(size, fileExst) ?? null;
      if (!filesSettings) return null;

      const path = determineIconPath(fileExst);

      const iconSize = IconSizes[size] ?? iconSize32;

      return iconSize.get(path) ?? iconSize.get("file.svg") ?? null;
    },
    [filesSettings, getIconProp, determineIconPath],
  );

  return {
    getIcon,
    extsWebEdited: filesSettings?.extsWebEdited,
    isLoading,
    displayFileExtension: filesSettings?.displayFileExtension,
  };
};

export default useFilesSettings;
