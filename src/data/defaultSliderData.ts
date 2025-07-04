
import { SchoolStage } from '@/types/schoolSettings';

export const defaultSliderStages: SchoolStage[] = [
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
      { id: 'grade4', name: 'الرابع الابتدائي', sections: ['أ', 'ب'] },
      { id: 'grade5', name: 'الخامس الابتدائي', sections: ['أ', 'ب'] },
      { id: 'grade6', name: 'السادس الابتدائي', sections: ['أ', 'ب'] }
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

export const sliderGradeOptions = [
  'المستوى الأول',
  'المستوى الثاني', 
  'المستوى الثالث',
  'الأول الابتدائي بنين',
  'الأول الابتدائي بنات',
  'الثاني الابتدائي بنين',
  'الثاني الابتدائي بنات',
  'الثالث الابتدائي بنين',
  'الثالث الابتدائي بنات',
  'الرابع الابتدائي',
  'الخامس الابتدائي',
  'السادس الابتدائي',
  'الأول المتوسط',
  'الثاني المتوسط',
  'الثالث المتوسط',
  'الأول الثانوي',
  'الثاني الثانوي',
  'الثالث الثانوي'
];
