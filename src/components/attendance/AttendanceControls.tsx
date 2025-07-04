
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, CheckCircle, XCircle, Save, Clock, BookOpen, GraduationCap, School } from "lucide-react";
import { StudentWithAttendance } from "@/types/attendance";
import { useToast } from "@/hooks/use-toast";

interface AttendanceControlsProps {
  selectedDate: string;
  selectedStage: string;
  selectedGrade: string;
  selectedSection: string;
  selectedPeriod: string;
  hasMultipleStages: boolean;
  enabledStages: any[];
  availableGrades: string[];
  availableSections: string[];
  studentsWithAttendance: StudentWithAttendance[];
  hasExistingAttendance: boolean;
  isEditMode: boolean;
  settings: any;
  loading?: boolean;
  onDateChange: (date: string) => void;
  onStageChange: (stage: string) => void;
  onGradeChange: (grade: string) => void;
  onSectionChange: (section: string) => void;
  onPeriodChange: (period: string) => void;
  onMarkAllPresent: () => void;
  onMarkAllAbsent: () => void;
  onSaveAttendance: () => void;
  getStageDisplayName: (stageId: string) => string;
}

export const AttendanceControls = ({
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
  loading = false,
  onDateChange,
  onStageChange,
  onGradeChange,
  onSectionChange,
  onPeriodChange,
  onMarkAllPresent,
  onMarkAllAbsent,
  onSaveAttendance,
  getStageDisplayName
}: AttendanceControlsProps) => {
  // Show stages if there are multiple enabled stages
  const shouldShowStages = hasMultipleStages && enabledStages && enabledStages.length > 1;
  
  // Debug logs for enabled stages
  console.log('AttendanceControls: hasMultipleStages:', hasMultipleStages);
  console.log('AttendanceControls: enabledStages:', enabledStages);
  console.log('AttendanceControls: enabledStages.length:', enabledStages?.length);
  console.log('AttendanceControls: shouldShowStages:', shouldShowStages);
  console.log('AttendanceControls: loading:', loading);

  if (loading) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg mb-6">
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <p className="text-school-navy">جاري تحميل الإعدادات...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-white/30 shadow-lg mb-6">
      <CardHeader className="bg-school-navy/5 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-school-navy">
          <CalendarIcon className="h-5 w-5" />
          إعدادات الحضور
        </CardTitle>
        <CardDescription>تصنيف الطلاب حسب المرحلة والصف والشعبة</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div>
          <label className="text-sm font-medium text-school-navy">التاريخ</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-school-blue/30 rounded-md focus:border-school-green focus:ring-school-green"
          />
        </div>

        {/* Educational Stage Classification - Show if multiple stages */}
        {shouldShowStages && (
          <div className="bg-school-teal/5 p-3 rounded-lg border border-school-teal/20">
            <label className="text-sm font-semibold text-school-navy flex items-center gap-2 mb-2">
              <School className="h-4 w-4 text-school-teal" />
              المرحلة التعليمية ({enabledStages.length} مراحل متاحة)
            </label>
            <Select value={selectedStage} onValueChange={onStageChange}>
              <SelectTrigger className="mt-1 border-school-teal/30 focus:border-school-green bg-white">
                <SelectValue placeholder="اختر المرحلة" />
              </SelectTrigger>
              <SelectContent className="bg-white border-school-teal/30 z-50">
                {enabledStages.map((stage: any) => {
                  console.log('AttendanceControls: Rendering stage option:', stage);
                  return (
                    <SelectItem key={stage.id} value={stage.id} className="hover:bg-school-teal/10">
                      {stage.name || getStageDisplayName(stage.id)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <p className="text-xs text-school-navy/60 mt-1">
              {enabledStages.length === 0 ? 'لا توجد مراحل مُفعلة' : `${enabledStages.length} مراحل مُفعلة`}
            </p>
          </div>
        )}
        
        {/* Period selection if attendance is hourly */}
        {settings?.attendance_type === 'hourly' && (
          <div className="bg-school-blue/5 p-3 rounded-lg border border-school-blue/20">
            <label className="text-sm font-semibold text-school-navy flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-school-blue" />
              الحصة الدراسية
            </label>
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger className="mt-1 border-school-blue/30 focus:border-school-green bg-white">
                <SelectValue placeholder="اختر الحصة" />
              </SelectTrigger>
              <SelectContent className="bg-white border-school-blue/30 z-50">
                {Array.from({ length: settings?.periods_per_day || 6 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()} className="hover:bg-school-blue/10">
                    الحصة {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Grade Classification */}
        <div className="bg-school-green/5 p-3 rounded-lg border border-school-green/20">
          <label className="text-sm font-semibold text-school-navy flex items-center gap-2 mb-2">
            <GraduationCap className="h-4 w-4 text-school-green" />
            الصف الدراسي
          </label>
          <Select 
            value={selectedGrade} 
            onValueChange={onGradeChange}
            disabled={shouldShowStages && !selectedStage}
          >
            <SelectTrigger className="mt-1 border-school-green/30 focus:border-school-green bg-white">
              <SelectValue placeholder={
                shouldShowStages && !selectedStage ? "اختر المرحلة أولاً" : "اختر الصف"
              } />
            </SelectTrigger>
            <SelectContent className="bg-white border-school-green/30 z-50">
              {availableGrades.map(grade => (
                <SelectItem key={grade} value={grade} className="hover:bg-school-green/10">{grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Section Classification */}
        <div className="bg-school-navy/5 p-3 rounded-lg border border-school-navy/20">
          <label className="text-sm font-semibold text-school-navy flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-school-navy" />
            الشعبة
          </label>
          <Select 
            value={selectedSection} 
            onValueChange={onSectionChange} 
            disabled={!selectedGrade}
          >
            <SelectTrigger className="mt-1 border-school-navy/30 focus:border-school-green bg-white">
              <SelectValue placeholder={!selectedGrade ? "اختر الصف أولاً" : "اختر الشعبة"} />
            </SelectTrigger>
            <SelectContent className="bg-white border-school-navy/30 z-50">
              {availableSections.map(section => (
                <SelectItem key={section} value={section} className="hover:bg-school-navy/10">{section}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {studentsWithAttendance.length > 0 && (!hasExistingAttendance || isEditMode) && (
          <div className="space-y-2 pt-4 border-t border-school-gray/20">
            <Button 
              onClick={onMarkAllPresent}
              className="w-full bg-school-green hover:bg-school-green/90 text-white" 
              variant="default"
              type="button"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              الجميع حاضر
            </Button>
            <Button 
              onClick={onMarkAllAbsent}
              className="w-full border-red-500 text-red-500 hover:bg-red-50" 
              variant="outline"
              type="button"
            >
              <XCircle className="h-4 w-4 mr-2" />
              الجميع غائب
            </Button>
            <Button 
              onClick={onSaveAttendance}
              className="w-full bg-school-teal hover:bg-school-teal/90 text-white"
              type="button"
            >
              <Save className="h-4 w-4 mr-2" />
              {hasExistingAttendance ? "حفظ التعديل" : "حفظ الحضور"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
