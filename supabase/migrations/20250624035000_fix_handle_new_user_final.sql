
-- إصلاح دالة handle_new_user لتجنب مشاكل المفتاح الخارجي
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- إدراج الملف الشخصي للمستخدم الجديد
  INSERT INTO public.profiles (id, email, full_name, role, school_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'school_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'school'),
    -- تجنب استخدام school_id إذا لم تكن المدرسة موجودة بعد
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'school') = 'admin' THEN NULL
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'school') = 'school' AND 
           (NEW.raw_user_meta_data->>'school_id') IS NOT NULL AND
           EXISTS (SELECT 1 FROM public.schools WHERE id = (NEW.raw_user_meta_data->>'school_id')::uuid) THEN
        (NEW.raw_user_meta_data->>'school_id')::uuid
      ELSE NULL
    END
  );
  RETURN NEW;
EXCEPTION
  WHEN foreign_key_violation THEN
    -- في حالة انتهاك المفتاح الخارجي، أنشئ الملف بدون school_id
    INSERT INTO public.profiles (id, email, full_name, role, school_id)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'school_name', NEW.email),
      COALESCE(NEW.raw_user_meta_data->>'role', 'school'),
      NULL
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
