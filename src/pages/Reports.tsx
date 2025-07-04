
import { useMemo } from "react";
import { useStudents } from "@/hooks/useStudents";
import { useAttendance } from "@/hooks/useAttendance";
import { useLateAttendance } from "@/hooks/useLateAttendance";
import { generateReportPDF } from "@/utils/pdfGenerator";
import { useAttendanceState } from "@/hooks/useAttendanceState";
import { useReportsData } from "@/hooks/useReportsData";
import { useReportsFilters } from "@/hooks/useReportsFilters";
import { ReportsDataValidation } from "@/components/reports/ReportsDataValidation";
import { ReportsActions } from "@/components/reports/ReportsActions";
import { ReportsContent } from "@/components/reports/ReportsContent";

const Reports = () => {
  const { students } = useStudents();
  const { getStudentsWithAttendanceData, getTodayAttendance, attendanceRecords } = useAttendance(students);
  const { lateRecords } = useLateAttendance();
  const { 
    enabledStages, 
    hasMultipleStages, 
    getStageDisplayName 
  } = useAttendanceState();
  
  console.log('Late records in Reports:', lateRecords);
  console.log('Students:', students);
  console.log('Attendance records:', attendanceRecords);
  
  // Get students with attendance data
  const studentsWithAttendance = getStudentsWithAttendanceData();
  
  // Ensure enabledStages is an array and filter out invalid stages
  const validEnabledStages = Array.isArray(enabledStages) ? enabledStages.filter(stage => stage && stage.id && stage.name) : [];
  
  // Initialize filters
  const {
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
    getPeriodDateRange
  } = useReportsFilters(validEnabledStages, studentsWithAttendance);

  // Get period date range for filtering
  const periodDateRange = getPeriodDateRange();

  // Get processed data with lateRecords and period filtering
  const {
    filteredStudents,
    studentsWithAlerts,
    studentsWithLateAlerts,
    mostAbsentStudents,
    mostLateStudents,
    bestAttendanceStudents,
    weeklyData,
    gradeData,
    overallStats
  } = useReportsData(
    studentsWithAttendance,
    selectedStage,
    selectedGrade,
    selectedSection,
    validEnabledStages,
    attendanceRecords,
    lateRecords,
    periodDateRange
  );

  // تصفية سجلات التأخر حسب الفلاتر المحددة
  const filteredLateRecords = useMemo(() => {
    console.log('Filtering late records, total records:', lateRecords.length);
    
    const filtered = lateRecords.filter(record => {
      const student = students.find(s => s.id === record.studentId);
      console.log('Checking late record for student:', record.studentId, 'found student:', student?.name);
      
      if (!student) {
        console.log('Student not found for late record:', record.studentId);
        return false;
      }
      
      // تطبيق نفس الفلاتر المستخدمة في filteredStudents
      if (selectedStage) {
        const stage = validEnabledStages.find(s => s.id === selectedStage);
        if (stage && stage.grades) {
          const stageGrades = stage.grades.map(g => g.name);
          if (!stageGrades.includes(student.grade)) {
            console.log('Student grade not in selected stage:', student.grade);
            return false;
          }
        }
      }
      
      if (selectedGrade && student.grade !== selectedGrade) {
        console.log('Student grade does not match selected grade:', student.grade, 'vs', selectedGrade);
        return false;
      }
      
      if (selectedSection && student.section !== selectedSection) {
        console.log('Student section does not match selected section:', student.section, 'vs', selectedSection);
        return false;
      }
      
      console.log('Late record passed all filters for student:', student.name);
      return true;
    });
    
    console.log('Filtered late records count:', filtered.length);
    return filtered;
  }, [lateRecords, students, selectedStage, selectedGrade, selectedSection, validEnabledStages]);

  const handleExportPDF = () => {
    generateReportPDF(
      filteredStudents,
      selectedGrade,
      overallStats.overallAttendanceRate,
      students.length,
      studentsWithAlerts.length
    );
  };

  const hasData = students.length > 0 && attendanceRecords.length > 0;

  // Safe function to get stage display name
  const safeGetStageDisplayName = (stage: any) => {
    if (!stage) return "";
    return typeof stage === 'string' ? stage : (stage.name || "");
  };

  return (
    <div className="container mx-auto px-3 py-4" dir="rtl">
      <div className="mb-4">
        <h1 className="text-xl lg:text-3xl font-bold text-school-navy mb-2">التقارير والإحصائيات</h1>
        <p className="text-sm text-school-navy/70">تحليل شامل لحضور الطلاب من البيانات المسجلة فعلياً</p>
        <ReportsActions onExportPDF={handleExportPDF} hasData={hasData} />
      </div>

      <ReportsDataValidation
        studentsCount={students.length}
        attendanceRecordsCount={attendanceRecords.length}
        studentsWithAlertsCount={studentsWithAlerts.length}
        studentsWithLateAlertsCount={studentsWithLateAlerts.length}
      />

      <ReportsContent
        hasData={hasData}
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
        sortType={sortType}
        setSortType={(sort: string) => setSortType(sort as "most_absent" | "best_attendance")}
        hasMultipleStages={hasMultipleStages}
        validEnabledStages={validEnabledStages}
        safeGetStageDisplayName={safeGetStageDisplayName}
        filteredAvailableGrades={filteredAvailableGrades}
        availableSectionsForGrade={availableSectionsForGrade}
        filteredStudents={filteredStudents}
        studentsWithAlerts={studentsWithAlerts}
        studentsWithLateAlerts={studentsWithLateAlerts}
        mostAbsentStudents={mostAbsentStudents}
        mostLateStudents={mostLateStudents}
        bestAttendanceStudents={bestAttendanceStudents}
        weeklyData={weeklyData}
        gradeData={gradeData}
        overallStats={overallStats}
        getSelectedStageDisplayName={getSelectedStageDisplayName}
        filteredLateRecords={filteredLateRecords}
        periodDateRange={periodDateRange}
        // Pass additional props for StudentsTable
        selectedStageForTable={selectedStage}
        selectedGradeForTable={selectedGrade}
        selectedSectionForTable={selectedSection}
        getStageDisplayNameForTable={safeGetStageDisplayName}
      />
    </div>
  );
};

export default Reports;
