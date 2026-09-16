"use client";

export default function EmptyStateAction({
  title,
  body,
  actionLabel,
  onAction,
  disabled,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
      <p className="text-sm font-medium text-heading">{title}</p>
      <p className="mt-1 max-w-56 text-xs text-faint">{body}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          disabled={disabled}
          onClick={onAction}
          className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
