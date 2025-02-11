// layout.tsx
import { ReactNode } from "react";
// import { Sidebar } from "@/components/sidebar";
// import { Header } from "@/components/header";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background/95 backdrop-blur-lg">
      <AdminSidebar />
      <div className="lg:ml-72 transition-all duration-300">
        <AdminHeader />
        <main className="p-6 lg:p-8 min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}