
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Calendar } from "lucide-react";
import { useAttendance } from "@/hooks/useAttendance";
import { useStudents } from "@/hooks/useStudents";

export const AttendanceAnnouncement = () => {
  const { students } = useStudents();
  const { attendanceRecords } = useAttendance(students);

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Get unique grade-section combinations from students
  const getClassesFromStudents = () => {
    const uniqueClasses = new Map<string, { grade: string, section: string }>();
    
    students.forEach(student => {
      const classKey = `${student.grade}_${student.section}`;
      if (!uniqueClasses.has(classKey)) {
        uniqueClasses.set(classKey, {
          grade: student.grade,
          section: student.section
        });
      }
    });
    
    return Array.from(uniqueClasses.values());
  };

  // Check which classes don't have attendance recorded today
  const getClassesWithoutAttendance = () => {
    const allClasses = getClassesFromStudents();
    
    return allClasses.filter(classItem => {
      // Find students in this class
      const classStudents = students.filter(student => 
        student.grade === classItem.grade && student.section === classItem.section
      );
      
      // Check if any student in this class has attendance recorded today
      const hasAttendanceToday = classStudents.some(student => 
        attendanceRecords.some(record => 
          record.studentId === student.id && record.date === today
        )
      );
      
      return !hasAttendanceToday && classStudents.length > 0;
    });
  };

  const classesWithoutAttendance = getClassesWithoutAttendance();

  // Don't show announcement if all classes have attendance recorded or no students exist
  if (classesWithoutAttendance.length === 0 || students.length === 0) {
    return null;
  }

  return (
    <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 mb-6">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-900 font-semibold">
        تنبيه من نظام حاضرون التعليمي: فصول لم يتم تسجيل الحضور لها اليوم
      </AlertTitle>
      <AlertDescription className="mt-2">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-yellow-600" />
          <span className="font-medium">الفصول التي تحتاج لتسجيل الحضور:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {classesWithoutAttendance.map((classItem, index) => (
            <span 
              key={`${classItem.grade}-${classItem.section}`}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200"
            >
              {classItem.grade} - {classItem.section}
            </span>
          ))}
        </div>
        <p className="text-sm mt-2 text-yellow-700">
          يرجى الانتقال إلى صفحة الحضور لتسجيل حضور هذه الفصول
        </p>
      </AlertDescription>
    </Alert>
  );
};
