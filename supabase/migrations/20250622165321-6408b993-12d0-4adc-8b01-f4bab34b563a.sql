
-- حذف جميع بيانات الحضور المسجلة سابقاً
DELETE FROM public.attendance_records;

-- حذف جميع إعدادات المدارس المحفوظة وإعادة تعيينها
DELETE FROM public.school_settings;

-- إعادة تعيين شعار المدرسة لجميع المدارس الموجودة
UPDATE public.schools SET phone = NULL WHERE phone IS NOT NULL;

-- حذف أي بيانات طلاب مسجلة مسبقاً (اختياري)
DELETE FROM public.students;

-- حذف أي فصول مسجلة مسبقاً (اختياري) 
DELETE FROM public.school_classes;
