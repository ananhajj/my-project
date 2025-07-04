
import { Student } from '@/hooks/useStudents';

export const getAvailableGrades = (
  students: Student[],
  enabledStages: any[],
  hasMultipleStages: boolean,
  selectedStage: string,
  orderedStages: any[]
) => {
  console.log('getAvailableGrades called with:', { students: students.length, enabledStages: enabledStages.length, hasMultipleStages, selectedStage });
  
  // إذا لم تكن هناك مراحل مُفعلة، أظهر جميع صفوف الطلاب
  if (!hasMultipleStages || enabledStages.length === 0) {
    const studentGrades = [...new Set(students.map(s => s.grade))].filter(grade => grade && grade.trim());
    console.log('No enabled stages, showing all student grades:', studentGrades);
    return studentGrades.sort((a, b) => a.localeCompare(b, 'ar'));
  }
  
  // إذا تم اختيار مرحلة، أظهر صفوف تلك المرحلة فقط
  if (selectedStage) {
    const stage = orderedStages.find((s: any) => s.id === selectedStage);
    if (stage && stage.grades) {
      const stageGrades = stage.grades.map((g: any) => g.name).filter(grade => grade && grade.trim());
      console.log('Stage selected, showing stage grades only:', stageGrades);
      return stageGrades.sort((a, b) => a.localeCompare(b, 'ar'));
    }
    // إذا لم توجد صفوف للمرحلة، ارجع مصفوفة فارغة
    console.log('Stage selected but no grades found, returning empty array');
    return [];
  }
  
  // إذا لم يتم اختيار مرحلة، أظهر جميع الصفوف من المراحل المُفعلة
  const allStageGrades = enabledStages.flatMap((stage: any) => 
    stage.grades ? stage.grades.map((g: any) => g.name) : []
  ).filter(grade => grade && grade.trim());
  
  const uniqueGrades = [...new Set(allStageGrades)];
  console.log('No stage selected, showing all enabled stage grades:', uniqueGrades);
  return uniqueGrades.sort((a, b) => a.localeCompare(b, 'ar'));
};

export const getAvailableSections = (
  selectedGrade: string,
  students: Student[],
  enabledStages: any[],
  hasMultipleStages: boolean,
  selectedStage: string,
  orderedStages: any[]
) => {
  if (!selectedGrade) {
    return [];
  }
  
  console.log('getAvailableSections called for grade:', selectedGrade);
  
  // إذا تم اختيار مرحلة، ابحث عن الشعب في تلك المرحلة فقط
  if (hasMultipleStages && selectedStage) {
    const stage = orderedStages.find((s: any) => s.id === selectedStage);
    if (stage && stage.grades) {
      const grade = stage.grades.find((g: any) => g.name === selectedGrade);
      if (grade && grade.sections) {
        const stageSections = grade.sections.filter(section => section && section.trim());
        console.log('Stage and grade selected, showing stage sections:', stageSections);
        return stageSections.sort((a, b) => a.localeCompare(b, 'ar'));
      }
    }
    // إذا لم توجد شعب للصف في المرحلة، ارجع شعبة افتراضية
    console.log('Stage selected but no sections found for grade, returning default section');
    return ['أ'];
  }
  
  // إذا لم تكن هناك مراحل مُفعلة، أظهر شعب الطلاب
  const studentSections = [...new Set(
    students
      .filter(s => s.grade === selectedGrade)
      .map(s => s.section)
      .filter(section => section && section.trim())
  )];
  
  console.log('No stages or stage selected, showing student sections:', studentSections);
  return studentSections.length > 0 ? studentSections.sort((a, b) => a.localeCompare(b, 'ar')) : ['أ'];
};
