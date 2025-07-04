
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useRealSchoolSettings } from "@/hooks/useRealSchoolSettings";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, User, LogOut, ShieldCheck, Menu, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Header = () => {
  const { settings } = useRealSchoolSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { signOut, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerAvatar, setHeaderAvatar] = useState<string>("");
  
  const userType = localStorage.getItem("userType");
  const isAdminDashboard = location.pathname === "/admin";
  const isAdminAccess = localStorage.getItem("isAdminAccess");
  const adminAccessSchool = localStorage.getItem("adminAccessSchool");

  // إذا كان المدير يدخل على بيانات مدرسة، استخدم بيانات تلك المدرسة
  const currentSchoolData = isAdminAccess === "true" && adminAccessSchool 
    ? JSON.parse(adminAccessSchool) 
    : null;

  // Default logo
  const defaultLogo = "/lovable-uploads/ceeee985-6f40-459e-8179-d315fbab21ab.png";

  // Load avatar immediately from localStorage, then update from database if available
  useEffect(() => {
    // Set default or cached avatar immediately
    const savedAvatar = localStorage.getItem('profile_avatar');
    setHeaderAvatar(savedAvatar || defaultLogo);
    
    // Update with database logo if available (non-blocking)
    if (settings?.logo_url) {
      setHeaderAvatar(settings.logo_url);
    }
  }, [settings]);

  // Listen for avatar changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      if (!settings?.logo_url) {
        const savedAvatar = localStorage.getItem('profile_avatar');
        setHeaderAvatar(savedAvatar || defaultLogo);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [settings]);

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
    // إزالة بيانات الوصول الإداري والعودة للوحة التحكم
    localStorage.removeItem("isAdminAccess");
    localStorage.removeItem("adminAccessSchool");
    
    toast({
      title: "تم العودة للوحة التحكم",
      description: "أنت الآن في وضع المدير العام",
    });
    
    navigate("/admin");
  };

  const hiddenHeaderPaths = ["/", "/auth", "/login", "/admin-login", "/school-login"];
  const isHeaderHidden = hiddenHeaderPaths.some(path => location.pathname === path);
  
  if (isHeaderHidden) {
    return null;
  }
  

  // Show header immediately - don't wait for loading to complete
  // استخدام بيانات المدرسة الحالية (من قاعدة البيانات أو من الوصول الإداري أو من المستخدم)
  const getDisplaySchoolName = () => {
    if (currentSchoolData) {
      return currentSchoolData.name;
    }
    if (settings?.school_name) {
      return settings.school_name;
    }
    if (user?.user_metadata?.school_name) {
      return user.user_metadata.school_name;
    }
    return user?.email?.split('@')[0] || 'مدرستي';
  };

  const displaySchoolName = getDisplaySchoolName();

  return (
<header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-gradient-to-r from-[#15445A]/95 via-[#3D7EB9]/90 to-[#0DA9A6]/85 shadow-lg" dir="rtl">
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50"></div>

  <div className="container mx-auto px-4 sm:px-6 relative z-10">
    <div className="flex justify-between items-center py-3 sm:py-4">
      {/* شعار المدرسة */}
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <div className="relative group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white rounded-xl flex items-center justify-center shadow-xl border border-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl overflow-hidden">
            <img 
              src={headerAvatar} 
              alt="شعار المدرسة" 
              className="w-full h-full object-cover rounded-xl"
            />
            <Sparkles className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 animate-pulse" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-0 sm:mb-1 tracking-wide truncate">
            {displaySchoolName}
          </h1>
          <p className="text-xs sm:text-sm text-gray-200/90 font-medium hidden sm:block">منصة حاضرون التعليمية</p>
          {isAdminAccess === "true" && (
            <Badge className="bg-[#F4A261]/80 text-[#D9822B] text-xs mt-1 flex items-center gap-1 w-fit">
              <ShieldCheck className="w-3 h-3" />
              <span className="hidden sm:inline">وضع المدير</span>
              <span className="sm:hidden">مدير</span>
            </Badge>
          )}
        </div>
      </div>

      {/* أزرار سطح المكتب */}
      <div className="hidden md:flex items-center gap-2 lg:gap-3">
        <Link to="/profile">
          <Button variant="outline" size="sm" className="flex items-center gap-1.5 lg:gap-2 border-white/30 bg-[#15445A]/30 text-white hover:bg-[#15445A]/50 transition-all duration-300 backdrop-blur-sm text-xs px-3 lg:px-4 py-2 rounded-xl shadow-lg hover:shadow-xl">
            <User className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden lg:inline">حسابي</span>
          </Button>
        </Link>

        <Link to="/school/">
          <Button variant="outline" size="sm" className="flex items-center gap-1.5 lg:gap-2 border-white/30 bg-[#3D7EB9]/30 text-white hover:bg-[#3D7EB9]/50 transition-all duration-300 backdrop-blur-sm text-xs px-3 lg:px-4 py-2 rounded-xl shadow-lg hover:shadow-xl">
            <Home className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden lg:inline">الرئيسية</span>
          </Button>
        </Link>

        {isAdminAccess === "true" && (
          <Button
            onClick={handleReturnToAdminDashboard}
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 lg:gap-2 border-[#F4A261]/50 bg-[#F4A261]/10 text-[#D9822B] hover:bg-[#F4A261]/20 transition-all duration-300 backdrop-blur-sm text-xs px-3 lg:px-4 py-2 rounded-xl shadow-lg hover:shadow-xl"
          >
            <ShieldCheck className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden lg:inline">العودة للوحة التحكم</span>
            <span className="lg:hidden">وحة التحكم</span>
          </Button>
        )}

        <Button 
          onClick={handleLogout} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1.5 lg:gap-2 border-[#E05B5B]/50 text-[#E05B5B] hover:bg-[#E05B5B]/20 transition-all duration-300 backdrop-blur-sm text-xs px-3 lg:px-4 py-2 rounded-xl shadow-lg hover:shadow-xl"
        >
          <LogOut className="h-3 w-3 lg:h-4 lg:w-4" />
          <span className="hidden lg:inline">خروج</span>
        </Button>
      </div>

      {/* زر القائمة للموبايل */}
      <Button
        variant="outline"
        size="sm"
        className="md:hidden border-white/30 hover:bg-white/10 backdrop-blur-sm p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-4 w-4 text-white stroke-2" />
      </Button>
    </div>

    {/* قائمة الموبايل */}
    {isMobileMenuOpen && (
      <div className="md:hidden border-t border-white/20 py-4">
        <div className="flex flex-col gap-2">
          <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2 border-white/30 bg-[#15445A]/30 text-white hover:bg-[#15445A]/50 backdrop-blur-sm text-xs">
              <User className="h-4 w-4" />
              حسابي
            </Button>
          </Link>

          <Link to="/school" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2 border-white/30 bg-[#3D7EB9]/30 text-white hover:bg-[#3D7EB9]/50 backdrop-blur-sm text-xs">
              <Home className="h-4 w-4" />
              الرئيسية
            </Button>
          </Link>

          {isAdminAccess === "true" && (
            <Button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleReturnToAdminDashboard();
              }}
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 border-[#F4A261]/50 bg-[#F4A261]/10 text-[#D9822B] hover:bg-[#F4A261]/20 backdrop-blur-sm text-xs"
            >
              <ShieldCheck className="h-4 w-4" />
              العودة للوحة التحكم
            </Button>
          )}

          <Button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }} 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-2 border-[#E05B5B]/50 text-[#E05B5B] hover:bg-[#E05B5B]/20 backdrop-blur-sm text-xs"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </div>
    )}
  </div>
</header>

  );
};

export default Header;
