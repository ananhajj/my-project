
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';
import { RealSchoolSettings } from '@/hooks/useRealSchoolSettings';

interface AttendanceTypeCardProps {
  settings: RealSchoolSettings;
  updateSettings: (updates: Partial<RealSchoolSettings>) => Promise<void>;
}

export const AttendanceTypeCard = ({ settings, updateSettings }: AttendanceTypeCardProps) => {
  return (
    <Card className="bg-[#F4F9FF]/90 backdrop-blur-md border border-primary-blue/10 shadow-md rounded-2xl" dir="rtl">
    <CardHeader className="bg-primary-blue/5 rounded-t-2xl text-right">
      <CardTitle className="flex items-center gap-2 text-primary-navy justify-start">
        <Clock className="h-5 w-5" />
        <span>نوع تسجيل الحضور</span>
      </CardTitle>
      <CardDescription className="text-right">
        اختر كيفية تسجيل الحضور في مدرستك
      </CardDescription>
    </CardHeader>
  
    <CardContent className="space-y-4 pt-6 text-right">
      <RadioGroup
        value={settings.attendance_type}
        onValueChange={async (value: 'daily' | 'hourly') => await updateSettings({ attendance_type: value })}
        className="space-y-3"
      >
        <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-gray/10 hover:bg-neutral-gray/20 transition-colors border border-neutral-gray/30">
          <RadioGroupItem value="daily" id="daily" className="border-primary-blue text-primary-green" />
          <Label htmlFor="daily" className="text-primary-navy font-medium cursor-pointer flex-1 text-right mr-3">
            تسجيل يومي (حضور/غياب لليوم كامل)
          </Label>
        </div>
  
        <div className="flex items-center justify-between p-4 rounded-lg bg-neutral-gray/10 hover:bg-neutral-gray/20 transition-colors border border-neutral-gray/30">
          <RadioGroupItem value="hourly" id="hourly" className="border-primary-blue text-primary-green" />
          <Label htmlFor="hourly" className="text-primary-navy font-medium cursor-pointer flex-1 text-right mr-3">
            تسجيل بالحصص (حضور/غياب لكل حصة)
          </Label>
        </div>
      </RadioGroup>
  
      {settings.attendance_type === 'hourly' && (
        <div className="mt-4 p-4 bg-primary-teal/10 rounded-lg border border-primary-teal/30 text-right">
          <Label htmlFor="periodsPerDay" className="text-primary-navy font-medium text-right block">عدد الحصص في اليوم</Label>
          <div className="flex justify-end mt-2">
            <Select
              value={settings.periods_per_day?.toString()}
              onValueChange={async (value) => await updateSettings({ periods_per_day: parseInt(value) })}
            >
              <SelectTrigger className="w-32 border-primary-teal/30 focus:border-primary-green transition">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[4, 5, 6, 7, 8, 9, 10].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
  
  );
};
