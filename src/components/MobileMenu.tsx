
import { Button } from "@/components/ui/button";
import { Menu, ShieldCheck, User, LogOut, Home, Settings, Users, ClipboardCheck, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isAdminAccess: string | null;
  handleReturnToAdminDashboard: () => void;
  handleLogout: () => void;
}

const MobileMenu = ({ 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  isAdminAccess, 
  handleReturnToAdminDashboard, 
  handleLogout 
}: MobileMenuProps) => {
  const location = useLocation();

  const navigationItems = [
    { path: "/school/", label: "الرئيسية", icon: Home },
    { path: "/school/school-settings", label: "الإعدادات", icon: Settings },
    { path: "/school/students", label: "إدارة الطلاب", icon: Users },
    { path: "/school/attendance", label: "تسجيل الحضور", icon: ClipboardCheck },
    { path: "/school/reports", label: "التقارير", icon: FileText },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="sm"
        className="md:hidden border-white/30 hover:bg-white/10 backdrop-blur-sm p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-4 w-4 text-blue-800 stroke-2" />
      </Button>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden border-t border-white/20 backdrop-blur-xl bg-gradient-to-r from-school-navy/95 via-school-blue/90 to-school-teal/85 shadow-lg z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-all duration-300 text-sm flex items-center gap-3 ${
                    location.pathname === item.path
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-gray-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/20">
                {isAdminAccess === "true" ? (
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleReturnToAdminDashboard();
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2 border-yellow-300/50 bg-yellow-500/10 text-yellow-200 hover:bg-yellow-500/20 backdrop-blur-sm text-xs"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    العودة للوحة التحكم
                  </Button>
                ) : (
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm text-xs">
                      <User className="h-4 w-4" />
                      حسابي
                    </Button>
                  </Link>
                )}
                
                <Button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }} 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start gap-2 border-red-300/50 text-red-200 hover:bg-red-500/20 backdrop-blur-sm text-xs"
                >
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
