import { BellIcon } from "../icons";

export default function DashboardTopBar({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 className="text-xl font-semibold text-heading">{title}</h3>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-xs font-medium text-slate-300">
          Dark Mode
          <span className="flex h-4 w-7 items-center rounded-full bg-primary p-0.5">
            <span className="h-3 w-3 rounded-full bg-white" />
          </span>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-muted">
          <BellIcon className="h-4 w-4" />
        </span>
        <span className="h-9 w-9 rounded-full bg-primary" />
      </div>
    </div>
  );
}
