'use client'
import { ReactNode } from "react";
// import { Sidebar } from "@/components/sidebar";
// import { Header } from "@/components/header";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { useAuth } from "@/app/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!isLoading) {
        if (!userId) {
          router.push('/login');
          return;
        }

        try {
          const response = await fetch('/api/user/me');
          const data = await response.json();
          
          if (data.email !== 'admin@example.com') {
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Error checking admin access:', error);
          router.push('/dashboard');
        }
      }
    };

    checkAdminAccess();
  }, [userId, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
// export default function AdminLayout({ children }: AdminLayoutProps) {
  
//   return <>{children}</>;
// }