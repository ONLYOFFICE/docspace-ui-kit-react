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

import { useEffect, useState } from "react";
import { DocumentEditor as OODocumentEditor } from "@onlyoffice/document-editor-react";
import type { IConfig } from "@onlyoffice/document-editor-react";
import { useApi } from "../providers/api";
import type { DocumentEditorProps } from "./DocumentEditor.types";

export const DocumentEditor = (props: DocumentEditorProps) => {
  const {
    id,
    width = "100%",
    height = "100%",
    shardkey,
    onLoadComponentError,
    fileVersion,
    isView,
    config: configProp,
    documentServerUrl: documentServerUrlProp,
    ...restProps
  } = props;

  const hasConfig = "config" in props && configProp;
  const hasDocumentServerUrl =
    "documentServerUrl" in props && documentServerUrlProp;
  const hasFileId = "fileId" in props && props.fileId;

  const api = useApi();

  const [config, setConfig] = useState<IConfig | null>(
    hasConfig ? configProp : null,
  );
  const [documentServerUrl, setDocumentServerUrl] = useState<string>(
    hasDocumentServerUrl ? documentServerUrlProp : "",
  );

  useEffect(() => {
    if (documentServerUrl || config) return;

    let cancelled = false;

    (async () => {
      try {
        const [docServiceLocation, result] = await Promise.all([
          api.filesSettingsApi.getDocServiceUrl(),
          api.filesApi.openEditFile({
            fileId: props.fileId || 1,
            version: fileVersion,
            view: isView,
          }),
        ]);

        if (!result.data.response) {
          throw new Error("Invalid response format: missing 'response' field");
        }

        const initialConfig = result.data.response;

        if (!initialConfig.editorUrl) {
          throw new Error("Invalid response format: missing 'editorUrl' field");
        }

        const baseUrl = docServiceLocation?.data?.response?.docServiceUrl;

        if (!baseUrl) {
          throw new Error(
            "Invalid response format: missing 'docServiceUrl' field",
          );
        }

        if (cancelled) return;
        setDocumentServerUrl(baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
        setConfig(initialConfig as unknown as IConfig);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        if (!cancelled) {
          onLoadComponentError?.(0, errorMessage);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    documentServerUrl,
    config,
    hasFileId,
    fileVersion,
    isView,
    api.filesApi,
    api.filesSettingsApi,
    onLoadComponentError,
  ]);

  if (!config || !documentServerUrl) {
    return null;
  }

  return (
    <OODocumentEditor
      id={id}
      documentServerUrl={documentServerUrl}
      config={config}
      width={width}
      height={height}
      shardkey={shardkey}
      onLoadComponentError={onLoadComponentError}
      {...restProps}
    />
  );
};

DocumentEditor.displayName = "DocumentEditor";
