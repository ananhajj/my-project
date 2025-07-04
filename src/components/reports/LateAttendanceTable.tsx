
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentWithAttendance } from "@/hooks/useReportsData";
import { LateRecord } from "@/hooks/useLateAttendance";
import { Printer, FileDown } from "lucide-react";
import { generateLateAttendancePDF } from "@/utils/lateAttendancePdfGenerator";

interface LateAttendanceTableProps {
  studentsWithAttendance: StudentWithAttendance[];
  lateRecords: LateRecord[];
  enabledStages?: any[];
}

interface StudentLateData {
  student: StudentWithAttendance;
  lateRecords: LateRecord[];
  totalLateDays: number;
  consecutiveLateDays: number;
}

const calculateTotalLateDays = (lateRecords: LateRecord[], studentId: string): number => {
  return lateRecords.filter(record => record.studentId === studentId).length;
};

const calculateConsecutiveLateDays = (lateRecords: LateRecord[], studentId: string): number => {
  if (!lateRecords || lateRecords.length === 0) {
    return 0;
  }

  const studentLateRecords = lateRecords.filter(record => record.studentId === studentId);
  if (studentLateRecords.length === 0) {
    return 0;
  }

  studentLateRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let consecutiveDays = 0;
  let previousDate: Date | null = null;

  for (const record of studentLateRecords) {
    const currentDate = new Date(record.date);

    if (!previousDate) {
      consecutiveDays = 1;
      previousDate = currentDate;
    } else {
      const timeDifference = previousDate.getTime() - currentDate.getTime();
      const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

      if (dayDifference === 1) {
        consecutiveDays++;
        previousDate = currentDate;
      } else {
        break;
      }
    }
  }

  return consecutiveDays;
};

export const LateAttendanceTable = ({ 
  studentsWithAttendance, 
  lateRecords,
  enabledStages = []
}: LateAttendanceTableProps) => {
  const [studentDetails, setStudentDetails] = useState<{ student: StudentWithAttendance | null, lateRecords: LateRecord[] }>({ student: null, lateRecords: [] });

  const filteredData: {
    student: StudentWithAttendance;
    lateRecords: LateRecord[];
    totalLateDays: number;
    consecutiveLateDays: number;
  }[] = useMemo(() => {
    return studentsWithAttendance
      .map(student => {
        const studentLateRecords = lateRecords.filter(record => record.studentId === student.id);
        const totalLateDays = calculateTotalLateDays(lateRecords, student.id);
        const consecutiveLateDays = calculateConsecutiveLateDays(lateRecords, student.id);

        return {
          student: student,
          lateRecords: studentLateRecords,
          totalLateDays: totalLateDays,
          consecutiveLateDays: consecutiveLateDays
        };
      });
  }, [studentsWithAttendance, lateRecords]);

  const handlePrint = () => {
    const printContent = document.getElementById('late-attendance-table');
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
      await generateLateAttendancePDF(
        filteredData,
        {
          selectedPeriod: "",
          selectedStage: "",
          selectedGrade: "",
          selectedSection: ""
        }
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
              تقرير التأخر المفصل
            </CardTitle>
            <div className="flex gap-3">
              <Button
                onClick={handlePrint}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-white hover:bg-slate-50 border-slate-300 text-slate-700 px-4 py-2 rounded-lg shadow-sm"
              >
                <Printer className="h-4 w-4" />
                طباعة التقرير
              </Button>
              <Button
                onClick={handleExportPDF}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 px-4 py-2 rounded-lg shadow-sm"
              >
                <FileDown className="h-4 w-4" />
                حفظ كـ PDF
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div id="late-attendance-table" className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-800 hover:to-slate-700 border-0">
                    <TableHead className="text-white font-bold text-center py-3 px-4 text-xs border-r border-slate-600 last:border-r-0">م</TableHead>
                    <TableHead className="text-white font-bold text-right py-3 px-4 text-xs border-r border-slate-600 min-w-[150px]">اسم الطالب</TableHead>
                    <TableHead className="text-white font-bold text-center py-3 px-4 text-xs border-r border-slate-600">الصف/الشعبة</TableHead>
                    <TableHead className="text-white font-bold text-center py-3 px-4 text-xs border-r border-slate-600">عدد أيام التأخر</TableHead>
                    <TableHead className="text-white font-bold text-center py-3 px-4 text-xs border-r border-slate-600">عدد أيام التأخر المتتالية</TableHead>
                    <TableHead className="text-white font-bold text-center py-3 px-4 text-xs">تفاصيل التأخر</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, index) => (
                    <TableRow 
                      key={item.student.id}
                      className={`
                        ${index % 2 === 0 
                          ? 'bg-slate-50/50' 
                          : 'bg-white'
                        } 
                        hover:bg-blue-50/70 transition-all duration-200 border-b border-slate-100 last:border-b-0
                      `}
                    >
                      <TableCell className="text-center font-bold text-slate-700 py-4 px-6 border-r border-slate-100 last:border-r-0">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-800 py-4 px-6 border-r border-slate-100 text-right">
                        {item.student.name}
                      </TableCell>
                      <TableCell className="text-slate-700 text-center py-4 px-6 border-r border-slate-100 font-medium">
                        {`${item.student.grade} / ${item.student.section}`}
                      </TableCell>
                      <TableCell className="text-center py-4 px-6 border-r border-slate-100">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-bold border-2 ${
                            item.totalLateDays === 0 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : item.totalLateDays <= 2
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : item.totalLateDays <= 4
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {item.totalLateDays}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4 px-6 border-r border-slate-100">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1.5 rounded-full text-sm font-bold border-2 ${
                            item.consecutiveLateDays === 0 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : item.consecutiveLateDays <= 2
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : item.consecutiveLateDays <= 4
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {item.consecutiveLateDays}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4 px-6">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setStudentDetails({ student: item.student, lateRecords: item.lateRecords })}
                          className="bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300 px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          عرض التفاصيل
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {studentDetails.student && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg mx-4 border-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-slate-800">تفاصيل تأخر الطالب: {studentDetails.student.name}</h2>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {studentDetails.lateRecords.map((record, index) => (
                  <div key={index} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-700">التاريخ:</span>
                      <span className="text-slate-600">{new Date(record.date).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="font-medium text-slate-700">النوع:</span>
                      <span className="text-slate-600">{record.lateType}</span>
                    </div>
                    {record.time && (
                      <div className="flex justify-between items-center text-sm mt-2">
                        <span className="font-medium text-slate-700">الوقت:</span>
                        <span className="text-slate-600">{record.time}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                className="absolute top-4 left-4 text-slate-600 hover:text-slate-800 hover:bg-slate-100 border-slate-300 rounded-lg px-3 py-1.5" 
                onClick={() => setStudentDetails({ student: null, lateRecords: [] })}
              >
                إغلاق
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
