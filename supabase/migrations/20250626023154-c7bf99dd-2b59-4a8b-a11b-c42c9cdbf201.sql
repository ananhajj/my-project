
-- تحديث دالة إنشاء البريد الإلكتروني العشوائي لاستخدام نطاق صالح
CREATE OR REPLACE FUNCTION public.generate_random_email()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
  random_part TEXT;
BEGIN
  random_part := substr(md5(random()::text || clock_timestamp()::text), 1, 8);
  RETURN 'school_' || random_part || '@schoolsystem.com';
END;
$function$
