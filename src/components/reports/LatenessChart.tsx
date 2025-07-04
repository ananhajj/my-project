
import { useMemo } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { StudentWithAttendance } from "@/hooks/useReportsData";
import { LateRecord } from "@/hooks/useLateAttendance";

interface LatenessChartProps {
  selectedPeriod: string;
  lateRecords: LateRecord[];
  filteredStudents: StudentWithAttendance[];
  periodDateRange?: { startDate: Date; endDate: Date };
  latenessData: {
    lateCount: number;
    onTimeCount: number;
    totalStudents: number;
    totalLateInstances: number;
    latePercentage: number;
    onTimePercentage: number;
  };
}

export const LatenessChart = ({ 
  selectedPeriod, 
  lateRecords, 
  filteredStudents, 
  periodDateRange, 
  latenessData 
}: LatenessChartProps) => {
  const chartData = useMemo(() => {
    console.log('=== Chart Data Debug ===');
    console.log('Selected period:', selectedPeriod);
    console.log('Period date range:', periodDateRange);
    console.log('Late records:', lateRecords);
    console.log('Filtered students:', filteredStudents);

    if (!periodDateRange || !lateRecords.length) {
      console.log('Using simple distribution data');
      return [{
        name: "متأخرين",
        value: latenessData.lateCount,
        fill: "#f97316"
      }, {
        name: "غير متأخرين", 
        value: latenessData.onTimeCount,
        fill: "#10b981"
      }];
    }

    const { startDate, endDate } = periodDateRange;
    
    if (selectedPeriod === "weekly") {
      // أيام الأسبوع من الأحد إلى الخميس
      const daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
      const weeklyData = daysOfWeek.map((day, index) => {
        const dayDate = new Date(startDate);
        dayDate.setDate(startDate.getDate() + index);
        
        const dayLateRecords = lateRecords.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate.toDateString() === dayDate.toDateString();
        });
        
        console.log(`${day} (${dayDate.toDateString()}): ${dayLateRecords.length} late records`);
        
        return {
          name: day,
          value: dayLateRecords.length,
          fill: "#f97316"
        };
      });
      
      console.log('Weekly chart data:', weeklyData);
      return weeklyData;
    }
    
    if (selectedPeriod === "monthly") {
      // أسابيع الشهر
      const weeks = [];
      const currentDate = new Date(startDate);
      let weekNumber = 1;
      
      while (currentDate <= endDate) {
        const weekStart = new Date(currentDate);
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        if (weekEnd > endDate) {
          weekEnd.setTime(endDate.getTime());
        }
        
        const weekLateRecords = lateRecords.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= weekStart && recordDate <= weekEnd;
        });
        
        weeks.push({
          name: `الأسبوع ${weekNumber}`,
          value: weekLateRecords.length,
          fill: "#f97316"
        });
        
        currentDate.setDate(currentDate.getDate() + 7);
        weekNumber++;
      }
      
      console.log('Monthly chart data:', weeks);
      return weeks;
    }
    
    if (selectedPeriod === "quarterly") {
      // أسابيع الفصل الدراسي
      const weeks = [];
      const currentDate = new Date(startDate);
      let weekNumber = 1;
      
      while (currentDate <= endDate) {
        const weekStart = new Date(currentDate);
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        if (weekEnd > endDate) {
          weekEnd.setTime(endDate.getTime());
        }
        
        const weekLateRecords = lateRecords.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= weekStart && recordDate <= weekEnd;
        });
        
        weeks.push({
          name: `أ${weekNumber}`,
          value: weekLateRecords.length,
          fill: "#f97316"
        });
        
        currentDate.setDate(currentDate.getDate() + 7);
        weekNumber++;
      }
      
      console.log('Quarterly chart data:', weeks);
      return weeks;
    }
    
    // للفترات الأخرى، عرض التوزيع العام
    console.log('Using general distribution data');
    return [{
      name: "متأخرين",
      value: latenessData.lateCount,
      fill: "#f97316"
    }, {
      name: "غير متأخرين",
      value: latenessData.onTimeCount,
      fill: "#10b981"
    }];
  }, [selectedPeriod, periodDateRange, lateRecords, latenessData]);

  const chartConfig = {
    value: {
      label: "عدد المرات",
    },
  };

  console.log('Final chart data for render:', chartData);

  return (
    <div className="w-full h-64 bg-white rounded-lg border p-4">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 20, left: 20, bottom: 50 }}
          >
            {/* إضافة الشبكة للخطوط الأفقية والعمودية */}
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e2e8f0" 
              strokeWidth={1}
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              tick={{ 
                fontSize: 14, 
                textAnchor: 'middle', 
                fill: '#1f2937',
                fontWeight: 'bold'
              }}
              axisLine={{ stroke: '#6b7280', strokeWidth: 1.5 }}
              tickLine={{ stroke: '#6b7280', strokeWidth: 1 }}
              angle={0}
              height={40}
              interval={0}
            />
            <YAxis 
              tick={{ 
                fontSize: 14, 
                fill: '#1f2937',
                fontWeight: 'bold'
              }}
              axisLine={{ stroke: '#6b7280', strokeWidth: 1.5 }}
              tickLine={{ stroke: '#6b7280', strokeWidth: 1 }}
              allowDecimals={false}
              width={50}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Bar 
              dataKey="value"
              fill="#f97316"
              radius={[4, 4, 0, 0]}
              name="عدد مرات التأخر"
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
