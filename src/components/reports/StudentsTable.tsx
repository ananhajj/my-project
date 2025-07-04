import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentWithAttendance } from "@/hooks/useReportsData";
import { Printer, FileDown, ArrowUpDown } from "lucide-react";
import { generateStudentsListPDF } from "@/utils/studentsListPdfGenerator";
import { useRealSchoolSettings } from "@/hooks/useRealSchoolSettings";
import { getDynamicStatusColor, getDynamicStatusText } from "@/utils/attendanceUtils";

interface StudentsTableProps {
  students: StudentWithAttendance[];
  
  sortBy?: "name" | "absenceDays" | "attendancePercentage";
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
  selectedStage?: string;
  selectedGrade?: string;
  selectedSection?: string;
  getStageDisplayName?: (stage: any) => string;
}

export const StudentsTable = ({ 
  students, 
  sortBy = "absenceDays", 
  sortOrder = "desc",
  onSort,
  selectedStage,
  selectedGrade,
  selectedSection,
  getStageDisplayName
}: StudentsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { settings } = useRealSchoolSettings();

  // Sort students based on current sort settings
  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.name || "";
          bValue = b.name || "";
          break;
        case "attendancePercentage":
          aValue = a.attendancePercentage || 0;
          bValue = b.attendancePercentage || 0;
          break;
        case "absenceDays":
        default:
          aValue = a.absenceDays || 0;
          bValue = b.absenceDays || 0;
          break;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [students, sortBy, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = sortedStudents.slice(startIndex, endIndex);

  const handlePrint = () => {
    const printContent = document.getElementById('students-table');
    if (printContent) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const handleExportPDF = async () => {
    try {
      const schoolName = "المدرسة";
      let filterInfo = "جميع الطلاب";
      
      if (selectedStage && getStageDisplayName) {
        filterInfo = getStageDisplayName({ name: selectedStage });
      }
      if (selectedGrade) {
        filterInfo += ` - ${selectedGrade}`;
      }
      if (selectedSection) {
        filterInfo += ` - ${selectedSection}`;
      }

      await generateStudentsListPDF(
        sortedStudents,
        schoolName,
        filterInfo,
        selectedGrade,
        selectedSection,
        selectedStage
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 py-6">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
              تقرير الغياب المفصل
            </CardTitle>
            <div className="flex gap-3">
              <Button
                onClick={handlePrint}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-white hover:bg-slate-50 border-slate-300 text-slate-700 px-4 py-2 rounded-lg shadow-sm"
              >
                <Printer className="h-4 w-4" />
                طباعة
              </Button>
              <Button
                onClick={handleExportPDF}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 px-4 py-2 rounded-lg shadow-sm"
              >
                <FileDown className="h-4 w-4" />
                تصدير PDF
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div id="students-table" className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-800 hover:to-slate-700 border-0">
                    <TableHead className="text-white font-bold text-center py-4 px-6 text-sm border-r border-slate-600 last:border-r-0">م</TableHead>
                    <TableHead className="text-white font-bold text-right py-4 px-6 text-sm border-r border-slate-600 min-w-[200px]">
                      <div className="flex items-center gap-2 justify-end">
                        اسم الطالب
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-white font-bold text-center py-4 px-6 text-sm border-r border-slate-600">الصف/الشعبة</TableHead>
                    <TableHead className="text-white font-bold text-center py-4 px-6 text-sm border-r border-slate-600">
                      <div className="flex items-center gap-2 justify-center">
                        أيام الغياب
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-white font-bold text-center py-4 px-6 text-sm border-r border-slate-600">
                      <div className="flex items-center gap-2 justify-center">
                        نسبة الحضور
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-white font-bold text-center py-4 px-6 text-sm">الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentStudents.map((student, index) => (
                    <TableRow 
                      key={student.id}
                      className={`
                        ${(startIndex + index) % 2 === 0 
                          ? 'bg-slate-50/50' 
                          : 'bg-white'
                        } 
                        hover:bg-blue-50/70 transition-all duration-200 border-b border-slate-100 last:border-b-0
                        ${student.absenceDays && student.absenceDays >= 3 ? 'bg-red-50/30' : ''}
                      `}
                    >
                      <TableCell className="text-center font-bold text-slate-700 py-4 px-6 border-r border-slate-100 last:border-r-0">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-800 py-4 px-6 border-r border-slate-100 text-right">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-slate-700 text-center py-4 px-6 border-r border-slate-100 font-medium">
                        {`${student.grade} / ${student.section}`}
                      </TableCell>
                      <TableCell className="text-center py-4 px-6 border-r border-slate-100">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-bold border-2 ${getDynamicStatusColor(student.absenceDays || 0, settings?.alert_rules)}`}>
                            {student.absenceDays || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4 px-6 border-r border-slate-100">
                        <div className="flex justify-center">
                          <span className="px-3 py-1.5 rounded-full text-sm font-bold bg-blue-50 text-blue-700 border-2 border-blue-200">
                            {student.attendancePercentage || 0}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4 px-6">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getDynamicStatusColor(student.absenceDays || 0, settings?.alert_rules)}`}>
                            {getDynamicStatusText(student.absenceDays || 0, settings?.alert_rules)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
              <div className="text-sm text-slate-600">
                عرض {startIndex + 1} إلى {Math.min(endIndex, sortedStudents.length)} من {sortedStudents.length} طالب
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm"
                >
                  السابق
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="px-3 py-1 text-sm min-w-[32px]"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm"
                >
                  التالي
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
