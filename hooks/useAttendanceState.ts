import { useState, useEffect } from 'react';
import { useStudents } from '@/hooks/useStudents';
import { useAttendance } from '@/hooks/useAttendance';
import { useRealSchoolSettings } from '@/hooks/useRealSchoolSettings';
import { useStageOrdering } from '@/hooks/useStageOrdering';
import { StudentWithAttendance, AttendanceState } from '@/types/attendance';
import { getAvailableGrades, getAvailableSections } from '@/utils/attendanceFilters';
import { filterAndSortStudents } from '@/utils/studentSorting';
import { processStudentsWithAttendance, getStageDisplayName } from '@/utils/attendanceData';

export type { StudentWithAttendance };

export const useAttendanceState = () => {
  const [selectedStage, setSelectedStage] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPeriod, setSelectedPeriod] = useState("1");
  const [studentsWithAttendance, setStudentsWithAttendance] = useState<StudentWithAttendance[]>([]);
  const [attendanceChanges, setAttendanceChanges] = useState<{[studentId: string]: 'present' | 'absent' | 'late' | undefined}>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasExistingAttendance, setHasExistingAttendance] = useState(false);

  const { students } = useStudents();
  const { recordAttendance, getStudentAttendance } = useAttendance(students);
  const { settings, loading } = useRealSchoolSettings();

  console.log('useAttendanceState: Current settings from useRealSchoolSettings:', settings);
  console.log('useAttendanceState: Settings loading status:', loading);

  // Get all stages from settings
  const allStages = settings?.stages || [];
  console.log('useAttendanceState: All stages from settings:', allStages);
  
  // Filter enabled stages
  const enabledStages = allStages.filter((stage: any) => {
    const isEnabled = stage && stage.enabled === true;
    console.log(`useAttendanceState: Stage ${stage?.id} (${stage?.name}): enabled = ${stage?.enabled}, filtered = ${isEnabled}`);
    return isEnabled;
  });
  
  console.log('useAttendanceState: Enabled stages after filtering:', enabledStages);
  
  // Use stage ordering hook
  const orderedStages = useStageOrdering(enabledStages);
  console.log('useAttendanceState: Ordered stages from hook:', orderedStages);
  
  const hasMultipleStages = orderedStages.length > 1;
  console.log('useAttendanceState: Has multiple stages (>1):', hasMultipleStages, 'Total count:', orderedStages.length);

  // Get available grades and sections using utility functions
  const availableGrades = getAvailableGrades(
    students,
    enabledStages,
    hasMultipleStages,
    selectedStage,
    orderedStages
  );

  const availableSections = getAvailableSections(
    selectedGrade,
    students,
    enabledStages,
    hasMultipleStages,
    selectedStage,
    orderedStages
  );

  console.log('useAttendanceState: Final available grades:', availableGrades);
  console.log('useAttendanceState: Final available sections:', availableSections);

  // Reset selections when stage changes
  useEffect(() => {
    if (hasMultipleStages) {
      setSelectedGrade("");
      setSelectedSection("");
    }
  }, [selectedStage, hasMultipleStages]);

  // Reset section when grade changes
  useEffect(() => {
    setSelectedSection("");
  }, [selectedGrade]);

  // Reset all selections when settings change
  useEffect(() => {
    console.log('useAttendanceState: Settings changed, resetting selections');
    setSelectedStage("");
    setSelectedGrade("");
    setSelectedSection("");
  }, [settings?.id]);

  // Filter students and load attendance data
  useEffect(() => {
    if (selectedGrade && selectedSection && selectedDate) {
      const filteredStudents = filterAndSortStudents(
        students,
        selectedGrade,
        selectedSection,
        selectedStage,
        hasMultipleStages,
        orderedStages
      );

      const { studentsWithAttendanceData, hasExisting } = processStudentsWithAttendance(
        filteredStudents,
        getStudentAttendance,
        selectedDate,
        attendanceChanges
      );
      
      setHasExistingAttendance(hasExisting);
      setStudentsWithAttendance(studentsWithAttendanceData);
      
      if (hasExisting && !isEditMode) {
        setIsEditMode(false);
      }
    } else {
      setStudentsWithAttendance([]);
      setHasExistingAttendance(false);
    }
  }, [selectedStage, selectedGrade, selectedSection, selectedDate, selectedPeriod, students, attendanceChanges, hasMultipleStages, orderedStages, isEditMode]);

  // Clear local changes when selections change
  useEffect(() => {
    setAttendanceChanges({});
    setIsEditMode(false);
  }, [selectedStage, selectedGrade, selectedSection, selectedDate, selectedPeriod]);

  return {
    // State
    selectedStage,
    selectedGrade,
    selectedSection,
    selectedDate,
    selectedPeriod,
    studentsWithAttendance,
    attendanceChanges,
    isEditMode,
    hasExistingAttendance,
    enabledStages: orderedStages,
    hasMultipleStages,
    availableGrades,
    availableSections,
    settings,
    students,
    recordAttendance,
    loading,
    
    // Actions
    setSelectedStage,
    setSelectedGrade,
    setSelectedSection,
    setSelectedDate,
    setSelectedPeriod,
    setAttendanceChanges,
    setIsEditMode,
    getStageDisplayName
  };
};
