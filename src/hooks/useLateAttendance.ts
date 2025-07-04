
import { useState, useEffect } from 'react';

export interface LateRecord {
  studentId: string;
  date: string;
  lateType: 'morning_lineup' | 'after_lineup' | 'period_1' | 'period_2' | 'period_3' | 'period_4' | 'period_5' | 'period_6' | 'period_7';
  period?: string;
  time?: string; // وقت التأخر
}

const LATE_RECORDS_STORAGE_KEY = 'school_late_records';

export const useLateAttendance = () => {
  const [lateRecords, setLateRecords] = useState<LateRecord[]>([]);

  // تحميل بيانات التأخر من localStorage
  useEffect(() => {
    const savedLateRecords = localStorage.getItem(LATE_RECORDS_STORAGE_KEY);
    if (savedLateRecords) {
      try {
        const parsedRecords = JSON.parse(savedLateRecords);
        console.log('Loaded late records:', parsedRecords);
        setLateRecords(parsedRecords);
      } catch (error) {
        console.error('خطأ في قراءة بيانات التأخر:', error);
        setLateRecords([]);
      }
    }
  }, []);

  // حفظ بيانات التأخر في localStorage
  useEffect(() => {
    if (lateRecords.length >= 0) {
      console.log('Saving late records to localStorage:', lateRecords);
      localStorage.setItem(LATE_RECORDS_STORAGE_KEY, JSON.stringify(lateRecords));
    }
  }, [lateRecords]);

  const recordLateAttendance = (studentId: string, date: string, lateType: LateRecord['lateType'], period?: string) => {
    console.log('Recording late attendance:', { studentId, date, lateType, period });
    
    setLateRecords(prev => {
      // إزالة أي تسجيل تأخر سابق لنفس الطالب في نفس التاريخ والفترة
      const filtered = prev.filter(record => 
        !(record.studentId === studentId && record.date === date && 
          (period ? record.period === period : !record.period))
      );
      
      const newRecord: LateRecord = {
        studentId,
        date,
        lateType,
        ...(period && { period }),
        time: new Date().toLocaleTimeString('ar-SA')
      };
      
      const newRecords = [...filtered, newRecord];
      console.log('Updated late records:', newRecords);
      return newRecords;
    });
  };

  const removeLateRecord = (studentId: string, date: string, period?: string) => {
    console.log('Removing late record:', { studentId, date, period });
    
    setLateRecords(prev => {
      const filtered = prev.filter(record => 
        !(record.studentId === studentId && record.date === date && 
          (period ? record.period === period : !record.period))
      );
      console.log('Late records after removal:', filtered);
      return filtered;
    });
  };

  const getStudentLateRecord = (studentId: string, date: string, period?: string): LateRecord | undefined => {
    return lateRecords.find(record => 
      record.studentId === studentId && 
      record.date === date && 
      (period ? record.period === period : !record.period)
    );
  };

  const getLateRecordsForDate = (date: string, period?: string): LateRecord[] => {
    return lateRecords.filter(record => 
      record.date === date && 
      (period ? record.period === period : true)
    );
  };

  const getStudentLateCount = (studentId: string): number => {
    return lateRecords.filter(record => record.studentId === studentId).length;
  };

  const getTodayLateCount = (): number => {
    const today = new Date().toISOString().split('T')[0];
    return lateRecords.filter(record => record.date === today).length;
  };

  return {
    lateRecords,
    recordLateAttendance,
    removeLateRecord,
    getStudentLateRecord,
    getLateRecordsForDate,
    getStudentLateCount,
    getTodayLateCount
  };
};
