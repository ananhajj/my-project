
import { Loader2 } from 'lucide-react';

export const SchoolSettingsLoading = () => {
  return (
    <div className="min-h-screen font-tajawal flex items-center justify-center" dir="rtl">
      <div className="flex items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p>جاري تحميل الإعدادات...</p>
      </div>
    </div>
  );
};
