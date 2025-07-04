
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertSettings } from "@/types/alertSettings";

interface LateColorLegendProps {
  alertSettings?: AlertSettings;
}

export const LateColorLegend = ({ alertSettings }: LateColorLegendProps) => {
  // إذا لم تكن هناك إعدادات تنبيهات التأخر، لا نعرض شيئاً
  if (!alertSettings?.late_alerts) {
    return null;
  }

  // أخذ تنبيهات التأخر المفعلة فقط وترتيبها حسب العتبة
  const lateAlerts = (alertSettings.late_alerts?.filter(alert => alert.enabled) || [])
    .sort((a, b) => a.threshold - b.threshold);

  // إذا لم تكن هناك تنبيهات تأخر مفعلة، لا نعرض شيئاً
  if (lateAlerts.length === 0) {
    return null;
  }

  // إضافة الحالة الطبيعية كقيمة افتراضية
  const alertLevels = [
    {
      threshold: 0,
      title: "ممتاز",
      description: "لا توجد مشاكل تأخر",
      colorClass: "bg-emerald-100 border-emerald-400",
      textColor: "text-emerald-700"
    },
    ...lateAlerts.map((alert, index) => {
      // تحديد الألوان بناءً على مستوى التنبيه
      let colorClass = "";
      let textColor = "";
      
      if (index === 0) {
        // أول مستوى تنبيه - أصفر
        colorClass = "bg-amber-100 border-amber-400";
        textColor = "text-amber-700";
      } else if (index === 1) {
        // ثاني مستوى تنبيه - برتقالي
        colorClass = "bg-orange-100 border-orange-400";
        textColor = "text-orange-700";
      } else if (index === 2) {
        // ثالث مستوى تنبيه - أحمر فاتح
        colorClass = "bg-red-100 border-red-400";
        textColor = "text-red-700";
      } else {
        // مستويات أعلى - أحمر غامق
        colorClass = "bg-red-200 border-red-500";
        textColor = "text-red-800";
      }

      return {
        threshold: alert.threshold,
        title: alert.title,
        description: alert.description,
        colorClass,
        textColor
      };
    })
  ];

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-gray-200 mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-report-navy">مفتاح ألوان تنبيهات التأخر</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-4 ${alertLevels.length <= 3 ? 'grid-cols-2 md:grid-cols-3' : alertLevels.length <= 5 ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-2 md:grid-cols-6'}`}>
          {alertLevels.map((level, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded border-2 ${level.colorClass}`}></div>
              <div className="flex flex-col">
                <span className={`text-sm font-medium ${level.textColor}`}>
                  {level.title}
                </span>
                <span className="text-xs text-gray-600">
                  {level.threshold === 0 ? "0-1" : `${level.threshold}+`} مرة
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
