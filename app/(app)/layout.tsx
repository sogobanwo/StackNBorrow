import DashboardSidebar from "@/app/components/dashboard/DashboardSidebar";
import DashboardPageTransition from "@/app/components/dashboard/DashboardPageTransition";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-page">
      <div className="flex flex-col lg:flex-row lg:min-h-screen">
        <DashboardSidebar />
        <div className="min-w-0 flex-1 bg-card px-6 py-7 sm:px-8">
          <DashboardPageTransition>{children}</DashboardPageTransition>
        </div>
      </div>
    </div>
  );
}
