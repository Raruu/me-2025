export const SettingTextField = ({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string;
  subtitle?: string;
  value?: string;
  onChange?: (value: string) => void;
}) => {
  return (
    <div className="flex flex-row items-center justify-between w-full ">
      <div className="flex flex-col items-start justify-center">
        <h1 className="text-base font-semibold pointer-events-none">{title}</h1>
        {subtitle && <h5 className="text-sm leading-4 opacity-60">{subtitle}</h5>}
      </div>
      <div className="relative w-20 mr-2">
        <input
          type="text"
          className="w-full bg-background px-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-center"
          onChange={(e) => onChange?.(e.target.value)}
          value={value}
        />
      </div>
    </div>
  );
};
