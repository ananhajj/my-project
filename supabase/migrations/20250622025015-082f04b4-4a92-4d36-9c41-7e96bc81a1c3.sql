
-- إنشاء جدول إعدادات المدرسة
CREATE TABLE IF NOT EXISTS public.school_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  logo_url TEXT,
  stages JSONB DEFAULT '[]'::jsonb,
  attendance_type TEXT DEFAULT 'daily' CHECK (attendance_type IN ('daily', 'hourly')),
  periods_per_day INTEGER DEFAULT 6,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id)
);

-- إنشاء جدول الطلاب الخاص بكل مدرسة (محسن)
CREATE TABLE IF NOT EXISTS public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  section TEXT NOT NULL,
  phone TEXT,
  parent_phone TEXT,
  address TEXT,
  birth_date DATE,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'transferred')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, student_id)
);

-- إنشاء جدول الحضور الحقيقي
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  period INTEGER DEFAULT 1,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  recorded_by TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, student_id, date, period)
);

-- إنشاء جدول الفصول/الصفوف
CREATE TABLE IF NOT EXISTS public.school_classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  section TEXT NOT NULL,
  teacher_name TEXT,
  room_number TEXT,
  capacity INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, grade, section)
);

-- تفعيل Row Level Security
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_classes ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان للمدارس المصرح لها فقط
CREATE POLICY "Schools can access their own settings" ON public.school_settings
  FOR ALL USING (
    school_id IN (
      SELECT id FROM public.schools 
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

CREATE POLICY "Schools can access their own students" ON public.students
  FOR ALL USING (
    school_id IN (
      SELECT id FROM public.schools 
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

CREATE POLICY "Schools can access their own attendance" ON public.attendance_records
  FOR ALL USING (
    school_id IN (
      SELECT id FROM public.schools 
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

CREATE POLICY "Schools can access their own classes" ON public.school_classes
  FOR ALL USING (
    school_id IN (
      SELECT id FROM public.schools 
      WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- إنشاء مؤشرات للأداء
CREATE INDEX IF NOT EXISTS idx_students_school_id ON public.students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_grade_section ON public.students(school_id, grade, section);
CREATE INDEX IF NOT EXISTS idx_attendance_school_date ON public.attendance_records(school_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON public.attendance_records(student_id, date);
CREATE INDEX IF NOT EXISTS idx_school_classes_school_id ON public.school_classes(school_id);
