
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceReportTab } from "./AttendanceReportTab";
import { LateAttendanceReportTab } from "./LateAttendanceReportTab";

interface ReportsTabsProps {
  hasData: boolean;
  filteredStudents: any[];
  studentsWithAlerts: any[];
  studentsWithLateAlerts: any[];
  mostAbsentStudents: any[];
  bestAttendanceStudents: any[];
  weeklyData: any[];
  gradeData: any[];
  overallStats: {
    totalAttendanceRecords: number;
    totalPresentRecords: number;
    totalLateRecords: number;
    overallAttendanceRate: number;
    overallLateRate: number;
  };
  getSelectedStageDisplayName: () => string;
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
  sortType: "most_absent" | "best_attendance";
  setSortType: (value: "most_absent" | "best_attendance") => void;
  periodDateRange?: { startDate: Date; endDate: Date };
  mostLateStudents: any[];
  // Add the missing properties for StudentsTable
  selectedStageForTable?: string;
  selectedGradeForTable?: string;
  selectedSectionForTable?: string;
  getStageDisplayNameForTable?: (stage: any) => string;
}

export const ReportsTabs = ({
  hasData,
  filteredStudents,
  studentsWithAlerts,
  studentsWithLateAlerts,
  mostAbsentStudents,
  bestAttendanceStudents,
  weeklyData,
  gradeData,
  overallStats,
  getSelectedStageDisplayName,
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
  sortType,
  setSortType,
  periodDateRange,
  mostLateStudents,
  selectedStageForTable,
  selectedGradeForTable,
  selectedSectionForTable,
  getStageDisplayNameForTable
}: ReportsTabsProps) => {
  return (
    <Tabs defaultValue="attendance" className="w-full" dir="rtl">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="attendance">تقارير الحضور</TabsTrigger>
        <TabsTrigger value="lateness">تقارير التأخر</TabsTrigger>
      </TabsList>

      <TabsContent value="attendance" className="space-y-6">
        <AttendanceReportTab
          hasData={hasData}
          filteredStudents={filteredStudents}
          studentsWithAlerts={studentsWithAlerts}
          studentsWithLateAlerts={studentsWithLateAlerts}
          mostAbsentStudents={mostAbsentStudents}
          bestAttendanceStudents={bestAttendanceStudents}
          weeklyData={weeklyData}
          gradeData={gradeData}
          overallStats={overallStats}
          getSelectedStageDisplayName={getSelectedStageDisplayName}
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
          sortType={sortType}
          setSortType={setSortType}
        />
      </TabsContent>

      <TabsContent value="lateness" className="space-y-6">
        <LateAttendanceReportTab
          filteredStudents={filteredStudents}
          mostLateStudents={mostLateStudents}
          filteredLateRecords={filteredLateRecords}
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
          periodDateRange={periodDateRange}
        />
      </TabsContent>
    </Tabs>
  );
};
