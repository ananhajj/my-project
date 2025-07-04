
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface ReportsDataValidationProps {
  studentsCount: number;
  attendanceRecordsCount: number;
  studentsWithAlertsCount: number;
  studentsWithLateAlertsCount: number;
}

export const ReportsDataValidation = ({
  studentsCount,
  attendanceRecordsCount,
  studentsWithAlertsCount,
  studentsWithLateAlertsCount
}: ReportsDataValidationProps) => {
  return (
    <>
      {/* Data validation alerts */}
      {studentsCount === 0 && (
        <Alert className="mb-4 border-blue-200 bg-blue-50 p-3">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            لا توجد بيانات طلاب محفوظة. يرجى إضافة طلاب أولاً من <Link to="/students" className="font-bold underline">صفحة إدارة الطلاب</Link>
          </AlertDescription>
        </Alert>
      )}

      {attendanceRecordsCount === 0 && studentsCount > 0 && (
        <Alert className="mb-4 border-orange-200 bg-orange-50 p-3">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            لا توجد سجلات حضور. يرجى تسجيل الحضور أولاً من <Link to="/attendance" className="font-bold underline">صفحة تسجيل الحضور</Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Absence alerts */}
      {studentsWithAlertsCount > 0 && (
        <Alert className="mb-4 border-orange-200 bg-orange-50 p-3">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            يوجد {studentsWithAlertsCount} طالب يحتاج إلى متابعة بسبب الغياب المتكرر
          </AlertDescription>
        </Alert>
      )}

      {/* Late alerts */}
      {studentsWithLateAlertsCount > 0 && (
        <Alert className="mb-4 border-yellow-200 bg-yellow-50 p-3">
          <Clock className="h-4 w-4" />
          <AlertDescription className="text-sm">
            يوجد {studentsWithLateAlertsCount} طالب يحتاج إلى متابعة بسبب التأخر المتكرر
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
