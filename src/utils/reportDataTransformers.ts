
import { StudentWithAttendance } from '@/hooks/useAttendance';
import { LateRecord } from '@/hooks/useLateAttendance';
import { calculateStudentLateCount } from './reportCalculations';

export const transformStudentsWithLateData = (
  studentsWithAttendance: StudentWithAttendance[],
  lateRecords: LateRecord[],
  periodDateRange?: { startDate: Date; endDate: Date }
): StudentWithAttendance[] => {
  console.log('=== Transform Students Debug ===');
  console.log('Period date range:', periodDateRange);
  console.log('Late records count:', lateRecords.length);
  
  return studentsWithAttendance.map(student => {
    const studentLateCount = calculateStudentLateCount(student.id, lateRecords, periodDateRange);
    
    console.log(`Student ${student.name}: original lateDays = ${student.lateDays}, calculated = ${studentLateCount}`);
    
    return {
      ...student,
      lateDays: studentLateCount
    };
  });
};

export const generateWeeklyData = (attendanceRecords: any[]) => {
  const dataMap = new Map();
  const today = new Date();
  
  // Collect data for the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
    
    // Skip Friday (5) and Saturday (6)
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      continue;
    }
    
    const dateString = date.toISOString().split('T')[0];
    
    const dayRecords = attendanceRecords.filter(record => record.date === dateString);
    const presentCount = dayRecords.filter(record => record.status === 'present').length;
    const absentCount = dayRecords.filter(record => record.status === 'absent').length;
    const lateCount = dayRecords.filter(record => record.status === 'late').length;
    
    const dayName = date.toLocaleDateString('ar', { weekday: 'long' });
    
    dataMap.set(dayOfWeek, {
      day: dayName,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      date: dateString,
      dayOfWeek
    });
  }
  
  // Order the data: Sunday (0), Monday (1), Tuesday (2), Wednesday (3), Thursday (4)
  const orderedData = [];
  for (let day = 0; day <= 4; day++) {
    if (dataMap.has(day)) {
      orderedData.push(dataMap.get(day));
    }
  }
  
  return orderedData;
};
