
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, TrendingUp } from "lucide-react";
import { StudentWithAttendance } from "@/types/attendance";
import { LateRecord } from "@/hooks/useLateAttendance";

interface LateAttendanceStatsProps {
  studentsWithAttendance: StudentWithAttendance[];
  attendanceChanges: {[studentId: string]: 'present' | 'absent' | 'late' | undefined};
  currentLateRecords: LateRecord[];
}

export const LateAttendanceStats = ({ 
  studentsWithAttendance, 
  attendanceChanges,
  currentLateRecords
}: LateAttendanceStatsProps) => {
  const totalStudents = studentsWithAttendance.length;
  
  if (totalStudents === 0) {
    return null;
  }

  // عدد الطلاب المتأخرين
  const lateCount = currentLateRecords.length;

  // عدد الطلاب الذين تم تسجيل حضورهم يدوياً
  const manuallyMarkedPresent = Object.values(attendanceChanges).filter(status => status === 'present').length;
  const manuallyMarkedAbsent = Object.values(attendanceChanges).filter(status => status === 'absent').length;

  // عدد الطلاب غير المحددين (لم يتم تسجيل حضورهم ولا تأخرهم)
  const undefinedCount = totalStudents - lateCount - manuallyMarkedPresent - manuallyMarkedAbsent;

  // معدل التأخر
  const lateRate = totalStudents > 0 ? 
    Math.round((lateCount / totalStudents) * 100) : 0;

  // معدل الحضور المسجل يدوياً
  const manualAttendanceRate = totalStudents > 0 ? 
    Math.round((manuallyMarkedPresent / totalStudents) * 100) : 0;

  // معدل الغياب المسجل يدوياً
  const manualAbsentRate = totalStudents > 0 ? 
    Math.round((manuallyMarkedAbsent / totalStudents) * 100) : 0;

  return (
    <Card className="bg-gradient-to-br from-orange-50/90 to-amber-50/90 backdrop-blur-sm border-orange-200/50 shadow-lg mt-4">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-orange-600 text-base">
          <TrendingUp className="h-4 w-4" />
          إحصائيات التأخر والحضور
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* نسبة التأخر */}
        <div className="text-center p-3 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">{lateRate}%</div>
          <div className="text-sm text-orange-700">نسبة التأخر</div>
        </div>

        {/* نسبة الحضور المسجل */}
        <div className="text-center p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{manualAttendanceRate}%</div>
          <div className="text-sm text-green-700">حضور مسجل يدوياً</div>
        </div>

        {/* نسبة الغياب المسجل */}
        <div className="text-center p-3 bg-gradient-to-r from-red-100 to-rose-100 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">{manualAbsentRate}%</div>
          <div className="text-sm text-red-700">غياب مسجل يدوياً</div>
        </div>

        {/* التفاصيل */}
        <div className="space-y-2 pt-2 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">متأخرون:</span>
            <span className="font-medium text-orange-600">{lateCount}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">حاضرون (مسجل):</span>
            <span className="font-medium text-green-600">{manuallyMarkedPresent}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">غائبون (مسجل):</span>
            <span className="font-medium text-red-600">{manuallyMarkedAbsent}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">غير محدد:</span>
            <span className="font-medium text-gray-600">{undefinedCount}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium pt-2 border-t border-gray-100">
            <span className="text-gray-800">المجموع:</span>
            <span className="text-gray-800">{totalStudents}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
