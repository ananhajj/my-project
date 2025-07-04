
-- إضافة حقول المعلومات التنظيمية إلى جدول إعدادات المدرسة
ALTER TABLE public.school_settings 
ADD COLUMN IF NOT EXISTS country text DEFAULT 'المملكة العربية السعودية',
ADD COLUMN IF NOT EXISTS ministry text DEFAULT 'وزارة التعليم',
ADD COLUMN IF NOT EXISTS education_department text DEFAULT 'إدارة التعليم بالمنطقة',
ADD COLUMN IF NOT EXISTS educational_supervision text DEFAULT 'الإشراف التربوي';
