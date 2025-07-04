
import { useMemo } from "react";

export const useLateAttendanceStats = (filteredStudents: any[], filteredLateRecords: any[]) => {
  return useMemo(() => {
    console.log('=== Late Attendance Stats Debug (Fixed) ===');
    console.log('Filtered students:', filteredStudents.map(s => ({ 
      name: s.name, 
      lateDays: s.lateDays 
    })));
    console.log('Filtered late records:', filteredLateRecords.length);
    
    const totalStudents = filteredStudents.length;
    const totalLateStudents = filteredStudents.filter(s => (s.lateDays || 0) > 0).length;
    const totalOnTimeStudents = filteredStudents.filter(s => (s.lateDays || 0) === 0).length;
    
    // حساب العدد الكلي لحالات التأخر من الطلاب المفلترين
    const totalLateInstances = filteredStudents.reduce((sum, s) => sum + (s.lateDays || 0), 0);
    
    // استخدام العدد الأكبر بين الحسابات المختلفة
    const actualTotalLateInstances = Math.max(totalLateInstances, filteredLateRecords.length);
    
    const latePercentage = totalStudents > 0 ? 
      Math.round((totalLateStudents / totalStudents) * 100) : 0;
    
    const attendanceRate = filteredStudents.length > 0 ? 
      Math.round(filteredStudents.reduce((sum, s) => sum + (s.attendancePercentage || 0), 0) / filteredStudents.length) : 0;

    console.log('Final stats (Fixed):', {
      totalStudents,
      totalLateStudents,
      totalOnTimeStudents,
      totalLateInstances: actualTotalLateInstances,
      latePercentage,
      attendanceRate
    });

    return {
      totalLateStudents,
      totalOnTimeStudents,
      totalLateInstances: actualTotalLateInstances,
      latePercentage,
      attendanceRate,
      totalStudents
    };
  }, [filteredStudents, filteredLateRecords]);
};
