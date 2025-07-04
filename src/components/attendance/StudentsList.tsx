
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserX } from "lucide-react";
import { StudentWithAttendance } from "@/types/attendance";

interface StudentsListProps {
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
  onStudentAttendanceChange: (studentId: string, isPresent: boolean) => void;
  getStageDisplayName: (stage: any) => string;
}

export const StudentsList = ({
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
  onStudentAttendanceChange,
  getStageDisplayName
}: StudentsListProps) => {
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
          <Users className="h-12 w-12 text-school-blue/40 mx-auto mb-4" />
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
        <CardTitle className="flex items-center gap-2 text-school-blue">
          <Users className="h-5 w-5" />
          قائمة طلاب {selectedGrade} - {selectedSection}{stageText}{periodText}
          <span className="text-sm font-normal text-gray-500">({studentsWithAttendance.length} طالب)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {studentsWithAttendance.map((student, index) => {
            const isPresent = student.isPresent;
            
            return (
              <div
                key={student.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isPresent === true
                    ? 'bg-green-50 border-green-200'
                    : isPresent === false
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      <span className="text-gray-500 text-sm">{index + 1}.</span>
                      {student.name}
                      {isPresent === true && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                          حاضر
                        </span>
                      )}
                      {isPresent === false && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                          غائب
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={isPresent === true ? "default" : "outline"}
                      className={`${
                        isPresent === true 
                          ? "bg-green-600 hover:bg-green-700 text-white" 
                          : "border-green-300 text-green-600 hover:bg-green-50"
                      }`}
                      onClick={() => onStudentAttendanceChange(student.id, true)}
                      disabled={!canModify}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      حاضر
                    </Button>
                    <Button
                      size="sm"
                      variant={isPresent === false ? "default" : "outline"}
                      className={`${
                        isPresent === false 
                          ? "bg-red-600 hover:bg-red-700 text-white" 
                          : "border-red-300 text-red-600 hover:bg-red-50"
                      }`}
                      onClick={() => onStudentAttendanceChange(student.id, false)}
                      disabled={!canModify}
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      غائب
                    </Button>
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
