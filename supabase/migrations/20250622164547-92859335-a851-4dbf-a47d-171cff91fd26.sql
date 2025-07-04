
-- إزالة السياسات الحالية وإنشاء سياسات مؤقتة أكثر مرونة
DROP POLICY IF EXISTS "Schools can access their own settings" ON public.school_settings;
DROP POLICY IF EXISTS "Schools can access their own students" ON public.students;
DROP POLICY IF EXISTS "Schools can access their own attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Schools can access their own classes" ON public.school_classes;

-- إنشاء سياسات مؤقتة تسمح بالوصول لجميع المستخدمين (حتى يتم تطبيق نظام المصادقة الكامل)
CREATE POLICY "Allow all access to school_settings" ON public.school_settings
  FOR ALL USING (true);

CREATE POLICY "Allow all access to students" ON public.students
  FOR ALL USING (true);

CREATE POLICY "Allow all access to attendance_records" ON public.attendance_records
  FOR ALL USING (true);

CREATE POLICY "Allow all access to school_classes" ON public.school_classes
  FOR ALL USING (true);
