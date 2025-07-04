
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Camera } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRealSchoolSettings } from "@/hooks/useRealSchoolSettings";

const ProfileHeader = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { settings } = useRealSchoolSettings();
  const [avatar, setAvatar] = useState<string>("");

  // Default logo
  const defaultLogo = "/lovable-uploads/ceeee985-6f40-459e-8179-d315fbab21ab.png";

  // Load avatar from localStorage on component mount
  useEffect(() => {
    const savedAvatar = localStorage.getItem('profile_avatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    } else {
      setAvatar(defaultLogo);
    }
  }, []);

  // Save avatar to localStorage whenever it changes
  useEffect(() => {
    if (avatar) {
      localStorage.setItem('profile_avatar', avatar);
      // Trigger a custom event to notify other components
      window.dispatchEvent(new Event('storage'));
    }
  }, [avatar]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatar(result);
        toast({
          title: "تم الحفظ بنجاح",
          description: "تم تحديث الصورة الشخصية بنجاح",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // الحصول على اسم المدرسة الحقيقي من الإعدادات أو من بيانات المستخدم
  const getSchoolName = () => {
    if (settings?.school_name) {
      return settings.school_name;
    }
    return user?.user_metadata?.school_name || user?.email?.split('@')[0] || 'مدرستي';
  };

  const schoolName = getSchoolName();

  return (
    <Card className="backdrop-blur-xl bg-white/90 shadow-xl border-0 rounded-2xl">
      <CardHeader className="text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-school-green/20">
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-white text-school-navy text-2xl p-2">
                <img 
                  src={defaultLogo} 
                  alt="شعار المدرسة" 
                  className="w-full h-full object-cover"
                />
              </AvatarFallback>
            </Avatar>
            <label className="absolute bottom-0 right-0 bg-school-green hover:bg-school-green/90 text-white p-2 rounded-full cursor-pointer transition-colors">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <CardTitle className="text-xl text-school-navy text-center" dir="rtl">
              {schoolName}
            </CardTitle>
            <CardDescription className="text-school-navy/70 text-center">
              حساب إدارة المدرسة
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProfileHeader;
