import { DBSchema, openDB } from "idb";

export interface FileSystemDB extends DBSchema {
  files: {
    key: string;
    value: {
      id: string;
      name: string;
      folderId: string;
      blob: Blob;
    };
    indexes: {
      byFolderId: string;
    };
  };
  folders: {
    key: string;
    value: {
      id: string;
      name: string;
      parentId?: string;
    };
    indexes: {
      byParentId: string;
    };
  };
}

const dbPromise = globalThis.indexedDB
  ? openDB<FileSystemDB>("fileSystem", 1, {
      upgrade(db) {
        db.createObjectStore("files", { keyPath: "id" }).createIndex(
          "byFolderId",
          "folderId",
        );
        db.createObjectStore("folders", { keyPath: "id" }).createIndex(
          "byParentId",
          "parentId",
        );
      },
    })
  : null;

export const initFileSystem = async () => {
  const dbPromise = openDB<FileSystemDB>("fileSystem", 1, {
    upgrade(db) {
      db.createObjectStore("files", { keyPath: "id" }).createIndex(
        "byFolderId",
        "folderId",
      );
      db.createObjectStore("folders", { keyPath: "id" }).createIndex(
        "byParentId",
        "parentId",
      );
    },
  });

  const db = await dbPromise;
  const root = await db.get("folders", "root");
  if (!root) {
    db.put("folders", { id: "root", name: "root" });
  }
  const etc = await db.get("folders", "etc");
  if (!etc) {
    db.put("folders", { id: "etc", name: "etc", parentId: "root" });
  }
  const home = await db.get("folders", "home");
  if (!home) {
    db.put("folders", { id: "home", name: "home", parentId: "root" });
  }
  const azoosaHome = await db.get("folders", "homeAzusa");
  if (!azoosaHome) {
    db.put("folders", { id: "homeAzusa", name: "Azusa", parentId: "home" });
  }
  const azusaLocal = await db.get("folders", "azusaLocal");
  if (!azusaLocal) {
    db.put("folders", {
      id: "azusaLocal",
      name: ".local",
      parentId: "homeAzusa",
    });
  }
  const azusaLocalShare = await db.get("folders", "azusaLocalShare");
  if (!azusaLocalShare) {
    db.put("folders", {
      id: "azusaLocalShare",
      name: "share",
      parentId: "azusaLocal",
    });
  }
  const azusaEnvironment = await db.get("folders", "azusaEnvironment");
  if (!azusaEnvironment) {
    db.put("folders", {
      id: "azusaEnvironment",
      name: "azusaEnvironment",
      parentId: "azusaLocalShare",
    });
  }

  return true;
};

export const db = {
  async createFolder(name: string, parentId?: string) {
    parentId = parentId ?? "root";
    const db = await dbPromise;
    if (!db) throw new Error("DB is not ready");
    const id = Date.now().toString();
    db.put("folders", { id, name, parentId });
  },

  async loadFolder(id: string) {
    const db = await dbPromise;
    if (!db) throw new Error("DB is not ready");
    return db.get("folders", id);
  },

  async loadChildren(
    parentId: string = "root",
    type: "ALL" | "FOLDER" | "FILE" = "ALL",
  ) {
    const db = await dbPromise;
    if (!db) throw new Error("DB is not ready");
    return [
      ...(type === "ALL" || type === "FOLDER"
        ? await db.getAllFromIndex("folders", "byParentId", parentId)
        : []),
      ...(type === "ALL" || type === "FILE"
        ? await db.getAllFromIndex("files", "byFolderId", parentId)
        : []),
    ];
  },

  async deleteFolder(id: string) {
    const db = await dbPromise;
    if (!db) throw new Error("DB is not ready");
    db.delete("folders", id);
  },

  async loadFile(id: string) {
    const db = await dbPromise;
    if (!db) throw new Error("DB is not ready");
    return db.get("files", id);
  },

  async saveFile(id: string, name: string, folderId: string, blob: Blob) {
    const db = await dbPromise;
    if (!db) throw new Error("DB is not ready");
    db.put("files", { id, name, folderId, blob });
  },

  async deleteFile(id: string) {
    const db = await dbPromise;
    if (!db) throw new Error("DB is not ready");
    db.delete("files", id);
  },
};

export const getIndexedDBSize = async (): Promise<number> => {
  try {
    const dbRequest = indexedDB.open("fileSystem", 1);
    return new Promise((resolve, reject) => {
      dbRequest.onsuccess = () => {
        const db = dbRequest.result;
        let totalSize = 0;
        const stores = ["files", "folders"];
        let completed = 0;

        stores.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            completed++;
            if (completed === stores.length) {
              db.close();
              resolve(totalSize);
            }
            return;
          }

          const transaction = db.transaction([storeName], "readonly");
          const store = transaction.objectStore(storeName);
          const getAllRequest = store.getAll();

          getAllRequest.onsuccess = () => {
            const data = getAllRequest.result;
            const jsonSize = new Blob([JSON.stringify(data)]).size;
            totalSize += jsonSize;
            completed++;
            if (completed === stores.length) {
              db.close();
              resolve(totalSize);
            }
          };

          getAllRequest.onerror = () => {
            completed++;
            if (completed === stores.length) {
              db.close();
              resolve(totalSize);
            }
          };
        });
      };

      dbRequest.onerror = () => reject(0);
    });
  } catch (error) {
    return 0;
  }
};
