
import { AlertSettings } from '@/types/alertSettings';

export interface RealSchoolSettings {
  id: string;
  school_id: string;
  school_name: string;
  logo_url?: string;
  stages: any[];
  attendance_type: 'daily' | 'hourly';
  periods_per_day: number;
  absence_alert_days?: number;
  late_alert_count?: number;
  absence_alert_title?: string;
  late_alert_title?: string;
  absence_alert_description?: string;
  late_alert_description?: string;
  alert_rules?: AlertSettings;
}
