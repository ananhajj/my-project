
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, Clock, Database, Eye, Trash2, Key } from "lucide-react";

interface School {
  id: string;
  subscription_id: string;
  school_name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'expired';
  subscription_end?: string;
  students_count: number;
  created_at: string;
  updated_at: string;
}

interface SchoolManagementTableProps {
  schools: School[];
  onToggleStatus: (schoolId: string) => void;
  onExtendSubscription: (school: School) => void;
  onViewSchoolData: (school: School) => void;
  onDeleteSchool: (school: School) => void;
  onViewCredentials: (school: School) => void;
}

const SchoolManagementTable = ({ 
  schools, 
  onToggleStatus, 
  onExtendSubscription, 
  onViewSchoolData,
  onDeleteSchool,
  onViewCredentials
}: SchoolManagementTableProps) => {
  const { toast } = useToast();

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

  const handleToggleStatus = (schoolId: string) => {
    onToggleStatus(schoolId);
  };

  const handleViewSchoolData = (school: School) => {
    onViewSchoolData(school);
    toast({
      title: "تم فتح بيانات المدرسة",
      description: `عرض بيانات ${school.school_name}`,
    });
  };

  const handleDeleteSchool = (school: School) => {
    onDeleteSchool(school);
  };

  const handleViewCredentials = (school: School) => {
    onViewCredentials(school);
  };

  if (schools.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد مدارس مسجلة حتى الآن
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>اسم المدرسة</TableHead>
          <TableHead>رقم الاشتراك</TableHead>
          <TableHead>البريد الإلكتروني</TableHead>
          <TableHead>عدد الطلاب</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>انتهاء الاشتراك</TableHead>
          <TableHead>الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schools.map((school) => (
          <TableRow key={school.id}>
            <TableCell className="font-medium">{school.school_name}</TableCell>
            <TableCell>
              <Badge variant="outline">{school.subscription_id}</Badge>
            </TableCell>
            <TableCell>{school.email}</TableCell>
            <TableCell>{school.students_count}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(school.status)}>
                {getStatusLabel(school.status)}
              </Badge>
            </TableCell>
            <TableCell>
              {school.subscription_end ? school.subscription_end : "غير محدد"}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleStatus(school.id)}
                  className={school.status === "active" ? "text-red-600" : "text-green-600"}
                  title={school.status === "active" ? "إيقاف الاشتراك" : "تفعيل الاشتراك"}
                >
                  {school.status === "active" ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onExtendSubscription(school)}
                  className="text-blue-600"
                  title="تمديد الاشتراك"
                >
                  <Clock className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleViewSchoolData(school)}
                  className="text-purple-600"
                  title="عرض بيانات المدرسة"
                >
                  <Database className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleViewCredentials(school)}
                  className="text-orange-600"
                  title="عرض بيانات الدخول"
                >
                  <Key className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600"
                  title="عرض التفاصيل"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteSchool(school)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="حذف المدرسة"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SchoolManagementTable;
