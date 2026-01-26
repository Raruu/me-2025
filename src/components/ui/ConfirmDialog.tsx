import { Icon } from "@iconify/react";
import { useEffect, useRef, ReactNode } from "react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
  variant?: "default" | "danger" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon,
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onCancel();
      } else if (e.key === "Enter") {
        onConfirm();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconBg: "bg-red-100 dark:bg-red-900/30",
          iconColor: "text-red-600 dark:text-red-400",
          confirmBtn:
            "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg",
          defaultIcon: "mdi:alert-circle",
        };
      case "warning":
        return {
          iconBg: "bg-amber-100 dark:bg-amber-900/30",
          iconColor: "text-amber-600 dark:text-amber-400",
          confirmBtn:
            "bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg",
          defaultIcon: "mdi:alert",
        };
      default:
        return {
          iconBg: "bg-primary/10 dark:bg-primary/20",
          iconColor: "text-primary",
          confirmBtn:
            "bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg",
          defaultIcon: "mdi:help-circle",
        };
    }
  };

  const styles = getVariantStyles();
  const displayIcon = icon || styles.defaultIcon;

  return (
    <div
      className="absolute inset-0 z-[9999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Scrim/Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Dialog Container */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative bg-background rounded-3xl shadow-2xl w-[min(90vw,400px)] 
          animate-scale-in overflow-hidden outline-none"
      >
        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center gap-4">
          {/* Icon */}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${styles.iconBg}`}
          >
            <Icon
              icon={displayIcon}
              className={`text-3xl ${styles.iconColor}`}
            />
          </div>

          {/* Title */}
          <h2
            id="dialog-title"
            className="text-xl font-semibold text-foreground"
          >
            {title}
          </h2>

          {/* Message */}
          <p className="text-sm text-foreground/70 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-full text-sm font-medium
              text-foreground/80 hover:bg-foreground/10 
              transition-all duration-200 active:scale-95"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2.5 rounded-full text-sm font-medium
              transition-all duration-200 active:scale-95 ${styles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
