
import { useState, useEffect } from 'react';
import { SchoolSettings } from '@/types/schoolSettings';
import { defaultSettings } from '@/data/defaultSchoolData';
import { loadSettingsFromStorage, saveSettingsToStorage } from '@/utils/schoolSettingsStorage';
import { 
  toggleStageEnabled, 
  updateGradeSections as updateGradeSectionsUtil, 
  addGradeToStage, 
  updateGradeName as updateGradeNameUtil, 
  deleteGrade as deleteGradeUtil 
} from '@/utils/stageManagement';
import { getAvailableGrades, getAvailableSections } from '@/utils/gradeUtils';
import { useRealSchoolSettings } from './useRealSchoolSettings';

export const useSchoolSettings = () => {
  const { settings: realSettings, loading } = useRealSchoolSettings();
  const [settings, setSettings] = useState<SchoolSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);
  const [settingsVersion, setSettingsVersion] = useState(0);

  useEffect(() => {
    // If we have real settings from database, use them
    if (realSettings && !loading) {
      const convertedSettings: SchoolSettings = {
        schoolName: realSettings.school_name || '',
        stages: realSettings.stages || [],
        attendanceType: realSettings.attendance_type || 'daily',
        periodsPerDay: realSettings.periods_per_day || 6
      };
      setSettings(convertedSettings);
      setIsLoaded(true);
    } else if (!loading) {
      // Fallback to localStorage
      const savedSettings = loadSettingsFromStorage();
      console.log('useSchoolSettings: Loading settings from storage:', savedSettings);
      if (savedSettings) {
        console.log('useSchoolSettings: Found saved settings, applying:', savedSettings);
        setSettings(savedSettings);
      } else {
        console.log('useSchoolSettings: No saved settings found, using defaults:', defaultSettings);
      }
      setIsLoaded(true);
    }
  }, [realSettings, loading]);

  useEffect(() => {
    if (isLoaded && !realSettings) {
      console.log('useSchoolSettings: Saving settings to storage:', settings);
      saveSettingsToStorage(settings);
      // Force a version update to trigger re-renders
      setSettingsVersion(prev => prev + 1);
    }
  }, [settings, isLoaded, realSettings]);

  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    console.log('useSchoolSettings: Updating settings with:', newSettings);
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      console.log('useSchoolSettings: New settings state:', updated);
      return updated;
    });
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    saveSettingsToStorage(defaultSettings);
  };

  const toggleStage = (stageId: string) => {
    console.log('useSchoolSettings: Toggling stage:', stageId);
    setSettings(prev => {
      const updated = toggleStageEnabled(prev, stageId);
      console.log('useSchoolSettings: After toggle, new settings:', updated);
      return { ...updated, __version: Date.now() };
    });
  };

  const updateGradeSections = (stageId: string, gradeId: string, sections: string[]) => {
    setSettings(prev => updateGradeSectionsUtil(prev, stageId, gradeId, sections));
  };

  const addGrade = (stageId: string, gradeName: string) => {
    setSettings(prev => addGradeToStage(prev, stageId, gradeName));
  };

  const updateGradeName = (stageId: string, gradeId: string, newName: string) => {
    setSettings(prev => updateGradeNameUtil(prev, stageId, gradeId, newName));
  };

  const deleteGrade = (stageId: string, gradeId: string) => {
    setSettings(prev => deleteGradeUtil(prev, stageId, gradeId));
  };

  console.log('useSchoolSettings: Current settings state:', settings);
  console.log('useSchoolSettings: Current stages:', settings?.stages);
  console.log('useSchoolSettings: Settings version:', settingsVersion);

  return {
    settings: { ...settings, __version: settingsVersion },
    updateSettings,
    resetToDefaults,
    toggleStage,
    updateGradeSections,
    addGrade,
    updateGradeName,
    deleteGrade,
    getAvailableGrades: () => getAvailableGrades(settings),
    getAvailableSections: (gradeName: string) => getAvailableSections(settings, gradeName),
    isConfigured: settings.schoolName.length > 0
  };
};
