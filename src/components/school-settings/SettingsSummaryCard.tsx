
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RealSchoolSettings } from '@/hooks/useRealSchoolSettings';

interface SettingsSummaryCardProps {
  settings: RealSchoolSettings;
}

export const SettingsSummaryCard = ({ settings }: SettingsSummaryCardProps) => {
  return (
    <Card className="bg-[#FDFCF9]/90 backdrop-blur-md border border-neutral-beige/20 shadow-md rounded-2xl" dir="rtl">
    <CardHeader className="bg-neutral-beige/10 rounded-t-2xl text-right">
      <CardTitle className="text-primary-navy text-right">ملخص الإعدادات الحالية</CardTitle>
    </CardHeader>
  
    <CardContent className="pt-6 text-right">
      <div className="space-y-3 text-primary-navy text-right">
        <p className="text-right">
          <strong>اسم المدرسة:</strong>{' '}
          <span className="text-primary-blue">{settings.school_name || 'غير محدد'}</span>
        </p>
  
        <p className="text-right">
          <strong>نوع تسجيل الحضور:</strong>{' '}
          <span className="text-primary-teal">
            {settings.attendance_type === 'daily' ? 'يومي' : 'بالحصص'}
          </span>
        </p>
  
        {settings.attendance_type === 'hourly' && (
          <p className="text-right">
            <strong>عدد الحصص:</strong>{' '}
            <span className="text-primary-green">{settings.periods_per_day}</span>
          </p>
        )}
  
        <p className="text-right">
          <strong>حالة النظام:</strong>{' '}
          <span className="text-primary-green">مفعل ومتصل بقاعدة البيانات</span>
        </p>
      </div>
    </CardContent>
  </Card>
  
  );
};
