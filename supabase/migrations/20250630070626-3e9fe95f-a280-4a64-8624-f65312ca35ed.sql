
-- إضافة إعدادات التنبيهات إلى جدول إعدادات المدرسة
ALTER TABLE public.school_settings 
ADD COLUMN absence_alert_days integer DEFAULT 3,
ADD COLUMN late_alert_count integer DEFAULT 3,
ADD COLUMN absence_alert_title text DEFAULT 'تنبيه غياب',
ADD COLUMN late_alert_title text DEFAULT 'تنبيه تأخر',
ADD COLUMN absence_alert_description text DEFAULT 'تجاوز الطالب العدد المسموح من أيام الغياب',
ADD COLUMN late_alert_description text DEFAULT 'تجاوز الطالب العدد المسموح من مرات التأخر';
