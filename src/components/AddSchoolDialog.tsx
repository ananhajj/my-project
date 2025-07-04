
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Plus, Copy, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type NewSchoolData } from "@/hooks/useSchools";

interface AddSchoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSchool?: (school: NewSchoolData) => Promise<{ school?: any; credentials?: { email: string; password: string; subscription_id: string } }>;
}

const AddSchoolDialog = ({ open, onOpenChange, onAddSchool }: AddSchoolDialogProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<{ email: string; password: string; subscription_id: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<NewSchoolData>();

  const onSubmit = async (data: NewSchoolData) => {
    if (!onAddSchool) return;
    
    setIsSubmitting(true);
    try {
      const result = await onAddSchool(data);
      
      if (result.credentials) {
        setGeneratedCredentials(result.credentials);
        form.reset();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: `تم نسخ ${label} إلى الحافظة`,
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    setGeneratedCredentials(null);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة مدرسة جديدة</DialogTitle>
          <DialogDescription>
            أدخل بيانات المدرسة لإنشاء حساب جديد مع بيانات دخول فريدة
          </DialogDescription>
        </DialogHeader>

        {!generatedCredentials ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="school_name"
                rules={{ required: "اسم المدرسة مطلوب" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المدرسة</FormLabel>
                    <FormControl>
                      <Input placeholder="مدرسة النموذج الابتدائية" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف (اختياري)</FormLabel>
                    <FormControl>
                      <Input placeholder="0501234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subscription_months"
                rules={{ 
                  required: "مدة الاشتراك مطلوبة",
                  min: { value: 1, message: "أقل مدة شهر واحد" },
                  max: { value: 24, message: "أقصى مدة 24 شهر" }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مدة الاشتراك (بالأشهر)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="24"
                        placeholder="12"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "جاري الإنشاء..." : "إنشاء المدرسة"}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800 text-sm">تم إنشاء المدرسة بنجاح!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">رقم الاشتراك:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={generatedCredentials.subscription_id} readOnly className="bg-gray-50" />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedCredentials.subscription_id, "رقم الاشتراك")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">البريد الإلكتروني:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={generatedCredentials.email} readOnly className="bg-gray-50" />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedCredentials.email, "البريد الإلكتروني")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">كلمة المرور:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={generatedCredentials.password}
                      readOnly
                      className="bg-gray-50"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedCredentials.password, "كلمة المرور")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
              <strong>تنبيه:</strong> احفظ هذه البيانات في مكان آمن. لن تتمكن من رؤية كلمة المرور مرة أخرى.
            </div>

            <Button onClick={handleClose} className="w-full">
              إغلاق
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddSchoolDialog;
