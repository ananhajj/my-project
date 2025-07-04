
import { LateAttendanceTable } from "./LateAttendanceTable";
import { StudentWithAttendance } from "@/hooks/useReportsData";
import { LateRecord } from "@/hooks/useLateAttendance";

interface LateAttendanceReportProps {
  studentsWithAttendance: StudentWithAttendance[];
  lateRecords: LateRecord[];
  enabledStages?: any[];
}

export const LateAttendanceReport = ({ 
  studentsWithAttendance, 
  lateRecords,
  enabledStages = []
}: LateAttendanceReportProps) => {
  console.log('=== LateAttendanceReport Render ===');
  console.log('Students count:', studentsWithAttendance?.length || 0);
  console.log('Late records count:', lateRecords?.length || 0);

  return (
    <LateAttendanceTable
      studentsWithAttendance={studentsWithAttendance}
      lateRecords={lateRecords}
      enabledStages={enabledStages}
    />
  );
};
