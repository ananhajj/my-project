import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { AttendanceControls } from "@/components/attendance/AttendanceControls";
import { StudentsList } from "@/components/attendance/StudentsList";
import { AttendanceStats } from "@/components/attendance/AttendanceStats";
import { AttendanceAlert } from "@/components/attendance/AttendanceAlert";
import { useAttendanceState } from "@/hooks/useAttendanceState";
import { useLateAttendance } from "@/hooks/useLateAttendance";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const Attendance = () => {
  const { toast } = useToast();
  const [showAbsentWarning, setShowAbsentWarning] = useState(false);
  const [showMarkAllAbsentWarning, setShowMarkAllAbsentWarning] = useState(false);
  const [pendingStudentId, setPendingStudentId] = useState<string>("");
  const [lateStudentsNames, setLateStudentsNames] = useState<string[]>([]);
  
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

  const { getStudentLateRecord } = useLateAttendance();

  const handleStudentAttendance = (studentId: string, isPresent: boolean) => {
    console.log('Handling student attendance change:', { studentId, isPresent });
    
    if (!hasExistingAttendance || isEditMode) {
      // التحقق من وجود تسجيل تأخر للطالب
      const period = settings?.attendance_type === 'hourly' ? selectedPeriod : undefined;
      const lateRecord = getStudentLateRecord(studentId, selectedDate, period);
      
      // إذا كان الطالب متأخر ونريد تسجيله غائب، نظهر تنبيه
      if (lateRecord && !isPresent) {
        setPendingStudentId(studentId);
        setShowAbsentWarning(true);
        return;
      }
      
      // تسجيل الحضور عادي
      setAttendanceChanges(prev => ({
        ...prev,
        [studentId]: isPresent ? 'present' : 'absent'
      }));
    }
  };

  const confirmAbsentForLateStudent = () => {
    // تسجيل الطالب غائب رغم كونه متأخر
    setAttendanceChanges(prev => ({
      ...prev,
      [pendingStudentId]: 'absent'
    }));
    setShowAbsentWarning(false);
    setPendingStudentId("");
    
    toast({
      title: "تم التسجيل",
      description: "تم تسجيل الطالب غائب رغم وجود تسجيل تأخر له",
      variant: "default"
    });
  };

  const cancelAbsentForLateStudent = () => {
    setShowAbsentWarning(false);
    setPendingStudentId("");
  };

  const markAllPresent = () => {
    if (!hasExistingAttendance || isEditMode) {
      const changes: {[studentId: string]: 'present'} = {};
      studentsWithAttendance.forEach(student => {
        changes[student.id] = 'present';
      });
      setAttendanceChanges(changes);
      toast({
        title: "تم التحديث",
        description: "تم تسجيل حضور جميع الطلاب"
      });
    }
  };

  const markAllAbsent = () => {
    if (!hasExistingAttendance || isEditMode) {
      // التحقق من وجود طلاب متأخرين
      const period = settings?.attendance_type === 'hourly' ? selectedPeriod : undefined;
      const lateStudents = studentsWithAttendance.filter(student => {
        const lateRecord = getStudentLateRecord(student.id, selectedDate, period);
        return lateRecord !== undefined;
      });

      if (lateStudents.length > 0) {
        // عرض أسماء الطلاب المتأخرين
        const lateNames = lateStudents.map(student => student.name);
        setLateStudentsNames(lateNames);
        setShowMarkAllAbsentWarning(true);
        return;
      }

      // إذا لم يوجد طلاب متأخرين، تسجيل الكل غائب مباشرة
      const changes: {[studentId: string]: 'absent'} = {};
      studentsWithAttendance.forEach(student => {
        changes[student.id] = 'absent';
      });
      setAttendanceChanges(changes);
      toast({
        title: "تم التحديث",
        description: "تم تسجيل غياب جميع الطلاب"
      });
    }
  };

  const markAllAbsentExceptLate = () => {
    // تسجيل جميع الطلاب غائب باستثناء المتأخرين وجعل المتأخرين حاضرين
    const period = settings?.attendance_type === 'hourly' ? selectedPeriod : undefined;
    const changes: {[studentId: string]: 'absent' | 'present'} = {};
    
    studentsWithAttendance.forEach(student => {
      const lateRecord = getStudentLateRecord(student.id, selectedDate, period);
      if (lateRecord) {
        // تسجيل الطالب المتأخر حاضر
        changes[student.id] = 'present';
      } else {
        // تسجيل الطالب غائب إذا لم يكن متأخراً
        changes[student.id] = 'absent';
      }
    });
    
    setAttendanceChanges(changes);
    setShowMarkAllAbsentWarning(false);
    setLateStudentsNames([]);
    
    toast({
      title: "تم التسجيل",
      description: "تم تسجيل الكل غائب إلا المتأخرين وجعل المتأخرين حاضرين",
      variant: "default"
    });
  };

  const confirmMarkAllAbsent = () => {
    // تسجيل جميع الطلاب غائب بما في ذلك المتأخرين
    const changes: {[studentId: string]: 'absent'} = {};
    studentsWithAttendance.forEach(student => {
      changes[student.id] = 'absent';
    });
    setAttendanceChanges(changes);
    setShowMarkAllAbsentWarning(false);
    setLateStudentsNames([]);
    
    toast({
      title: "تم التسجيل",
      description: "تم تسجيل غياب جميع الطلاب بما في ذلك المتأخرين",
      variant: "default"
    });
  };

  const cancelMarkAllAbsent = () => {
    setShowMarkAllAbsentWarning(false);
    setLateStudentsNames([]);
  };

  const saveAttendance = () => {
    console.log('Save attendance clicked');
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

    const studentsWithStatus = studentsWithAttendance.map(student => ({
      ...student,
      finalStatus: attendanceChanges.hasOwnProperty(student.id) 
        ? attendanceChanges[student.id] 
        : student.status || (student.isPresent === true ? 'present' : student.isPresent === false ? 'absent' : undefined)
    }));

    const undefinedStudents = studentsWithStatus.filter(s => s.finalStatus === undefined);
    if (undefinedStudents.length > 0) {
      console.log('Students without attendance status:', undefinedStudents);
      toast({
        title: "خطأ",
        description: "يرجى تحديد حالة الحضور لجميع الطلاب أولاً",
        variant: "destructive"
      });
      return;
    }

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
    
    console.log('Attendance saved successfully:', { savedCount, hasExistingAttendance });
    
    toast({
      title: "تم الحفظ بنجاح",
      description: `تم ${actionText} الحضور لـ ${savedCount} طالب لتاريخ ${selectedDate}${stageText}${periodText}`,
      variant: "default"
    });
  };

  const enableEditMode = () => {
    setIsEditMode(true);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8" dir="rtl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-school-blue mb-2">تسجيل الحضور</h1>
            <p className="text-school-blue/70">تسجيل حضور وغياب الطلاب بشكل يومي</p>
          </div>
          <Link to="/school">
            <Button variant="outline" className="bg-white/90 hover:bg-white text-school-blue border-white/20">العودة للرئيسية</Button>
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
            <AttendanceControls
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
              onMarkAllPresent={markAllPresent}
              onMarkAllAbsent={markAllAbsent}
              onSaveAttendance={saveAttendance}
              getStageDisplayName={getStageDisplayName}
            />

            {/* Statistics */}
            <AttendanceStats studentsWithAttendance={studentsWithAttendance} />
          </div>

          {/* Students List */}
          <div className="lg:col-span-3">
            <StudentsList
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
              onStudentAttendanceChange={handleStudentAttendance}
              getStageDisplayName={getStageDisplayName}
            />
          </div>
        </div>
      </div>

      {/* Alert Dialog for Late Student Absent Warning */}
      <AlertDialog open={showAbsentWarning} onOpenChange={setShowAbsentWarning}>
        <AlertDialogContent className="bg-white" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-orange-600 text-right">تنبيه - طالب متأخر</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700 text-right">
              هذا الطالب مسجل كمتأخر اليوم. هل أنت متأكد من تسجيله غائب؟
              <br />
              <span className="text-sm text-gray-500 mt-2 block">
                سيؤثر هذا على إحصائيات الحضور والتأخر
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel 
              onClick={cancelAbsentForLateStudent}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              لا، إلغاء
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmAbsentForLateStudent}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              نعم، تسجيل غائب
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog for Mark All Absent with Late Students Warning */}
      <AlertDialog open={showMarkAllAbsentWarning} onOpenChange={setShowMarkAllAbsentWarning}>
        <AlertDialogContent className="bg-white max-w-md" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-orange-600 text-lg text-right">تنبيه - يوجد طلاب متأخرون</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700 text-base text-right">
              يوجد طلاب متأخرون في هذا الفصل. ماذا تريد أن تفعل؟
              <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="font-medium text-orange-800 mb-2 text-sm text-right">الطلاب المتأخرون:</div>
                <ul className="text-sm text-orange-700 space-y-1 text-right">
                  {lateStudentsNames.map((name, index) => (
                    <li key={index} className="flex items-center gap-2 justify-end">
                      <span>{name}</span>
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0"></span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-sm text-gray-500 mt-3 text-right">
                اختر الإجراء المناسب للتعامل مع الطلاب المتأخرين
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 flex-col">
            <div className="flex flex-col gap-2 w-full">
              <AlertDialogAction 
                onClick={markAllAbsentExceptLate}
                className="bg-blue-600 text-white hover:bg-blue-700 w-full justify-center text-sm py-2 h-auto"
              >
                الجميع غائب إلا المتأخرين
              </AlertDialogAction>
              <AlertDialogAction 
                onClick={confirmMarkAllAbsent}
                className="bg-red-600 text-white hover:bg-red-700 w-full justify-center text-sm py-2 h-auto"
              >
                الجميع غائب
              </AlertDialogAction>
            </div>
            <AlertDialogCancel 
              onClick={cancelMarkAllAbsent}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200 w-full justify-center text-sm py-2 h-auto border-gray-300"
            >
              إلغاء
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Attendance;
