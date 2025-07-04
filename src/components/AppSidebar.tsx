
import { Home, Settings, Users, ClipboardCheck, FileText, User, LogOut, ShieldCheck, Clock, Edit } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();
const hideSidebarRoutes = ["/", "/auth", "/login", "/register", "/admin-login", "/school-login"];
const hideSidebar = hideSidebarRoutes.includes(location.pathname);
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  if (hideSidebar) return null; 
  const isAdminAccess = localStorage.getItem("isAdminAccess");

  const navigationItems = [
    { path: "/school", label: "الرئيسية", icon: Home },
    { path: "/school/school-settings", label: "الإعدادات", icon: Settings },
    { path: "/school/students", label: "إدارة الطلاب", icon: Users },
    { path: "/school/attendance", label: "تسجيل الحضور", icon: ClipboardCheck },
    { path: "/school/late-attendance", label: "تسجيل التأخر", icon: Clock },
    { path: "/school/reports", label: "التقارير", icon: FileText },
  ];

  const adminNavigationItems = [
    { path: "/admin", label: "لوحة التحكم", icon: ShieldCheck },
    { path: "/content-management", label: "إدارة المحتوى", icon: Edit },
  ];

  const currentItems = isAdminAccess === "true" ? adminNavigationItems : navigationItems;

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "خطأ في تسجيل الخروج",
        description: "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive"
      });
    }
  };

  const handleReturnToAdminDashboard = () => {
    localStorage.removeItem("isAdminAccess");
    localStorage.removeItem("adminAccessSchool");
    
    toast({
      title: "تم العودة للوحة التحكم",
      description: "أنت الآن في وضع المدير العام",
    });
    
    navigate("/admin");
  };

  return (
    <Sidebar
    className="fixed top-0 right-0 w-64 z-50 border-l border-slate-200 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-600 shadow-xl"
    side="right"
    collapsible={false}
  >
      <SidebarHeader className="p-6 border-b border-white/20 bg-gradient-to-r from-slate-800/80 to-slate-700/80" dir="rtl">
        <div className="text-right">
          <h2 className="text-white text-xl font-bold mb-1">القائمة الرئيسية</h2>
          <p className="text-slate-200 text-sm font-medium">منصة حاضرون التعليمية</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 bg-gradient-to-b from-slate-700/90 to-slate-600/90" dir="rtl">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-200 text-base font-semibold mb-3 text-right">التنقل</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {currentItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    className={`text-slate-200 hover:bg-slate-600/60 hover:text-white transition-all duration-200 h-12 text-base font-medium ${
                      location.pathname === item.path 
                        ? "bg-slate-600/80 text-white font-semibold border-l-2 border-school-teal shadow-lg" 
                        : ""
                    }`}
                  >
                    <Link to={item.path} className="flex items-center gap-3 w-full px-4" dir="rtl">
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-right flex-1">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/20 bg-gradient-to-r from-slate-800/80 to-slate-700/80" dir="rtl">
        <SidebarMenu className="space-y-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-slate-200 hover:bg-slate-600/60 hover:text-white h-12 text-base font-medium transition-all duration-200">
              <Link to="/school/profile" className="flex items-center gap-3 w-full px-4" dir="rtl">
                <User className="h-5 w-5 flex-shrink-0" />
                <span className="text-right flex-1">حسابي</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {isAdminAccess === "true" && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={handleReturnToAdminDashboard}
                className="text-yellow-200 hover:bg-yellow-500/30 hover:text-yellow-100 h-12 text-base font-medium transition-all duration-200"
              >
                <div className="flex items-center gap-3 w-full px-4" dir="rtl">
                  <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                  <span className="text-right flex-1">العودة للوحة التحكم</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="text-red-200 hover:bg-red-500/30 hover:text-red-100 h-12 text-base font-medium transition-all duration-200"
            >
              <div className="flex items-center gap-3 w-full px-4" dir="rtl">
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <span className="text-right flex-1">تسجيل الخروج</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
