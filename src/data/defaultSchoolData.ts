
import { SchoolStage, SchoolSettings } from '@/types/schoolSettings';

export const defaultStages: SchoolStage[] = [
  {
    id: 'kindergarten',
    name: 'رياض الأطفال',
    enabled: false,
    grades: [
      { id: 'kg1', name: 'المستوى الأول', sections: ['أ'] },
      { id: 'kg2', name: 'المستوى الثاني', sections: ['أ'] },
      { id: 'kg3', name: 'المستوى الثالث', sections: ['أ'] }
    ]
  },
  {
    id: 'early_childhood',
    name: 'الطفولة المبكرة',
    enabled: false,
    grades: [
      { id: 'early1_boys', name: 'الأول الابتدائي بنين', sections: ['أ'] },
      { id: 'early1_girls', name: 'الأول الابتدائي بنات', sections: ['أ'] },
      { id: 'early2_boys', name: 'الثاني الابتدائي بنين', sections: ['أ'] },
      { id: 'early2_girls', name: 'الثاني الابتدائي بنات', sections: ['أ'] },
      { id: 'early3_boys', name: 'الثالث الابتدائي بنين', sections: ['أ'] },
      { id: 'early3_girls', name: 'الثالث الابتدائي بنات', sections: ['أ'] }
    ]
  },
  {
    id: 'elementary',
    name: 'المرحلة الابتدائية',
    enabled: true,
    grades: [
      { id: 'grade4', name: 'الرابع الابتدائي', sections: ['أ'] },
      { id: 'grade5', name: 'الخامس الابتدائي', sections: ['أ'] },
      { id: 'grade6', name: 'السادس الابتدائي', sections: ['أ'] }
    ]
  },
  {
    id: 'middle',
    name: 'المرحلة المتوسطة',
    enabled: false,
    grades: [
      { id: 'grade7', name: 'الأول المتوسط', sections: ['أ'] },
      { id: 'grade8', name: 'الثاني المتوسط', sections: ['أ'] },
      { id: 'grade9', name: 'الثالث المتوسط', sections: ['أ'] }
    ]
  },
  {
    id: 'high',
    name: 'المرحلة الثانوية',
    enabled: false,
    grades: [
      { id: 'grade10', name: 'الأول الثانوي', sections: ['أ'] },
      { id: 'grade11', name: 'الثاني الثانوي', sections: ['أ'] },
      { id: 'grade12', name: 'الثالث الثانوي', sections: ['أ'] }
    ]
  }
];

export const defaultSettings: SchoolSettings = {
  schoolName: '',
  stages: defaultStages,
  attendanceType: 'daily',
  periodsPerDay: 6
};

export const STORAGE_KEY = 'school_settings';
