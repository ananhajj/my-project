
-- إضافة عمود email إلى جدول profiles إذا لم يكن موجوداً
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- تحديث دالة handle_new_user لتتعامل مع الحقول الصحيحة
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'school')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
