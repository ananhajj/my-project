
-- حذف السياسات الموجودة أولاً إذا كانت موجودة
DROP POLICY IF EXISTS "Schools can view their own settings" ON public.school_settings;
DROP POLICY IF EXISTS "Schools can create their own settings" ON public.school_settings;
DROP POLICY IF EXISTS "Schools can update their own settings" ON public.school_settings;
DROP POLICY IF EXISTS "Admins can view all schools" ON public.schools;
DROP POLICY IF EXISTS "Schools can view their own data" ON public.schools;

-- تمكين RLS على الجداول
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- إعادة إنشاء السياسات بشكل صحيح
CREATE POLICY "Schools can view their own settings" 
ON public.school_settings 
FOR SELECT 
USING (
  school_id = auth.uid() OR 
  get_current_user_role() = 'admin'
);

CREATE POLICY "Schools can create their own settings" 
ON public.school_settings 
FOR INSERT 
WITH CHECK (
  school_id = auth.uid() OR 
  get_current_user_role() = 'admin'
);

CREATE POLICY "Schools can update their own settings" 
ON public.school_settings 
FOR UPDATE 
USING (
  school_id = auth.uid() OR 
  get_current_user_role() = 'admin'
);

CREATE POLICY "Admins can view all schools" 
ON public.schools 
FOR SELECT 
USING (get_current_user_role() = 'admin');

CREATE POLICY "Schools can view their own data" 
ON public.schools 
FOR SELECT 
USING (id = auth.uid());
