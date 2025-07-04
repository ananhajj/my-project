import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface School {
  id: string;
  subscription_id: string;
  school_name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'expired';
  subscription_end?: string;
  students_count: number;
  created_at: string;
  updated_at: string;
}

export interface NewSchoolData {
  school_name: string;
  phone?: string;
  subscription_months: number;
}

export const useSchools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSchools = async () => {
    try {
      console.log('Fetching schools...')
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching schools:', error)
        throw error;
      }
      
      const typedSchools: School[] = (data || []).map(school => ({
        ...school,
        status: school.status as 'active' | 'inactive' | 'expired',
        phone: school.phone || undefined,
        subscription_end: school.subscription_end || undefined
      }));
      
      console.log('Fetched schools successfully:', typedSchools.length)
      setSchools(typedSchools);
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "لم نتمكن من تحميل بيانات المدارس",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createSchool = async (schoolData: NewSchoolData): Promise<{ school?: School; credentials?: { email: string; password: string; subscription_id: string } }> => {
    try {
      console.log('Starting school creation process...')
      console.log('School data:', schoolData);
      
      // Validate input
      if (!schoolData.school_name?.trim()) {
        throw new Error('اسم المدرسة مطلوب');
      }
      
      if (!schoolData.subscription_months || schoolData.subscription_months < 1) {
        throw new Error('فترة الاشتراك يجب أن تكون شهر واحد على الأقل');
      }

      const { data, error } = await supabase.functions.invoke('create-school', {
        body: schoolData
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        let errorMessage = 'فشل في إنشاء المدرسة - خطأ في الخدمة';
        
        if (error.message) {
          if (error.message.includes('Edge Function returned a non-2xx status code')) {
            errorMessage = 'خطأ في خدمة إنشاء المدرسة - يرجى المحاولة مرة أخرى';
          } else {
            errorMessage = error.message;
          }
        }
        
        throw new Error(errorMessage);
      }

      if (!data) {
        throw new Error('لم يتم تلقي استجابة من الخدمة');
      }

      if (!data.success) {
        console.error('School creation failed:', data.error);
        throw new Error(data.error || 'فشل في إنشاء المدرسة');
      }

      console.log('School created successfully:', data);

      // Refresh the schools list
      await fetchSchools();

      toast({
        title: "تم إنشاء المدرسة بنجاح",
        description: `رقم الاشتراك: ${data.credentials.subscription_id}`,
      });

      return {
        school: data.school,
        credentials: {
          email: data.credentials.email,
          password: data.credentials.password,
          subscription_id: data.credentials.subscription_id
        }
      };
    } catch (error) {
      console.error('Error in createSchool:', error);
      
      let errorMessage = 'حدث خطأ أثناء إنشاء المدرسة';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "فشل في إنشاء المدرسة",
        description: errorMessage,
        variant: "destructive"
      });
      
      return {};
    }
  };

  const updateSchoolStatus = async (schoolId: string, status: 'active' | 'inactive' | 'expired') => {
    try {
      const { error } = await supabase
        .from('schools')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', schoolId);

      if (error) throw error;

      await fetchSchools();
      toast({
        title: "تم تحديث حالة المدرسة",
        description: `تم ${status === 'active' ? 'تفعيل' : 'إيقاف'} الاشتراك`,
      });
    } catch (error) {
      console.error('Error updating school status:', error);
      toast({
        title: "خطأ في التحديث",
        description: "لم نتمكن من تحديث حالة المدرسة",
        variant: "destructive"
      });
    }
  };

  const extendSubscription = async (schoolId: string, months: number) => {
    try {
      const school = schools.find(s => s.id === schoolId);
      if (!school) return;

      const currentEnd = school.subscription_end ? new Date(school.subscription_end) : new Date();
      const newEnd = new Date(currentEnd);
      newEnd.setMonth(newEnd.getMonth() + months);

      const { error } = await supabase
        .from('schools')
        .update({ 
          subscription_end: newEnd.toISOString().split('T')[0],
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', schoolId);

      if (error) throw error;

      await fetchSchools();
      toast({
        title: "تم تمديد الاشتراك",
        description: `تم تمديد الاشتراك لمدة ${months} شهر`,
      });
    } catch (error) {
      console.error('Error extending subscription:', error);
      toast({
        title: "خطأ في التمديد",
        description: "لم نتمكن من تمديد الاشتراك",
        variant: "destructive"
      });
    }
  };

  const deleteSchool = async (schoolId: string) => {
    try {
      // حذف جميع البيانات المرتبطة بالمدرسة
      // حذف سجلات الحضور
      await supabase
        .from('attendance_records')
        .delete()
        .eq('school_id', schoolId);

      // حذف الطلاب
      await supabase
        .from('students')
        .delete()
        .eq('school_id', schoolId);

      await supabase
        .from('school_students')
        .delete()
        .eq('school_id', schoolId);

      // حذف الفصول الدراسية
      await supabase
        .from('school_classes')
        .delete()
        .eq('school_id', schoolId);

      // حذف إعدادات المدرسة
      await supabase
        .from('school_settings')
        .delete()
        .eq('school_id', schoolId);

      // حذف بيانات الحضور المدرسي
      await supabase
        .from('school_attendance')
        .delete()
        .eq('school_id', schoolId);

      // حذف ملف المدرسة من جدول المستخدمين
      await supabase
        .from('profiles')
        .delete()
        .eq('school_id', schoolId);

      // حذف المدرسة نفسها أخيراً
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', schoolId);

      if (error) throw error;

      await fetchSchools();
      toast({
        title: "تم حذف المدرسة",
        description: "تم حذف المدرسة وجميع البيانات المرتبطة بها",
      });
    } catch (error) {
      console.error('Error deleting school:', error);
      toast({
        title: "خطأ في الحذف",
        description: "لم نتمكن من حذف المدرسة",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  return {
    schools,
    loading,
    createSchool,
    updateSchoolStatus,
    extendSubscription,
    deleteSchool,
    refetch: fetchSchools
  };
};
