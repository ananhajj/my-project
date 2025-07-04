
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, TrendingUp } from "lucide-react";

interface LateAttendanceStatsProps {
  totalLateStudents: number;
  totalLateInstances: number;
  averageLateRate: number;
  attendanceRate: number;
  totalStudents: number;
}

export const LateAttendanceStats = ({
  totalLateStudents,
  totalLateInstances,
  averageLateRate,
  totalStudents
}: LateAttendanceStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* إجمالي الطلاب */}
      <Card className="bg-gradient-to-br from-report-blue/10 to-report-blue/5 border-report-blue/20">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-6 w-6 text-report-blue" />
          </div>
          <div className="text-2xl font-bold text-report-blue">{totalStudents}</div>
          <div className="text-sm text-report-navy">إجمالي الطلاب</div>
        </CardContent>
      </Card>

      {/* معدل التأخر */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-6 w-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{averageLateRate}%</div>
          <div className="text-sm text-report-navy">معدل التأخر</div>
        </CardContent>
      </Card>

      {/* تنبيهات تأخر */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-6 w-6 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-500">{totalLateStudents}</div>
          <div className="text-sm text-report-navy">تنبيهات تأخر</div>
        </CardContent>
      </Card>
    </div>
  );
};
