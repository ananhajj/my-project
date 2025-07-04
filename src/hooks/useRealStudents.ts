
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface RealStudent {
  id: string;
  school_id: string;
  student_id: string;
  name: string;
  grade: string;
  section: string;
  phone?: string;
  parent_phone?: string;
  address?: string;
  birth_date?: string;
  enrollment_date?: string;
  status: 'active' | 'inactive' | 'transferred';
}

export const useRealStudents = () => {
  const [students, setStudents] = useState<RealStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchStudents = async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }

      // The RLS policies will automatically filter students based on the user's school_id
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;

      const typedData = (data || []).map(student => ({
        ...student,
        status: student.status as 'active' | 'inactive' | 'transferred'
      }));

      setStudents(typedData);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "خطأ في تحميل الطلاب",
        description: "لم نتمكن من تحميل قائمة الطلاب",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (studentData: Omit<RealStudent, 'id' | 'school_id'>) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get the current user's school_id from their profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('school_id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile?.school_id) {
        throw new Error('School ID not found in user profile');
      }

      const { data, error } = await supabase
        .from('students')
        .insert([{ ...studentData, school_id: profile.school_id }])
        .select()
        .single();

      if (error) throw error;

      const typedData = {
        ...data,
        status: data.status as 'active' | 'inactive' | 'transferred'
      };

      setStudents(prev => [...prev, typedData]);
      toast({
        title: "تم إضافة الطالب",
        description: `تم إضافة ${typedData.name} بنجاح`
      });
      
      return typedData;
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "خطأ في الإضافة",
        description: "لم نتمكن من إضافة الطالب",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateStudent = async (id: string, updates: Partial<RealStudent>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const typedData = {
        ...data,
        status: data.status as 'active' | 'inactive' | 'transferred'
      };

      setStudents(prev => prev.map(s => s.id === id ? typedData : s));
      toast({
        title: "تم التحديث",
        description: "تم تحديث بيانات الطالب بنجاح"
      });
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "خطأ في التحديث",
        description: "لم نتمكن من تحديث بيانات الطالب",
        variant: "destructive"
      });
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({ status: 'inactive' })
        .eq('id', id);

      if (error) throw error;

      setStudents(prev => prev.filter(s => s.id !== id));
      toast({
        title: "تم الحذف",
        description: "تم حذف الطالب بنجاح"
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "خطأ في الحذف",
        description: "لم نتمكن من حذف الطالب",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user]);

  return {
    students,
    loading,
    addStudent,
    updateStudent,
    deleteStudent,
    refetch: fetchStudents
  };
};
