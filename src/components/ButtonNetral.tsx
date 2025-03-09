export const ButtonNetral = ({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;
}) => {
  return (
    <button
      className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors
        dark:bg-slate-50 dark:hover:bg-slate-300 dark:bg-opacity-25 dark:hover:bg-opacity-25 px-4 py-2 rounded-xl"
      onClick={onClick}
    >
      {text}
    </button>
  );
};
