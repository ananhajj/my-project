import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export const SchoolSettingsHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-navy mb-2 flex items-center gap-2">
          <Settings className="h-8 w-8" />
          إعدادات المدرسة
        </h1>
        <p className="text-primary-navy/70">
          تخصيص المراحل والصفوف ونوع تسجيل الحضور
        </p>
      </div>

      <Link to="/school/">
        <Button
          variant="outline"
          className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white hover:border-primary-blue transition"
        >
          العودة للرئيسية
        </Button>
      </Link>
    </div>
  );
};
