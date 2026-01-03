export const SettingGroup = ({
  title,
  subtitle,
  children,
  badge,
  hideBackground,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
  hideBackground?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-0.5 w-full">
      {(title || subtitle) && (
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col px-0.5">
            {title && (
              <h2
                className="text-lg font-bold"
                style={{ lineHeight: subtitle ? 0.9 : "" }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-foreground opacity-65">{subtitle}</p>
            )}
          </div>
          {badge}
        </div>
      )}

      <div
        className={`w-full flex flex-col gap-2 rounded-lg px-4 py-2 ${
          hideBackground
            ? ""
            : "bg-background border border-secondary dark:border-gray-500"
        }`}
      >
        {children}
      </div>
    </div>
  );
};
