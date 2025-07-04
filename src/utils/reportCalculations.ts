import { StudentWithAttendance } from '@/hooks/useAttendance';
import { LateRecord } from '@/hooks/useLateAttendance';

export const calculateStudentLateCount = (
  studentId: string,
  lateRecords: LateRecord[],
  periodDateRange?: { startDate: Date; endDate: Date }
): number => {
  const studentLateRecords = lateRecords.filter(record => record.studentId === studentId);
  
  // إذا لم يكن هناك نطاق تاريخي محدد، أرجع العدد الكلي
  if (!periodDateRange) {
    console.log(`Student ${studentId}: total late records = ${studentLateRecords.length}`);
    return studentLateRecords.length;
  }
  
  const filteredLateRecords = studentLateRecords.filter(record => {
    const recordDate = new Date(record.date);
    const isInRange = recordDate >= periodDateRange.startDate && recordDate <= periodDateRange.endDate;
    console.log(`Student ${studentId}, record date ${record.date}: in range = ${isInRange}`);
    return isInRange;
  });
  
  console.log(`Student ${studentId}: filtered late records = ${filteredLateRecords.length}, total = ${studentLateRecords.length}`);
  return filteredLateRecords.length;
};

export const calculateOverallStats = (attendanceRecords: any[]) => {
  const totalAttendanceRecords = attendanceRecords.length;
  const totalPresentRecords = attendanceRecords.filter(r => r.status === 'present').length;
  const totalLateRecords = attendanceRecords.filter(r => r.status === 'late').length;
  const overallAttendanceRate = totalAttendanceRecords > 0 
    ? Math.round(((totalPresentRecords + totalLateRecords) / totalAttendanceRecords) * 100) 
    : 0;
  const overallLateRate = totalAttendanceRecords > 0
    ? Math.round((totalLateRecords / totalAttendanceRecords) * 100)
    : 0;

  return {
    totalAttendanceRecords,
    totalPresentRecords,
    totalLateRecords,
    overallAttendanceRate,
    overallLateRate
  };
};

export const calculateGradeData = (
  studentsWithAttendance: StudentWithAttendance[],
  selectedStage: string,
  enabledStages: any[]
) => {
  let gradesToShow = [];
  
  if (selectedStage) {
    const stage = enabledStages.find(s => s.id === selectedStage);
    if (stage && stage.grades) {
      gradesToShow = stage.grades.map(g => g.name);
    }
  } else {
    gradesToShow = [...new Set(studentsWithAttendance.map(s => s.grade))];
  }
  
  return gradesToShow.map(grade => {
    const gradeStudents = studentsWithAttendance.filter(s => s.grade === grade);
    const avgAttendance = gradeStudents.length > 0 
      ? Math.round(gradeStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / gradeStudents.length)
      : 0;
    const avgLateRate = gradeStudents.length > 0
      ? Math.round(gradeStudents.reduce((sum, s) => sum + s.lateDays, 0) / gradeStudents.length)
      : 0;
    
    return {
      grade: grade.replace(' الابتدائي', ''),
      attendance: avgAttendance,
      lateRate: avgLateRate,
      studentCount: gradeStudents.length
    };
  }).filter(item => item.studentCount > 0);
};
