
export interface AlertRule {
  id: string;
  threshold: number;
  title: string;
  description: string;
  enabled: boolean;
}

export interface AlertSettings {
  absence_alerts: AlertRule[];
  late_alerts: AlertRule[];
}

export const createDefaultAlertRule = (type: 'absence' | 'late', threshold: number): AlertRule => ({
  id: `${type}_${threshold}_${Date.now()}`,
  threshold,
  title: type === 'absence' ? 'تنبيه غياب' : 'تنبيه تأخر',
  description: type === 'absence' 
    ? `تجاوز الطالب ${threshold} أيام من الغياب`
    : `تجاوز الطالب ${threshold} مرات من التأخر`,
  enabled: true
});
