
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface AttendanceRecord {
  id: string;
  school_id: string;
  student_id: string;
  date: string;
  period?: number;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  recorded_by?: string;
  recorded_at: string;
}

export const useRealAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchAttendanceByDate = async (date: string, period?: number) => {
    setLoading(true);
    try {
      if (!user) {
        return [];
      }

      let query = supabase
        .from('attendance_records')
        .select('*')
        .eq('date', date);

      if (period) {
        query = query.eq('period', period);
      }

      const { data, error } = await query;

      if (error) throw error;

      // تحويل البيانات مع التحقق من النوع
      const typedData = (data || []).map(record => ({
        ...record,
        status: record.status as 'present' | 'absent' | 'late' | 'excused'
      }));

      setAttendanceRecords(typedData);
      return typedData;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast({
        title: "خطأ في تحميل الحضور",
        description: "لم نتمكن من تحميل بيانات الحضور",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const recordAttendance = async (
    studentId: string,
    date: string,
    status: 'present' | 'absent' | 'late' | 'excused',
    period?: number,
    notes?: string
  ) => {
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

      const recordData = {
        school_id: profile.school_id,
        student_id: studentId,
        date,
        status,
        period: period || 1,
        notes,
        recorded_by: user.id,
      };

      const { data, error } = await supabase
        .from('attendance_records')
        .upsert(recordData, {
          onConflict: 'school_id,student_id,date,period'
        })
        .select()
        .single();

      if (error) throw error;

      const typedData = {
        ...data,
        status: data.status as 'present' | 'absent' | 'late' | 'excused'
      };

      // تحديث السجلات المحلية
      setAttendanceRecords(prev => {
        const existing = prev.findIndex(r => 
          r.student_id === studentId && 
          r.date === date && 
          r.period === (period || 1)
        );
        
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = typedData;
          return updated;
        } else {
          return [...prev, typedData];
        }
      });

      return typedData;
    } catch (error) {
      console.error('Error recording attendance:', error);
      toast({
        title: "خطأ في تسجيل الحضور",
        description: "لم نتمكن من تسجيل الحضور",
        variant: "destructive"
      });
      return null;
    }
  };

  const getStudentAttendance = (studentId: string, date: string, period?: number) => {
    return attendanceRecords.find(record => 
      record.student_id === studentId && 
      record.date === date && 
      (!period || record.period === period)
    );
  };

  const recordBulkAttendance = async (attendanceData: Array<{
    studentId: string;
    date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    period?: number;
  }>) => {
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

      const records = attendanceData.map(item => ({
        school_id: profile.school_id,
        student_id: item.studentId,
        date: item.date,
        status: item.status,
        period: item.period || 1,
        recorded_by: user.id
      }));

      const { data, error } = await supabase
        .from('attendance_records')
        .upsert(records, {
          onConflict: 'school_id,student_id,date,period'
        })
        .select();

      if (error) throw error;

      // تحديث السجلات المحلية
      if (data) {
        const typedData = data.map(record => ({
          ...record,
          status: record.status as 'present' | 'absent' | 'late' | 'excused'
        }));

        setAttendanceRecords(prev => {
          const newRecords = [...prev];
          typedData.forEach(newRecord => {
            const existingIndex = newRecords.findIndex(r => 
              r.student_id === newRecord.student_id && 
              r.date === newRecord.date && 
              r.period === newRecord.period
            );
            
            if (existingIndex >= 0) {
              newRecords[existingIndex] = newRecord;
            } else {
              newRecords.push(newRecord);
            }
          });
          return newRecords;
        });
      }

      toast({
        title: "تم حفظ الحضور",
        description: `تم تسجيل حضور ${attendanceData.length} طالب بنجاح`
      });

      return data;
    } catch (error) {
      console.error('Error recording bulk attendance:', error);
      toast({
        title: "خطأ في تسجيل الحضور",
        description: "لم نتمكن من حفظ جميع سجلات الحضور",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    attendanceRecords,
    loading,
    fetchAttendanceByDate,
    recordAttendance,
    recordBulkAttendance,
    getStudentAttendance
  };
};
