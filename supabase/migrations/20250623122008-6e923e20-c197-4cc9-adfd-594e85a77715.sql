
-- حذف جميع المدارس والبيانات المرتبطة بها
-- حذف سجلات الحضور أولاً
DELETE FROM public.attendance_records;

-- حذف الطلاب
DELETE FROM public.students;
DELETE FROM public.school_students;

-- حذف الفصول الدراسية
DELETE FROM public.school_classes;

-- حذف إعدادات المدارس
DELETE FROM public.school_settings;

-- حذف بيانات الحضور المدرسي
DELETE FROM public.school_attendance;

-- حذف المدارس نفسها (يجب أن يكون آخر شيء)
DELETE FROM public.schools;

-- حذف ملفات المستخدمين المرتبطة بالمدارس (عدا المدير)
DELETE FROM public.profiles WHERE role = 'school';
