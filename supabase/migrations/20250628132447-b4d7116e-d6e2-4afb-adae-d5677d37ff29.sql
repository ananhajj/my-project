
-- إنشاء جدول لتتبع التنبيهات
CREATE TABLE public.subscription_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('expiring_soon', 'expired')),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX idx_subscription_alerts_school_id ON public.subscription_alerts(school_id);
CREATE INDEX idx_subscription_alerts_sent_at ON public.subscription_alerts(sent_at);

-- تمكين Row Level Security
ALTER TABLE public.subscription_alerts ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسة الأمان
CREATE POLICY "Users can view their school alerts" ON public.subscription_alerts
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.school_id = subscription_alerts.school_id
  )
);

-- إنشاء دالة للتحقق من انتهاء الاشتراك
CREATE OR REPLACE FUNCTION public.check_subscription_status(school_uuid UUID)
RETURNS TABLE (
  is_active BOOLEAN,
  days_remaining INTEGER,
  status TEXT,
  message TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  school_record RECORD;
  days_left INTEGER;
BEGIN
  -- جلب بيانات المدرسة
  SELECT * INTO school_record 
  FROM public.schools 
  WHERE id = school_uuid;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 0, 'not_found'::TEXT, 'المدرسة غير موجودة'::TEXT;
    RETURN;
  END IF;
  
  -- التحقق من حالة الاشتراك
  IF school_record.status = 'inactive' THEN
    RETURN QUERY SELECT FALSE, 0, 'inactive'::TEXT, 'تم إيقاف حسابك. يرجى التواصل مع مدير الموقع'::TEXT;
    RETURN;
  END IF;
  
  -- التحقق من انتهاء الاشتراك
  IF school_record.subscription_end IS NULL THEN
    RETURN QUERY SELECT TRUE, 999, 'active'::TEXT, 'اشتراك مفتوح'::TEXT;
    RETURN;
  END IF;
  
  -- حساب الأيام المتبقية
  days_left := school_record.subscription_end - CURRENT_DATE;
  
  IF days_left < 0 THEN
    -- انتهى الاشتراك
    RETURN QUERY SELECT FALSE, days_left, 'expired'::TEXT, 'انتهى اشتراكك. يرجى تجديد الاشتراك للمتابعة'::TEXT;
  ELSIF days_left <= 7 THEN
    -- اشتراك قارب على الانتهاء
    RETURN QUERY SELECT TRUE, days_left, 'expiring_soon'::TEXT, 
      CASE 
        WHEN days_left = 0 THEN 'ينتهي اشتراكك اليوم!'
        WHEN days_left = 1 THEN 'ينتهي اشتراكك غداً!'
        ELSE 'ينتهي اشتراكك خلال ' || days_left || ' أيام'
      END::TEXT;
  ELSE
    -- اشتراك نشط
    RETURN QUERY SELECT TRUE, days_left, 'active'::TEXT, 'اشتراك نشط'::TEXT;
  END IF;
END;
$$;
