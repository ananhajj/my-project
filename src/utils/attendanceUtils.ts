
import { AlertSettings } from '@/types/alertSettings';

export const getAbsenceColorClass = (absenceDays: number): string => {
  if (absenceDays >= 5) {
    return "bg-red-800 text-white"; // أحمر غامق
  } else if (absenceDays === 4) {
    return "bg-red-400 text-white"; // أحمر فاتح
  } else if (absenceDays === 3) {
    return "bg-orange-500 text-white"; // برتقالي
  } else if (absenceDays === 2) {
    return "bg-yellow-500 text-black"; // أصفر
  } else {
    return "bg-green-100 text-green-800"; // طبيعي
  }
};

export const getAbsenceLabel = (absenceDays: number): string => {
  if (absenceDays >= 5) {
    return "تحذير شديد";
  } else if (absenceDays === 4) {
    return "تحذير عالي";
  } else if (absenceDays === 3) {
    return "تحذير متوسط";
  } else if (absenceDays === 2) {
    return "تنبيه";
  } else {
    return "طبيعي";
  }
};

export const getDynamicStatusColor = (absenceDays: number, alertSettings?: AlertSettings): string => {
  if (!alertSettings?.absence_alerts) {
    return getAbsenceColorClass(absenceDays);
  }

  const enabledAlerts = alertSettings.absence_alerts
    .filter(alert => alert.enabled)
    .sort((a, b) => a.threshold - b.threshold);

  if (enabledAlerts.length === 0) {
    return getAbsenceColorClass(absenceDays);
  }

  // تحديد مستوى التنبيه بناءً على العتبات المحددة
  let alertLevel = 0;
  for (let i = 0; i < enabledAlerts.length; i++) {
    if (absenceDays >= enabledAlerts[i].threshold) {
      alertLevel = i + 1;
    }
  }

  // إرجاع الألوان بناءً على مستوى التنبيه
  if (alertLevel === 0) {
    return "text-emerald-600 bg-emerald-50 border-emerald-200";
  } else if (alertLevel === 1) {
    return "text-amber-600 bg-amber-50 border-amber-200";
  } else if (alertLevel === 2) {
    return "text-orange-600 bg-orange-50 border-orange-200";
  } else if (alertLevel === 3) {
    return "text-red-600 bg-red-50 border-red-200";
  } else {
    return "text-red-800 bg-red-100 border-red-300";
  }
};

export const getDynamicStatusText = (absenceDays: number, alertSettings?: AlertSettings): string => {
  if (!alertSettings?.absence_alerts) {
    return getAbsenceLabel(absenceDays);
  }

  const enabledAlerts = alertSettings.absence_alerts
    .filter(alert => alert.enabled)
    .sort((a, b) => a.threshold - b.threshold);

  if (enabledAlerts.length === 0) {
    return getAbsenceLabel(absenceDays);
  }

  // العثور على أعلى تنبيه مطابق
  let matchedAlert = null;
  for (let i = enabledAlerts.length - 1; i >= 0; i--) {
    if (absenceDays >= enabledAlerts[i].threshold) {
      matchedAlert = enabledAlerts[i];
      break;
    }
  }

  if (matchedAlert) {
    return matchedAlert.title;
  }

  return "ممتاز";
};
