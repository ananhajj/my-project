
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

interface SchoolStatsCardsProps {
  schools: School[];
}

const SchoolStatsCards = ({ schools }: SchoolStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white/70 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-600">إجمالي المدارس</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{schools.length}</div>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-600">المدارس النشطة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {schools.filter(s => s.status === "active").length}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-600">إجمالي الطلاب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {schools.reduce((total, school) => total + (school.students_count || 0), 0)}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/70 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-gray-600">اشتراكات منتهية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {schools.filter(s => s.status === "expired").length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolStatsCards;
