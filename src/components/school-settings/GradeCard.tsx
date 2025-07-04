
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { GradeEditor } from './GradeEditor';
import { SectionManager } from './SectionManager';

interface GradeCardProps {
  grade: any;
  stageId: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onSaveEdit: (newName: string) => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onAddSection: () => void;
  onRemoveSection: (index: number) => void;
}

export const GradeCard = ({ 
  grade, 
  stageId, 
  isEditing, 
  onStartEdit, 
  onSaveEdit, 
  onCancelEdit, 
  onDelete, 
  onAddSection, 
  onRemoveSection 
}: GradeCardProps) => {
  return (
    <div className="bg-school-gray/10 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <GradeEditor
            gradeId={grade.id}
            gradeName={grade.name}
            isEditing={isEditing}
            onStartEdit={onStartEdit}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
          />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
              <Trash2 className="h-3 w-3" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-right">حذف الصف</AlertDialogTitle>
              <AlertDialogDescription className="text-right">
                هل أنت متأكد من حذف {grade.name}؟ لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex justify-start gap-2">
              <AlertDialogAction onClick={onDelete}>
                حذف
              </AlertDialogAction>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <SectionManager
        sections={grade.sections}
        onAddSection={onAddSection}
        onRemoveSection={onRemoveSection}
      />
    </div>
  );
};
