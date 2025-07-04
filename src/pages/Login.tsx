
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { School, GraduationCap, BookOpen, Sparkles, Lock, Eye, EyeOff, Shield, Settings, Mail, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showAdminLink, setShowAdminLink] = useState(false);
  const { toast } = useToast();
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const form = useForm<LoginForm>();

  // Handle logo clicks to reveal admin mode
  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    
    if (newCount >= 5) {
      setIsAdminMode(true);
      setShowAdminLink(true);
      toast({
        title: "وضع المدير مُفعل",
        description: "يمكنك الآن تسجيل الدخول كمدير نظام"
      });
    }
  };

  // Reset logo click count after 3 seconds
  useEffect(() => {
    if (logoClickCount > 0) {
      const timer = setTimeout(() => {
        setLogoClickCount(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [logoClickCount]);

  const onSubmit = async (data: LoginForm) => {
    setLoginLoading(true);
    
    try {
      console.log('Attempting login with:', data.email, 'Mode:', isAdminMode ? 'Admin' : 'School');
      const { error } = await signIn(data.email, data.password);
      
      if (!error) {
        console.log('Login successful');
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: isAdminMode ? "مرحباً بك في لوحة إدارة النظام" : "مرحباً بك في منصة حاضرون التعليمية"
        });
        
        // Navigate based on mode - توجيه المدارس للصفحة الرئيسية
        if (isAdminMode) {
          navigate("/admin", { replace: true });
        } else {
          navigate("/school", { replace: true });
        }
      } else {
        console.error('Login failed:', error);
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-all duration-500 bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20" dir="rtl">
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-school-green to-school-teal rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/4 right-20 w-32 h-32 bg-gradient-to-br from-school-blue to-school-navy rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-gradient-to-br from-school-teal to-school-green rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-gradient-to-br from-school-navy to-school-blue rounded-full blur-lg animate-pulse delay-[1500ms]"></div>
      </div>
      
      {/* Floating animated icons */}
      <div className="absolute inset-0 pointer-events-none">
        <GraduationCap className="absolute top-20 right-1/4 w-8 h-8 text-school-blue/20 animate-bounce" />
        <BookOpen className="absolute bottom-1/3 left-20 w-6 h-6 text-school-green/20 animate-bounce delay-1000" />
        <School className="absolute top-1/3 left-1/4 w-10 h-10 text-school-teal/15 animate-bounce delay-500" />
        <Sparkles className="absolute bottom-20 right-1/3 w-7 h-7 text-school-blue/15 animate-pulse delay-700" />
      </div>

      <Card className="w-full max-w-md backdrop-blur-xl shadow-2xl border-0 relative z-10 rounded-2xl overflow-hidden transition-all duration-500 bg-white/90">
        
        {/* Card glow effect */}
        <div className="absolute inset-0 pointer-events-none transition-all duration-500 bg-gradient-to-br from-school-green/10 via-transparent to-school-teal/10"></div>
        
        <CardHeader className="text-center pb-6 relative">
          <div 
            className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-2xl relative overflow-hidden group transition-all duration-300 bg-gradient-to-br from-school-green via-school-teal to-school-blue cursor-pointer"
            onClick={handleLogoClick}
          >
            {isAdminMode ? (
              <Shield className="h-10 w-10 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <School className="h-10 w-10 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
          </div>
          
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent transition-all duration-300 bg-gradient-to-r from-school-navy via-school-blue to-school-teal">
            {isAdminMode ? "تسجيل دخول مدير النظام" : "تسجيل دخول المدرسة"}
          </CardTitle>
          
          <CardDescription className="mt-3 font-medium transition-all duration-300 text-school-gray">
            {isAdminMode ? "لوحة إدارة النظام" : "منصة حاضرون لرصد الحضور اليومي للطلاب"}
          </CardDescription>

          {/* Admin mode indicator */}
          {isAdminMode && (
            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-1">
              <Shield className="w-3 h-3" />
              <span>وضع مدير النظام</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 text-orange-600 hover:text-orange-800"
                onClick={() => {
                  setIsAdminMode(false);
                  setShowAdminLink(false);
                }}
              >
                ×
              </Button>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6 relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-base flex items-center gap-2 transition-all duration-300 text-school-navy">
                      <Mail className="w-4 h-4" />
                      البريد الإلكتروني
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={isAdminMode ? "admin@system.com" : "school@example.com"}
                        className="h-14 transition-all duration-300 rounded-xl text-base border-school-gray/50 focus:border-school-green focus:ring-school-green/30 backdrop-blur-sm bg-white/80"
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
                    <FormLabel className="font-semibold text-base flex items-center gap-2 transition-all duration-300 text-school-navy">
                      <Lock className="w-4 h-4" />
                      كلمة المرور
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="كلمة المرور"
                          className="h-14 transition-all duration-300 rounded-xl text-base pr-12 border-school-gray/50 focus:border-school-green focus:ring-school-green/30 backdrop-blur-sm bg-white/80"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors text-school-gray hover:text-school-navy"
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
                className="w-full h-14 font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] rounded-xl relative overflow-hidden group bg-gradient-to-r from-school-green via-school-teal to-school-blue hover:from-school-green/90 hover:via-school-teal/90 hover:to-school-blue/90 text-white"
                disabled={loginLoading}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isAdminMode ? <Shield className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  {loginLoading ? "جاري التحقق..." : "تسجيل الدخول"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </form>
          </Form>

          {/* رسالة توضيحية */}
          {!isAdminMode && (
            <div className="text-center bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-blue-700 text-xs leading-relaxed">
                للحصول على حساب جديد للمدرسة، الشراء من خلال متجر فايل كليك.
              </p>
            </div>
          )}

          {/* Hidden admin access hint */}
          {!isAdminMode && logoClickCount > 0 && logoClickCount < 5 && (
            <div className="text-center">
              <p className="text-xs text-gray-400">
                {5 - logoClickCount} نقرات متبقية...
              </p>
            </div>
          )}

          {/* رابط مدير النظام المخفي */}
          {showAdminLink && !isAdminMode && (
            <div className="text-center transition-all duration-300 opacity-100 transform translate-y-0">
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setIsAdminMode(true)}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors text-sm"
              >
                <Settings className="w-4 h-4" />
                دخول مدير النظام
              </Button>
            </div>
          )}

          {/* إظهار معلومات المستخدم الحالي إن وجد */}
          {user && (
            <div className="text-center bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-700 text-sm">
                أنت مسجل دخولك حالياً: {user.email}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => navigate("/school")}
              >
                الذهاب إلى الصفحة الرئيسية
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
