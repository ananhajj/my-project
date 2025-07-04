
import { supabase } from '@/integrations/supabase/client';
import { RealSchoolSettings } from '@/types/realSchoolSettings';
import { getDefaultStages, parseAlertRules } from '@/utils/schoolSettingsUtils';

export const schoolSettingsService = {
  async fetchSettings(): Promise<RealSchoolSettings | null> {
    // الحصول على معلومات المستخدم الحالي
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('لا يوجد مستخدم مسجل الدخول');
      return null;
    }

    console.log('المستخدم المسجل:', user.email);

    // التحقق من نوع المستخدم
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // إذا كان المستخدم مدير، لا نحتاج لإعدادات مدرسة
    if (profile?.role === 'admin') {
      console.log('المستخدم مدير نظام - لا حاجة لإعدادات مدرسة');
      return null;
    }

    // البحث عن إعدادات المستخدم الحالي
    let { data: existingSettings, error: settingsError } = await supabase
      .from('school_settings')
      .select('*')
      .eq('school_id', user.id)
      .maybeSingle();

    if (settingsError && settingsError.code !== 'PGRST116') {
      console.error('خطأ في جلب الإعدادات:', settingsError);
      throw settingsError;
    }

    // إذا لم توجد إعدادات، إنشاء إعدادات جديدة
    if (!existingSettings) {
      return await this.createDefaultSettings(user);
    } else {
      return this.processExistingSettings(existingSettings, user);
    }
  },

  async createDefaultSettings(user: any): Promise<RealSchoolSettings> {
    console.log('لم توجد إعدادات سابقة، إنشاء إعدادات جديدة');
    
    const defaultStages = getDefaultStages();
    const newSettings = {
      school_id: user.id,
      school_name: user.user_metadata?.school_name || user.email?.split('@')[0] || 'مدرستي',
      logo_url: null,
      stages: defaultStages,
      attendance_type: 'daily' as 'daily' | 'hourly',
      periods_per_day: 6,
      absence_alert_days: 3,
      late_alert_count: 3,
      absence_alert_title: 'تنبيه غياب',
      late_alert_title: 'تنبيه تأخر',
      absence_alert_description: 'تجاوز الطالب العدد المسموح من أيام الغياب',
      late_alert_description: 'تجاوز الطالب العدد المسموح من مرات التأخر',
      alert_rules: null
    };

    const { data: createdData, error: createError } = await supabase
      .from('school_settings')
      .insert([newSettings])
      .select()
      .single();

    if (createError) {
      console.error('خطأ في إنشاء الإعدادات:', createError);
      throw createError;
    }

    return {
      ...createdData,
      stages: Array.isArray(createdData.stages) ? createdData.stages : defaultStages,
      attendance_type: createdData.attendance_type as 'daily' | 'hourly',
      alert_rules: parseAlertRules(createdData.alert_rules)
    };
  },

  async processExistingSettings(existingSettings: any, user: any): Promise<RealSchoolSettings> {
    // إذا كانت الإعدادات موجودة، تأكد من وجود جميع المراحل الجديدة
    let stages = Array.isArray(existingSettings.stages) ? existingSettings.stages : [];
    const defaultStages = getDefaultStages();
    
    // فحص المراحل المفقودة وإضافتها
    const existingStageIds = stages.map((stage: any) => stage.id);
    const missingStages = defaultStages.filter(stage => !existingStageIds.includes(stage.id));
    
    if (missingStages.length > 0) {
      stages = [...stages, ...missingStages];
      
      // تحديث قاعدة البيانات بالمراحل الجديدة
      await supabase
        .from('school_settings')
        .update({ stages: stages })
        .eq('school_id', user.id);
    }
    
    return {
      ...existingSettings,
      stages: stages,
      attendance_type: existingSettings.attendance_type as 'daily' | 'hourly',
      alert_rules: parseAlertRules(existingSettings.alert_rules)
    };
  },

  async updateSettings(updates: Partial<RealSchoolSettings>, currentSettings?: RealSchoolSettings | null): Promise<RealSchoolSettings> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('يجب تسجيل الدخول أولاً');
    }

    const settingsData = {
      school_id: user.id,
      school_name: updates.school_name || currentSettings?.school_name || '',
      logo_url: updates.logo_url || currentSettings?.logo_url || null,
      stages: updates.stages || currentSettings?.stages || getDefaultStages(),
      attendance_type: updates.attendance_type || currentSettings?.attendance_type || 'daily',
      periods_per_day: updates.periods_per_day || currentSettings?.periods_per_day || 6,
      absence_alert_days: updates.absence_alert_days !== undefined ? updates.absence_alert_days : currentSettings?.absence_alert_days || 3,
      late_alert_count: updates.late_alert_count !== undefined ? updates.late_alert_count : currentSettings?.late_alert_count || 3,
      absence_alert_title: updates.absence_alert_title || currentSettings?.absence_alert_title || 'تنبيه غياب',
      late_alert_title: updates.late_alert_title || currentSettings?.late_alert_title || 'تنبيه تأخر',
      absence_alert_description: updates.absence_alert_description || currentSettings?.absence_alert_description || 'تجاوز الطالب العدد المسموح من أيام الغياب',
      late_alert_description: updates.late_alert_description || currentSettings?.late_alert_description || 'تجاوز الطالب العدد المسموح من مرات التأخر',
      alert_rules: updates.alert_rules !== undefined ? JSON.stringify(updates.alert_rules) : (currentSettings?.alert_rules ? JSON.stringify(currentSettings.alert_rules) : null),
      updated_at: new Date().toISOString()
    };

    console.log('محاولة حفظ الإعدادات:', settingsData);

    const { data, error } = await supabase
      .from('school_settings')
      .upsert(settingsData, {
        onConflict: 'school_id'
      })
      .select()
      .single();

    if (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
      throw error;
    }

    console.log('تم حفظ الإعدادات بنجاح:', data);

    return {
      ...data,
      stages: Array.isArray(data.stages) ? data.stages : getDefaultStages(),
      attendance_type: data.attendance_type as 'daily' | 'hourly',
      alert_rules: parseAlertRules(data.alert_rules)
    };
  }
};
