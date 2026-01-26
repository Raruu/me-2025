import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useState, useCallback, ReactNode } from "react";

interface UseConfirmDialogOptions {
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
  variant?: "default" | "danger" | "warning";
}

export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<UseConfirmDialogOptions>({
    title: "",
    message: "",
  });
  const [resolveRef, setResolveRef] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = useCallback(
    (opts: UseConfirmDialogOptions): Promise<boolean> => {
      setOptions(opts);
      setIsOpen(true);

      return new Promise((resolve) => {
        setResolveRef(() => resolve);
      });
    },
    [],
  );

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolveRef?.(true);
  }, [resolveRef]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolveRef?.(false);
  }, [resolveRef]);

  const DialogComponent = (
    <ConfirmDialog
      isOpen={isOpen}
      title={options.title}
      message={options.message}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
      icon={options.icon}
      variant={options.variant}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirm, DialogComponent };
};
