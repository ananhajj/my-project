
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface AdminLoginForm {
  email: string;
  password: string;
}

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<AdminLoginForm>();

  useEffect(() => {
    // التحقق من الجلسة الحالية
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // التحقق من أن المستخدم مدير
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (profile?.role === 'admin') {
            navigate("/admin");
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    };

    checkSession();
  }, [navigate]);

  const onSubmit = async (data: AdminLoginForm) => {
    setLoading(true);
    
    try {
      console.log('Attempting admin login with:', data.email);
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        console.error('Admin login error:', error);
        toast({
          title: "خطأ في تسجيل الدخول",
          description: error.message === 'Invalid login credentials' 
            ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
            : error.message,
          variant: "destructive"
        });
        return;
      }

      if (authData.user) {
        // التحقق من أن المستخدم مدير
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();
        
        if (profileError || profile?.role !== 'admin') {
          await supabase.auth.signOut();
          toast({
            title: "غير مصرح",
            description: "هذا الحساب ليس حساب مدير",
            variant: "destructive"
          });
          return;
        }

        console.log('Admin login successful:', authData.user.email);
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في لوحة تحكم المدير"
        });
        
        navigate("/admin");
      }
    } catch (error) {
      console.error('Admin login exception:', error);
      toast({
        title: "خطأ في النظام",
        description: "حدث خطأ غير متوقع",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Dark theme background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/4 right-20 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Security themed icons */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <Shield className="absolute top-20 right-1/4 w-12 h-12 text-red-400 animate-pulse" />
        <Lock className="absolute bottom-1/3 left-20 w-8 h-8 text-purple-400 animate-pulse delay-1000" />
      </div>

      <Card className="w-full max-w-md backdrop-blur-xl bg-slate-800/90 shadow-2xl border border-slate-700/50 relative z-10 rounded-2xl overflow-hidden">
        {/* Dark card glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>
        
        <CardHeader className="text-center pb-2 relative">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl relative overflow-hidden group">
            <Shield className="h-10 w-10 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Lock className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            دخول مدير النظام
          </CardTitle>
          <CardDescription className="text-slate-300 mt-3 font-medium">
            لوحة التحكم الرئيسية - وصول محظور
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 font-semibold text-base flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      البريد الإلكتروني
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@school-system.com"
                        className="h-14 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500/30 transition-all duration-300 rounded-xl text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 font-semibold text-base flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      كلمة المرور
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="كلمة المرور السرية"
                          className="h-14 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500/30 transition-all duration-300 rounded-xl text-base pr-12"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-14 bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 hover:from-red-500 hover:via-purple-500 hover:to-indigo-500 text-white font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] rounded-xl relative overflow-hidden group"
                disabled={loading}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {loading ? "جاري التحقق..." : "دخول النظام"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </form>
          </Form>

          {/* رابط العودة للصفحة العادية */}
          <div className="text-center">
            <Link to="/auth" className="text-slate-400 hover:text-slate-200 transition-colors text-sm flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              العودة لتسجيل دخول المدارس
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
