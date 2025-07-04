
import { Button } from '@/components/ui/button';
import { AlertTriangle, Plus } from 'lucide-react';

interface AlertSectionHeaderProps {
  type: 'absence' | 'late';
  onAddAlert: () => void;
}

export const AlertSectionHeader = ({ type, onAddAlert }: AlertSectionHeaderProps) => {
  const isAbsence = type === 'absence';
  const bgColor = isAbsence ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700';
  const textColor = isAbsence ? 'text-red-700' : 'text-yellow-700';
  const title = isAbsence ? 'تنبيهات الغياب' : 'تنبيهات التأخر';
  const buttonText = isAbsence ? 'إضافة تنبيه غياب' : 'إضافة تنبيه تأخر';

  return (
    <div className="flex items-center justify-between">
      <h3 className={`font-semibold ${textColor} flex items-center gap-2`}>
        <span>{title}</span>
        <AlertTriangle className="h-4 w-4" />
      </h3>
      <Button
        onClick={onAddAlert}
        size="sm"
        className={`${bgColor} text-white`}
      >
        <Plus className="h-4 w-4 ml-1" />
        {buttonText}
      </Button>
    </div>
  );
};
