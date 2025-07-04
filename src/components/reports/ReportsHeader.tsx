
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ReportsHeaderProps {
  onExportPDF: () => void;
  hasData: boolean;
}

export const ReportsHeader = ({ onExportPDF, hasData }: ReportsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-school-navy mb-2">التقارير والإحصائيات</h1>
        <p className="text-school-navy/70">تحليل شامل لحضور الطلاب من البيانات المسجلة فعلياً</p>
      </div>
      <div className="flex gap-3">
        <Link to="/">
          <Button variant="outline">العودة للرئيسية</Button>
        </Link>
      </div>
    </div>
  );
};
