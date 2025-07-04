
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RealSchoolSettings } from '@/types/realSchoolSettings';
import { schoolSettingsService } from '@/services/schoolSettingsService';

export const useRealSchoolSettings = () => {
  const [settings, setSettings] = useState<RealSchoolSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const fetchedSettings = await schoolSettingsService.fetchSettings();
      setSettings(fetchedSettings);
    } catch (error) {
      console.error('Error fetching school settings:', error);
      toast({
        title: "خطأ في تحميل الإعدادات",
        description: "لم نتمكن من تحميل إعدادات المدرسة",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<RealSchoolSettings>) => {
    try {
      const updatedSettings = await schoolSettingsService.updateSettings(updates, settings);
      setSettings(updatedSettings);
      toast({
        title: "تم حفظ الإعدادات",
        description: "تم تحديث إعدادات المدرسة بنجاح"
      });
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast({
        title: "خطأ في الحفظ",
        description: error.message || 'لم نتمكن من حفظ الإعدادات',
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updateSettings,
    refetch: fetchSettings
  };
};

// Export the type for backward compatibility
export type { RealSchoolSettings };
