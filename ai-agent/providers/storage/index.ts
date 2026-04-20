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

import type {
  StorageAdapter,
  ThreadsStorage,
  MessagesStorage,
  ProfilesStorage,
  PromptsStorage,
  PromptFoldersStorage,
  Thread,
  Profile,
  Prompt,
  PromptFolder,
  TProvider,
  Model,
} from "@onlyoffice/ai-chat";

// Derive the message type from the storage interface — avoids a direct
// dependency on @assistant-ui/react (not a peer of ui-kit).
type ChatMessage = Parameters<MessagesStorage["create"]>[2];

const DB_NAME = "docspace-ai-agent";
const DB_VERSION = 1;

const STORE_THREADS = "threads";
const STORE_MESSAGES = "messages";
const STORE_PROFILES = "profiles";
const STORE_PROMPTS = "prompts";
const STORE_PROMPT_FOLDERS = "promptFolders";

const req = <T>(request: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const tx = (transaction: IDBTransaction): Promise<void> =>
  new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });

let dbPromise: Promise<IDBDatabase> | null = null;

const openDatabase = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_THREADS)) {
        const threads = db.createObjectStore(STORE_THREADS, {
          keyPath: "threadId",
        });
        threads.createIndex("lastEditDate", "lastEditDate");
      }

      if (!db.objectStoreNames.contains(STORE_MESSAGES)) {
        const messages = db.createObjectStore(STORE_MESSAGES, {
          keyPath: "id",
        });
        messages.createIndex("threadId", "threadId");
      }

      if (!db.objectStoreNames.contains(STORE_PROFILES)) {
        db.createObjectStore(STORE_PROFILES, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(STORE_PROMPTS)) {
        const prompts = db.createObjectStore(STORE_PROMPTS, { keyPath: "id" });
        prompts.createIndex("folderId", "folderId");
      }

      if (!db.objectStoreNames.contains(STORE_PROMPT_FOLDERS)) {
        db.createObjectStore(STORE_PROMPT_FOLDERS, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("IndexedDB upgrade blocked"));
  });

  return dbPromise;
};

const getStore = async (name: string, mode: IDBTransactionMode) => {
  const db = await openDatabase();
  const transaction = db.transaction(name, mode);
  return { store: transaction.objectStore(name), transaction };
};

// ---------------------------------------------------------------------------
// Threads
// ---------------------------------------------------------------------------

class IDBThreads implements ThreadsStorage {
  async create(
    threadId: string,
    title: string,
    provider?: TProvider,
    model?: Model,
    profileId?: string,
  ): Promise<void> {
    const { store } = await getStore(STORE_THREADS, "readwrite");
    await req(
      store.add({
        threadId,
        title,
        lastEditDate: Date.now(),
        provider,
        model,
        profileId,
      }),
    );
  }

  async getAll(): Promise<Thread[]> {
    const { store } = await getStore(STORE_THREADS, "readonly");
    const all: Thread[] = await req(store.getAll());
    return all.sort((a, b) => (b.lastEditDate ?? 0) - (a.lastEditDate ?? 0));
  }

  async getById(threadId: string): Promise<Thread | null> {
    const { store } = await getStore(STORE_THREADS, "readonly");
    return (await req<Thread | undefined>(store.get(threadId))) ?? null;
  }

  async update(threadId: string, title?: string): Promise<void> {
    const { store, transaction } = await getStore(STORE_THREADS, "readwrite");
    const thread = await req<Thread | undefined>(store.get(threadId));
    if (thread) {
      if (title !== undefined) thread.title = title;
      thread.lastEditDate = Date.now();
      store.put(thread);
    }
    await tx(transaction);
  }

  async touch(
    threadId: string,
    updates?: {
      provider?: TProvider | null;
      model?: Model | null;
      profileId?: string | null;
    },
  ): Promise<void> {
    const { store, transaction } = await getStore(STORE_THREADS, "readwrite");
    const thread = await req<Thread | undefined>(store.get(threadId));
    if (thread) {
      thread.lastEditDate = Date.now();
      if (updates) {
        if (updates.provider !== undefined)
          thread.provider = updates.provider ?? undefined;
        if (updates.model !== undefined)
          thread.model = updates.model ?? undefined;
        if (updates.profileId !== undefined)
          thread.profileId = updates.profileId ?? undefined;
      }
      store.put(thread);
    }
    await tx(transaction);
  }

  async delete(threadId: string): Promise<void> {
    const { store } = await getStore(STORE_THREADS, "readwrite");
    await req(store.delete(threadId));
  }
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

interface MessageRecord {
  id: string;
  threadId: string;
  message: ChatMessage;
  timestamp: number;
}

class IDBMessages implements MessagesStorage {
  async create(
    threadId: string,
    id: string,
    message: ChatMessage,
  ): Promise<void> {
    const { store } = await getStore(STORE_MESSAGES, "readwrite");
    const record: MessageRecord = {
      id,
      threadId,
      message,
      timestamp: Date.now(),
    };
    await req(store.add(record));
  }

  async getByThread(
    threadId: string,
    limit?: number,
  ): Promise<ChatMessage[]> {
    const { store } = await getStore(STORE_MESSAGES, "readonly");
    const index = store.index("threadId");
    const records: MessageRecord[] = await req(
      index.getAll(IDBKeyRange.only(threadId)),
    );
    records.sort((a, b) => a.timestamp - b.timestamp);
    const slice = limit ? records.slice(-limit) : records;
    return slice
      .map((r) => r.message)
      .filter((m) => m && "role" in m && m.role);
  }

  async getById(
    threadId: string,
    messageId: string,
  ): Promise<ChatMessage | null> {
    const { store } = await getStore(STORE_MESSAGES, "readonly");
    const record = await req<MessageRecord | undefined>(store.get(messageId));
    if (record && record.threadId === threadId) return record.message;
    return null;
  }

  async update(messageId: string, message: ChatMessage): Promise<void> {
    const { store, transaction } = await getStore(STORE_MESSAGES, "readwrite");
    const record = await req<MessageRecord | undefined>(store.get(messageId));
    if (record) {
      record.message = message;
      record.timestamp = Date.now();
      store.put(record);
    }
    await tx(transaction);
  }

  async delete(messageId: string): Promise<void> {
    const { store } = await getStore(STORE_MESSAGES, "readwrite");
    await req(store.delete(messageId));
  }

  async deleteByThread(threadId: string): Promise<void> {
    const { store, transaction } = await getStore(STORE_MESSAGES, "readwrite");
    const index = store.index("threadId");
    const keys = await req<IDBValidKey[]>(
      index.getAllKeys(IDBKeyRange.only(threadId)),
    );
    for (const key of keys) store.delete(key);
    await tx(transaction);
  }

  async replaceByThread(
    threadId: string,
    messages: ChatMessage[],
  ): Promise<void> {
    const { store, transaction } = await getStore(STORE_MESSAGES, "readwrite");
    const index = store.index("threadId");
    const keys = await req<IDBValidKey[]>(
      index.getAllKeys(IDBKeyRange.only(threadId)),
    );
    for (const key of keys) store.delete(key);

    const now = Date.now();
    messages.forEach((msg, i) => {
      const record: MessageRecord = {
        id: `${threadId}-${i}-${now}`,
        threadId,
        message: msg,
        timestamp: now + i,
      };
      store.add(record);
    });

    await tx(transaction);
  }

  async search(
    query: string,
  ): Promise<{ threadId: string; message: ChatMessage }[]> {
    const { store } = await getStore(STORE_MESSAGES, "readonly");
    const all: MessageRecord[] = await req(store.getAll());
    const q = query.toLowerCase();
    return all
      .filter((r) => JSON.stringify(r.message).toLowerCase().includes(q))
      .map((r) => ({ threadId: r.threadId, message: r.message }));
  }
}

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------

class IDBProfiles implements ProfilesStorage {
  async create(profile: Profile): Promise<void> {
    const { store } = await getStore(STORE_PROFILES, "readwrite");
    await req(store.add(profile));
  }

  async createMany(profiles: Profile[]): Promise<void> {
    const { store, transaction } = await getStore(STORE_PROFILES, "readwrite");
    for (const p of profiles) store.add(p);
    await tx(transaction);
  }

  async getAll(): Promise<Profile[]> {
    const { store } = await getStore(STORE_PROFILES, "readonly");
    return req(store.getAll());
  }

  async getById(id: string): Promise<Profile | undefined> {
    const { store } = await getStore(STORE_PROFILES, "readonly");
    return req(store.get(id));
  }

  async update(profile: Profile): Promise<void> {
    const { store } = await getStore(STORE_PROFILES, "readwrite");
    await req(store.put(profile));
  }

  async delete(id: string): Promise<void> {
    const { store } = await getStore(STORE_PROFILES, "readwrite");
    await req(store.delete(id));
  }
}

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------

class IDBPrompts implements PromptsStorage {
  async create(prompt: Prompt): Promise<void> {
    const { store } = await getStore(STORE_PROMPTS, "readwrite");
    await req(store.add(prompt));
  }

  async getAll(): Promise<Prompt[]> {
    const { store } = await getStore(STORE_PROMPTS, "readonly");
    const all: Prompt[] = await req(store.getAll());
    return all.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  }

  async getById(id: string): Promise<Prompt | null> {
    const { store } = await getStore(STORE_PROMPTS, "readonly");
    return (await req<Prompt | undefined>(store.get(id))) ?? null;
  }

  async update(
    id: string,
    updates: { name?: string; text?: string; folderId?: string | null },
  ): Promise<void> {
    const { store, transaction } = await getStore(STORE_PROMPTS, "readwrite");
    const prompt = await req<Prompt | undefined>(store.get(id));
    if (prompt) {
      Object.assign(prompt, updates, { updatedAt: Date.now() });
      store.put(prompt);
    }
    await tx(transaction);
  }

  async delete(id: string): Promise<void> {
    const { store } = await getStore(STORE_PROMPTS, "readwrite");
    await req(store.delete(id));
  }

  async deleteByFolder(folderId: string): Promise<void> {
    const { store, transaction } = await getStore(STORE_PROMPTS, "readwrite");
    const index = store.index("folderId");
    const keys = await req<IDBValidKey[]>(
      index.getAllKeys(IDBKeyRange.only(folderId)),
    );
    for (const key of keys) store.delete(key);
    await tx(transaction);
  }
}

// ---------------------------------------------------------------------------
// Prompt folders
// ---------------------------------------------------------------------------

class IDBPromptFolders implements PromptFoldersStorage {
  async create(folder: PromptFolder): Promise<void> {
    const { store } = await getStore(STORE_PROMPT_FOLDERS, "readwrite");
    await req(store.add(folder));
  }

  async getAll(): Promise<PromptFolder[]> {
    const { store } = await getStore(STORE_PROMPT_FOLDERS, "readonly");
    const all: PromptFolder[] = await req(store.getAll());
    return all.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  }

  async getById(id: string): Promise<PromptFolder | null> {
    const { store } = await getStore(STORE_PROMPT_FOLDERS, "readonly");
    return (await req<PromptFolder | undefined>(store.get(id))) ?? null;
  }

  async update(id: string, name: string): Promise<void> {
    const { store, transaction } = await getStore(
      STORE_PROMPT_FOLDERS,
      "readwrite",
    );
    const folder = await req<PromptFolder | undefined>(store.get(id));
    if (folder) {
      folder.name = name;
      folder.updatedAt = Date.now();
      store.put(folder);
    }
    await tx(transaction);
  }

  async delete(id: string): Promise<void> {
    const { store } = await getStore(STORE_PROMPT_FOLDERS, "readwrite");
    await req(store.delete(id));
  }
}

export const storageAdapter: StorageAdapter = {
  threads: new IDBThreads(),
  messages: new IDBMessages(),
  profiles: new IDBProfiles(),
  prompts: new IDBPrompts(),
  promptFolders: new IDBPromptFolders(),
  async init() {
    await openDatabase();
  },
  async close() {
    if (!dbPromise) return;
    const db = await dbPromise;
    db.close();
    dbPromise = null;
  },
};
