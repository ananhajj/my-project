
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, GraduationCap, Users, TrendingUp, AlertTriangle } from "lucide-react";

interface ReportsFiltersProps {
  filteredStudentsCount: number;
  overallAttendanceRate: number;
  totalAttendanceRecords: number;
  studentsWithAlertsCount: number;
  studentsWithLateAlertsCount: number;
  overallLateRate: number;
}

export const ReportsFilters = ({
  filteredStudentsCount,
  overallAttendanceRate,
  totalAttendanceRecords,
  studentsWithAlertsCount
}: ReportsFiltersProps) => {
  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* تنبيهات غياب */}
        <Card className="bg-gradient-to-br from-report-red/10 to-report-red/5 border-report-red/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-6 w-6 text-report-red" />
            </div>
            <div className="text-2xl font-bold text-report-red">{studentsWithAlertsCount}</div>
            <div className="text-sm text-report-navy">تنبيهات غياب</div>
          </CardContent>
        </Card>

        {/* معدل الحضور */}
        <Card className="bg-gradient-to-br from-report-green/10 to-report-teal/5 border-report-green/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-report-green" />
            </div>
            <div className="text-2xl font-bold text-report-green">{overallAttendanceRate}%</div>
            <div className="text-sm text-report-navy">معدل الحضور</div>
          </CardContent>
        </Card>

        {/* إجمالي الطلاب */}
        <Card className="bg-gradient-to-br from-report-blue/10 to-report-blue/5 border-report-blue/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-report-blue" />
            </div>
            <div className="text-2xl font-bold text-report-blue">{filteredStudentsCount}</div>
            <div className="text-sm text-report-navy">إجمالي الطلاب</div>
          </CardContent>
        </Card>

        {/* إجمالي السجلات */}
        <Card className="bg-gradient-to-br from-report-navy/10 to-report-navy/5 border-report-navy/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CalendarDays className="h-6 w-6 text-report-navy" />
            </div>
            <div className="text-2xl font-bold text-report-navy">{totalAttendanceRecords}</div>
            <div className="text-sm text-report-navy">إجمالي السجلات</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
