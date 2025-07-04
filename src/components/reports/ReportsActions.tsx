import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ReportsActionsProps {
  onExportPDF: () => void;
  hasData: boolean;
}

export const ReportsActions = ({ onExportPDF, hasData }: ReportsActionsProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExportClick = async () => {
    if (!hasData) {
      toast({
        title: "لا توجد بيانات",
        description: "لا توجد بيانات حضور متاحة لتصدير التقرير",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    
    try {
      await onExportPDF();
      toast({
        title: "تم التصدير بنجاح",
        description: "تم إنشاء تقرير PDF وتحميله"
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "خطأ في التصدير",
        description: error instanceof Error ? error.message : "فشل في إنشاء تقرير PDF",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-4 mt-4">
      {/* زر تصدير PDF */}
      <Button
        onClick={handleExportClick}
        disabled={!hasData || isExporting}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-2"
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            جاري التصدير...
          </>
        ) : (
          <>
            <FileDown className="h-4 w-4" />
            تصدير PDF
          </>
        )}
      </Button>

      {/* زر العودة للرئيسية */}
      <Link to="/school">
        <Button
          className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50"
        >
          العودة للرئيسية
        </Button>
      </Link>
    </div>
  );
};
