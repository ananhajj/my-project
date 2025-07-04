
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PeriodSetting {
  id: string;
  period_type: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  academic_year: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const usePeriodSettings = () => {
  const [periodSettings, setPeriodSettings] = useState<PeriodSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPeriodSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('period_settings')
        .select('*')
        .eq('is_active', true)
        .order('academic_year', { ascending: false });

      if (error) {
        console.error('Error fetching period settings:', error);
        toast({
          title: "خطأ في جلب البيانات",
          description: "حدث خطأ أثناء جلب إعدادات الفترات الزمنية",
          variant: "destructive",
        });
        return;
      }

      // Type assertion to ensure correct typing
      const typedData = (data || []).map(item => ({
        ...item,
        period_type: item.period_type as 'weekly' | 'monthly' | 'quarterly' | 'yearly'
      }));

      setPeriodSettings(typedData);
    } catch (error) {
      console.error('Error in fetchPeriodSettings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPeriodSetting = async (setting: Omit<PeriodSetting, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('period_settings')
        .insert([setting])
        .select()
        .single();

      if (error) {
        console.error('Error creating period setting:', error);
        toast({
          title: "خطأ في الحفظ",
          description: "حدث خطأ أثناء حفظ إعدادات الفترة الزمنية",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ إعدادات الفترة الزمنية بنجاح",
      });

      await fetchPeriodSettings();
      return data;
    } catch (error) {
      console.error('Error in createPeriodSetting:', error);
      return null;
    }
  };

  const updatePeriodSetting = async (id: string, updates: Partial<PeriodSetting>) => {
    try {
      const { error } = await supabase
        .from('period_settings')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating period setting:', error);
        toast({
          title: "خطأ في التحديث",
          description: "حدث خطأ أثناء تحديث إعدادات الفترة الزمنية",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث إعدادات الفترة الزمنية بنجاح",
      });

      await fetchPeriodSettings();
      return true;
    } catch (error) {
      console.error('Error in updatePeriodSetting:', error);
      return false;
    }
  };

  const deletePeriodSetting = async (id: string) => {
    try {
      const { error } = await supabase
        .from('period_settings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting period setting:', error);
        toast({
          title: "خطأ في الحذف",
          description: "حدث خطأ أثناء حذف إعدادات الفترة الزمنية",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف إعدادات الفترة الزمنية بنجاح",
      });

      await fetchPeriodSettings();
      return true;
    } catch (error) {
      console.error('Error in deletePeriodSetting:', error);
      return false;
    }
  };

  const getPeriodSettingByType = (periodType: string, academicYear?: string) => {
    if (academicYear) {
      return periodSettings.find(s => s.period_type === periodType && s.academic_year === academicYear);
    }
    // إذا لم يتم تحديد السنة الدراسية، أحضر أحدث إعداد
    return periodSettings
      .filter(s => s.period_type === periodType)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
  };

  useEffect(() => {
    fetchPeriodSettings();
  }, []);

  return {
    periodSettings,
    loading,
    fetchPeriodSettings,
    createPeriodSetting,
    updatePeriodSetting,
    deletePeriodSetting,
    getPeriodSettingByType
  };
};
