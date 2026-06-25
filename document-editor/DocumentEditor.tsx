/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
