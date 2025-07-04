import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import { supabase } from "@/integrations/supabase/client";
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { AppSidebar } from "./AppSidebar";
import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const LayoutContent = ({ children }: LayoutProps) => {
  const location = useLocation();
  const hideSidebarRoutes = ["/", "/auth", "/login", "/register", "/admin-login", "/school-login"];
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  const { user } = useAuth();
  const { subscriptionStatus } = useSubscriptionStatus();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const getUserRole = async () => {
      if (user) {
        const { data: profile } = await supabase.auth.getUser();
        if (profile.user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", profile.user.id)
            .single();

          setUserRole(profileData?.role || "school");
        }
      }
    };

    getUserRole();
  }, [user]);

  // ✅ تخطيط المدير (Admin) بدون Sidebar
  if (userRole === "admin") {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // ✅ إذا الاشتراك غير فعال
  if (userRole === "school" && subscriptionStatus && !subscriptionStatus.is_active) {
    return <>{children}</>;
  }

  // ✅ صفحات تسجيل الدخول بدون Sidebar وخلفيات
  if (hideSidebar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden" dir="rtl">
        <main className="flex items-center justify-center min-h-screen w-screen p-4">{children}</main>
      </div>
    );
  }

  // ✅ التخطيط الكامل الثابت مع Sidebar
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden" dir="rtl">
      {/* الخلفيات */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-school-green to-school-teal rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-64 h-64 bg-gradient-to-br from-school-blue to-school-navy rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-80 h-80 bg-gradient-to-br from-school-teal to-school-green rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-16 w-48 h-48 bg-gradient-to-br from-school-navy to-school-blue rounded-full blur-xl animate-pulse delay-[1500ms]"></div>
      </div>

      {/* تخطيط المحتوى مع الهيدر والفوتر الثابتين */}
      <div className="relative min-h-screen w-full z-0">
        <div className={`min-h-screen w-full transition-all duration-300 ease-in-out ${hideSidebar ? '' : 'pr-64'}`}>

          {/* Header ثابت */}
          <Header className="fixed top-0 left-0 w-full z-50" />
          
          {/* المحتوى الرئيسي */}
          <main className="flex-1 mt-16 mb-20 p-4">
            <div className="max-w-full">{children}</div>
          </main>

          {/* Footer ثابت */}
          <Footer className="fixed bottom-0 left-0 w-full z-50" />
        </div>

        <AppSidebar />
      </div>
    </div>
  );
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
};

export default Layout;
