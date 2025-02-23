"use client";

export function Toast({ message, type = "positive" }) {
  const bgColor =
    {
      positive: "bg-emerald-500 dark:bg-emerald-400",
      negative: "bg-rose-500 dark:bg-rose-400",
    }[type] || "bg-gray-900 dark:bg-white";

  const textColor = "text-white dark:text-gray-900";

  const borderColor =
    {
      positive: "border-emerald-600 dark:border-emerald-300",
      negative: "border-rose-600 dark:border-rose-300",
    }[type] || "border-gray-800 dark:border-white";

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 ${bgColor} ${textColor} px-4 py-2.5 rounded-lg shadow-lg border ${borderColor} animate-[fade-in_0.2s_ease-out] animate-[slide-in-from-top_0.2s_ease-out] z-50`}
    >
      {type === "positive" ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          aria-hidden="true"
          className="flex-shrink-0"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          aria-hidden="true"
          className="flex-shrink-0"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )}
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
}
