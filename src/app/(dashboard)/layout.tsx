import AdminSidebar from "@/components/AdminSidebar";
import TopBar from "@/components/Topbar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar title="Dashboard" />

          <div className={cn("flex-1 overflow-y-auto p-6 bg-background")}>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
