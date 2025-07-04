
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSubscriptionStatus } from "@/hooks/useSubscriptionStatus";
import SubscriptionAlert from "./SubscriptionAlert";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "school";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { subscriptionStatus, loading: subscriptionLoading, refetch } = useSubscriptionStatus();
  

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate("/auth");
          return;
        }

        // جلب بيانات المستخدم والتحقق من الدور
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, school_id')
          .eq('id', session.user.id)
          .single();
        
        if (!profile) {
          console.error('لم يتم العثور على ملف المستخدم');
          navigate("/auth");
          return;
        }

        // إذا كان هناك دور مطلوب، تحقق منه
        if (requiredRole && profile.role !== requiredRole) {
          if (requiredRole === 'admin') {
            navigate("/auth");
          } else {
            navigate("/admin");
          }
          return;
        }
        
        setUserRole(profile.role);
        setUser(session.user);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // مراقبة تغييرات المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          navigate("/auth");
        } else {
          setUser(session.user);
          // إعادة فحص الاشتراك عند تغيير الجلسة
          refetch();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, requiredRole, refetch]);

  // مراقبة تغييرات حالة الاشتراك كل فترة
  useEffect(() => {
    if (userRole === 'school' && !loading && !subscriptionLoading) {
      const interval = setInterval(() => {
        refetch();
      }, 30000); // كل 30 ثانية

      return () => clearInterval(interval);
    }
  }, [userRole, loading, subscriptionLoading, refetch]);

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // إذا كان المستخدم مدرسة وليس مدير، تحقق من حالة الاشتراك
  if (userRole === 'school' && subscriptionStatus) {
    // إذا كان الاشتراك منتهي أو الحساب معطل، امنع الوصول تماماً
    if (!subscriptionStatus.is_active) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <SubscriptionAlert status={subscriptionStatus} />
          <div className="text-center mt-20">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                {subscriptionStatus.status === 'expired' ? 'انتهى الاشتراك' : 'تم إيقاف الحساب'}
              </h2>
              <p className="text-gray-700 mb-6">{subscriptionStatus.message}</p>
              <button 
                onClick={() => {
                  // تسجيل خروج فوري
                  supabase.auth.signOut().then(() => {
                    navigate("/auth");
                  });
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mr-4"
              >
                تسجيل الخروج
              </button>
              <button 
                onClick={() => refetch()}
                className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
              >
                إعادة التحقق
              </button>
            </div>
          </div>
        </div>
      );
    }

    // إظهار التنبيه للاشتراكات القريبة من الانتهاء
    return (
      <>
        {subscriptionStatus.status === 'expiring_soon' && (
          <SubscriptionAlert status={subscriptionStatus} />
        )}
        {children}
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
