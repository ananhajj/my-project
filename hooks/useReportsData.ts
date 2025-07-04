
import { useMemo } from 'react';
import { StudentWithAttendance } from '@/hooks/useAttendance';
import { LateRecord } from '@/hooks/useLateAttendance';
import { 
  calculateOverallStats, 
  calculateGradeData 
} from '@/utils/reportCalculations';
import { 
  filterStudentsByStageGradeSection,
  getStudentsWithAlerts,
  getStudentsWithLateAlerts,
  getMostAbsentStudents,
  getMostLateStudents,
  getBestAttendanceStudents
} from '@/utils/reportFilters';
import { 
  transformStudentsWithLateData, 
  generateWeeklyData 
} from '@/utils/reportDataTransformers';

export type { StudentWithAttendance };

export const useReportsData = (
  studentsWithAttendance: StudentWithAttendance[],
  selectedStage: string,
  selectedGrade: string,
  selectedSection: string,
  enabledStages: any[],
  attendanceRecords: any[],
  lateRecords?: LateRecord[],
  periodDateRange?: { startDate: Date; endDate: Date }
) => {
  // Transform students with correct late data
  const studentsWithLateData = useMemo(() => {
    if (!lateRecords) return studentsWithAttendance;
    return transformStudentsWithLateData(studentsWithAttendance, lateRecords, periodDateRange);
  }, [studentsWithAttendance, lateRecords, periodDateRange]);

  // Filter students based on selected stage, grade, and section
  const filteredStudents = useMemo(() => {
    const filtered = filterStudentsByStageGradeSection(
      studentsWithLateData,
      selectedStage,
      selectedGrade,
      selectedSection,
      enabledStages
    );
    
    console.log('Filtered students with correct lateDays:', filtered.map(s => ({
      name: s.name,
      lateDays: s.lateDays
    })));
    
    return filtered;
  }, [studentsWithLateData, selectedStage, selectedGrade, selectedSection, enabledStages]);

  // Students with alerts (2+ absence days)
  const studentsWithAlerts = useMemo(() => 
    getStudentsWithAlerts(filteredStudents),
    [filteredStudents]
  );

  const studentsWithLateAlerts = useMemo(() => 
    getStudentsWithLateAlerts(filteredStudents),
    [filteredStudents]
  );

  // Most absent students (top 5)
  const mostAbsentStudents = useMemo(() => 
    getMostAbsentStudents(filteredStudents),
    [filteredStudents]
  );

  // Most late students (top 5)
  const mostLateStudents = useMemo(() => {
    const sorted = getMostLateStudents(filteredStudents);
    
    console.log('Most late students (corrected):', sorted.map(s => ({
      name: s.name,
      lateDays: s.lateDays
    })));
    
    return sorted;
  }, [filteredStudents]);

  // Best attendance students (top 5)
  const bestAttendanceStudents = useMemo(() => 
    getBestAttendanceStudents(filteredStudents),
    [filteredStudents]
  );

  // Weekly attendance data
  const weeklyData = useMemo(() => 
    generateWeeklyData(attendanceRecords),
    [attendanceRecords]
  );

  // Grade data for charts
  const gradeData = useMemo(() => 
    calculateGradeData(studentsWithAttendance, selectedStage, enabledStages),
    [studentsWithAttendance, selectedStage, enabledStages]
  );

  // Overall statistics
  const overallStats = useMemo(() => 
    calculateOverallStats(attendanceRecords),
    [attendanceRecords]
  );

  return {
    filteredStudents,
    studentsWithAlerts,
    studentsWithLateAlerts,
    mostAbsentStudents,
    mostLateStudents,
    bestAttendanceStudents,
    weeklyData,
    gradeData,
    overallStats
  };
};
