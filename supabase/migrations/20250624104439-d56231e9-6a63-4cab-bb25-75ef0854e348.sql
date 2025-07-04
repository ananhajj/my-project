
-- حذف الـ trigger الحالي وإعادة إنشاؤه بطريقة صحيحة
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- إنشاء دالة محدثة لا تحاول إدراج school_id إذا لم تكن المدرسة موجودة
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- إدراج الملف الشخصي للمستخدم الجديد بدون school_id في البداية
  INSERT INTO public.profiles (id, email, full_name, role, school_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'school_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'school'),
    -- فقط ضع school_id إذا كان المستخدم admin أو إذا كانت المدرسة موجودة فعلاً
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'school') = 'admin' THEN NULL
      ELSE NULL -- سنقوم بتحديث هذا لاحقاً عبر Edge Function
    END
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- في حالة أي خطأ، أنشئ الملف بدون school_id
    INSERT INTO public.profiles (id, email, full_name, role, school_id)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'school_name', NEW.email),
      COALESCE(NEW.raw_user_meta_data->>'role', 'school'),
      NULL
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- إعادة إنشاء الـ trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
