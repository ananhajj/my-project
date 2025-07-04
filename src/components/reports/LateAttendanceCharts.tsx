
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { Clock, TrendingUp } from "lucide-react";

interface LateAttendanceChartsProps {
  weeklyLateData: any[];
  gradeLateData: any[];
  selectedStageDisplayName: string;
  studentsWithAttendance?: any[];
}

export const LateAttendanceCharts = ({
  weeklyLateData,
  gradeLateData,
  selectedStageDisplayName,
  studentsWithAttendance = []
}: LateAttendanceChartsProps) => {
  
  // إعداد بيانات التأخر مقابل عدم التأخر
  const lateVsNonLateData = () => {
    const lateStudents = studentsWithAttendance.filter(s => s.lateDays > 0).length;
    const nonLateStudents = studentsWithAttendance.filter(s => s.lateDays === 0).length;
    const totalStudents = studentsWithAttendance.length;

    return [
      {
        category: "غير متأخرين",
        count: nonLateStudents,
        percentage: totalStudents > 0 ? Math.round((nonLateStudents / totalStudents) * 100) : 0
      },
      {
        category: "متأخرين",
        count: lateStudents,
        percentage: totalStudents > 0 ? Math.round((lateStudents / totalStudents) * 100) : 0
      }
    ];
  };

  const chartData = lateVsNonLateData();
  const totalStudents = studentsWithAttendance.length;

  const chartConfig = {
    count: {
      label: "عدد الطلاب",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* رسم بياني للتأخر مقابل عدم التأخر */}
      <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-orange-700">
            <Clock className="h-5 w-5" />
            توزيع الطلاب حسب التأخر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      formatter={(value, name) => [
                        `${value} طالب (${chartData.find(d => d.count === value)?.percentage || 0}%)`,
                        name
                      ]}
                    />
                  }
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  <Cell fill="#22c55e" />
                  <Cell fill="#f97316" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* إحصائيات العدد الكلي */}
      <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-report-navy">
            <TrendingUp className="h-5 w-5" />
            إحصائيات شاملة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-report-green/10 rounded-lg border border-report-green/20">
              <div className="text-2xl font-bold text-report-green">
                {chartData[0]?.count || 0}
              </div>
              <div className="text-sm text-report-navy/70">طالب غير متأخر</div>
              <div className="text-xs text-report-green font-medium">
                {chartData[0]?.percentage || 0}% من المجموع
              </div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">
                {chartData[1]?.count || 0}
              </div>
              <div className="text-sm text-report-navy/70">طالب متأخر</div>
              <div className="text-xs text-orange-600 font-medium">
                {chartData[1]?.percentage || 0}% من المجموع
              </div>
            </div>
          </div>
          
          <div className="text-center p-4 bg-report-navy/5 rounded-lg border border-report-navy/20">
            <div className="text-3xl font-bold text-report-navy">
              {totalStudents}
            </div>
            <div className="text-sm text-report-navy/70">إجمالي عدد الطلاب</div>
            {selectedStageDisplayName && (
              <div className="text-xs text-report-navy/60 mt-1">
                في {selectedStageDisplayName}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
