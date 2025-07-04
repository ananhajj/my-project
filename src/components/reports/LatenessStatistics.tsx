
interface LatenessStatisticsProps {
  latenessData: {
    lateCount: number;
    onTimeCount: number;
    totalStudents: number;
    totalLateInstances: number;
    latePercentage: number;
    onTimePercentage: number;
  };
}

export const LatenessStatistics = ({ latenessData }: LatenessStatisticsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Late Students Card */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-orange-600">
          {latenessData.lateCount}
        </div>
        <div className="text-sm text-orange-700 font-medium">
          طالب متأخر
        </div>
        <div className="text-xs text-orange-600 mt-1">
          {latenessData.latePercentage}% من المجموع
        </div>
      </div>

      {/* On Time Students Card */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-green-600">
          {latenessData.onTimeCount}
        </div>
        <div className="text-sm text-green-700 font-medium">
          طالب غير متأخر
        </div>
        <div className="text-xs text-green-600 mt-1">
          {latenessData.onTimePercentage}% من المجموع
        </div>
      </div>

      {/* Total Students Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-gray-700">
          {latenessData.totalStudents}
        </div>
        <div className="text-sm text-gray-600 font-medium">
          إجمالي عدد الطلاب
        </div>
      </div>
    </div>
  );
};
