
import { useState, useEffect } from 'react';
import { Student } from './useStudents';

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  period?: string;
}

export interface StudentWithAttendance extends Student {
  absenceDays: number;
  lateDays: number;
  attendancePercentage: number;
}

const ATTENDANCE_STORAGE_KEY = 'school_attendance';

export const useAttendance = (students: Student[]) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // تحميل بيانات الحضور من localStorage
  useEffect(() => {
    const savedAttendance = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (savedAttendance) {
      try {
        const parsedAttendance = JSON.parse(savedAttendance);
        console.log('Loaded attendance records:', parsedAttendance);
        setAttendanceRecords(parsedAttendance);
      } catch (error) {
        console.error('خطأ في قراءة بيانات الحضور:', error);
        setAttendanceRecords([]);
      }
    }
  }, []);

  // حفظ بيانات الحضور في localStorage
  useEffect(() => {
    if (attendanceRecords.length > 0) {
      console.log('Saving attendance records to localStorage:', attendanceRecords);
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(attendanceRecords));
    }
  }, [attendanceRecords]);

  const recordAttendance = (studentId: string, date: string, status: 'present' | 'absent' | 'late', period?: string) => {
    console.log('Recording attendance:', { studentId, date, status, period });
    
    setAttendanceRecords(prev => {
      // إزالة أي تسجيل حضور سابق لنفس الطالب في نفس التاريخ والفترة
      const filtered = prev.filter(record => 
        !(record.studentId === studentId && record.date === date && 
          (period ? record.period === period : !record.period))
      );
      
      const newRecord: AttendanceRecord = {
        studentId,
        date,
        status,
        ...(period && { period })
      };
      
      const newRecords = [...filtered, newRecord];
      console.log('Updated attendance records:', newRecords);
      return newRecords;
    });
  };

  const getStudentAttendance = (studentId: string, period?: string): AttendanceRecord[] => {
    return attendanceRecords.filter(record => 
      record.studentId === studentId && 
      (period ? record.period === period : true)
    );
  };

  const getStudentsWithAttendanceData = (): StudentWithAttendance[] => {
    return students.map(student => {
      const studentAttendance = getStudentAttendance(student.id);
      const absenceDays = studentAttendance.filter(record => record.status === 'absent').length;
      const lateDays = studentAttendance.filter(record => record.status === 'late').length;
      const totalDays = studentAttendance.length;
      const presentDays = studentAttendance.filter(record => record.status === 'present' || record.status === 'late').length;
      const attendancePercentage = totalDays > 0 ? 
        Math.round((presentDays / totalDays) * 100) : 100;

      return {
        ...student,
        absenceDays,
        lateDays,
        attendancePercentage
      };
    });
  };

  const getTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendanceRecords.filter(record => record.date === today);
    
    const presentCount = todayRecords.filter(record => record.status === 'present').length;
    const absentCount = todayRecords.filter(record => record.status === 'absent').length;
    const lateCount = todayRecords.filter(record => record.status === 'late').length;
    
    return {
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      total: students.length,
      attendanceRate: students.length > 0 ? 
        Math.round(((presentCount + lateCount) / students.length) * 100) : 0
    };
  };

  const getAttendanceForDate = (date: string, period?: string): AttendanceRecord[] => {
    return attendanceRecords.filter(record => 
      record.date === date && 
      (period ? record.period === period : true)
    );
  };

  return {
    attendanceRecords,
    recordAttendance,
    getStudentAttendance,
    getStudentsWithAttendanceData,
    getTodayAttendance,
    getAttendanceForDate
  };
};
