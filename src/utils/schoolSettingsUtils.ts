
import { AlertSettings } from '@/types/alertSettings';

export const getDefaultStages = () => {
  return [
    {
      id: 'kindergarten',
      name: 'مرحلة الروضة',
      enabled: false,
      grades: [
        { id: 'grade_kg1', name: 'الأول', sections: ['أ'] },
        { id: 'grade_kg2', name: 'الثاني', sections: ['أ'] },
        { id: 'grade_prep', name: 'التمهيدي', sections: ['أ'] }
      ]
    },
    {
      id: 'early_childhood',
      name: 'مرحلة الطفولة المبكرة',
      enabled: false,
      grades: [
        { id: 'grade_first_boys', name: 'الأول بنين', sections: ['أ'] },
        { id: 'grade_second_boys', name: 'الثاني بنين', sections: ['أ'] },
        { id: 'grade_third_boys', name: 'الثالث بنين', sections: ['أ'] },
        { id: 'grade_first_girls', name: 'الأول بنات', sections: ['أ'] },
        { id: 'grade_second_girls', name: 'الثاني بنات', sections: ['أ'] },
        { id: 'grade_third_girls', name: 'الثالث بنات', sections: ['أ'] }
      ]
    },
    {
      id: 'elementary',
      name: 'المرحلة الابتدائية',
      enabled: true,
      grades: [
        { id: 'grade_1', name: 'الصف الأول', sections: ['أ'] },
        { id: 'grade_2', name: 'الصف الثاني', sections: ['أ'] },
        { id: 'grade_3', name: 'الصف الثالث', sections: ['أ'] },
        { id: 'grade_4', name: 'الصف الرابع', sections: ['أ'] },
        { id: 'grade_5', name: 'الصف الخامس', sections: ['أ'] },
        { id: 'grade_6', name: 'الصف السادس', sections: ['أ'] }
      ]
    },
    {
      id: 'middle',
      name: 'المرحلة المتوسطة',
      enabled: false,
      grades: [
        { id: 'grade_7', name: 'الصف الأول المتوسط', sections: ['أ'] },
        { id: 'grade_8', name: 'الصف الثاني المتوسط', sections: ['أ'] },
        { id: 'grade_9', name: 'الصف الثالث المتوسط', sections: ['أ'] }
      ]
    },
    {
      id: 'high',
      name: 'المرحلة الثانوية',
      enabled: false,
      grades: [
        { id: 'grade_10', name: 'الصف الأول الثانوي', sections: ['أ'] },
        { id: 'grade_11', name: 'الصف الثاني الثانوي', sections: ['أ'] },
        { id: 'grade_12', name: 'الصف الثالث الثانوي', sections: ['أ'] }
      ]
    }
  ];
};

// Helper function to safely parse alert_rules
export const parseAlertRules = (alertRules: any): AlertSettings | undefined => {
  if (!alertRules) return undefined;
  
  try {
    // If it's already an object with the right structure
    if (typeof alertRules === 'object' && alertRules.absence_alerts && alertRules.late_alerts) {
      return alertRules as AlertSettings;
    }
    
    // If it's a string, try to parse it
    if (typeof alertRules === 'string') {
      const parsed = JSON.parse(alertRules);
      if (parsed.absence_alerts && parsed.late_alerts) {
        return parsed as AlertSettings;
      }
    }
    
    return undefined;
  } catch (error) {
    console.error('Error parsing alert_rules:', error);
    return undefined;
  }
};
