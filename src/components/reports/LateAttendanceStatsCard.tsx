
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Clock, AlertTriangle } from "lucide-react";

interface LateAttendanceStatsCardProps {
  stats: {
    totalLateStudents: number;
    totalOnTimeStudents: number;
    totalLateInstances: number;
    latePercentage: number;
    attendanceRate: number;
    totalStudents: number;
  };
}

export const LateAttendanceStatsCard = ({ stats }: LateAttendanceStatsCardProps) => {
  const onTimePercentage = stats.totalStudents > 0 ? 
    Math.round((stats.totalOnTimeStudents / stats.totalStudents) * 100) : 0;

  // حساب تنبيهات التأخر المتكرر (الطلاب الذين تأخروا 3 مرات أو أكثر)
  const repeatedLateAlertsCount = Math.floor(stats.totalLateInstances / 3);

  return (
    <Card className="mb-6 bg-gradient-to-br from-orange-50/90 to-amber-50/90 backdrop-blur-sm border-orange-200/50 shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* إجمالي الطلاب */}
          <div className="text-center p-4 bg-white/60 rounded-lg border border-green-100">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{stats.totalStudents}</div>
            <div className="text-sm text-green-700 font-medium">إجمالي الطلاب</div>
          </div>

          {/* معدل عدم التأخر وعدد الطلاب المنضبطين */}
          <div className="text-center p-4 bg-white/60 rounded-lg border border-emerald-100">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-1">{onTimePercentage}%</div>
            <div className="text-sm text-emerald-700 font-medium">معدل عدم التأخر</div>
            <div className="text-xs text-emerald-600 mt-1">{stats.totalOnTimeStudents} منضبط</div>
          </div>

          {/* معدل التأخر وعدد حالات التأخر */}
          <div className="text-center p-4 bg-white/60 rounded-lg border border-orange-100">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">{stats.latePercentage}%</div>
            <div className="text-sm text-orange-700 font-medium">معدل التأخر</div>
            <div className="text-xs text-orange-600 mt-1">{stats.totalLateInstances} تأخر</div>
          </div>

          {/* تنبيهات التأخر المتكرر */}
          <div className="text-center p-4 bg-white/60 rounded-lg border border-red-100">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600 mb-1">{repeatedLateAlertsCount}</div>
            <div className="text-sm text-red-700 font-medium">تنبيهات التأخر</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
