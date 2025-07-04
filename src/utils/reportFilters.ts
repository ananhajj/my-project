
import { StudentWithAttendance } from '@/hooks/useAttendance';

export const filterStudentsByStageGradeSection = (
  students: StudentWithAttendance[],
  selectedStage: string,
  selectedGrade: string,
  selectedSection: string,
  enabledStages: any[]
): StudentWithAttendance[] => {
  let filtered = students;
  
  if (selectedStage) {
    const stage = enabledStages.find(s => s.id === selectedStage);
    if (stage && stage.grades) {
      const stageGrades = stage.grades.map(g => g.name);
      filtered = filtered.filter(s => stageGrades.includes(s.grade));
    }
  }
  
  if (selectedGrade) {
    filtered = filtered.filter(s => s.grade === selectedGrade);
  }
  
  if (selectedSection) {
    filtered = filtered.filter(s => s.section === selectedSection);
  }
  
  return filtered;
};

export const getStudentsWithAlerts = (students: StudentWithAttendance[]) => {
  return students.filter(s => s.absenceDays >= 2);
};

export const getStudentsWithLateAlerts = (students: StudentWithAttendance[]) => {
  return students.filter(s => s.lateDays >= 3);
};

export const getMostAbsentStudents = (students: StudentWithAttendance[], limit: number = 5) => {
  return [...students]
    .sort((a, b) => b.absenceDays - a.absenceDays)
    .slice(0, limit)
    .filter(s => s.absenceDays > 0);
};

export const getMostLateStudents = (students: StudentWithAttendance[], limit: number = 5) => {
  return [...students]
    .sort((a, b) => b.lateDays - a.lateDays)
    .slice(0, limit)
    .filter(s => s.lateDays > 0);
};

export const getBestAttendanceStudents = (students: StudentWithAttendance[], limit: number = 5) => {
  return [...students]
    .sort((a, b) => b.attendancePercentage - a.attendancePercentage)
    .slice(0, limit)
    .filter(s => s.attendancePercentage > 0);
};
