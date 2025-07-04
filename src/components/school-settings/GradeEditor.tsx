
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit } from 'lucide-react';

interface GradeEditorProps {
  gradeId: string;
  gradeName: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onSaveEdit: (newName: string) => void;
  onCancelEdit: () => void;
}

export const GradeEditor = ({ 
  gradeId, 
  gradeName, 
  isEditing, 
  onStartEdit, 
  onSaveEdit, 
  onCancelEdit 
}: GradeEditorProps) => {
  const [editName, setEditName] = useState(gradeName);

  const handleSave = () => {
    onSaveEdit(editName);
  };

  const handleCancel = () => {
    setEditName(gradeName);
    onCancelEdit();
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Button onClick={handleCancel} size="sm" variant="outline">
          إلغاء
        </Button>
        <Button onClick={handleSave} size="sm" className="bg-school-green hover:bg-school-green/90">
          حفظ
        </Button>
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="w-40 text-right"
          dir="rtl"
        />
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={onStartEdit}
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0"
      >
        <Edit className="h-3 w-3" />
      </Button>
      <span className="font-medium text-school-navy">{gradeName}</span>
    </>
  );
};
