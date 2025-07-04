
-- إنشاء جدول المدارس مع معلومات الاشتراك
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id TEXT NOT NULL UNIQUE,
  school_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  subscription_end DATE,
  students_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول الطلاب المرتبط بكل مدرسة
CREATE TABLE public.school_students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  student_name TEXT NOT NULL,
  student_id TEXT NOT NULL,
  grade TEXT NOT NULL,
  section TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(school_id, student_id)
);

-- إنشاء جدول الحضور المرتبط بكل مدرسة
CREATE TABLE public.school_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.school_students(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, date)
);

-- تفعيل Row Level Security للحماية
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_attendance ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان للمدارس (المديرون يرون جميع المدارس)
CREATE POLICY "Admins can view all schools" ON public.schools
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage schools" ON public.schools
  FOR ALL USING (true);

-- سياسات الأمان للطلاب (كل مدرسة ترى طلابها فقط)
CREATE POLICY "Schools can view their students" ON public.school_students
  FOR SELECT USING (
    school_id IN (
      SELECT id FROM public.schools WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

CREATE POLICY "Schools can manage their students" ON public.school_students
  FOR ALL USING (
    school_id IN (
      SELECT id FROM public.schools WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- سياسات الأمان للحضور (كل مدرسة ترى حضور طلابها فقط)
CREATE POLICY "Schools can view their attendance" ON public.school_attendance
  FOR SELECT USING (
    school_id IN (
      SELECT id FROM public.schools WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

CREATE POLICY "Schools can manage their attendance" ON public.school_attendance
  FOR ALL USING (
    school_id IN (
      SELECT id FROM public.schools WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
    )
  );

-- دالة لتوليد رقم اشتراك فريد
CREATE OR REPLACE FUNCTION generate_subscription_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  counter INTEGER := 1;
BEGIN
  LOOP
    new_id := 'SCH' || LPAD(counter::TEXT, 4, '0');
    IF NOT EXISTS (SELECT 1 FROM public.schools WHERE subscription_id = new_id) THEN
      RETURN new_id;
    END IF;
    counter := counter + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- دالة لتوليد بريد إلكتروني عشوائي
CREATE OR REPLACE FUNCTION generate_random_email()
RETURNS TEXT AS $$
DECLARE
  random_part TEXT;
BEGIN
  random_part := substr(md5(random()::text || clock_timestamp()::text), 1, 8);
  RETURN 'school_' || random_part || '@platform.edu';
END;
$$ LANGUAGE plpgsql;

-- دالة لتوليد كلمة مرور معقدة
CREATE OR REPLACE FUNCTION generate_secure_password()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  password TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..12 LOOP
    password := password || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN password;
END;
$$ LANGUAGE plpgsql;
