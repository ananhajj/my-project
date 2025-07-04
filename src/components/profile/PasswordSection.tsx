
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock, Save, Edit, Eye, EyeOff, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const PasswordSection = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  // Password validation
  const validatePassword = (password: string, type: 'current' | 'new' | 'confirm') => {
    if (type === 'current') {
      return !password ? "كلمة المرور الحالية مطلوبة" : "";
    }
    
    if (type === 'new') {
      if (!password) return "كلمة المرور الجديدة مطلوبة";
      if (password.length < 6) return "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
      if (!/(?=.*[a-zA-Z])/.test(password)) return "كلمة المرور يجب أن تحتوي على حرف واحد على الأقل";
      if (!/(?=.*\d)/.test(password)) return "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل";
      return "";
    }
    
    if (type === 'confirm') {
      if (!password) return "تأكيد كلمة المرور مطلوب";
      if (password !== newPassword) return "كلمة المرور غير متطابقة";
      return "";
    }
    
    return "";
  };

  // Real-time password validation
  const handlePasswordChange = (value: string, type: 'current' | 'new' | 'confirm') => {
    if (type === 'current') {
      setCurrentPassword(value);
      setPasswordErrors(prev => ({ ...prev, current: validatePassword(value, 'current') }));
    } else if (type === 'new') {
      setNewPassword(value);
      setPasswordErrors(prev => ({ ...prev, new: validatePassword(value, 'new') }));
      // Re-validate confirm password if it exists
      if (confirmPassword) {
        setPasswordErrors(prev => ({ ...prev, confirm: validatePassword(confirmPassword, 'confirm') }));
      }
    } else if (type === 'confirm') {
      setConfirmPassword(value);
      setPasswordErrors(prev => ({ ...prev, confirm: validatePassword(value, 'confirm') }));
    }
  };

  const handlePasswordSave = async () => {
    // Validate all password fields
    const currentError = validatePassword(currentPassword, 'current');
    const newError = validatePassword(newPassword, 'new');
    const confirmError = validatePassword(confirmPassword, 'confirm');

    setPasswordErrors({
      current: currentError,
      new: newError,
      confirm: confirmError
    });

    if (currentError || newError || confirmError) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى تصحيح الأخطاء في الحقول المميزة",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // First verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || "",
        password: currentPassword
      });

      if (signInError) {
        setPasswordErrors(prev => ({ ...prev, current: "كلمة المرور الحالية غير صحيحة" }));
        toast({
          title: "خطأ في التحقق",
          description: "كلمة المرور الحالية غير صحيحة",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Error updating password:', error);
        toast({
          title: "خطأ في تحديث كلمة المرور",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordErrors({ current: "", new: "", confirm: "" });
        setIsEditing(false);
        
        toast({
          title: "تم الحفظ بنجاح",
          description: "تم تحديث كلمة المرور بنجاح",
        });
      }
    } catch (error) {
      console.error('Exception updating password:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث كلمة المرور",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordErrors({ current: "", new: "", confirm: "" });
    setIsEditing(false);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Card className="backdrop-blur-xl bg-white/90 shadow-xl border-0 rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-school-navy">
          <Lock className="w-5 h-5" />
          كلمة المرور
        </CardTitle>
        <CardDescription>تغيير كلمة المرور</CardDescription>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-school-gray/10 rounded-xl">
              <span className="text-school-navy font-medium">••••••••</span>
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="border-school-green text-school-green hover:bg-school-green hover:text-white"
                disabled={loading}
              >
                <Edit className="w-4 h-4 ml-2" />
                تعديل
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-school-navy font-semibold block mb-2">كلمة المرور الحالية</label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => handlePasswordChange(e.target.value, 'current')}
                  placeholder="أدخل كلمة المرور الحالية"
                  className={`h-12 border-school-gray/50 focus:border-school-green focus:ring-school-green/30 transition-all duration-300 rounded-xl ${
                    passwordErrors.current ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''
                  }`}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {passwordErrors.current && (
                <p className="text-red-500 text-sm mt-1">{passwordErrors.current}</p>
              )}
            </div>
            
            <div>
              <label className="text-school-navy font-semibold block mb-2">كلمة المرور الجديدة</label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value, 'new')}
                  placeholder="أدخل كلمة المرور الجديدة (6 أحرف على الأقل، حرف ورقم)"
                  className={`h-12 border-school-gray/50 focus:border-school-green focus:ring-school-green/30 transition-all duration-300 rounded-xl ${
                    passwordErrors.new ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''
                  } ${!passwordErrors.new && newPassword && !validatePassword(newPassword, 'new') ? 'border-green-500' : ''}`}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                {!passwordErrors.new && newPassword && !validatePassword(newPassword, 'new') && (
                  <Check className="absolute left-10 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {passwordErrors.new && (
                <p className="text-red-500 text-sm mt-1">{passwordErrors.new}</p>
              )}
            </div>
            
            <div>
              <label className="text-school-navy font-semibold block mb-2">تأكيد كلمة المرور الجديدة</label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => handlePasswordChange(e.target.value, 'confirm')}
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  className={`h-12 border-school-gray/50 focus:border-school-green focus:ring-school-green/30 transition-all duration-300 rounded-xl ${
                    passwordErrors.confirm ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''
                  } ${!passwordErrors.confirm && confirmPassword && !validatePassword(confirmPassword, 'confirm') ? 'border-green-500' : ''}`}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                {!passwordErrors.confirm && confirmPassword && !validatePassword(confirmPassword, 'confirm') && (
                  <Check className="absolute left-10 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {passwordErrors.confirm && (
                <p className="text-red-500 text-sm mt-1">{passwordErrors.confirm}</p>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handlePasswordSave}
                className="flex-1 h-12 bg-gradient-to-r from-school-green via-school-teal to-school-blue hover:from-school-green/90 hover:via-school-teal/90 hover:to-school-blue/90 text-white font-semibold shadow-lg transition-all duration-300 rounded-xl"
                disabled={loading || !!passwordErrors.current || !!passwordErrors.new || !!passwordErrors.confirm || !currentPassword || !newPassword || !confirmPassword}
              >
                <Save className="w-4 h-4 ml-2" />
                {loading ? "جاري الحفظ..." : "حفظ"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="px-6 h-12 border-school-gray/50 text-school-navy hover:bg-school-gray/10 transition-all duration-300 rounded-xl"
                disabled={loading}
              >
                إلغاء
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PasswordSection;
