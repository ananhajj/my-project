
import { Card, CardContent } from "@/components/ui/card";
import { School } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 flex items-center justify-center p-6" dir="rtl">
      <Card className="w-full max-w-2xl backdrop-blur-xl bg-white/90 shadow-2xl border-0 rounded-3xl overflow-hidden">
        <CardContent className="text-center p-12">
          <div className="w-16 h-16 bg-gradient-to-br from-school-green to-school-teal rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <School className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg text-school-navy">جاري تحميل إعدادات المدرسة...</p>
        </CardContent>
      </Card>
    </div>
  );
};
