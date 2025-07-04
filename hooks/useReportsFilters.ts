
import { useState, useMemo } from 'react';

export const useReportsFilters = (enabledStages: any[], studentsWithAttendance: any[]) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const [sortType, setSortType] = useState<"most_absent" | "best_attendance">("most_absent");

  // Get filtered available grades
  const getFilteredAvailableGrades = () => {
    if (selectedStage) {
      const stage = enabledStages.find(s => s?.id === selectedStage);
      if (stage && stage.grades) {
        return stage.grades.map(g => g?.name || '').filter(name => name);
      }
    }
    // Get all available grades from students
    return [...new Set(studentsWithAttendance.map(s => s?.grade).filter(grade => grade))];
  };

  const filteredAvailableGrades = useMemo(() => getFilteredAvailableGrades(), [selectedStage, enabledStages, studentsWithAttendance]);

  // Get available sections for selected grade
  const getAvailableSectionsForGrade = () => {
    if (!selectedGrade) return [];
    
    if (selectedStage) {
      const stage = enabledStages.find(s => s?.id === selectedStage);
      if (stage && stage.grades) {
        const gradeObj = stage.grades.find(g => g?.name === selectedGrade);
        if (gradeObj && gradeObj.sections) {
          return gradeObj.sections.filter(section => section);
        }
      }
    }
    
    // If no sections in stage settings, use student sections
    const sections = [...new Set(
      studentsWithAttendance
        .filter(s => s?.grade === selectedGrade)
        .map(s => s?.section)
        .filter(section => section)
    )];
    
    return sections.length > 0 ? sections : ['أ'];
  };

  const availableSectionsForGrade = useMemo(() => getAvailableSectionsForGrade(), [selectedGrade, selectedStage, enabledStages, studentsWithAttendance]);

  // Reset selections when stage changes
  const handleStageChange = (value: string) => {
    setSelectedStage(value);
    setSelectedGrade("");
    setSelectedSection("");
  };

  // Reset section when grade changes
  const handleGradeChange = (value: string) => {
    setSelectedGrade(value);
    setSelectedSection("");
  };

  // Helper function to get stage display name safely - ALWAYS returns a string
  const getSelectedStageDisplayName = () => {
    if (!selectedStage) return "";
    const stage = enabledStages.find(s => s?.id === selectedStage);
    return stage?.name || "";
  };

  // Helper function to get period display text
  const getPeriodDisplayText = () => {
    if (startDate && endDate) {
      return `من ${startDate.toLocaleDateString('ar-SA')} إلى ${endDate.toLocaleDateString('ar-SA')}`;
    }
    return "جميع الفترات";
  };

  // Get period date range based on selected dates
  const getPeriodDateRange = () => {
    if (startDate && endDate) {
      return {
        startDate,
        endDate
      };
    }
    return undefined;
  };

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedGrade,
    selectedSection,
    setSelectedSection,
    selectedStage,
    sortType,
    setSortType,
    filteredAvailableGrades,
    availableSectionsForGrade,
    handleStageChange,
    handleGradeChange,
    getSelectedStageDisplayName,
    getPeriodDisplayText,
    getPeriodDateRange
  };
};
