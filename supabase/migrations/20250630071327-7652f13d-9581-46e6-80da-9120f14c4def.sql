
-- إضافة عمود alert_rules إلى جدول إعدادات المدرسة
ALTER TABLE public.school_settings 
ADD COLUMN alert_rules jsonb DEFAULT NULL;
