
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, AlertTriangle } from "lucide-react";

interface TopStudentsSectionProps {
  mostAbsentStudents: any[];
  bestAttendanceStudents: any[];
  selectedPeriod: string;
}

export const TopStudentsSection = ({
  mostAbsentStudents,
  bestAttendanceStudents,
  selectedPeriod
}: TopStudentsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Most Absent Students */}
      <Card className="bg-gradient-to-br from-red-50/90 to-rose-50/90 backdrop-blur-sm border-red-200/50 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-600 text-base">
            <AlertTriangle className="h-4 w-4" />
            الأكثر غياباً - {selectedPeriod}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {mostAbsentStudents.length > 0 ? (
            mostAbsentStudents.slice(0, 5).map((student, index) => (
              <div key={student.id} className="flex justify-between items-center p-2 bg-white/60 rounded border border-red-100">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="bg-red-100 text-red-700 text-xs">
                    {index + 1}
                  </Badge>
                  <span className="text-sm font-medium text-red-700">{student.name}</span>
                </div>
                <div className="flex gap-1 text-xs">
                  <span className="text-red-600 font-medium">{student.absenceDays || 0} يوم</span>
                  <span className="text-red-500">({student.attendancePercentage}%)</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-red-600 text-center py-2">لا توجد بيانات</p>
          )}
        </CardContent>
      </Card>

      {/* Best Attendance Students */}
      <Card className="bg-gradient-to-br from-green-50/90 to-emerald-50/90 backdrop-blur-sm border-green-200/50 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-600 text-base">
            <Trophy className="h-4 w-4" />
            الأفضل حضوراً - {selectedPeriod}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {bestAttendanceStudents.length > 0 ? (
            bestAttendanceStudents.slice(0, 5).map((student, index) => (
              <div key={student.id} className="flex justify-between items-center p-2 bg-white/60 rounded border border-green-100">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    {index + 1}
                  </Badge>
                  <span className="text-sm font-medium text-green-700">{student.name}</span>
                </div>
                <div className="flex gap-1 text-xs">
                  <span className="text-green-600 font-medium">{student.attendancePercentage}%</span>
                  <span className="text-green-500">({student.absenceDays || 0} غياب)</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-green-600 text-center py-2">لا توجد بيانات</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
