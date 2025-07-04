
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, TrendingUp, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface NoStudentsStateProps {
  schoolLogo: string;
}

export const NoStudentsState = ({ schoolLogo }: NoStudentsStateProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 flex items-center justify-center p-6" dir="rtl">
      <Card className="w-full max-w-4xl backdrop-blur-xl bg-white/90 shadow-2xl border-0 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-school-green/3 to-school-blue/3"></div>
        <CardHeader className="text-center pb-6 relative z-10">
          <div className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-school-green to-school-teal rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-white font-bold text-2xl">{schoolLogo}</span>
          </div>
          <CardTitle className="text-3xl font-bold text-school-navy mb-3">ابدأ رحلة التعلم الرقمي</CardTitle>
          <CardDescription className="text-xl text-school-navy/70 max-w-2xl mx-auto leading-relaxed">
            لم يتم إضافة أي طلاب بعد. ابدأ بإضافة الطلاب لتتمكن من تسجيل الحضور واستخدام جميع مميزات النظام المتطور
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-8 relative z-10">
          <Link to="/school/students">
            <Button className="bg-gradient-to-r from-school-green via-school-teal to-school-blue hover:from-school-green/90 hover:via-school-teal/90 hover:to-school-blue/90 text-white px-8 py-6 text-lg font-semibold shadow-xl transition-all duration-300 rounded-2xl transform hover:scale-105 mb-6">
              <Plus className="ml-2 h-6 w-6" />
              إضافة الطلاب
            </Button>
          </Link>
          
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-6 bg-white/60 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-300 hover:scale-105 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-school-navy mb-2">إدارة الطلاب</h3>
              <p className="text-sm text-school-navy/70">إضافة وتعديل بيانات الطلاب</p>
            </div>
            
            <div className="text-center p-6 bg-white/60 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-300 hover:scale-105 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-school-navy mb-2">تسجيل الحضور</h3>
              <p className="text-sm text-school-navy/70">متابعة حضور الطلاب يومياً</p>
            </div>
            
            <div className="text-center p-6 bg-white/60 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-300 hover:scale-105 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-school-navy mb-2">التقارير</h3>
              <p className="text-sm text-school-navy/70">إحصائيات وتقارير شاملة</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
