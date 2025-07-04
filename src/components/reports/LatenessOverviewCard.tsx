
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { StudentWithAttendance } from "@/hooks/useReportsData";
import { LatenessChart } from "./LatenessChart";
import { LatenessStatistics } from "./LatenessStatistics";

interface LatenessOverviewCardProps {
  filteredStudents: StudentWithAttendance[];
  selectedPeriod: string;
  lateRecords?: any[];
  periodDateRange?: { startDate: Date; endDate: Date };
}

export const LatenessOverviewCard = ({ 
  filteredStudents, 
  selectedPeriod, 
  lateRecords = [],
  periodDateRange 
}: LatenessOverviewCardProps) => {
  const latenessData = useMemo(() => {
    // استخدام lateDays المحدث من filteredStudents مباشرة
    const lateStudents = filteredStudents.filter(s => s.lateDays > 0);
    const onTimeStudents = filteredStudents.filter(s => s.lateDays === 0);
    const totalStudents = filteredStudents.length;
    
    const lateCount = lateStudents.length;
    const onTimeCount = onTimeStudents.length;
    
    // حساب العدد الكلي لحالات التأخر
    const totalLateInstances = filteredStudents.reduce((sum, s) => sum + (s.lateDays || 0), 0);
    
    const latePercentage = totalStudents > 0 ? Math.round((lateCount / totalStudents) * 100) : 0;
    const onTimePercentage = totalStudents > 0 ? Math.round((onTimeCount / totalStudents) * 100) : 0;

    console.log('Lateness data calculation:', {
      lateStudents: lateStudents.map(s => ({ name: s.name, lateDays: s.lateDays })),
      lateCount,
      onTimeCount,
      totalLateInstances
    });

    return {
      lateCount,
      onTimeCount,
      totalStudents,
      totalLateInstances,
      latePercentage,
      onTimePercentage
    };
  }, [filteredStudents]);

  const getPeriodText = () => {
    switch (selectedPeriod) {
      case "weekly": return "أسبوعياً";
      case "monthly": return "شهرياً"; 
      case "quarterly": return "فصلياً";
      case "yearly": return "سنوياً";
      default: return "إجمالي";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-600" />
          الرسم البياني للتأخر من {periodDateRange?.startDate.toLocaleDateString('ar-SA')} إلى {periodDateRange?.endDate.toLocaleDateString('ar-SA')}
        </CardTitle>
        <span className="text-sm text-muted-foreground">{getPeriodText()}</span>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* الإحصائيات في الأعلى */}
          <LatenessStatistics latenessData={latenessData} />
          
          {/* الرسم البياني في الأسفل مع ارتفاع ثابت */}
          <div className="w-full">
            <LatenessChart
              selectedPeriod={selectedPeriod}
              lateRecords={lateRecords}
              filteredStudents={filteredStudents}
              periodDateRange={periodDateRange}
              latenessData={latenessData}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
