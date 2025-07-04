import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportsCharts } from "./ReportsCharts";
import { StudentsTable } from "./StudentsTable";
import { LateAttendanceTable } from "./LateAttendanceTable";
import { TopStudentsSection } from "./TopStudentsSection";
import { LateAttendanceStats } from "./LateAttendanceStats";
import { ReportsTabs } from "./ReportsTabs";
import { StudentWithAttendance } from "@/hooks/useReportsData";
import { LateRecord } from "@/hooks/useLateAttendance";
import { useRealSchoolSettings } from "@/hooks/useRealSchoolSettings";

interface ReportsContentProps {
  hasData: boolean;
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
  selectedStage: string;
  handleStageChange: (stage: string) => void;
  selectedGrade: string;
  handleGradeChange: (grade: string) => void;
  selectedSection: string;
  setSelectedSection: (section: string) => void;
  sortType: string;
  setSortType: (sort: string) => void;
  hasMultipleStages: boolean;
  validEnabledStages: any[];
  safeGetStageDisplayName: (stage: any) => string;
  filteredAvailableGrades: string[];
  availableSectionsForGrade: string[];
  filteredStudents: StudentWithAttendance[];
  studentsWithAlerts: StudentWithAttendance[];
  studentsWithLateAlerts: StudentWithAttendance[];
  mostAbsentStudents: StudentWithAttendance[];
  mostLateStudents: StudentWithAttendance[];
  bestAttendanceStudents: StudentWithAttendance[];
  weeklyData: any[];
  gradeData: any[];
  overallStats: any;
  getSelectedStageDisplayName: () => string;
  filteredLateRecords: LateRecord[];
  periodDateRange?: { startDate: Date; endDate: Date };
  selectedStageForTable?: string;
  selectedGradeForTable?: string;
  selectedSectionForTable?: string;
  getStageDisplayNameForTable?: (stage: any) => string;
}

export const ReportsContent = ({
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
  mostLateStudents,
  bestAttendanceStudents,
  weeklyData,
  gradeData,
  overallStats,
  getSelectedStageDisplayName,
  filteredLateRecords,
  periodDateRange,
  selectedStageForTable,
  selectedGradeForTable,
  selectedSectionForTable,
  getStageDisplayNameForTable
}: ReportsContentProps) => {
  const { settings } = useRealSchoolSettings();

  if (!hasData) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-blue-200/50 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">لا توجد بيانات متاحة</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              لعرض التقارير، تحتاج أولاً إلى إضافة طلاب وتسجيل بيانات الحضور. 
              ابدأ بإضافة الطلاب من قسم "إدارة الطلاب" ثم سجل الحضور من قسم "تسجيل الحضور".
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ReportsTabs
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
        sortType={sortType as "most_absent" | "best_attendance"}
        setSortType={(value: "most_absent" | "best_attendance") => setSortType(value)}
        periodDateRange={periodDateRange}
        mostLateStudents={mostLateStudents}
        selectedStageForTable={selectedStageForTable}
        selectedGradeForTable={selectedGradeForTable}
        selectedSectionForTable={selectedSectionForTable}
        getStageDisplayNameForTable={getStageDisplayNameForTable}
      />
    </div>
  );
};
