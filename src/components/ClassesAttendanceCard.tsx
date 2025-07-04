import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock } from "lucide-react";
import { useAttendance } from "@/hooks/useAttendance";
import { useStudents } from "@/hooks/useStudents";
import { useState, useEffect } from "react";

export const ClassesAttendanceCard = () => {
  const { students } = useStudents();
  const { attendanceRecords } = useAttendance(students);
  const [refreshKey, setRefreshKey] = useState(0);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [attendanceRecords.length, attendanceRecords]);

  const getClassesFromStudents = () => {
    const uniqueClasses = new Map<string, { grade: string, section: string, studentCount: number }>();

    students.forEach(student => {
      const classKey = `${student.grade}_${student.section}`;
      if (uniqueClasses.has(classKey)) {
        const existing = uniqueClasses.get(classKey)!;
        uniqueClasses.set(classKey, { ...existing, studentCount: existing.studentCount + 1 });
      } else {
        uniqueClasses.set(classKey, {
          grade: student.grade,
          section: student.section,
          studentCount: 1,
        });
      }
    });

    return Array.from(uniqueClasses.values());
  };

  const getClassesAttendanceStatus = () => {
    const allClasses = getClassesFromStudents();
    const classesWithAttendance: typeof allClasses = [];
    const classesWithoutAttendance: typeof allClasses = [];

    allClasses.forEach(classItem => {
      const classStudents = students.filter(
        student => student.grade === classItem.grade && student.section === classItem.section
      );

      const hasAttendanceToday = classStudents.some(student =>
        attendanceRecords.some(record => record.studentId === student.id && record.date === today)
      );

      if (hasAttendanceToday) {
        classesWithAttendance.push(classItem);
      } else {
        classesWithoutAttendance.push(classItem);
      }
    });

    return { classesWithAttendance, classesWithoutAttendance };
  };

  const { classesWithAttendance, classesWithoutAttendance } = getClassesAttendanceStatus();

  return (
    <Card key={refreshKey} className="bg-white/90 backdrop-blur-md shadow-lg lg:shadow-xl border-0 rounded-2xl overflow-hidden">
      <CardHeader className="p-4 lg:p-6 pb-3 lg:pb-4">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-[#3D7EB9]/20 text-[#3D7EB9] flex items-center justify-center">
            <Calendar className="w-5 h-5 lg:w-6 lg:h-6" />
          </div>
          <div>
            <CardTitle className="text-lg lg:text-xl font-semibold text-school-navy">حالة حضور الفصول</CardTitle>
            <CardDescription className="text-xs lg:text-sm text-school-navy/70">متابعة تسجيل الحضور للفصول والشعب</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 lg:p-6 pt-0 space-y-3 lg:space-y-4">
        {/* الفصول التي لم يتم تسجيل حضور لها */}
        {classesWithoutAttendance.length > 0 && (
          <div className="space-y-2 lg:space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 lg:h-4 lg:w-4 text-[#E05B5B]" />
              <span className="font-medium text-[#E05B5B] text-sm lg:text-base">
                فصول لم يتم تسجيل الحضور لها ({classesWithoutAttendance.length})
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {classesWithoutAttendance.map((classItem) => (
                <div
                  key={`${classItem.grade}-${classItem.section}-${refreshKey}`}
                  className="flex items-center justify-between p-2 lg:p-3 bg-[#FDECEC] border border-[#E05B5B] rounded-lg"
                >
                  <div>
                    <div className="font-medium text-[#E05B5B] text-sm lg:text-base">{classItem.grade} - {classItem.section}</div>
                    <div className="text-xs lg:text-sm text-[#E05B5B] flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {classItem.studentCount} طالب
                    </div>
                  </div>
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-[#E05B5B] rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* الفصول التي تم تسجيل حضور لها */}
        {classesWithAttendance.length > 0 && (
          <div className="space-y-2 lg:space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 lg:h-4 lg:w-4 text-[#07A869]" />
              <span className="font-medium text-[#07A869] text-sm lg:text-base">
                فصول تم تسجيل الحضور لها ({classesWithAttendance.length})
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {classesWithAttendance.map((classItem) => (
                <div
                  key={`${classItem.grade}-${classItem.section}-${refreshKey}`}
                  className="flex items-center justify-between p-2 lg:p-3 bg-[#E6F6F0] border border-[#07A869] rounded-lg"
                >
                  <div>
                    <div className="font-medium text-[#07A869] text-sm lg:text-base">{classItem.grade} - {classItem.section}</div>
                    <div className="text-xs lg:text-sm text-[#07A869] flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {classItem.studentCount} طالب
                    </div>
                  </div>
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-[#07A869] rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* لا يوجد طلاب */}
        {students.length === 0 && (
          <div className="text-center py-6 lg:py-8 text-school-navy/70">
            <Calendar className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-2 lg:mb-3 text-school-navy/40" />
            <p className="text-sm lg:text-base">لا توجد طلاب مسجلون</p>
            <p className="text-xs lg:text-sm mt-1">يرجى إضافة طلاب أولاً لعرض حالة الحضور</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
