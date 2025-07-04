
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";
import { Users, UserCheck, Award, Clock, BarChart3 } from "lucide-react";

interface DashboardStatsProps {
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  lateStudents: number;
}

export const DashboardStats = ({ totalStudents, presentStudents, absentStudents, lateStudents }: DashboardStatsProps) => {
  return (
    <Card className="bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-lg shadow-xl border-0 rounded-2xl lg:rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/10"></div>
      <CardHeader className="relative z-10 pb-3 p-3 lg:p-4">
        <CardTitle className="text-base lg:text-lg font-bold text-school-navy text-left flex items-center justify-start gap-2">
          <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6" />
          <span>البيانات اليومية</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 lg:p-4 pt-0 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {/* إجمالي الطلاب */}
          <div className="text-center ">
            <div className="w-8 h-8 bg-gradient-to-br from-[#3D7EB9] to-[#15445A] lg:w-10 lg:h-10 mx-auto mb-1 lg:mb-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg">
              <Users className="w-4 h-4 lg:w-5 lg:h-5" />
            </div>
            <CardTitle className="text-lg lg:text-xl font-bold text-school-navy mb-1">{totalStudents}</CardTitle>
            <CardDescription className="text-xs lg:text-sm text-school-navy/70 font-medium">عدد الطلاب الكلي</CardDescription>
          </div>

          {/* الطلاب الحاضرون */}
          <div className="text-center">
            <div className="w-8 h-8 bg-gradient-to-br from-[#07A869] to-[#0DA9A6] lg:w-10 lg:h-10 mx-auto mb-1 lg:mb-2 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center shadow-lg">
              <UserCheck className="w-4 h-4 lg:w-5 lg:h-5" />
            </div>
            <CardTitle className="text-lg lg:text-xl font-bold text-school-navy mb-1">{presentStudents}</CardTitle>
            <CardDescription className="text-xs lg:text-sm text-school-navy/70 font-medium">الطلاب الحاضرون اليوم</CardDescription>
          </div>

          {/* الطلاب الغائبون */}
          <div className="text-center">
            <div className="w-8 h-8 bg-gradient-to-br from-[#E05B5B] to-[#D9822B] lg:w-10 lg:h-10 mx-auto mb-1 lg:mb-2 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center shadow-lg">
              <Award className="w-4 h-4 lg:w-5 lg:h-5" />
            </div>
            <CardTitle className="text-lg lg:text-xl font-bold text-school-navy mb-1">{absentStudents}</CardTitle>
            <CardDescription className="text-xs lg:text-sm text-school-navy/70 font-medium">الطلاب الغائبون اليوم</CardDescription>
          </div>

          {/* الطلاب المتأخرون */}
          <div className="text-center">
            <div className="w-8 h-8 bg-gradient-to-br from-[#F4A261] to-[#D9822B] lg:w-10 lg:h-10 mx-auto mb-1 lg:mb-2 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 text-white flex items-center justify-center shadow-lg">
              <Clock className="w-4 h-4 lg:w-5 lg:h-5" />
            </div>
            <CardTitle className="text-lg lg:text-xl font-bold text-school-navy mb-1">{lateStudents}</CardTitle>
            <CardDescription className="text-xs lg:text-sm text-school-navy/70 font-medium">الطلاب المتأخرون اليوم</CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
