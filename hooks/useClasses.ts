
import { useState, useEffect } from 'react';

export interface Class {
  id: string;
  name: string;
  grade: string;
}

const CLASSES_STORAGE_KEY = 'school_classes';

export const useClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    const savedClasses = localStorage.getItem(CLASSES_STORAGE_KEY);
    if (savedClasses) {
      try {
        const parsedClasses = JSON.parse(savedClasses);
        // التأكد من أن البيانات هي مصفوفة صحيحة
        if (Array.isArray(parsedClasses)) {
          setClasses(parsedClasses);
        } else {
          console.error('بيانات الفصول غير صحيحة في localStorage');
          setClasses([]);
          localStorage.removeItem(CLASSES_STORAGE_KEY);
        }
      } catch (error) {
        console.error('خطأ في قراءة بيانات الفصول:', error);
        setClasses([]);
        localStorage.removeItem(CLASSES_STORAGE_KEY);
      }
    } else {
      // بدء بمصفوفة فارغة إذا لم توجد بيانات محفوظة
      console.log('لا توجد فصول محفوظة، البدء بمصفوفة فارغة');
      setClasses([]);
    }
  }, []);

  useEffect(() => {
    if (classes.length > 0) {
      localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(classes));
    } else {
      // إزالة البيانات من localStorage إذا كانت المصفوفة فارغة
      localStorage.removeItem(CLASSES_STORAGE_KEY);
    }
  }, [classes]);

  const addClass = (newClass: Omit<Class, 'id'>) => {
    const classWithId: Class = {
      ...newClass,
      id: Date.now().toString()
    };
    setClasses(prev => [...prev, classWithId]);
    return classWithId;
  };

  const removeClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  const updateClass = (id: string, updatedClass: Partial<Class>) => {
    setClasses(prev => prev.map(c => 
      c.id === id ? { ...c, ...updatedClass } : c
    ));
  };

  const clearAllClasses = () => {
    setClasses([]);
    localStorage.removeItem(CLASSES_STORAGE_KEY);
  };

  return {
    classes,
    addClass,
    removeClass,
    updateClass,
    clearAllClasses
  };
};
