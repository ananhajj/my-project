
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface AttendanceReportFiltersProps {
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  selectedStage: string;
  handleStageChange: (value: string) => void;
  selectedGrade: string;
  handleGradeChange: (value: string) => void;
  selectedSection: string;
  setSelectedSection: (value: string) => void;
  hasMultipleStages: boolean;
  validEnabledStages: any[];
  safeGetStageDisplayName: (stage: any) => string;
  filteredAvailableGrades: string[];
  availableSectionsForGrade: string[];
  isLateReport?: boolean;
}

export const AttendanceReportFilters = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedStage,
  handleStageChange,
  selectedGrade,
  handleGradeChange,
  selectedSection,
  setSelectedSection,
  hasMultipleStages,
  validEnabledStages,
  safeGetStageDisplayName,
  filteredAvailableGrades,
  availableSectionsForGrade,
  isLateReport = false
}: AttendanceReportFiltersProps) => {
  const filterTitle = isLateReport ? "فلتر تقرير التأخر" : "فلتر تقرير الحضور";

  return (
    <Card className="mb-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border-blue-200/50 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">{filterTitle}</h3>
        </div>
        <p className="text-sm text-blue-700 mb-4">
          {isLateReport 
            ? "اختر الفترة الزمنية والمرحلة والصف والشعبة لتخصيص تقرير التأخر"
            : "اختر الفترة الزمنية والمرحلة والصف والشعبة لتخصيص تقرير الحضور"
          }
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* تاريخ البداية */}
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-2">تاريخ البداية</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-right font-normal bg-white/70 border-blue-200",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP", { locale: ar }) : "اختر التاريخ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* تاريخ النهاية */}
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-2">تاريخ النهاية</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-right font-normal bg-white/70 border-blue-200",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP", { locale: ar }) : "اختر التاريخ"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* المرحلة */}
          {hasMultipleStages && (
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">المرحلة</label>
              <Select value={selectedStage} onValueChange={handleStageChange}>
                <SelectTrigger className="bg-white/70 border-blue-200">
                  <SelectValue placeholder="جميع المراحل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">جميع المراحل</SelectItem>
                  {validEnabledStages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {safeGetStageDisplayName(stage)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* الصف */}
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-2">الصف</label>
            <Select value={selectedGrade} onValueChange={handleGradeChange}>
              <SelectTrigger className="bg-white/70 border-blue-200">
                <SelectValue placeholder="جميع الصفوف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الصفوف</SelectItem>
                {filteredAvailableGrades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* الشعبة */}
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-2">الشعبة</label>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="bg-white/70 border-blue-200">
                <SelectValue placeholder="جميع الشعب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الشعب</SelectItem>
                {availableSectionsForGrade.map((section) => (
                  <SelectItem key={section} value={section}>
                    {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
