
-- إنشاء جدول لإعدادات الفترات الزمنية
CREATE TABLE public.period_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  period_type TEXT NOT NULL CHECK (period_type IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  academic_year TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(period_type, academic_year)
);

-- إضافة Row Level Security
ALTER TABLE public.period_settings ENABLE ROW LEVEL SECURITY;

-- سياسة للسماح للمديرين بالقراءة والكتابة
CREATE POLICY "Admins can manage period settings" 
  ON public.period_settings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- سياسة للسماح للمدارس بالقراءة فقط
CREATE POLICY "Schools can view period settings" 
  ON public.period_settings 
  FOR SELECT 
  USING (is_active = true);

-- إضافة trigger لتحديث updated_at
CREATE TRIGGER update_period_settings_updated_at
  BEFORE UPDATE ON public.period_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- إدراج بيانات افتراضية للعام الدراسي الحالي
INSERT INTO public.period_settings (period_type, start_date, end_date, academic_year) VALUES
('weekly', '2024-09-01', '2024-09-07', '2024-2025'),
('monthly', '2024-09-01', '2024-09-30', '2024-2025'),
('quarterly', '2024-09-01', '2024-12-31', '2024-2025'),
('yearly', '2024-09-01', '2025-08-31', '2024-2025');
