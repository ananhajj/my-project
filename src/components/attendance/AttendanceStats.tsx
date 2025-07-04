import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudentWithAttendance } from "@/types/attendance";

interface AttendanceStatsProps {
  studentsWithAttendance: StudentWithAttendance[];
}

export const AttendanceStats = ({ studentsWithAttendance }: AttendanceStatsProps) => {
  const presentCount = studentsWithAttendance.filter(s => s.isPresent === true).length;
  const absentCount = studentsWithAttendance.filter(s => s.isPresent === false).length;
  const undefinedCount = studentsWithAttendance.filter(s => s.isPresent === undefined).length;
  const attendancePercentage = studentsWithAttendance.length > 0 ? 
    ((presentCount / studentsWithAttendance.length) * 100).toFixed(1) : 0;

  if (studentsWithAttendance.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg">
      <CardHeader className="bg-school-teal/5 rounded-t-lg">
        <CardTitle className="text-school-navy">إحصائيات سريعة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-6">
        <div className="flex justify-between items-center">
          <span className="text-school-navy">إجمالي الطلاب:</span>
          <Badge className="bg-school-blue text-white">{studentsWithAttendance.length}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-school-navy">الحضور:</span>
          <Badge className="bg-school-green text-white">{presentCount}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-school-navy">الغياب:</span>
          <Badge className="bg-red-500 text-white">{absentCount}</Badge>
        </div>
        {undefinedCount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-school-navy">غير محدد:</span>
            <Badge className="bg-school-gray text-school-navy">{undefinedCount}</Badge>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-school-navy">نسبة الحضور:</span>
          <Badge className="bg-school-beige text-school-navy">{attendancePercentage}%</Badge>
        </div>
      </CardContent>
    </Card>
  );
};
