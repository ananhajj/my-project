
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info, Edit } from "lucide-react";

interface AttendanceAlertProps {
  hasExistingAttendance: boolean;
  studentsLength: number;
  isEditMode: boolean;
  onEnableEditMode: () => void;
}

export const AttendanceAlert = ({ 
  hasExistingAttendance, 
  studentsLength, 
  isEditMode, 
  onEnableEditMode 
}: AttendanceAlertProps) => {
  if (!hasExistingAttendance || studentsLength === 0 || isEditMode) {
    return null;
  }

  return (
    <Alert className="mb-6 bg-blue-50 border-blue-200">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <div className="flex items-center justify-between">
          <span>تم تسجيل الحضور لهذا الفصل في هذا التاريخ مسبقاً</span>
          <Button 
            onClick={onEnableEditMode}
            variant="outline"
            size="sm"
            className="bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200"
          >
            <Edit className="h-4 w-4 mr-1" />
            تعديل
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
