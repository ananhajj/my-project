
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { GraduationCap, Calendar, BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export const QuickNavigation = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      <Card className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-lg shadow-xl lg:shadow-2xl border-0 rounded-2xl lg:rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl lg:hover:shadow-3xl cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10"></div>
        <Link to="/school/students">
          <CardContent className="p-6 lg:p-8 flex items-center gap-3 lg:gap-4 relative z-10">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg lg:shadow-xl">
              <GraduationCap className="w-6 h-6 lg:w-8 lg:h-8" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg lg:text-xl font-bold text-school-navy mb-1 lg:mb-2">إدارة الطلاب</CardTitle>
              <CardDescription className="text-xs lg:text-sm text-school-navy/70">إضافة وتعديل بيانات الطلاب</CardDescription>
            </div>
            <ChevronRight className="text-school-navy/40 w-5 h-5 lg:w-6 lg:h-6" />
          </CardContent>
        </Link>
      </Card>

      <Card className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-lg shadow-xl lg:shadow-2xl border-0 rounded-2xl lg:rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl lg:hover:shadow-3xl cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10"></div>
        <Link to="/school/attendance">
          <CardContent className="p-6 lg:p-8 flex items-center gap-3 lg:gap-4 relative z-10">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center shadow-lg lg:shadow-xl">
              <Calendar className="w-6 h-6 lg:w-8 lg:h-8" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg lg:text-xl font-bold text-school-navy mb-1 lg:mb-2">تسجيل الحضور</CardTitle>
              <CardDescription className="text-xs lg:text-sm text-school-navy/70">تسجيل حضور وغياب الطلاب يومياً</CardDescription>
            </div>
            <ChevronRight className="text-school-navy/40 w-5 h-5 lg:w-6 lg:h-6" />
          </CardContent>
        </Link>
      </Card>

      <Card className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-lg shadow-xl lg:shadow-2xl border-0 rounded-2xl lg:rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl lg:hover:shadow-3xl cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10"></div>
        <Link to="/school/reports">
          <CardContent className="p-6 lg:p-8 flex items-center gap-3 lg:gap-4 relative z-10">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center shadow-lg lg:shadow-xl">
              <BookOpen className="w-6 h-6 lg:w-8 lg:h-8" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg lg:text-xl font-bold text-school-navy mb-1 lg:mb-2">التقارير</CardTitle>
              <CardDescription className="text-xs lg:text-sm text-school-navy/70">عرض التقارير والإحصائيات المفصلة</CardDescription>
            </div>
            <ChevronRight className="text-school-navy/40 w-5 h-5 lg:w-6 lg:h-6" />
          </CardContent>
        </Link>
      </Card>
    </div>
  );
};
