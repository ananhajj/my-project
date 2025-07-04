
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowRight, Database, Users, Calendar, Settings } from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import { School } from "@/hooks/useSchools";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface SchoolDataViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  school: School | null;
}

const SchoolDataView = ({ open, onOpenChange, school }: SchoolDataViewProps) => {
  if (!school) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "نشط";
      case "inactive": return "متوقف";
      case "expired": return "منتهي الصلاحية";
      default: return "غير محدد";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ar-SA');
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <div className="space-y-6">
          {/* Header للعودة */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => onOpenChange(false)}
                variant="outline" 
                className="flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                إغلاق
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Database className="h-6 w-6" />
                  بيانات {school.school_name}
                </h1>
                <p className="text-gray-600">إدارة بيانات المدرسة</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 text-sm px-3 py-1">
              وضع عرض البيانات
            </Badge>
          </div>

          {/* معلومات المدرسة */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-100/80 backdrop-blur-sm border-blue-200/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">اسم المدرسة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-blue-600">{school.school_name}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50/80 to-emerald-100/80 backdrop-blur-sm border-green-200/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">رقم الاشتراك</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-green-600">{school.subscription_id}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50/80 to-violet-100/80 backdrop-blur-sm border-purple-200/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">عدد الطلاب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-purple-600">{school.students_count}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50/80 to-amber-100/80 backdrop-blur-sm border-orange-200/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">حالة الاشتراك</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={getStatusColor(school.status)}>
                  {getStatusLabel(school.status)}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* معلومات تفصيلية */}
          <Card className="bg-gradient-to-br from-gray-50/80 to-slate-100/80 backdrop-blur-sm border-gray-200/50">
            <CardHeader>
              <CardTitle>معلومات تفصيلية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700">البريد الإلكتروني</Label>
                  <p className="text-lg">{school.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">رقم الهاتف</Label>
                  <p className="text-lg">{school.phone || "غير محدد"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">تاريخ التسجيل</Label>
                  <p className="text-lg">{formatDate(school.created_at)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">انتهاء الاشتراك</Label>
                  <p className="text-lg">{school.subscription_end ? formatDate(school.subscription_end) : "غير محدد"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SchoolDataView;
