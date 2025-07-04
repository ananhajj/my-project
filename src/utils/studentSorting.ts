
import { Student } from '@/hooks/useStudents';

export const getStageOrder = (grade: string, orderedStages: any[]) => {
  // Find which stage this grade belongs to and return its order
  for (let i = 0; i < orderedStages.length; i++) {
    const stage = orderedStages[i];
    if (stage && stage.grades) {
      const gradeExists = stage.grades.some((g: any) => g.name === grade);
      if (gradeExists) {
        console.log(`Grade ${grade} found in stage ${stage.id} at order ${i}`);
        return i;
      }
    }
  }
  console.log(`Grade ${grade} not found in any stage, assigning order 999`);
  return 999; // Unknown stages go to the end
};

export const filterAndSortStudents = (
  students: Student[],
  selectedGrade: string,
  selectedSection: string,
  selectedStage: string,
  hasMultipleStages: boolean,
  orderedStages: any[]
) => {
  let filteredStudents = students.filter(s => {
    const gradeMatch = s.grade === selectedGrade;
    const sectionMatch = s.section === selectedSection;
    return gradeMatch && sectionMatch;
  });

  console.log('Filtered students for grade/section:', filteredStudents);

  if (hasMultipleStages && selectedStage) {
    const stage = orderedStages.find((s: any) => s.id === selectedStage);
    if (stage && stage.grades) {
      const stageGrades = stage.grades.map((g: any) => g.name);
      filteredStudents = filteredStudents.filter(s => stageGrades.includes(s.grade));
      console.log('Further filtered by stage:', filteredStudents);
    }
  }

  console.log('Before sorting, students:', filteredStudents.map(s => ({ name: s.name, grade: s.grade })));

  // Sort students by stage order, then by grade, then by name
  filteredStudents.sort((a, b) => {
    const stageOrderA = getStageOrder(a.grade, orderedStages);
    const stageOrderB = getStageOrder(b.grade, orderedStages);
    
    console.log(`Comparing: ${a.name} (${a.grade}, order: ${stageOrderA}) vs ${b.name} (${b.grade}, order: ${stageOrderB})`);
    
    // First sort by stage order
    if (stageOrderA !== stageOrderB) {
      return stageOrderA - stageOrderB;
    }
    
    // Then sort by grade name
    if (a.grade !== b.grade) {
      return a.grade.localeCompare(b.grade, 'ar');
    }
    
    // Finally sort by student name
    return a.name.localeCompare(b.name, 'ar');
  });

  console.log('After sorting, students:', filteredStudents.map(s => ({ name: s.name, grade: s.grade })));
  
  return filteredStudents;
};
