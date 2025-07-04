
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, TriangleAlert, XCircle } from "lucide-react";

interface UnifiedStatsCardProps {
  totalRecords: number;
  totalStudents: number;
  attendanceRate: number;
  alertsCount: number;
  absenceCount: number;
  presentCount: number;
  presentPercentage: number;
  absencePercentage: number;
  lateRecurrenceRate?: number;
}

export const UnifiedStatsCard = ({
  totalRecords,
  totalStudents,
  attendanceRate,
  alertsCount,
  absenceCount,
  presentCount,
  presentPercentage,
  absencePercentage,
  lateRecurrenceRate = 0
}: UnifiedStatsCardProps) => {
  return (
    <Card className="mb-6 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-sm border-blue-200/50 shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* إجمالي الطلاب */}
          <div className="text-center p-4 bg-white/60 rounded-lg border border-green-100">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{totalStudents}</div>
            <div className="text-sm text-green-700 font-medium">إجمالي الطلاب</div>
          </div>

          {/* معدل الحضور وعدد الحضور */}
          <div className="text-center p-4 bg-white/60 rounded-lg border border-emerald-100">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-1">{attendanceRate}%</div>
            <div className="text-sm text-emerald-700 font-medium">معدل الحضور</div>
            <div className="text-xs text-emerald-600 mt-1">{presentCount} حضور</div>
          </div>

          {/* معدل الغياب وعدد الغياب */}
          <div className="text-center p-4 bg-white/60 rounded-lg border border-gray-100">
            <div className="flex items-center justify-center mb-2">
              <XCircle className="h-8 w-8 text-gray-600" />
            </div>
            <div className="text-3xl font-bold text-gray-600 mb-1">{absencePercentage}%</div>
            <div className="text-sm text-gray-700 font-medium">معدل الغياب</div>
            <div className="text-xs text-gray-600 mt-1">{absenceCount} غياب</div>
          </div>

          {/* تنبيهات غياب */}
          <div className="text-center p-4 bg-white/60 rounded-lg border border-red-100">
            <div className="flex items-center justify-center mb-2">
              <TriangleAlert className="h-8 w-8 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600 mb-1">{alertsCount}</div>
            <div className="text-sm text-red-700 font-medium">تنبيهات غياب</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
