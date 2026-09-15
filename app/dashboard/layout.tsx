import DashboardSidebar from "@/app/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-page">
      <div className="flex flex-col lg:flex-row lg:min-h-screen">
        <DashboardSidebar />
        <div className="min-w-0 flex-1 bg-card px-6 py-7 sm:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
