
import { SchoolSettings } from '@/types/schoolSettings';
import { STORAGE_KEY } from '@/data/defaultSchoolData';

export const loadSettingsFromStorage = (): SchoolSettings | null => {
  try {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    return savedSettings ? JSON.parse(savedSettings) : null;
  } catch (error) {
    console.error('خطأ في قراءة إعدادات المدرسة:', error);
    return null;
  }
};

export const saveSettingsToStorage = (settings: SchoolSettings): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};
