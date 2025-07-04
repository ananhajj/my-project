
-- Add the missing school_id column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL;

-- Create the security definer functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_current_user_school_id()
RETURNS UUID AS $$
  SELECT school_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all schools" ON public.schools;
DROP POLICY IF EXISTS "Admins can manage all schools" ON public.schools;
DROP POLICY IF EXISTS "Schools can view their own settings" ON public.school_settings;
DROP POLICY IF EXISTS "Schools can manage their own settings" ON public.school_settings;
DROP POLICY IF EXISTS "Schools can view their own students" ON public.students;
DROP POLICY IF EXISTS "Schools can manage their own students" ON public.students;
DROP POLICY IF EXISTS "Schools can view their own attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Schools can manage their own attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Schools can view their own classes" ON public.school_classes;
DROP POLICY IF EXISTS "Schools can manage their own classes" ON public.school_classes;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- Schools policies (only admins can manage schools)
CREATE POLICY "Admins can view all schools" ON public.schools
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage all schools" ON public.schools
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- School settings policies
CREATE POLICY "Schools can view their own settings" ON public.school_settings
  FOR SELECT USING (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "Schools can manage their own settings" ON public.school_settings
  FOR ALL USING (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

-- Students policies
CREATE POLICY "Schools can view their own students" ON public.students
  FOR SELECT USING (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "Schools can manage their own students" ON public.students
  FOR ALL USING (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

-- Attendance records policies
CREATE POLICY "Schools can view their own attendance" ON public.attendance_records
  FOR SELECT USING (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "Schools can manage their own attendance" ON public.attendance_records
  FOR ALL USING (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

-- School classes policies
CREATE POLICY "Schools can view their own classes" ON public.school_classes
  FOR SELECT USING (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "Schools can manage their own classes" ON public.school_classes
  FOR ALL USING (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

-- Create trigger to automatically create profile when user signs up
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

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
