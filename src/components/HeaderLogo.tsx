
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import { useRealSchoolSettings } from "@/hooks/useRealSchoolSettings";
import { useAuth } from "@/hooks/useAuth";

interface HeaderLogoProps {
  displaySchoolName: string;
  headerAvatar?: string;
  isAdminAccess: string | null;
}

const HeaderLogo = ({ displaySchoolName, headerAvatar, isAdminAccess }: HeaderLogoProps) => {
  const { settings } = useRealSchoolSettings();
  const { user } = useAuth();

  // Default logo
  const defaultLogo = "/lovable-uploads/ceeee985-6f40-459e-8179-d315fbab21ab.png";

  // الحصول على اسم المدرسة الحقيقي
  const getActualSchoolName = () => {
    if (settings?.school_name) {
      return settings.school_name;
    }
    if (user?.user_metadata?.school_name) {
      return user.user_metadata.school_name;
    }
    return displaySchoolName || 'مدرستي';
  };

  const actualSchoolName = getActualSchoolName();
  const logoUrl = headerAvatar || defaultLogo;

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <div className="relative group">
        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white rounded-xl flex items-center justify-center shadow-xl border border-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl overflow-hidden">
          <img 
            src={logoUrl} 
            alt="شعار المدرسة" 
            className="w-full h-full object-cover rounded-xl"
          />
          <Sparkles className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 animate-pulse" />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-0 sm:mb-1 tracking-wide truncate" dir="rtl">
          {actualSchoolName}
        </h1>
        <p className="text-xs sm:text-sm text-gray-200/90 font-medium hidden sm:block">منصة حاضرون التعليمية</p>
        {isAdminAccess === "true" && (
          <Badge className="bg-yellow-500/80 text-yellow-900 text-xs mt-1 flex items-center gap-1 w-fit">
            <ShieldCheck className="w-3 h-3" />
            <span className="hidden sm:inline">وضع المدير</span>
            <span className="sm:hidden">مدير</span>
          </Badge>
        )}
      </div>
    </div>
  );
};

export default HeaderLogo;
