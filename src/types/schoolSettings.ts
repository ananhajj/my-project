
export interface SchoolStage {
  id: string;
  name: string;
  enabled: boolean;
  grades: Grade[];
}

export interface Grade {
  id: string;
  name: string;
  sections: string[];
}

export interface SchoolSettings {
  schoolName: string;
  stages: SchoolStage[];
  attendanceType: 'daily' | 'hourly';
  periodsPerDay?: number;
}
