export interface WorkspaceStorage {
  load: () => string | null;
  save: (serializedState: string) => void;
  clear: () => void;
}

export function createBrowserWorkspaceStorage({
  currentKey,
  legacyKeys = [],
  getStorage,
}: {
  currentKey: string;
  legacyKeys?: string[];
  getStorage: () => Storage;
}): WorkspaceStorage {
  return {
    load() {
      const storage = getStorage();
      return (
        storage.getItem(currentKey) ??
        legacyKeys
          .map((key) => storage.getItem(key))
          .find((value): value is string => value !== null) ??
        null
      );
    },
    save(serializedState) {
      getStorage().setItem(currentKey, serializedState);
    },
    clear() {
      const storage = getStorage();
      storage.removeItem(currentKey);
      legacyKeys.forEach((key) => storage.removeItem(key));
    },
  };
}
