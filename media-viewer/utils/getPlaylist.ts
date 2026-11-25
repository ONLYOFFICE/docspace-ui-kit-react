import type { PlaylistType, TFile } from "../MediaViewer.types";

/**
 * The playlist of a file list: the files the viewer can open as an image or
 * play as media, in their order, numbered from zero.
 */
export const getPlaylist = (files: TFile[]): PlaylistType[] => {
  const playlist: PlaylistType[] = [];

  files.forEach((file) => {
    const canOpenPlayer =
      file.viewAccessibility?.ImageView || file.viewAccessibility?.MediaView;

    if (!canOpenPlayer) return;

    playlist.push({
      id: playlist.length,
      fileId: file.id,
      src: file.viewUrl,
      title: file.title,
      fileExst: file.fileExst,
      fileStatus: file.fileStatus,
      canShare: file.canShare,
      version: file.version,
      encrypted: file.encrypted === true,
      thumbnailUrl:
        !file.providerItem && file.thumbnailUrl ? file.thumbnailUrl : "",
    });
  });

  return playlist;
};
