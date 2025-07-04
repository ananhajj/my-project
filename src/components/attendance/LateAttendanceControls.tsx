
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Save } from "lucide-react";

interface LateAttendanceControlsProps {
  selectedDate: string;
  selectedStage: string;
  selectedGrade: string;
  selectedSection: string;
  selectedPeriod: string;
  hasMultipleStages: boolean;
  enabledStages: any[];
  availableGrades: string[];
  availableSections: string[];
  studentsWithAttendance: any[];
  hasExistingAttendance: boolean;
  isEditMode: boolean;
  settings: any;
  loading: boolean;
  onDateChange: (date: string) => void;
  onStageChange: (stage: string) => void;
  onGradeChange: (grade: string) => void;
  onSectionChange: (section: string) => void;
  onPeriodChange: (period: string) => void;
  onSaveAttendance: () => void;
  getStageDisplayName: (stage: any) => string;
}

export const LateAttendanceControls = ({
  selectedDate,
  selectedStage,
  selectedGrade,
  selectedSection,
  selectedPeriod,
  hasMultipleStages,
  enabledStages,
  availableGrades,
  availableSections,
  studentsWithAttendance,
  hasExistingAttendance,
  isEditMode,
  settings,
  loading,
  onDateChange,
  onStageChange,
  onGradeChange,
  onSectionChange,
  onPeriodChange,
  onSaveAttendance,
  getStageDisplayName
}: LateAttendanceControlsProps) => {
  const isHourlyAttendance = settings?.attendance_type === 'hourly';
  const canModify = !hasExistingAttendance || isEditMode;

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-orange-600">
          <Clock className="h-5 w-5" />
          تسجيل التأخر
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Selection */}
        <div>
          <Label htmlFor="date" className="text-sm font-medium">التاريخ</Label>
          <Input
            id="date" 
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Stage Selection */}
        {hasMultipleStages && (
          <div>
            <Label htmlFor="stage" className="text-sm font-medium">المرحلة</Label>
            <Select value={selectedStage} onValueChange={onStageChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="اختر المرحلة" />
              </SelectTrigger>
              <SelectContent>
                {enabledStages.map(stage => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {getStageDisplayName(stage)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Grade Selection */}
        <div>
          <Label htmlFor="grade" className="text-sm font-medium">الصف</Label>
          <Select value={selectedGrade} onValueChange={onGradeChange}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="اختر الصف" />
            </SelectTrigger>
            <SelectContent>
              {availableGrades.map(grade => (
                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Section Selection */}
        {selectedGrade && (
          <div>
            <Label htmlFor="section" className="text-sm font-medium">الشعبة</Label>
            <Select value={selectedSection} onValueChange={onSectionChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="اختر الشعبة" />
              </SelectTrigger>
              <SelectContent>
                {availableSections.map(section => (
                  <SelectItem key={section} value={section}>{section}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Period Selection for Hourly Attendance */}
        {isHourlyAttendance && (
          <div>
            <Label htmlFor="period" className="text-sm font-medium">الحصة</Label>
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="اختر الحصة" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(period => (
                  <SelectItem key={period} value={period.toString()}>
                    الحصة {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Save Button */}
        {selectedGrade && selectedSection && studentsWithAttendance.length > 0 && canModify && (
          <Button
            onClick={onSaveAttendance}
            className="w-full bg-orange-600 hover:bg-orange-700 mt-6"
            disabled={loading}
          >
            <Save className="h-4 w-4 ml-2" />
            {loading ? "جاري الحفظ..." : "حفظ التأخر"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
