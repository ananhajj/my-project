
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface AddGradeFormProps {
  isActive: boolean;
  onActivate: () => void;
  onAdd: (gradeName: string) => void;
  onCancel: () => void;
}

export const AddGradeForm = ({ isActive, onActivate, onAdd, onCancel }: AddGradeFormProps) => {
  const [newGradeName, setNewGradeName] = useState('');

  const handleAdd = () => {
    if (newGradeName.trim()) {
      onAdd(newGradeName.trim());
      setNewGradeName('');
    }
  };

  const handleCancel = () => {
    setNewGradeName('');
    onCancel();
  };

  if (isActive) {
    return (
      <div className="flex items-center gap-2 justify-end">
        <Button onClick={handleCancel} size="sm" variant="outline">
          إلغاء
        </Button>
        <Button
          onClick={handleAdd}
          size="sm"
          className="bg-school-teal hover:bg-school-teal/90"
          disabled={!newGradeName.trim()}
        >
          إضافة
        </Button>
        <Input
          value={newGradeName}
          onChange={(e) => setNewGradeName(e.target.value)}
          placeholder="اسم الصف الجديد"
          className="flex-1 text-right"
          dir="rtl"
        />
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <Button
        onClick={onActivate}
        size="sm"
        variant="ghost"
        className="text-school-teal hover:text-school-teal/70"
      >
        <span>إضافة صف جديد</span>
        <Plus className="h-4 w-4 mr-1" />
      </Button>
    </div>
  );
};
