// (c) Copyright Ascensio System SIA 2009-2026
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import { useEffect, useRef, useState } from "react";
import type { IConfig } from "@onlyoffice/document-editor-react";
import { ApiProvider, useApi } from "../providers/api";
import { DocumentEditor } from "./DocumentEditor";

export type DocumentEditorWithApiProps = {
  id: string;
  url: string;
  fileId: number;
  width?: string;
  height?: string;
  shardkey?: string;
  onLoadComponentError?: (errorCode: number, errorDescription: string) => void;
  apiKey: string;
};

type DocumentEditorInnerProps = Omit<
  DocumentEditorWithApiProps,
  "url" | "apiKey"
>;

const DocumentEditorInner = ({
  id,
  fileId,
  width = "100%",
  height = "100%",
  shardkey,
  onLoadComponentError,
}: DocumentEditorInnerProps) => {
  const { filesApi } = useApi();
  const containerRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<IConfig | null>(null);
  const [documentServerUrl, setDocumentServerUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const result = await filesApi.openEditFile(fileId);

        if (!result.data.response) {
          throw new Error("Invalid response format: missing 'response' field");
        }

        const initialConfig = result.data.response;

        if (!initialConfig.editorUrl) {
          throw new Error("Invalid response format: missing 'editorUrl' field");
        }

        const editorUrl = new URL(initialConfig.editorUrl);
        const pathParts = editorUrl.pathname.split("/");
        const baseUrl = `${editorUrl.protocol}//${editorUrl.host}/${pathParts[1]}/`;

        if (cancelled) return;
        setDocumentServerUrl(baseUrl);
        setConfig(initialConfig as unknown as IConfig);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        if (!cancelled) setError(errorMessage);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [fileId, filesApi]);

  if (loading) {
    return (
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          color: "#666",
        }}
      >
        Loading editor configuration...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          fontSize: "16px",
          color: "#d32f2f",
          padding: "20px",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
          Error loading editor
        </div>
        <div>{error}</div>
      </div>
    );
  }

  if (!config || !documentServerUrl || !fileId) {
    return null;
  }

  const editorId = `${id}-${fileId}`;

  return (
    <div ref={containerRef} style={{ width, height }}>
      <DocumentEditor
        key={editorId}
        id={editorId}
        documentServerUrl={documentServerUrl}
        config={config}
        width={width}
        height={height}
        shardkey={shardkey}
        onLoadComponentError={onLoadComponentError}
      />
    </div>
  );
};

DocumentEditorInner.displayName = "DocumentEditorInner";

export const DocumentEditorWithApi = ({
  url,
  apiKey,
  ...rest
}: DocumentEditorWithApiProps) => {
  return (
    <ApiProvider url={url} apiKey={apiKey}>
      <DocumentEditorInner key={`${rest.id}-${rest.fileId}`} {...rest} />
    </ApiProvider>
  );
};

DocumentEditorWithApi.displayName = "DocumentEditorWithApi";
