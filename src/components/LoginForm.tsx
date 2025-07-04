
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { School, GraduationCap, BookOpen, Sparkles, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

interface LoginForm {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [showAdminLink, setShowAdminLink] = useState(false);
  const { toast } = useToast();
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const form = useForm<LoginForm>();

  // Navigate when user becomes authenticated
  useEffect(() => {
    if (user) {
      console.log('User authenticated, navigating to dashboard');
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginForm) => {
    setLoginLoading(true);
    
    try {
      console.log('Attempting login with:', data.email);
      const { error } = await signIn(data.email, data.password);
      
      if (!error) {
        console.log('Login successful, user should be set in auth context');
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في منصة إدارة المدرسة"
        });
        // Navigation will be handled by the useEffect when user state updates
      } else {
        console.error('Login failed:', error);
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoginLoading(false);
    }
  };

  // Function to toggle admin link visibility
  const handleLogoClick = () => {
    setShowAdminLink(!showAdminLink);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-school-green to-school-teal rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/4 right-20 w-32 h-32 bg-gradient-to-br from-school-blue to-school-navy rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-gradient-to-br from-school-teal to-school-green rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-gradient-to-br from-school-navy to-school-blue rounded-full blur-lg animate-pulse delay-[1500ms]"></div>
      </div>
      
      {/* Floating animated education icons */}
      <div className="absolute inset-0 pointer-events-none">
        <GraduationCap className="absolute top-20 right-1/4 w-8 h-8 text-school-blue/20 animate-bounce" />
        <BookOpen className="absolute bottom-1/3 left-20 w-6 h-6 text-school-green/20 animate-bounce delay-1000" />
        <School className="absolute top-1/3 left-1/4 w-10 h-10 text-school-teal/15 animate-bounce delay-500" />
        <Sparkles className="absolute bottom-20 right-1/3 w-7 h-7 text-school-blue/15 animate-pulse delay-700" />
      </div>

      <Card className="w-full max-w-md backdrop-blur-xl bg-white/90 shadow-2xl border-0 relative z-10 rounded-2xl overflow-hidden">
        {/* Card glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-school-green/10 via-transparent to-school-teal/10 pointer-events-none"></div>
        
        <CardHeader className="text-center pb-6 relative">
          <div 
            className="mx-auto w-20 h-20 bg-gradient-to-br from-school-green via-school-teal to-school-blue rounded-2xl flex items-center justify-center mb-4 shadow-2xl relative overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={handleLogoClick}
          >
            <School className="h-10 w-10 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-school-navy via-school-blue to-school-teal bg-clip-text text-transparent">
            تسجيل دخول المدرسة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-school-navy font-semibold text-base">البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="school@example.com"
                        className="h-14 border-school-gray/50 focus:border-school-green focus:ring-school-green/30 transition-all duration-300 backdrop-blur-sm bg-white/80 rounded-xl text-base"
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
                    <FormLabel className="text-school-navy font-semibold text-base">كلمة المرور</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="كلمة المرور"
                        className="h-14 border-school-gray/50 focus:border-school-green focus:ring-school-green/30 transition-all duration-300 backdrop-blur-sm bg-white/80 rounded-xl text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-14 bg-gradient-to-r from-school-green via-school-teal to-school-blue hover:from-school-green/90 hover:via-school-teal/90 hover:to-school-blue/90 text-white font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] rounded-xl relative overflow-hidden group"
                disabled={loginLoading}
              >
                <span className="relative z-10">
                  {loginLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </form>
          </Form>

          {/* رسالة توضيحية للمدارس الجديدة */}
          <div className="text-center bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-700 text-xs leading-relaxed">
              للحصول على حساب جديد للمدرسة، يرجى التواصل مع إدارة النظام.
            </p>
          </div>

          {/* رابط مدير النظام المخفي */}
          {showAdminLink && (
            <div className="text-center transition-all duration-300 opacity-100 transform translate-y-0">
              <Link 
                to="/admin-login" 
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors text-sm bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg border border-slate-200 shadow-sm hover:shadow-md"
              >
                <Settings className="w-4 h-4" />
                دخول مدير النظام
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
