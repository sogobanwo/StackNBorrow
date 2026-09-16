"use client";

export default function DemoModeToggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      aria-pressed={enabled}
      className={
        enabled
          ? "flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-white"
          : "flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-xs font-medium text-slate-300"
      }
    >
      Demo Mode
      <span className="flex h-4 w-7 items-center rounded-full bg-white/20 p-0.5">
        <span
          className={
            enabled
              ? "h-3 w-3 translate-x-3 rounded-full bg-white transition-transform"
              : "h-3 w-3 translate-x-0 rounded-full bg-white transition-transform"
          }
        />
      </span>
    </button>
  );
}
