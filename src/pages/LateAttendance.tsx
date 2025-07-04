import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { LateAttendanceControls } from "@/components/attendance/LateAttendanceControls";
import { LateStudentsList } from "@/components/attendance/LateStudentsList";
import { LateAttendanceStats } from "@/components/attendance/LateAttendanceStats";
import { AttendanceAlert } from "@/components/attendance/AttendanceAlert";
import { useAttendanceState } from "@/hooks/useAttendanceState";
import { useLateAttendance } from "@/hooks/useLateAttendance";

const LateAttendance = () => {
  const { toast } = useToast();
  const {
    selectedStage,
    selectedGrade,
    selectedSection,
    selectedDate,
    selectedPeriod,
    studentsWithAttendance,
    attendanceChanges,
    isEditMode,
    hasExistingAttendance,
    enabledStages,
    hasMultipleStages,
    availableGrades,
    availableSections,
    settings,
    students,
    recordAttendance,
    loading,
    setSelectedStage,
    setSelectedGrade,
    setSelectedSection,
    setSelectedDate,
    setSelectedPeriod,
    setAttendanceChanges,
    setIsEditMode,
    getStageDisplayName
  } = useAttendanceState();

  const {
    recordLateAttendance,
    removeLateRecord,
    getStudentLateRecord,
    getLateRecordsForDate
  } = useLateAttendance();

  const handleStudentLateStatus = (studentId: string, lateType: 'morning_lineup' | 'after_lineup' | 'period_1' | 'period_2' | 'period_3' | 'period_4' | 'period_5' | 'period_6' | 'period_7' | null) => {
    console.log('Handling student late status change:', { studentId, lateType });
    
    if (!hasExistingAttendance || isEditMode) {
      const period = settings?.attendance_type === 'hourly' ? selectedPeriod : undefined;
      
      if (lateType) {
        // تسجيل التأخر فقط - لا نغير حالة الحضور تلقائياً
        recordLateAttendance(studentId, selectedDate, lateType, period);
      } else {
        // إزالة تسجيل التأخر
        removeLateRecord(studentId, selectedDate, period);
      }
    }
  };

  const saveAttendance = () => {
    console.log('Save late attendance clicked');
    console.log('Current attendance changes:', attendanceChanges);
    console.log('Students with attendance:', studentsWithAttendance);
    
    if (!selectedGrade || !selectedSection) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار الصف والشعبة",
        variant: "destructive"
      });
      return;
    }

    // تسجيل الحضور للطلاب الذين تم تغيير حالتهم فقط
    const studentsWithStatus = studentsWithAttendance.filter(student => 
      attendanceChanges.hasOwnProperty(student.id)
    ).map(student => ({
      ...student,
      finalStatus: attendanceChanges[student.id]
    }));

    let savedCount = 0;
    studentsWithStatus.forEach(student => {
      const status = student.finalStatus;
      const period = settings?.attendance_type === 'hourly' ? selectedPeriod : undefined;
      
      console.log('Recording attendance for student:', {
        studentId: student.id,
        date: selectedDate,
        status,
        period
      });
      
      recordAttendance(student.id, selectedDate, status, period);
      savedCount++;
    });

    setAttendanceChanges({});
    setIsEditMode(false);
    
    const periodText = settings?.attendance_type === 'hourly' ? ` (الحصة ${selectedPeriod})` : '';
    const stageText = hasMultipleStages && selectedStage ? ` - ${getStageDisplayName(selectedStage)}` : '';
    const actionText = hasExistingAttendance ? "تعديل" : "حفظ";
    
    console.log('Late attendance saved successfully:', { savedCount, hasExistingAttendance });
    
    toast({
      title: "تم الحفظ بنجاح",
      description: `تم ${actionText} التأخر لـ ${savedCount} طالب لتاريخ ${selectedDate}${stageText}${periodText}`,
      variant: "default"
    });
  };

  const enableEditMode = () => {
    setIsEditMode(true);
  };

  const currentLateRecords = getLateRecordsForDate(selectedDate, settings?.attendance_type === 'hourly' ? selectedPeriod : undefined);

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-orange-600 mb-2">تسجيل التأخر</h1>
          <p className="text-orange-600/70">تسجيل تأخر الطلاب عن الاصطفاف الصباحي والحصص</p>
        </div>
        <Link to="/school">
          <Button variant="outline" className="bg-white/90 hover:bg-white text-orange-600 border-white/20">العودة للرئيسية</Button>
        </Link>
      </div>

      {/* Warning for no students */}
      {students.length === 0 && (
        <div className="mb-6 p-4 bg-yellow-100/90 border border-yellow-300 rounded-lg backdrop-blur-sm">
          <p className="text-yellow-800">
            <strong>تنبيه:</strong> لا توجد بيانات طلاب محفوظة. يرجى إضافة طلاب من صفحة إدارة الطلاب أولاً.
          </p>
          <Link to="/students" className="text-school-blue underline font-medium">
            اذهب إلى صفحة إدارة الطلاب
          </Link>
        </div>
      )}

      {/* Existing Attendance Alert */}
      <AttendanceAlert 
        hasExistingAttendance={hasExistingAttendance}
        studentsLength={studentsWithAttendance.length}
        isEditMode={isEditMode}
        onEnableEditMode={enableEditMode}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Section */}
        <div className="lg:col-span-1">
          <LateAttendanceControls
            selectedDate={selectedDate}
            selectedStage={selectedStage}
            selectedGrade={selectedGrade}
            selectedSection={selectedSection}
            selectedPeriod={selectedPeriod}
            hasMultipleStages={hasMultipleStages}
            enabledStages={enabledStages}
            availableGrades={availableGrades}
            availableSections={availableSections}
            studentsWithAttendance={studentsWithAttendance}
            hasExistingAttendance={hasExistingAttendance}
            isEditMode={isEditMode}
            settings={settings}
            loading={loading}
            onDateChange={setSelectedDate}
            onStageChange={setSelectedStage}
            onGradeChange={setSelectedGrade}
            onSectionChange={setSelectedSection}
            onPeriodChange={setSelectedPeriod}
            onSaveAttendance={saveAttendance}
            getStageDisplayName={(stage) =>
              typeof stage === 'string' ? stage : (stage.name_ar || stage.name || stage.id)
            }
          />

          {/* Late Attendance Statistics */}
          <LateAttendanceStats 
            studentsWithAttendance={studentsWithAttendance}
            attendanceChanges={attendanceChanges}
            currentLateRecords={currentLateRecords}
          />
        </div>

        {/* Students List */}
        <div className="lg:col-span-3">
          <LateStudentsList
            studentsWithAttendance={studentsWithAttendance}
            selectedGrade={selectedGrade}
            selectedSection={selectedSection}
            selectedStage={selectedStage}
            selectedPeriod={selectedPeriod}
            hasMultipleStages={hasMultipleStages}
            hasExistingAttendance={hasExistingAttendance}
            isEditMode={isEditMode}
            settings={settings}
            studentsLength={students.length}
            attendanceChanges={attendanceChanges}
            onStudentLateStatusChange={handleStudentLateStatus}
            getStageDisplayName={getStageDisplayName}
            getStudentLateRecord={getStudentLateRecord}
          />
        </div>
      </div>
    </div>
  );
};

export default LateAttendance;
