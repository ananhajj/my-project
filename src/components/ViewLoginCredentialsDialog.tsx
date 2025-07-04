
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Copy, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { School } from "@/hooks/useSchools";

interface ViewLoginCredentialsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  school: School | null;
}

const ViewLoginCredentialsDialog = ({ open, onOpenChange, school }: ViewLoginCredentialsDialogProps) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  if (!school) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: `تم نسخ ${label} إلى الحافظة`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            بيانات تسجيل الدخول
          </DialogTitle>
          <DialogDescription>
            بيانات تسجيل الدخول لمدرسة {school.school_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">رقم الاشتراك</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input 
                value={school.subscription_id} 
                readOnly 
                className="bg-gray-50"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(school.subscription_id, "رقم الاشتراك")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">البريد الإلكتروني</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input 
                value={school.email} 
                readOnly 
                className="bg-gray-50"
                dir="ltr"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(school.email, "البريد الإلكتروني")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">كلمة المرور</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input 
                type={showPassword ? "text" : "password"}
                value="••••••••••••" 
                readOnly 
                className="bg-gray-50"
                dir="ltr"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              كلمة المرور مشفرة ولا يمكن عرضها. يمكن إنشاء كلمة مرور جديدة عند الحاجة.
            </p>
          </div>

          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>ملاحظة:</strong> هذه البيانات سرية ويجب عدم مشاركتها مع أي شخص غير مخول.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewLoginCredentialsDialog;
