
export interface StudentWithAttendance {
  id: string;
  name: string;
  grade: string;
  section: string;
  studentId: string;
  isPresent?: boolean | undefined;
  status?: 'present' | 'absent' | 'late' | undefined;
}

export interface AttendanceState {
  selectedStage: string;
  selectedGrade: string;
  selectedSection: string;
  selectedDate: string;
  selectedPeriod: string;
  studentsWithAttendance: StudentWithAttendance[];
  attendanceChanges: {[studentId: string]: 'present' | 'absent' | 'late' | undefined};
  isEditMode: boolean;
  hasExistingAttendance: boolean;
}
