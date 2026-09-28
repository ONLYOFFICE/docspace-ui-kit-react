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
    fileId,
    fileVersion,
    isView,
    config: configProp,
    documentServerUrl: documentServerUrlProp,
    ...restProps
  } = props;

  const hasConfig = "config" in props && configProp;
  const hasDocumentServerUrl =
    "documentServerUrl" in props && documentServerUrlProp;

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

    // Neither a configuration nor a file to fetch one for: nothing to open.
    // The props type rules this out; a caller that casts past it hears why.
    if (fileId === undefined) {
      onLoadComponentError?.(0, "No fileId and no config were given");
      return;
    }

    (async () => {
      try {
        const [docServiceLocation, result] = await Promise.all([
          api.filesSettingsApi.getDocServiceUrl(),
          api.filesApi.openEditFile({
            fileId,
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
    fileId,
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
