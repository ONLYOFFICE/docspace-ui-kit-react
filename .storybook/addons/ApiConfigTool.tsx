/*
 * (c) Copyright Ascensio System SIA 2009-2026
 *
 * This program is a free software product.
 * You can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
 * Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
 * to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
 * any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
 * the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions of the Program must
 * display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product logo when
 * distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
 * trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
 * content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
 * International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 */

import React, { useState, useEffect, useCallback } from "react";
import { addons, types, useStorybookApi } from "storybook/manager-api";
import { useGlobals } from "storybook/manager-api";
import {
  Modal,
  Button,
  Form,
  Select,
  Badge,
} from "storybook/internal/components";
import { EditorIcon, TrashIcon } from "@storybook/icons";

import {
  getSavedProviders,
  deleteProvider,
  STORAGE_KEY,
  type SavedApiProvider,
} from "../utils/apiProviders";

import "./index.css";

type Value = string | number | null | boolean | undefined;

const ADDON_ID = "docspace/api-config";
const TOOL_ID = `${ADDON_ID}/tool`;

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, url: string, apiKey: string) => void;
  onClose: () => void;
};

const AddCustomModal = ({
  open,
  onOpenChange,
  onSave,
  onClose,
}: ModalProps) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const resetState = () => {
    setName("");
    setUrl("");
    setApiKey("");
    setError("");
    setIsLoading(false);
  };

  const trimUrl = (rawUrl: string): string => {
    return rawUrl.trim().replace(/\/+$/, "");
  };

  const testConnection = async (
    baseUrl: string,
    key: string,
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${baseUrl}/api/2.0/people/@self`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !url.trim() || !apiKey.trim()) return;

    setError("");
    setIsLoading(true);

    const trimmedUrl = trimUrl(url);

    const isConnected = await testConnection(trimmedUrl, apiKey);

    if (!isConnected) {
      setError("Failed to connect to API. Please check the URL and API Key.");
      setIsLoading(false);
      return;
    }

    onSave(name.trim(), trimmedUrl, apiKey);
    resetState();
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} variant="dialog">
      <div className="modal-body">
        <h3 className="header">API Configuration</h3>
        <Form className="form">
          <div className="form-input">
            <p className="label">Name</p>
            <Form.Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My API"
            />
          </div>
          <div className="form-input">
            <p className="label">URL</p>
            <Form.Input
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://localhost"
            />
          </div>
          <div className="form-input">
            <p className="label">API Key</p>
            <Form.Input
              required
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-1234567890"
            />
          </div>
        </Form>

        {error ? (
          <Badge status="critical">{error}</Badge>
        ) : (
          <Badge status="warning">
            {"\u26A0\uFE0F"} API keys are stored unencrypted in localStorage for
            development convenience only.
          </Badge>
        )}

        <div className="footer">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            size="medium"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!name || !url || !apiKey || isLoading}
            size="medium"
          >
            {isLoading ? "Testing..." : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const ApiConfigDropdown = () => {
  const [globals, updateGlobals] = useGlobals();
  const api = useStorybookApi();
  const [providers, setProviders] =
    useState<SavedApiProvider[]>(getSavedProviders);
  const [modalOpen, setModalOpen] = useState(false);

  const apiConfig: string = globals.apiConfig || "default";

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setProviders(getSavedProviders());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleSelect = useCallback(
    (value: Value) => {
      if (value === "add-custom") {
        setModalOpen(true);
      } else {
        updateGlobals({ apiConfig: value });
      }
    },
    [updateGlobals],
  );

  const handleModalSave = useCallback(
    (name: string, url: string, key: string) => {
      const id = `provider-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newProvider: SavedApiProvider = { id, name, url, apiKey: key };

      const existing = getSavedProviders();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...existing, newProvider]),
      );

      setProviders(getSavedProviders());
      setModalOpen(false);
      updateGlobals({ apiConfig: id });
    },
    [updateGlobals],
  );

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleDelete = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      deleteProvider(id);
      setProviders(getSavedProviders());
      api.addNotification({
        id: `api-provider-deleted-${id}`,
        content: { headline: "Success deleted" },
        duration: 4000,
      });
    },
    [api],
  );

  const options = [
    { title: "Default", value: "default" },
    ...providers.map((p) => ({
      title: p.name,
      value: p.id,
      aside: (
        <Button
          variant="ghost"
          size="small"
          onClick={(e) => handleDelete(e, p.id)}
          title="Delete"
        >
          <TrashIcon />
        </Button>
      ),
    })),
    { title: "Add custom...", value: "add-custom" },
  ];

  return (
    <>
      <AddCustomModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleModalSave}
        onClose={handleModalClose}
      />
      <Select
        icon={<EditorIcon />}
        options={options}
        ariaLabel="API Config"
        defaultOptions={apiConfig}
        onSelect={handleSelect}
      />
    </>
  );
};

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: "API Config",
    match: () => true,
    render: () => <ApiConfigDropdown />,
  });
});
