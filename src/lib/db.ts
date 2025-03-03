import { DBSchema, openDB } from "idb";

interface FileSystemDB extends DBSchema {
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
          "folderId"
        );
        db.createObjectStore("folders", { keyPath: "id" }).createIndex(
          "byParentId",
          "parentId"
        );
      },
    })
  : null;

export const initFileSystem = async () => {
  const dbPromise = openDB<FileSystemDB>("fileSystem", 1, {
    upgrade(db) {
      db.createObjectStore("files", { keyPath: "id" }).createIndex(
        "byFolderId",
        "folderId"
      );
      db.createObjectStore("folders", { keyPath: "id" }).createIndex(
        "byParentId",
        "parentId"
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
};

export const db = {
  async createFolder(name: string, parentId?: string) {
    parentId = parentId ?? "root";
    const db = await dbPromise;
    if (!db) return;
    const id = Date.now().toString();
    db.put("folders", { id, name, parentId });
  },

  async loadFolderChildren(parentId: string = "root") {
    const db = await dbPromise;
    if (!db) return;
    return db.getAllFromIndex("folders", "byParentId", parentId);
  },

  async deleteFolder(id: string) {
    const db = await dbPromise;
    if (!db) return;
    db.delete("folders", id);
  },

  async loadFile(id: string) {
    const db = await dbPromise;
    if (!db) return;
    return db.get("files", id);
  },

  async saveFile(id: string, name: string, folderId: string, blob: Blob) {
    const db = await dbPromise;
    if (!db) return;
    db.put("files", { id, name, folderId, blob });
  },

  async deleteFile(id: string) {
    const db = await dbPromise;
    if (!db) return;
    db.delete("files", id);
  },
};
