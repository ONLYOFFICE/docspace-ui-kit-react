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
