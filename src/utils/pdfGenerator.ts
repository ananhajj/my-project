
import { StudentWithAttendance } from '@/hooks/useAttendance';
import { fetchSchoolInfo } from '@/services/schoolInfoService';
import { generatePDFHtml } from '@/utils/pdfHtmlGenerator';
import { renderHtmlToPDF } from '@/utils/pdfRenderer';

export const generateReportPDF = async (
  studentsData: StudentWithAttendance[],
  selectedGrade: string,
  overallAttendanceRate: number,
  totalStudents: number,
  alertsCount: number
) => {
  try {
    console.log('بدء إنشاء تقرير PDF...');
    
    // جلب بيانات المدرسة مع إضافة console.log لتتبع العملية
    console.log('جاري جلب بيانات المدرسة...');
    const schoolInfo = await fetchSchoolInfo();
    console.log('بيانات المدرسة المُسترجعة:', schoolInfo);
    
    // التأكد من أن اسم المدرسة ليس فارغاً
    if (!schoolInfo.school_name || schoolInfo.school_name === 'المدرسة النموذجية') {
      console.warn('تحذير: لم يتم العثور على اسم المدرسة، سيتم استخدام الاسم الافتراضي');
    }
    
    const htmlContent = generatePDFHtml(schoolInfo, studentsData, selectedGrade, totalStudents);
    
    const fileName = selectedGrade 
      ? `تقرير_الغياب_${selectedGrade.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      : `تقرير_الغياب_شامل_${new Date().toISOString().split('T')[0]}.pdf`;

    await renderHtmlToPDF(htmlContent, fileName);
    return true;
    
  } catch (error) {
    console.error('خطأ في إنشاء تقرير PDF:', error);
    
    if (error instanceof Error) {
      throw new Error(`فشل في إنشاء ملف PDF: ${error.message}`);
    } else {
      throw new Error('فشل في إنشاء ملف PDF - خطأ غير معروف');
    }
  }
};
