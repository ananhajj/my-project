
import { LateAttendanceTable } from "./LateAttendanceTable";
import { LateAttendanceTopStudents } from "./LateAttendanceTopStudents";
import { AttendanceReportFilters } from "./AttendanceReportFilters";
import { LatenessOverviewCard } from "./LatenessOverviewCard";
import { LateAttendanceStatsCard } from "./LateAttendanceStatsCard";
import { LateColorLegend } from "./LateColorLegend";
import { useLateAttendanceStats } from "@/hooks/useLateAttendanceStats";
import { useRealSchoolSettings } from "@/hooks/useRealSchoolSettings";
import { useMemo } from "react";

interface LateAttendanceReportTabProps {
  filteredStudents: any[];
  mostLateStudents: any[];
  filteredLateRecords: any[];
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
  hasMultipleStages: boolean;
  validEnabledStages: any[];
  safeGetStageDisplayName: (stage: any) => string;
  filteredAvailableGrades: string[];
  availableSectionsForGrade: string[];
  periodDateRange?: { startDate: Date; endDate: Date };
}

export const LateAttendanceReportTab = ({
  filteredStudents,
  mostLateStudents,
  filteredLateRecords,
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
  hasMultipleStages,
  validEnabledStages,
  safeGetStageDisplayName,
  filteredAvailableGrades,
  availableSectionsForGrade,
  periodDateRange
}: LateAttendanceReportTabProps) => {
  const { settings } = useRealSchoolSettings();
  
  // Calculate statistics using the custom hook
  const lateAttendanceStats = useLateAttendanceStats(filteredStudents, filteredLateRecords);

  // Calculate best attendance students (least late students)
  const bestAttendanceStudents = useMemo(() => {
    return [...filteredStudents]
      .sort((a, b) => (a.lateDays || 0) - (b.lateDays || 0) || (b.attendancePercentage || 0) - (a.attendancePercentage || 0))
      .slice(0, 5);
  }, [filteredStudents]);

  // Students with late alerts (3+ late days)
  const studentsWithLateAlerts = useMemo(() => 
    filteredStudents.filter(s => (s.lateDays || 0) >= 3),
    [filteredStudents]
  );

  // Get period display text
  const getPeriodDisplayText = () => {
    if (startDate && endDate) {
      return `من ${startDate.toLocaleDateString('ar-SA')} إلى ${endDate.toLocaleDateString('ar-SA')}`;
    }
    return "جميع الفترات";
  };

  return (
    <div className="space-y-6" dir="rtl">
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
        isLateReport={true}
      />

      <LateAttendanceStatsCard stats={lateAttendanceStats} />

      <LatenessOverviewCard 
        filteredStudents={filteredStudents}
        selectedPeriod={getPeriodDisplayText()}
        lateRecords={filteredLateRecords}
        periodDateRange={periodDateRange}
      />

      <LateAttendanceTopStudents
        bestAttendanceStudents={bestAttendanceStudents}
        mostLateStudents={mostLateStudents}
        studentsWithLateAlerts={studentsWithLateAlerts}
        selectedPeriod={getPeriodDisplayText()}
      />

      <LateAttendanceTable
        studentsWithAttendance={filteredStudents}
        lateRecords={filteredLateRecords}
        enabledStages={validEnabledStages}
      />

      <LateColorLegend alertSettings={settings?.alert_rules} />
    </div>
  );
};
