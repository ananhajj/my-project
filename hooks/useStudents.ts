
import { useState, useEffect } from 'react';

export interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
  studentId: string;
}

const STORAGE_KEY = 'school_students';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // تحميل البيانات من localStorage عند بدء التطبيق
  useEffect(() => {
    console.log('useStudents: Loading students from localStorage');
    const savedStudents = localStorage.getItem(STORAGE_KEY);
    console.log('useStudents: Raw saved data:', savedStudents);
    
    if (savedStudents) {
      try {
        const parsedStudents = JSON.parse(savedStudents);
        console.log('useStudents: Parsed students:', parsedStudents);
        // التأكد من أن البيانات هي مصفوفة وليس null أو undefined
        if (Array.isArray(parsedStudents)) {
          setStudents(parsedStudents);
        } else {
          console.log('useStudents: Invalid data format, starting with empty array');
          setStudents([]);
          // مسح البيانات الفاسدة من localStorage
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('خطأ في قراءة بيانات الطلاب:', error);
        // في حالة فشل التحليل، نبدأ بقائمة فارغة ونمسح البيانات الفاسدة
        setStudents([]);
        localStorage.removeItem(STORAGE_KEY);
      }
    } else {
      console.log('useStudents: No saved students found in localStorage, starting with empty array');
      setStudents([]);
    }
    setIsInitialized(true);
  }, []);

  // حفظ البيانات في localStorage عند تغييرها - فقط بعد التهيئة
  useEffect(() => {
    if (isInitialized) {
      console.log('useStudents: Saving students to localStorage:', students);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    }
  }, [students, isInitialized]);

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString()
    };
    console.log('useStudents: Adding new student:', newStudent);
    setStudents(prev => [...prev, newStudent]);
    return newStudent;
  };

  const removeStudent = (id: string) => {
    console.log('useStudents: Removing student with id:', id);
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const updateStudent = (id: string, updatedStudent: Partial<Student>) => {
    console.log('useStudents: Updating student:', id, updatedStudent);
    setStudents(prev => prev.map(student => 
      student.id === id 
        ? { ...student, ...updatedStudent }
        : student
    ));
  };

  const addMultipleStudents = (newStudents: Omit<Student, 'id'>[]) => {
    const studentsWithIds = newStudents.map((student, index) => ({
      ...student,
      id: (Date.now() + index).toString()
    }));
    console.log('useStudents: Adding multiple students:', studentsWithIds);
    setStudents(prev => [...prev, ...studentsWithIds]);
    return studentsWithIds;
  };

  // إضافة دالة لمسح جميع الطلاب
  const clearAllStudents = () => {
    console.log('useStudents: Clearing all students');
    setStudents([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  console.log('useStudents: Current students state:', students);

  return {
    students,
    addStudent,
    removeStudent,
    updateStudent,
    addMultipleStudents,
    clearAllStudents,
    totalStudents: students.length
  };
};
