
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { UserCheck, UserX, TrendingUp } from "lucide-react";

interface AttendanceChartsSectionProps {
  filteredStudents: any[];
  selectedStageDisplayName: string;
  startDate?: Date;
  endDate?: Date;
}

export const AttendanceChartsSection = ({
  filteredStudents,
  selectedStageDisplayName,
  startDate,
  endDate
}: AttendanceChartsSectionProps) => {
  
  // إعداد بيانات الحضور والغياب
  const attendanceData = () => {
    const presentStudents = filteredStudents.filter(s => (s.attendancePercentage || 0) >= 90).length;
    const absentStudents = filteredStudents.filter(s => (s.absenceDays || 0) > 2).length;
    const totalStudents = filteredStudents.length;

    return [
      {
        category: "حضور منتظم",
        count: presentStudents,
        percentage: totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0
      },
      {
        category: "غياب متكرر",
        count: absentStudents,
        percentage: totalStudents > 0 ? Math.round((absentStudents / totalStudents) * 100) : 0
      },
      {
        category: "غياب",
        count: totalStudents - presentStudents,
        percentage: totalStudents > 0 ? Math.round(((totalStudents - presentStudents) / totalStudents) * 100) : 0
      }
    ];
  };

  const chartData = attendanceData();
  const totalStudents = filteredStudents.length;

  const chartConfig = {
    count: {
      label: "عدد الطلاب",
      color: "hsl(var(--chart-1))",
    },
  };

  // تحديد نص الفترة
  const getPeriodText = () => {
    if (startDate && endDate) {
      return `من ${startDate.toLocaleDateString('ar-SA')} إلى ${endDate.toLocaleDateString('ar-SA')}`;
    }
    return "جميع الفترات";
  };

  return (
    <div className="mb-6">
      {/* بطاقة مدمجة للرسم البياني والإحصائيات */}
      <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
            <TrendingUp className="h-5 w-5" />
            الرسم البياني للحضور والغياب في الفترة ({getPeriodText()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* الإحصائيات التفصيلية في الأعلى */}
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">حضور منتظم</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">{chartData[0]?.count || 0}</div>
                    <div className="text-xs text-green-600">{chartData[0]?.percentage || 0}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <UserX className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-700">غياب متكرر</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-red-600">{chartData[1]?.count || 0}</div>
                    <div className="text-xs text-red-600">{chartData[1]?.percentage || 0}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <UserX className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">غياب</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-600">{chartData[2]?.count || 0}</div>
                    <div className="text-xs text-gray-600">{chartData[2]?.percentage || 0}%</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200 mt-4">
                <div className="text-2xl font-bold text-blue-600">
                  {totalStudents}
                </div>
                <div className="text-sm text-blue-700">إجمالي عدد الطلاب</div>
                {selectedStageDisplayName && (
                  <div className="text-xs text-blue-600 mt-1">
                    في {selectedStageDisplayName}
                  </div>
                )}
              </div>
            </div>

            {/* الرسم البياني في الأسفل */}
            <div className="w-full">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="category" 
                      tick={{ fontSize: 11 }}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
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
                      <Cell fill="#ef4444" />
                      <Cell fill="#6b7280" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
