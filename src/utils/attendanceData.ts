
import { Student } from '@/hooks/useStudents';
import { StudentWithAttendance } from '@/types/attendance';

export const processStudentsWithAttendance = (
  filteredStudents: Student[],
  getStudentAttendance: (studentId: string) => any[],
  selectedDate: string,
  attendanceChanges: {[studentId: string]: 'present' | 'absent' | 'late' | undefined},
  selectedPeriod?: string
): { studentsWithAttendanceData: StudentWithAttendance[], hasExisting: boolean } => {
  let hasExisting = false;
  
  const studentsWithAttendanceData = filteredStudents.map(s => {
    const studentAttendance = getStudentAttendance(s.id);
    const attendanceForDate = studentAttendance.find(record => 
      record.date === selectedDate && 
      (selectedPeriod ? record.period === selectedPeriod : !record.period)
    );
    
    if (attendanceForDate) {
      hasExisting = true;
    }
    
    let status: 'present' | 'absent' | 'late' | undefined;
    if (attendanceChanges.hasOwnProperty(s.id)) {
      status = attendanceChanges[s.id];
    } else {
      status = attendanceForDate ? attendanceForDate.status : undefined;
    }
    
    // Convert status to isPresent for backward compatibility
    let isPresent: boolean | undefined;
    if (status === 'present' || status === 'late') {
      isPresent = true;
    } else if (status === 'absent') {
      isPresent = false;
    } else {
      isPresent = undefined;
    }
    
    console.log('Processing student attendance:', {
      studentId: s.id,
      name: s.name,
      hasExistingRecord: !!attendanceForDate,
      status,
      isPresent,
      attendanceChanges: attendanceChanges[s.id]
    });
    
    return { ...s, isPresent, status };
  });
  
  return { studentsWithAttendanceData, hasExisting };
};

export const getStageDisplayName = (stageId: string): string => {
  const stageNames: {[key: string]: string} = {
    'kindergarten': 'رياض الأطفال',
    'early_childhood': 'الطفولة المبكرة',
    'elementary': 'الابتدائية',
    'middle': 'المتوسطة',
    'high': 'الثانوية'
  };
  return stageNames[stageId] || stageId;
};
