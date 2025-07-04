
-- تحديث قيود جدول profiles للسماح بدور 'school'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- إضافة القيد الجديد مع تضمين دور 'school'
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'school', 'teacher', 'student'));

-- تحديث إعدادات جدول profiles لتحسين الأداء
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'school';
