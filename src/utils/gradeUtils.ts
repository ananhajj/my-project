
import { SchoolSettings } from '@/types/schoolSettings';

export const getAvailableGrades = (settings: SchoolSettings): string[] => {
  return settings.stages
    .filter(stage => stage.enabled)
    .flatMap(stage => stage.grades)
    .map(grade => grade.name);
};

export const getAvailableSections = (settings: SchoolSettings, gradeName: string): string[] => {
  for (const stage of settings.stages) {
    const grade = stage.grades.find(g => g.name === gradeName);
    if (grade) {
      return grade.sections;
    }
  }
  return ['أ'];
};
