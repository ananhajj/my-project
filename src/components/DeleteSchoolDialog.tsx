
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { School } from "@/hooks/useSchools";

interface DeleteSchoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  school: School | null;
  onConfirm: () => void;
}

const DeleteSchoolDialog = ({ 
  open, 
  onOpenChange, 
  school, 
  onConfirm 
}: DeleteSchoolDialogProps) => {
  const handleConfirmDelete = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            تأكيد حذف المدرسة
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700">
            هل أنت متأكد من رغبتك في حذف مدرسة <strong>"{school?.school_name}"</strong>؟
            <br />
            <br />
            <span className="text-red-600 font-medium">
              تحذير: سيتم حذف جميع البيانات المرتبطة بهذه المدرسة نهائياً:
            </span>
            <ul className="list-disc list-inside mt-2 text-sm">
              <li>جميع الطلاب المسجلين</li>
              <li>جميع الفصول الدراسية</li>
              <li>جميع سجلات الحضور</li>
              <li>جميع إعدادات المدرسة</li>
              <li>حساب المدرسة في النظام</li>
            </ul>
            <br />
            <strong className="text-red-600">هذا الإجراء لا يمكن التراجع عنه!</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="bg-gray-200 text-gray-800 hover:bg-gray-300">
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirmDelete}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            حذف المدرسة نهائياً
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSchoolDialog;
