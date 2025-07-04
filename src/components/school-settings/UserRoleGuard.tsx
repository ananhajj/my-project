
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserRoleGuardProps {
  userRole: string | null;
  hasSettings: boolean;
}

export const UserRoleGuard = ({ userRole, hasSettings }: UserRoleGuardProps) => {
  // Admin user view
  if (userRole === 'admin') {
    return (
      <div className="min-h-screen font-tajawal flex items-center justify-center" dir="rtl">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <UserCheck className="h-5 w-5" />
              أنت مدير النظام
            </CardTitle>
            <CardDescription>
              هذه الصفحة مخصصة للمدارس فقط
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              كمدير نظام، يمكنك الوصول لوحة التحكم الإدارية لإدارة جميع المدارس في النظام.
            </p>
            <div className="flex gap-2">
              <Link to="/admin">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  وحة التحكم الإدارية
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline">
                  العودة للرئيسية
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No settings/not logged in view
  if (!hasSettings) {
    return (
      <div className="min-h-screen font-tajawal flex items-center justify-center" dir="rtl">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              يجب تسجيل الدخول أولاً
            </CardTitle>
            <CardDescription>
              يرجى تسجيل الدخول للوصول إلى إعدادات المدرسة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              لا يمكن الوصول إلى إعدادات المدرسة بدون تسجيل الدخول.
            </p>
            <div className="flex gap-2">
              <Link to="/school-login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  تسجيل الدخول
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline">
                  العودة للرئيسية
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};
