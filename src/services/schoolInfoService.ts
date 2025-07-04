
import { supabase } from '@/integrations/supabase/client';
import { SchoolInfo } from '@/types/pdfTypes';

export const fetchSchoolInfo = async (): Promise<SchoolInfo> => {
  const defaultSchoolInfo: SchoolInfo = {
    country: 'المملكة العربية السعودية',
    ministry: 'وزارة التعليم',
    education_department: 'إدارة التعليم بالمنطقة',
    educational_supervision: 'الإشراف التربوي',
    school_name: 'المدرسة النموذجية'
  };

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('لا يوجد مستخدم مسجل الدخول');
      return defaultSchoolInfo;
    }

    console.log('Current user ID:', user.id);

    // محاولة جلب إعدادات المدرسة أولاً
    const { data: settings, error } = await supabase
      .from('school_settings')
      .select('school_name, country, ministry, education_department, educational_supervision')
      .eq('school_id', user.id)
      .maybeSingle();
    
    if (error) {
      console.warn('خطأ في جلب إعدادات المدرسة:', error);
    }

    if (settings && settings.school_name) {
      console.log('تم جلب إعدادات المدرسة بنجاح:', settings);
      return {
        country: settings.country || defaultSchoolInfo.country,
        ministry: settings.ministry || defaultSchoolInfo.ministry,
        education_department: settings.education_department || defaultSchoolInfo.education_department,
        educational_supervision: settings.educational_supervision || defaultSchoolInfo.educational_supervision,
        school_name: settings.school_name
      };
    }

    console.log('لا توجد إعدادات مدرسة، سيتم استخدام البيانات الافتراضية');
    return defaultSchoolInfo;
    
  } catch (error) {
    console.warn('تعذر تحميل إعدادات المدرسة، سيتم استخدام البيانات الافتراضية:', error);
    return defaultSchoolInfo;
  }
};
