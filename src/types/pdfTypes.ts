
export interface SchoolInfo {
  country: string;
  ministry: string;
  education_department: string;
  educational_supervision: string;
  school_name: string;
}

export interface PDFGenerationOptions {
  studentsData: any[];
  selectedGrade: string;
  overallAttendanceRate: number;
  totalStudents: number;
  alertsCount: number;
}
