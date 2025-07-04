
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface DashboardChartsProps {
  attendanceData: Array<{ name: string; value: number }>;
  dailyAttendanceData: Array<{ name: string; present: number; absent: number; late?: number }>;
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

export const DashboardCharts = ({ attendanceData, dailyAttendanceData }: DashboardChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
      {/* Pie Chart for Today's Attendance */}
      <Card className="bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-lg shadow-xl lg:shadow-2xl border-0 rounded-2xl lg:rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/10"></div>
        <CardHeader className="relative z-10 pb-2 lg:pb-4 p-4 lg:p-6">
          <CardTitle className="text-lg lg:text-xl font-bold text-school-navy text-center">توزيع الحضور اليوم</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 p-4 lg:p-6 pt-0">
          <ResponsiveContainer width="100%" height={250} className="lg:h-[300px]">
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={60}
                className="lg:outerRadius-80"
                fill="#8884d8"
                dataKey="value"
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart for Daily Attendance */}
      <Card className="bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-lg shadow-xl lg:shadow-2xl border-0 rounded-2xl lg:rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-600/10"></div>
        <CardHeader className="relative z-10 pb-2 lg:pb-4 p-4 lg:p-6">
          <CardTitle className="text-lg lg:text-xl font-bold text-school-navy text-center">إحصائيات الحضور اليومي</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 p-4 lg:p-6 pt-0">
          <ResponsiveContainer width="100%" height={250} className="lg:h-[300px]">
            <BarChart data={dailyAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#10b981" name="حاضر" />
              <Bar dataKey="absent" fill="#ef4444" name="غائب" />
              <Bar dataKey="late" fill="#f59e0b" name="متأخر" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
