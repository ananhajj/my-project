
-- إصلاح القيد الخارجي في جدول school_settings
-- المشكلة أن المستخدمين يسجلون الدخول مباشرة بدون وجودهم في جدول schools
-- لذا سنقوم بربط school_settings بـ auth.users مباشرة

-- حذف القيد الخارجي الحالي
ALTER TABLE public.school_settings DROP CONSTRAINT IF EXISTS school_settings_school_id_fkey;

-- إضافة قيد خارجي جديد يربط بـ auth.users
ALTER TABLE public.school_settings 
ADD CONSTRAINT school_settings_school_id_fkey 
FOREIGN KEY (school_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- تحديث سياسة الأمان لتعمل مع auth.users
DROP POLICY IF EXISTS "Schools can access their own settings" ON public.school_settings;

CREATE POLICY "Users can access their own settings" ON public.school_settings
  FOR ALL USING (
    school_id = auth.uid()
  );
