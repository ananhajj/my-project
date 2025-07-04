
-- فقط إصلاح القيد الخارجي في جدول profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_school_id_fkey;

-- إضافة القيد الخارجي الصحيح
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_school_id_fkey 
FOREIGN KEY (school_id) REFERENCES public.schools(id) ON DELETE SET NULL;

-- إضافة فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON public.profiles(school_id);

-- التأكد من أن school_id يمكن أن يكون null (للمدراء)
ALTER TABLE public.profiles ALTER COLUMN school_id DROP NOT NULL;

-- إضافة trigger للتأكد من تحديث updated_at في جدول schools
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- تطبيق الـ trigger على جدول schools إذا لم يكن موجوداً
DROP TRIGGER IF EXISTS update_schools_updated_at ON public.schools;
CREATE TRIGGER update_schools_updated_at
    BEFORE UPDATE ON public.schools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
