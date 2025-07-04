
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Save, Edit, Check, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const EmailSection = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setCurrentEmail(user.email || "");
    }
  }, [user]);

  // Check if the current email is a randomly generated one
  const isRandomGeneratedEmail = (email: string) => {
    const randomPatterns = [
      /^school_[a-z0-9]{8}@schoolsystem\.com$/,
      /^school_[a-z0-9]{8}@platform\.edu$/,
      /^school_[a-z0-9]+@.*\.com$/,
      /^school_[a-z0-9]+@.*\.edu$/,
      /^school_[a-zA-Z0-9]{8,}@[a-zA-Z0-9.-]+\.(com|edu|org|net)$/
    ];
    
    return randomPatterns.some(pattern => pattern.test(email));
  };

  // Enhanced email validation
  const validateEmail = (email: string) => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      return "البريد الإلكتروني مطلوب";
    }
    
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(trimmedEmail)) {
      return "تنسيق البريد الإلكتروني غير صحيح";
    }
    
    if (trimmedEmail.includes('..') || trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) {
      return "تنسيق البريد الإلكتروني غير صحيح";
    }
    
    const parts = trimmedEmail.split('@');
    if (parts.length !== 2) {
      return "تنسيق البريد الإلكتروني غير صحيح";
    }
    
    const [localPart, domain] = parts;
    if (localPart.length === 0 || domain.length === 0) {
      return "تنسيق البريد الإلكتروني غير صحيح";
    }
    
    const domainParts = domain.split('.');
    if (domainParts.length < 2 || domainParts.some(part => part.length === 0)) {
      return "تنسيق البريد الإلكتروني غير صحيح";
    }
    
    if (trimmedEmail === currentEmail) {
      return "البريد الإلكتروني الجديد مطابق للحالي";
    }
    
    return "";
  };

  const handleEmailChange = (value: string) => {
    setNewEmail(value);
    setEmailError(validateEmail(value));
  };

  const handleEmailSave = async () => {
    const trimmedEmail = newEmail.trim();
    const error = validateEmail(trimmedEmail);
    
    if (error) {
      setEmailError(error);
      return;
    }

    setLoading(true);
    try {
      console.log('محاولة تحديث البريد الإلكتروني من:', currentEmail, 'إلى:', trimmedEmail);
      
      const isFirstTimeChange = isRandomGeneratedEmail(currentEmail);
      console.log('هل هذا أول تغيير للبريد؟', isFirstTimeChange);
      
      // استخدام Edge Function لتحديث البريد الإلكتروني
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      // استخدام URL الثابت بدلاً من الخصائص المحمية
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/update-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({
          newEmail: trimmedEmail,
          isFirstTimeChange: isFirstTimeChange
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to update email');
      }

      console.log('تم تحديث البريد الإلكتروني بنجاح');
      setCurrentEmail(trimmedEmail);
      setNewEmail("");
      setEmailError("");
      setIsEditing(false);
      
      toast({
        title: "تم تحديث البريد الإلكتروني بنجاح",
        description: result.message,
      });

    } catch (error: any) {
      console.error('خطأ في تحديث البريد الإلكتروني:', error);
      
      let errorMessage = 'حدث خطأ في تحديث البريد الإلكتروني';
      if (error.message) {
        errorMessage = error.message;
      }
      
      setEmailError(errorMessage);
      toast({
        title: "فشل في تحديث البريد الإلكتروني",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setNewEmail(currentEmail);
    setEmailError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setNewEmail("");
    setEmailError("");
    setIsEditing(false);
  };

  return (
    <Card className="backdrop-blur-xl bg-white/90 shadow-xl border-0 rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-school-navy">
          <Mail className="w-5 h-5" />
          البريد الإلكتروني
        </CardTitle>
        <CardDescription>
          عرض وتحديث البريد الإلكتروني
          {isRandomGeneratedEmail(currentEmail) && (
            <span className="block text-amber-600 text-sm mt-1">
              📝 البريد الحالي عشوائي - التغيير الأول سيكون مباشراً بدون تأكيد
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-school-gray/10 rounded-xl">
              <div className="flex flex-col">
                <span className="text-school-navy font-medium" dir="ltr">{currentEmail}</span>
                {isRandomGeneratedEmail(currentEmail) && (
                  <span className="text-xs text-amber-600 mt-1">بريد إلكتروني عشوائي - يحتاج للتحديث</span>
                )}
              </div>
              <Button
                onClick={handleEdit}
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
              <label className="text-school-navy font-semibold block mb-2">البريد الإلكتروني الجديد</label>
              <div className="relative">
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="أدخل البريد الإلكتروني الجديد (مثال: user@example.com)"
                  className={`h-12 border-school-gray/50 focus:border-school-green focus:ring-school-green/30 transition-all duration-300 rounded-xl ${
                    emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''
                  } ${!emailError && newEmail && !validateEmail(newEmail.trim()) ? 'border-green-500' : ''}`}
                  disabled={loading}
                  dir="ltr"
                />
                {!emailError && newEmail && !validateEmail(newEmail.trim()) && (
                  <Check className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
                {emailError && (
                  <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
              </div>
              {emailError && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {emailError}
                </p>
              )}
              <div className="text-gray-500 text-xs mt-1 space-y-1">
                <p>تأكد من استخدام تنسيق بريد إلكتروني صحيح مثل example@domain.com</p>
                {isRandomGeneratedEmail(currentEmail) ? (
                  <p className="text-green-600">
                    ✅ هذا التغيير الأول - سيتم التحديث مباشرة بدون تأكيد
                  </p>
                ) : (
                  <p className="text-blue-600">
                    📧 سيتم إرسال رسالة تأكيد للبريد القديم والجديد
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleEmailSave}
                className="flex-1 h-12 bg-gradient-to-r from-school-green via-school-teal to-school-blue hover:from-school-green/90 hover:via-school-teal/90 hover:to-school-blue/90 text-white font-semibold shadow-lg transition-all duration-300 rounded-xl"
                disabled={loading || !!emailError || !newEmail.trim()}
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

export default EmailSection;
