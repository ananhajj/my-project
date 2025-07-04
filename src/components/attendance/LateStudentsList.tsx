import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Users } from "lucide-react";
import { StudentWithAttendance } from "@/types/attendance";
import { LateRecord } from "@/hooks/useLateAttendance";

interface LateStudentsListProps {
  studentsWithAttendance: StudentWithAttendance[];
  selectedGrade: string;
  selectedSection: string;
  selectedStage: string;
  selectedPeriod: string;
  hasMultipleStages: boolean;
  hasExistingAttendance: boolean;
  isEditMode: boolean;
  settings: any;
  studentsLength: number;
  attendanceChanges: {[studentId: string]: 'present' | 'absent' | 'late' | undefined};
  onStudentLateStatusChange: (studentId: string, lateType: 'morning_lineup' | 'after_lineup' | 'period_1' | 'period_2' | 'period_3' | 'period_4' | 'period_5' | 'period_6' | 'period_7' | null) => void;
  getStageDisplayName: (stage: any) => string;
  getStudentLateRecord: (studentId: string, date: string, period?: string) => LateRecord | undefined;
}

const lateOptions = [
  { value: null, label: "غير متأخر", color: "text-green-600" },
  { value: "morning_lineup", label: "متأخر عن الاصطفاف الصباحي", color: "text-orange-700" },
  { value: "after_lineup", label: "حضر بعد الاصطفاف مباشرة", color: "text-orange-700" },
  { value: "period_1", label: "حضر أثناء الحصة الأولى", color: "text-orange-700" },
  { value: "period_2", label: "حضر أثناء الحصة الثانية", color: "text-orange-700" },
  { value: "period_3", label: "حضر أثناء الحصة الثالثة", color: "text-orange-700" },
  { value: "period_4", label: "حضر أثناء الحصة الرابعة", color: "text-orange-700" },
  { value: "period_5", label: "حضر أثناء الحصة الخامسة", color: "text-orange-700" },
  { value: "period_6", label: "حضر أثناء الحصة السادسة", color: "text-orange-700" },
  { value: "period_7", label: "حضر أثناء الحصة السابعة", color: "text-orange-700" },
];

export const LateStudentsList = ({
  studentsWithAttendance,
  selectedGrade,
  selectedSection,
  selectedStage,
  selectedPeriod,
  hasMultipleStages,
  hasExistingAttendance,
  isEditMode,
  settings,
  studentsLength,
  attendanceChanges,
  onStudentLateStatusChange,
  getStageDisplayName,
  getStudentLateRecord
}: LateStudentsListProps) => {
  const canModify = !hasExistingAttendance || isEditMode;

  if (studentsLength === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد بيانات طلاب</h3>
          <p className="text-gray-500 mb-4">يرجى إضافة طلاب من صفحة إدارة الطلاب أولاً</p>
        </CardContent>
      </Card>
    );
  }

  if (!selectedGrade || !selectedSection) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
        <CardContent className="p-8 text-center">
          <Clock className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">اختر الصف والشعبة</h3>
          <p className="text-gray-500">قم بتحديد الصف والشعبة لعرض قائمة الطلاب</p>
        </CardContent>
      </Card>
    );
  }

  if (studentsWithAttendance.length === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد طلاب في هذا الصف والشعبة</h3>
          <p className="text-gray-500">
            لا يوجد طلاب في {selectedGrade} - {selectedSection}
            {hasMultipleStages && selectedStage && ` - ${getStageDisplayName(selectedStage)}`}
          </p>
        </CardContent>
      </Card>
    );
  }

  const periodText = settings?.attendance_type === 'hourly' ? ` - الحصة ${selectedPeriod}` : '';
  const stageText = hasMultipleStages && selectedStage ? ` - ${getStageDisplayName(selectedStage)}` : '';

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-orange-600">
          <Clock className="h-5 w-5" />
          قائمة طلاب {selectedGrade} - {selectedSection}{stageText}{periodText}
          <span className="text-sm font-normal text-gray-500">({studentsWithAttendance.length} طالب)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {studentsWithAttendance.map((student, index) => {
            const currentLateRecord = getStudentLateRecord(
              student.id, 
              new Date().toISOString().split('T')[0], // اليوم الحالي - يمكن تغييره للتاريخ المحدد
              settings?.attendance_type === 'hourly' ? selectedPeriod : undefined
            );
            
            const isLate = !!currentLateRecord;
            const attendanceStatus = attendanceChanges.hasOwnProperty(student.id) 
              ? attendanceChanges[student.id] 
              : (isLate ? 'present' : student.status || 'present'); // الطالب المتأخر يعتبر حاضر
            
            return (
              <div
                key={student.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isLate
                    ? 'bg-orange-50 border-orange-200'
                    : attendanceStatus === 'present'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      {student.name}
                      {isLate && (
                        <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
                          متأخر
                        </span>
                      )}
                      {attendanceStatus === 'present' && !isLate && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          حاضر
                        </span>
                      )}
                    </div>
                    {currentLateRecord && (
                      <div className="text-sm text-orange-700 mt-1">
                        {lateOptions.find(opt => opt.value === currentLateRecord.lateType)?.label}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0 min-w-[250px]">
                    <Select
                      value={currentLateRecord?.lateType || 'null'}
                      onValueChange={(value) => {
                        const lateType = value === 'null' ? null : value as any;
                        onStudentLateStatusChange(student.id, lateType);
                      }}
                      disabled={!canModify}
                    >
                      <SelectTrigger className={`w-full text-right ${
                        isLate 
                          ? 'border-orange-300 bg-orange-50' 
                          : 'border-gray-300 bg-white'
                      }`}>
                        <SelectValue placeholder="اختر حالة التأخر" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                        {lateOptions.map((option) => (
                          <SelectItem 
                            key={option.value || 'null'} 
                            value={option.value || 'null'}
                            className="hover:bg-gray-50 text-right"
                          >
                            <span className={option.color}>
                              {option.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
