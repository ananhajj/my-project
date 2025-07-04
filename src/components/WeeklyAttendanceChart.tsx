import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Calendar } from "lucide-react";
import { useMemo } from "react";
import { useAttendance } from "@/hooks/useAttendance";
import { useLateAttendance } from "@/hooks/useLateAttendance";
import { useStudents } from "@/hooks/useStudents";

export const WeeklyAttendanceChart = () => {
  const { students } = useStudents();
  const { getAttendanceForDate } = useAttendance(students);
  const { getLateRecordsForDate } = useLateAttendance();

  const weeklyData = useMemo(() => {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();

    if (dayOfWeek === 0) {
      startOfWeek.setDate(today.getDate());
    } else {
      startOfWeek.setDate(today.getDate() - dayOfWeek);
    }

    return days.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      const dateString = date.toISOString().split('T')[0];

      const attendanceRecords = getAttendanceForDate(dateString);
      const lateRecords = getLateRecordsForDate(dateString);

      const absentCount = attendanceRecords.filter(record => record.status === 'absent').length;
      const lateCount = lateRecords.length;
      const totalStudents = students.length;

      const hasData = absentCount > 0 || lateCount > 0;

      return {
        day,
        date: dateString,
        absent: hasData ? absentCount : null,
        late: hasData ? lateCount : null,
        total: hasData ? totalStudents : null
      };
    });
  }, [getAttendanceForDate, getLateRecordsForDate, students]);

  return (
    <Card className="bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-lg shadow-xl border-0 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F4A261]/10 to-[#E05B5B]/10"></div>
      <CardHeader className="relative z-10 pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-school-navy text-center">
          <Calendar className="h-5 w-5" />
          إحصائيات التأخر الأسبوعية
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 pt-0">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12, fill: '#15445A' }}
              axisLine={{ stroke: '#3D7EB9' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#15445A' }}
              axisLine={{ stroke: '#3D7EB9' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e0e7ff',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number, name: string) => [
                value ? `${value} طالب` : 'لا توجد بيانات',
                name === 'absent' ? 'غائب' : name === 'late' ? 'متأخر' : 'العدد الكلي'
              ]}
              labelFormatter={(label) => `يوم ${label}`}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => value === 'absent' ? 'غائب' : value === 'late' ? 'متأخر' : 'العدد الكلي'}
            />
            <Bar 
              dataKey="total" 
              fill="#07A869"
              stroke="#0DA9A6"
              name="total"
              radius={[2, 2, 2, 2]}
              strokeWidth={1}
              opacity={0.3}
            />
            <Bar 
              dataKey="absent" 
              fill="#E05B5B"
              stroke="#D9822B"
              name="absent"
              radius={[4, 4, 0, 0]}
              strokeWidth={1}
            />
            <Bar 
              dataKey="late" 
              fill="#F4A261"
              stroke="#D9822B"
              name="late"
              radius={[4, 4, 0, 0]}
              strokeWidth={1}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
