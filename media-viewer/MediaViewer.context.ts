import { createContext } from "react";

import type { MediaViewerProps } from "./MediaViewer.types";

export const PdfViewerScriptContext =
  createContext<MediaViewerProps["getPdfViewerScriptUrl"]>(undefined);
