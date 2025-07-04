
import { SchoolSettings } from '@/types/schoolSettings';

export const toggleStageEnabled = (settings: SchoolSettings, stageId: string): SchoolSettings => {
  return {
    ...settings,
    stages: settings.stages.map(stage =>
      stage.id === stageId
        ? { ...stage, enabled: !stage.enabled }
        : stage
    )
  };
};

export const updateGradeSections = (
  settings: SchoolSettings, 
  stageId: string, 
  gradeId: string, 
  sections: string[]
): SchoolSettings => {
  return {
    ...settings,
    stages: settings.stages.map(stage =>
      stage.id === stageId
        ? {
            ...stage,
            grades: stage.grades.map(grade =>
              grade.id === gradeId
                ? { ...grade, sections }
                : grade
            )
          }
        : stage
    )
  };
};

export const addGradeToStage = (
  settings: SchoolSettings,
  stageId: string,
  gradeName: string
): SchoolSettings => {
  const newGradeId = `grade_${Date.now()}`;
  return {
    ...settings,
    stages: settings.stages.map(stage =>
      stage.id === stageId
        ? {
            ...stage,
            grades: [...stage.grades, {
              id: newGradeId,
              name: gradeName,
              sections: ['أ']
            }]
          }
        : stage
    )
  };
};

export const updateGradeName = (
  settings: SchoolSettings,
  stageId: string,
  gradeId: string,
  newName: string
): SchoolSettings => {
  return {
    ...settings,
    stages: settings.stages.map(stage =>
      stage.id === stageId
        ? {
            ...stage,
            grades: stage.grades.map(grade =>
              grade.id === gradeId
                ? { ...grade, name: newName }
                : grade
            )
          }
        : stage
    )
  };
};

export const deleteGrade = (
  settings: SchoolSettings,
  stageId: string,
  gradeId: string
): SchoolSettings => {
  return {
    ...settings,
    stages: settings.stages.map(stage =>
      stage.id === stageId
        ? {
            ...stage,
            grades: stage.grades.filter(grade => grade.id !== gradeId)
          }
        : stage
    )
  };
};
