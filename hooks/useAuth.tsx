
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string, role?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "خطأ في تسجيل الدخول",
          description: error.message === 'Invalid login credentials' 
            ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
            : error.message,
          variant: "destructive"
        });
      } else {
        console.log('Sign in successful:', data.user?.email);
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في المنصة"
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string, role: string = 'school') => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      
      if (error) {
        toast({
          title: "خطأ في إنشاء الحساب",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب"
        });
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Logout initiated');
      
      // مسح البيانات المحلية أولاً
      localStorage.removeItem("userType");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("isAdminAccess");
      localStorage.removeItem("adminAccessSchool");
      localStorage.removeItem("currentSchoolId");
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("siteLogo");
      localStorage.removeItem("profile_avatar");
      
      // محاولة تسجيل الخروج من Supabase فقط إذا كانت هناك جلسة نشطة
      if (session && user) {
        console.log('Active session found, attempting Supabase logout');
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Supabase logout error:', error);
          // لا نعرض رسالة خطأ للمستخدم هنا لأن البيانات المحلية تم مسحها بالفعل
        } else {
          console.log('Supabase logout successful');
        }
      } else {
        console.log('No active session, skipping Supabase logout');
      }
      
      // تحديث الحالة المحلية
      setSession(null);
      setUser(null);
      
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "نراك قريباً"
      });
      
      // التوجيه إلى صفحة تسجيل الدخول
      setTimeout(() => {
        window.location.href = "/auth";
      }, 1000);
      
    } catch (error) {
      console.error('Error during logout:', error);
      
      // حتى في حالة الخطأ، نقوم بمسح البيانات المحلية والتوجيه
      localStorage.clear();
      setSession(null);
      setUser(null);
      
      toast({
        title: "تم تسجيل الخروج",
        description: "تم مسح جميع البيانات المحلية"
      });
      
      setTimeout(() => {
        window.location.href = "/auth";
      }, 1000);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
