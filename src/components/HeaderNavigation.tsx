
import { Link, useLocation } from "react-router-dom";
import { Home, Settings, Users, ClipboardCheck, FileText, Clock } from "lucide-react";

const HeaderNavigation = () => {
  const location = useLocation();

  const navigationItems = [
    { path: "/school/", label: "الرئيسية", icon: Home },
    { path: "/school/school-settings", label: "الإعدادات", icon: Settings },
    { path: "/school/students", label: "إدارة الطلاب", icon: Users },
    { path: "/school/attendance", label: "تسجيل الحضور", icon: ClipboardCheck },
    { path: "/school/late-attendance", label: "تسجيل التأخر", icon: Clock },
    { path: "/school/reports", label: "التقارير", icon: FileText },
  ];

  return (
    <nav className="hidden md:flex items-center gap-1 overflow-x-auto scrollbar-hide">
      {navigationItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-lg transition-all duration-300 font-medium text-xs sm:text-sm relative overflow-hidden group flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${
            location.pathname === item.path
              ? "bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30"
              : "text-gray-200 hover:bg-white/10 hover:text-white backdrop-blur-sm border border-transparent hover:border-white/20"
          }`}
        >
          <item.icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="relative z-10 hidden sm:inline">{item.label}</span>
          <span className="relative z-10 sm:hidden text-xs">{item.label.split(' ')[0]}</span>
          {location.pathname !== item.path && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default HeaderNavigation;
