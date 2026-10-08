import { combineUrl } from "../combineUrl";

declare global {
  interface Window {
    ClientConfig?: {
      pdfViewerUrl: string;
      wrongPortalNameUrl?: string;
      api: {
        origin?: string;
        prefix?: string;
      };
      proxy: {
        url?: string;
      };
      imageThumbnails?: boolean;
      oauth2: {
        origin: string;
        secret: string;
        apiSystem: string[];
      };
      editor?: {
        requestClose: boolean;
      };
      firebase: {
        fetchTimeoutMillis?: number;
        minimumFetchIntervalMillis?: number;
      };
      campaigns?: string[];
      isFrame?: boolean;
      isOAuthFrame?: boolean;
      management: {
        checkDomain?: boolean;
      };
      logs: {
        enableLogs: boolean;
        logsToConsole: boolean;
      };
      loaders: {
        showLoader: boolean;
        showLoaderTime: number;
        loaderTime: number;
      };
    };
  }
}

export const openingNewTab = (url: string, e?: React.MouseEvent) => {
  if (e?.ctrlKey || e?.metaKey || e?.button === 1) {
    const path = combineUrl(window.ClientConfig?.proxy?.url, url);

    window.open(path, "_blank");

    return true;
  }

  return false;
};
