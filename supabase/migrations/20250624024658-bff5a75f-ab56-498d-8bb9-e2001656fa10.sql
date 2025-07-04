
-- First, let's fix the existing data before making the column NOT NULL
-- Update existing profiles to set school_id for school users
UPDATE public.profiles 
SET school_id = id 
WHERE role = 'school' AND school_id IS NULL;

-- For admin users, we'll leave school_id as NULL since they don't belong to a specific school
-- But we need to modify our approach - let's make school_id nullable but add a check constraint

-- Now we can safely apply the RLS policies without the NOT NULL constraint
-- Remove all conflicting and incomplete RLS policies
DROP POLICY IF EXISTS "Allow all access to school_settings" ON public.school_settings;
DROP POLICY IF EXISTS "Allow all access to students" ON public.students;
DROP POLICY IF EXISTS "Allow all access to attendance_records" ON public.attendance_records;
DROP POLICY IF EXISTS "Allow all access to school_classes" ON public.school_classes;
DROP POLICY IF EXISTS "Schools can view their own settings" ON public.school_settings;
DROP POLICY IF EXISTS "Schools can create their own settings" ON public.school_settings;
DROP POLICY IF EXISTS "Schools can update their own settings" ON public.school_settings;
DROP POLICY IF EXISTS "Schools can manage their own settings" ON public.school_settings;
DROP POLICY IF EXISTS "Schools can view their own students" ON public.students;
DROP POLICY IF EXISTS "Schools can manage their own students" ON public.students;
DROP POLICY IF EXISTS "Schools can view their own attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Schools can manage their own attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Schools can view their own classes" ON public.school_classes;
DROP POLICY IF EXISTS "Schools can manage their own classes" ON public.school_classes;
DROP POLICY IF EXISTS "Admins can view all schools" ON public.schools;
DROP POLICY IF EXISTS "Schools can view their own data" ON public.schools;
DROP POLICY IF EXISTS "Admins can manage all schools" ON public.schools;

-- Ensure RLS is enabled on all tables
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create comprehensive, consistent RLS policies

-- School Settings Policies
CREATE POLICY "school_settings_select_policy" ON public.school_settings
  FOR SELECT USING (
    school_id = auth.uid() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "school_settings_insert_policy" ON public.school_settings
  FOR INSERT WITH CHECK (
    school_id = auth.uid() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "school_settings_update_policy" ON public.school_settings
  FOR UPDATE USING (
    school_id = auth.uid() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "school_settings_delete_policy" ON public.school_settings
  FOR DELETE USING (
    school_id = auth.uid() OR 
    public.get_current_user_role() = 'admin'
  );

-- Students Policies
CREATE POLICY "students_select_policy" ON public.students
  FOR SELECT USING (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "students_insert_policy" ON public.students
  FOR INSERT WITH CHECK (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "students_update_policy" ON public.students
  FOR UPDATE USING (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "students_delete_policy" ON public.students
  FOR DELETE USING (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

-- Attendance Records Policies
CREATE POLICY "attendance_records_select_policy" ON public.attendance_records
  FOR SELECT USING (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "attendance_records_insert_policy" ON public.attendance_records
  FOR INSERT WITH CHECK (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "attendance_records_update_policy" ON public.attendance_records
  FOR UPDATE USING (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "attendance_records_delete_policy" ON public.attendance_records
  FOR DELETE USING (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

-- School Classes Policies
CREATE POLICY "school_classes_select_policy" ON public.school_classes
  FOR SELECT USING (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "school_classes_insert_policy" ON public.school_classes
  FOR INSERT WITH CHECK (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "school_classes_update_policy" ON public.school_classes
  FOR UPDATE USING (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "school_classes_delete_policy" ON public.school_classes
  FOR DELETE USING (
    school_id = public.get_current_user_school_id() OR 
    public.get_current_user_role() = 'admin'
  );

-- Schools Policies (Admin only for management, schools can view their own)
CREATE POLICY "schools_select_policy" ON public.schools
  FOR SELECT USING (
    id = auth.uid() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "schools_insert_policy" ON public.schools
  FOR INSERT WITH CHECK (public.get_current_user_role() = 'admin');

CREATE POLICY "schools_update_policy" ON public.schools
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

CREATE POLICY "schools_delete_policy" ON public.schools
  FOR DELETE USING (public.get_current_user_role() = 'admin');

-- Profiles Policies
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT USING (
    id = auth.uid() OR 
    public.get_current_user_role() = 'admin'
  );

CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE USING (
    id = auth.uid() OR 
    public.get_current_user_role() = 'admin'
  );

-- Fix password security in schools table - remove plaintext password storage
ALTER TABLE public.schools DROP COLUMN IF EXISTS password_hash;

-- Update the handle_new_user function to properly set school_id for school users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, school_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'school'),
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'school') = 'school' THEN NEW.id
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
