
-- تحديث دالة handle_new_user لتتعامل مع المدراء والمدارس بشكل صحيح
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- إدراج الملف الشخصي للمستخدم الجديد
  INSERT INTO public.profiles (id, email, full_name, role, school_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'school'),
    -- إذا كان المستخدم من نوع school، استخدم معرف المدرسة من metadata أو معرف المستخدم
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'school') = 'school' THEN
        COALESCE(
          (NEW.raw_user_meta_data->>'school_id')::uuid,
          NEW.id
        )
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
