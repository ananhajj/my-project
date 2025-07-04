
import { useMemo } from "react";
import { StudentWithAttendance } from "@/hooks/useReportsData";
import { AttendanceReportFilters } from "@/components/reports/AttendanceReportFilters";
import { UnifiedStatsCard } from "@/components/reports/UnifiedStatsCard";
import { TopStudentsSection } from "@/components/reports/TopStudentsSection";
import { ReportsCharts } from "@/components/reports/ReportsCharts";
import { StudentsTable } from "@/components/reports/StudentsTable";
import { ColorLegend } from "@/components/reports/ColorLegend";
import { AttendanceChartsSection } from "@/components/reports/AttendanceChartsSection";
import { useRealSchoolSettings } from "@/hooks/useRealSchoolSettings";

interface AttendanceReportTabProps {
  hasData: boolean;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  selectedStage: string;
  handleStageChange: (value: string) => void;
  selectedGrade: string;
  handleGradeChange: (value: string) => void;
  selectedSection: string;
  setSelectedSection: (value: string) => void;
  sortType: "most_absent" | "best_attendance";
  setSortType: (value: "most_absent" | "best_attendance") => void;
  hasMultipleStages: boolean;
  validEnabledStages: any[];
  safeGetStageDisplayName: (stage: any) => string;
  filteredAvailableGrades: string[];
  availableSectionsForGrade: string[];
  filteredStudents: StudentWithAttendance[];
  studentsWithAlerts: StudentWithAttendance[];
  studentsWithLateAlerts: StudentWithAttendance[];
  mostAbsentStudents: StudentWithAttendance[];
  bestAttendanceStudents: StudentWithAttendance[];
  weeklyData: any[];
  gradeData: any[];
  overallStats: any;
  getSelectedStageDisplayName: () => string;
}

export const AttendanceReportTab = ({
  hasData,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedStage,
  handleStageChange,
  selectedGrade,
  handleGradeChange,
  selectedSection,
  setSelectedSection,
  sortType,
  setSortType,
  hasMultipleStages,
  validEnabledStages,
  safeGetStageDisplayName,
  filteredAvailableGrades,
  availableSectionsForGrade,
  filteredStudents,
  studentsWithAlerts,
  studentsWithLateAlerts,
  mostAbsentStudents,
  bestAttendanceStudents,
  weeklyData,
  gradeData,
  overallStats,
  getSelectedStageDisplayName
}: AttendanceReportTabProps) => {
  const { settings } = useRealSchoolSettings();

  // Sort students based on selected sort type
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      if (sortType === "best_attendance") {
        // Sort by attendance percentage (highest first)
        return (b?.attendancePercentage || 0) - (a?.attendancePercentage || 0);
      } else {
        // Default: Sort by absence days (highest first)
        return (b?.absenceDays || 0) - (a?.absenceDays || 0);
      }
    });
  }, [filteredStudents, sortType]);

  // Calculate total absence count from filtered students
  const absenceCount = useMemo(() => {
    return filteredStudents.reduce((sum, student) => sum + (student.absenceDays || 0), 0);
  }, [filteredStudents]);

  // Calculate total present count from attendance percentage and total students
  const presentCount = useMemo(() => {
    return filteredStudents.reduce((sum, student) => {
      const totalDays = (student.absenceDays || 0) + Math.round(((student.attendancePercentage || 0) / 100) * ((student.absenceDays || 0) + 1));
      const presentDays = Math.round((totalDays * (student.attendancePercentage || 0)) / 100);
      return sum + presentDays;
    }, 0);
  }, [filteredStudents]);

  // Calculate present and absence percentages
  const totalDays = presentCount + absenceCount;
  const presentPercentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;
  const absencePercentage = totalDays > 0 ? Math.round((absenceCount / totalDays) * 100) : 0;

  // Calculate late recurrence rate
  const lateRecurrenceRate = useMemo(() => {
    const studentsWithLateDays = filteredStudents.filter(student => (student.lateDays || 0) > 0);
    if (filteredStudents.length === 0) return 0;
    return Math.round((studentsWithLateDays.length / filteredStudents.length) * 100);
  }, [filteredStudents]);

  // Get period display text
  const getPeriodDisplayText = () => {
    if (startDate && endDate) {
      return `من ${startDate.toLocaleDateString('ar-SA')} إلى ${endDate.toLocaleDateString('ar-SA')}`;
    }
    return "جميع الفترات";
  };

  return (
    <div dir="rtl">
      {/* Attendance Report Filters */}
      <AttendanceReportFilters
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        selectedStage={selectedStage}
        handleStageChange={handleStageChange}
        selectedGrade={selectedGrade}
        handleGradeChange={handleGradeChange}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        hasMultipleStages={hasMultipleStages}
        validEnabledStages={validEnabledStages}
        safeGetStageDisplayName={safeGetStageDisplayName}
        filteredAvailableGrades={filteredAvailableGrades}
        availableSectionsForGrade={availableSectionsForGrade}
      />

      <UnifiedStatsCard
        totalRecords={overallStats.totalAttendanceRecords}
        totalStudents={filteredStudents.length}
        attendanceRate={overallStats.overallAttendanceRate}
        alertsCount={studentsWithAlerts.length}
        absenceCount={absenceCount}
        presentCount={presentCount}
        presentPercentage={presentPercentage}
        absencePercentage={absencePercentage}
        lateRecurrenceRate={lateRecurrenceRate}
      />

      {hasData && (
        <>
          <AttendanceChartsSection
            filteredStudents={filteredStudents}
            selectedStageDisplayName={getSelectedStageDisplayName()}
            startDate={startDate}
            endDate={endDate}
          />

          <TopStudentsSection
            mostAbsentStudents={mostAbsentStudents}
            bestAttendanceStudents={bestAttendanceStudents}
            selectedPeriod={getPeriodDisplayText()}
          />

          <ReportsCharts
            weeklyData={weeklyData}
            gradeData={gradeData}
            selectedStageDisplayName={getSelectedStageDisplayName()}
            filteredStudents={filteredStudents}
            selectedGrade={selectedGrade}
            selectedSection={selectedSection}
            overallStats={overallStats}
          />

          <StudentsTable
            students={sortedStudents}
            sortBy={sortType === "best_attendance" ? "attendancePercentage" : "absenceDays"}
            sortOrder="desc"
            onSort={() => {}}
          />
        </>
      )}

      <ColorLegend alertSettings={settings?.alert_rules} />
    </div>
  );
};
