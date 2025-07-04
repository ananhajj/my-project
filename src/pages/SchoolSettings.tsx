
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRealSchoolSettings } from '@/hooks/useRealSchoolSettings';
import { useStageOrdering } from '@/hooks/useStageOrdering';
import { supabase } from '@/integrations/supabase/client';
import { SchoolSettingsHeader } from '@/components/school-settings/SchoolSettingsHeader';
import { SchoolSettingsTabs } from '@/components/school-settings/SchoolSettingsTabs';
import { UserRoleGuard } from '@/components/school-settings/UserRoleGuard';
import { SchoolSettingsLoading } from '@/components/school-settings/SchoolSettingsLoading';

const SchoolSettings = () => {
  const { settings, loading, updateSettings } = useRealSchoolSettings();
  const { toast } = useToast();
  const [tempSchoolName, setTempSchoolName] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const orderedStages = useStageOrdering(settings?.stages);

  // التحقق من نوع المستخدم
  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setUserRole(profile?.role || null);
      }
    };

    checkUserRole();
  }, []);

  // تحديث اسم المدرسة المؤقت عند تحميل الإعدادات
  useEffect(() => {
    if (settings?.school_name) {
      setTempSchoolName(settings.school_name);
    }
  }, [settings?.school_name]);

  const handleSaveSettings = async () => {
    // نتأكد من عدم إزالة المسافات المهمة، فقط إزالة المسافات الزائدة في البداية والنهاية
    const trimmedName = tempSchoolName.trim();
    if (trimmedName) {
      console.log('حفظ اسم المدرسة:', trimmedName);
      await updateSettings({ school_name: trimmedName });
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث اسم المدرسة بنجاح",
      });
    }
  };

  if (loading) {
    return <SchoolSettingsLoading />;
  }

  // Check for role guards
  const roleGuard = UserRoleGuard({ userRole, hasSettings: !!settings });
  if (roleGuard) {
    return roleGuard;
  }

  return (
<div className="min-h-screen font-tajawal bg-gradient-to-br from-[#E6F6F0]/40 via-[#F4F9FF]/40 to-[#FDECEC]/30" dir="rtl">
<div className="container mx-auto px-4 py-8">
        <SchoolSettingsHeader />
        
        <SchoolSettingsTabs
          settings={settings!}
          orderedStages={orderedStages}
          tempSchoolName={tempSchoolName}
          setTempSchoolName={setTempSchoolName}
          handleSaveSettings={handleSaveSettings}
          updateSettings={updateSettings}
        />
      </div>
    </div>
  );
};

export default SchoolSettings;
