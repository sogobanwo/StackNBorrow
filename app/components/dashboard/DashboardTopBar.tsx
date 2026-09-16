export default function DashboardTopBar({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 className="text-xl font-semibold text-heading">{title}</h3>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
      {actions}
    </div>
  );
}
