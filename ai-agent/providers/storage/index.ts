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

import type { StorageAdapter } from "@onlyoffice/ai-chat";

// Server-mode stub. With ApiProvider routed to a remote server, every
// engine call is performed over HTTP and no local engines are constructed,
// so this adapter is never invoked at runtime — it only exists to satisfy
// the AppContext / ServerAPIEngines type contract.
const unsupported = (slice: string) => () =>
  Promise.reject(
    new Error(
      `storage.${slice} called in server mode — engines run on the backend`,
    ),
  );

export const storageAdapter: StorageAdapter = {
  threads: new Proxy({} as StorageAdapter["threads"], {
    get: (_t, p) => unsupported(`threads.${String(p)}`),
  }),
  messages: new Proxy({} as StorageAdapter["messages"], {
    get: (_t, p) => unsupported(`messages.${String(p)}`),
  }),
  profiles: new Proxy({} as StorageAdapter["profiles"], {
    get: (_t, p) => unsupported(`profiles.${String(p)}`),
  }),
  prompts: new Proxy({} as StorageAdapter["prompts"], {
    get: (_t, p) => unsupported(`prompts.${String(p)}`),
  }),
  promptFolders: new Proxy({} as StorageAdapter["promptFolders"], {
    get: (_t, p) => unsupported(`promptFolders.${String(p)}`),
  }),
  assignments: new Proxy({} as StorageAdapter["assignments"], {
    get: (_t, p) => unsupported(`assignments.${String(p)}`),
  }),
  preferences: new Proxy({} as StorageAdapter["preferences"], {
    get: (_t, p) => unsupported(`preferences.${String(p)}`),
  }),
  mcpServers: new Proxy({} as StorageAdapter["mcpServers"], {
    get: (_t, p) => unsupported(`mcpServers.${String(p)}`),
  }),
  toolPrefs: new Proxy({} as StorageAdapter["toolPrefs"], {
    get: (_t, p) => unsupported(`toolPrefs.${String(p)}`),
  }),
  webSearch: new Proxy({} as StorageAdapter["webSearch"], {
    get: (_t, p) => unsupported(`webSearch.${String(p)}`),
  }),
  attachments: new Proxy({} as StorageAdapter["attachments"], {
    get: (_t, p) => unsupported(`attachments.${String(p)}`),
  }),
  async init() {},
  async close() {},
};
