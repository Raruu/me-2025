import { useEffect, useState } from "react";
import { SettingNavItemProps } from "..";
import { SettingGroup } from "../SettingGroup";
import { ButtonNetral } from "@/components/ButtonNetral";
import { getIndexedDBSize, initFileSystem } from "@/lib/db";
import { Icon } from "@iconify/react";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";

export const settingItemStorage: SettingNavItemProps = {
  title: "Storage",
  icon: "mdi:database",
  content: <StorageSettings />,
};

function StorageSettings() {
  const [totalStorage, setTotalStorage] = useState<number>(0);
  const [usedStorage, setUsedStorage] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { confirm, DialogComponent } = useConfirmDialog();

  const calculateStorage = async () => {
    setLoading(true);
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        const usage = estimate.usage || 0;
        const quota = estimate.quota || 0;

        setUsedStorage(usage);
        setTotalStorage(quota);
      } else {
        const db = await getIndexedDBSize();
        setUsedStorage(db);
        setTotalStorage(0); // Unknown quota
      }
    } catch (error) {
      console.error("Error calculating storage:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleResetStorage = async () => {
    const confirmed = await confirm({
      title: "Reset Storage",
      message: (
        <>
          Are you sure you want to reset storage?<br></br> This will clear all
          data and reinitialize the file system.
        </>
      ),
      confirmText: "Reset",
      cancelText: "Cancel",
      variant: "warning",
      icon: "mdi:database-refresh",
    });

    if (confirmed) {
      try {
        await deleteDatabase();
      } catch (error) {
      } finally {
        window.location.reload();
      }
    }
  };

  const handleDeleteStorage = async () => {
    const confirmed = await confirm({
      title: "Delete Storage",
      message: (
        <>
          Are you sure you want to delete all storage? <br></br> This action
          cannot be undone!
        </>
      ),
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
      icon: "mdi:database-remove",
    });

    if (confirmed) {
      try {
        await deleteDatabase();
      } catch (error) {
      } finally {
        window.close();
      }
    }
  };

  const deleteDatabase = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase("fileSystem");
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () =>
        reject(new Error("Failed to delete database"));
      deleteRequest.onblocked = () => resolve();
    });
  };

  useEffect(() => {
    calculateStorage();
  }, []);

  const usagePercentage =
    totalStorage > 0 ? (usedStorage / totalStorage) * 100 : 0;

  return (
    <>
      {DialogComponent}
      <div className="flex flex-col w-full h-full overflow-y-auto gap-4">
        <SettingGroup
          title="Storage Information"
          badge={
            <button
              onClick={calculateStorage}
              className={`p-1 rounded transition-colors hover:bg-primary hover:text-white`}
              title="Refresh"
            >
              <Icon
                icon="material-symbols:refresh-rounded"
                className="text-xl"
              />
            </button>
          }
        >
          <div className="flex flex-col gap-4 py-4 rounded-lg">
            {loading ? (
              <div className="text-sm opacity-65">Loading...</div>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Storage:</span>
                    <span className="text-sm">
                      {totalStorage > 0 ? formatBytes(totalStorage) : "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Used Storage:</span>
                    <span className="text-sm">{formatBytes(usedStorage)}</span>
                  </div>
                  {totalStorage > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Available:</span>
                      <span className="text-sm">
                        {formatBytes(totalStorage - usedStorage)}
                      </span>
                    </div>
                  )}
                </div>

                {totalStorage > 0 && (
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs opacity-65">Usage</span>
                      <span className="text-xs opacity-65">
                        {usagePercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </SettingGroup>

        <SettingGroup
          title="Storage Actions"
          subtitle="Manage your application storage"
        >
          <div className="flex flex-col gap-3 py-4 rounded-lg">
            <div className="flex flex-col gap-2">
              <ButtonNetral text="Reset" onClick={handleResetStorage} />
              <p className="text-xs opacity-65 px-1">
                Clear all data and reload the application
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <ButtonNetral
                text="Delete and Close"
                onClick={handleDeleteStorage}
              />
              <p className="text-xs opacity-65 px-1">
                Clear all data and close the application
              </p>
            </div>
          </div>
        </SettingGroup>
      </div>
    </>
  );
}
