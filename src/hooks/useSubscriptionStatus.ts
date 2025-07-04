
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionStatus {
  is_active: boolean;
  days_remaining: number;
  status: string;
  message: string;
}

export const useSubscriptionStatus = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkSubscriptionStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // التحقق من نوع المستخدم
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, school_id')
        .eq('id', user.id)
        .single();

      // إذا كان المستخدم مدير، لا نحتاج للتحقق من الاشتراك
      if (profile?.role === 'admin') {
        setSubscriptionStatus({
          is_active: true,
          days_remaining: 999,
          status: 'admin',
          message: 'حساب مدير'
        });
        setLoading(false);
        return;
      }

      // التحقق من حالة الاشتراك للمدرسة
      let schoolId = profile?.school_id;
      
      // إذا لم يكن هناك school_id في البروفايل، استخدم user.id
      if (!schoolId) {
        schoolId = user.id;
      }

      const { data, error } = await supabase.rpc('check_subscription_status', {
        school_uuid: schoolId
      });

      if (error) {
        console.error('خطأ في التحقق من الاشتراك:', error);
        throw error;
      }

      if (data && data.length > 0) {
        const status = data[0];
        setSubscriptionStatus(status);

        // إظهار التنبيهات حسب الحالة
        if (status.status === 'expiring_soon' && status.days_remaining <= 7) {
          toast({
            title: "تنبيه انتهاء الاشتراك",
            description: status.message,
            variant: "destructive",
            duration: 8000,
          });
        } else if (status.status === 'expired' || status.status === 'inactive') {
          toast({
            title: status.status === 'expired' ? "انتهى الاشتراك" : "تم إيقاف الحساب",
            description: status.message,
            variant: "destructive",
            duration: 10000,
          });
        }
      }
    } catch (error) {
      console.error('خطأ في فحص الاشتراك:', error);
      setSubscriptionStatus({
        is_active: false,
        days_remaining: 0,
        status: 'error',
        message: 'خطأ في التحقق من الاشتراك'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
    
    // فحص الاشتراك كل 5 دقائق للتأكد من التحديث الفوري
    const interval = setInterval(checkSubscriptionStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    subscriptionStatus,
    loading,
    refetch: checkSubscriptionStatus
  };
};
