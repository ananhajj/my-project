
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { StudentWithAttendance } from '@/hooks/useReportsData';
import { LateRecord } from '@/hooks/useLateAttendance';

interface FilterOptions {
  selectedPeriod: string;
  selectedStage: string;
  selectedGrade: string;
  selectedSection: string;
}

interface StudentLateData {
  student: StudentWithAttendance;
  lateRecords: LateRecord[];
  totalLateDays: number;
  consecutiveLateDays: number;
}

export const generateLateAttendancePDF = async (
  studentsLateData: StudentLateData[],
  filters: FilterOptions
) => {
  // Create a temporary HTML element with proper Arabic rendering
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  tempDiv.style.width = '794px'; // A4 width in pixels at 96 DPI
  tempDiv.style.padding = '40px';
  tempDiv.style.fontFamily = 'Tajawal, Arial, sans-serif';
  tempDiv.style.direction = 'rtl';
  tempDiv.style.backgroundColor = 'white';
  
  // Generate the HTML content with new colors
  const currentDate = new Date().toLocaleDateString('ar-SA');
  const totalStudents = studentsLateData.length;
  const totalLateRecords = studentsLateData.reduce((sum, item) => sum + item.totalLateDays, 0);
  const studentsWithAlerts = studentsLateData.filter(item => item.consecutiveLateDays >= 3).length;
  
  // حساب بيانات الرسم البياني
  const lateStudents = studentsLateData.filter(item => item.totalLateDays > 0).length;
  const onTimeStudents = totalStudents - lateStudents;
  const latePercentage = totalStudents > 0 ? Math.round((lateStudents / totalStudents) * 100) : 0;
  const onTimePercentage = 100 - latePercentage;
  
  // Sort students by total late days (descending)
  const sortedStudents = [...studentsLateData].sort((a, b) => b.totalLateDays - a.totalLateDays);
  
  tempDiv.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #15445A; font-size: 24px; margin-bottom: 10px;">تقرير التأخرات المفصل</h1>
      <p style="color: #15445A; font-size: 14px; opacity: 0.8;">تاريخ التقرير: ${currentDate}</p>
    </div>
    
    <div style="border: 2px solid #07A869; padding: 20px; margin-bottom: 30px; border-radius: 8px; background: linear-gradient(135deg, rgba(7, 168, 105, 0.05) 0%, rgba(13, 169, 166, 0.05) 100%);">
      <h2 style="color: #07A869; text-align: center; margin-bottom: 15px; font-size: 18px;">ملخص إحصائيات التأخرات</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 16px; color: #15445A;">
        <p><strong>إجمالي الطلاب:</strong> ${totalStudents}</p>
        <p><strong>إجمالي أيام التأخر:</strong> ${totalLateRecords}</p>
        <p><strong>طلاب بتنبيهات تأخر:</strong> ${studentsWithAlerts}</p>
        ${filters.selectedPeriod ? `<p><strong>الفترة:</strong> ${filters.selectedPeriod}</p>` : ''}
        ${filters.selectedStage ? `<p><strong>المرحلة:</strong> ${filters.selectedStage}</p>` : ''}
        ${filters.selectedGrade ? `<p><strong>الصف:</strong> ${filters.selectedGrade}</p>` : ''}
        ${filters.selectedSection ? `<p><strong>الشعبة:</strong> ${filters.selectedSection}</p>` : ''}
      </div>
    </div>
    
    <!-- الرسم البياني للتأخر -->
    <div style="border: 2px solid #f97316; padding: 20px; margin-bottom: 30px; border-radius: 8px; background: linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);">
      <h2 style="color: #f97316; text-align: center; margin-bottom: 20px; font-size: 18px;">الرسم البياني للتأخر</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <!-- طلاب متأخرين -->
        <div style="background: rgba(249, 115, 22, 0.1); border: 2px solid #f97316; border-radius: 8px; padding: 15px; text-align: center;">
          <div style="color: #f97316; font-size: 32px; font-weight: bold; margin-bottom: 5px;">${lateStudents}</div>
          <div style="color: #15445A; font-size: 14px; font-weight: bold;">طالب متأخر</div>
          <div style="color: #f97316; font-size: 12px; margin-top: 5px;">${latePercentage}% من المجموع</div>
        </div>
        
        <!-- طلاب غير متأخرين -->
        <div style="background: rgba(16, 185, 129, 0.1); border: 2px solid #10b981; border-radius: 8px; padding: 15px; text-align: center;">
          <div style="color: #10b981; font-size: 32px; font-weight: bold; margin-bottom: 5px;">${onTimeStudents}</div>
          <div style="color: #15445A; font-size: 14px; font-weight: bold;">طالب غير متأخر</div>
          <div style="color: #10b981; font-size: 12px; margin-top: 5px;">${onTimePercentage}% من المجموع</div>
        </div>
      </div>
      
      <!-- رسم بياني بسيط -->
      <div style="width: 100%; height: 40px; background: #f3f4f6; border-radius: 20px; overflow: hidden; margin-bottom: 10px;">
        <div style="height: 100%; width: ${latePercentage}%; background: linear-gradient(90deg, #f97316 0%, #fb923c 100%); float: right; border-radius: 20px;"></div>
      </div>
      
      <div style="display: flex; justify-content: space-between; font-size: 12px; color: #15445A;">
        <span>متأخرين: ${latePercentage}%</span>
        <span>غير متأخرين: ${onTimePercentage}%</span>
      </div>
      
      <!-- إحصائيات إضافية -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
        <div style="background: rgba(139, 69, 19, 0.1); border: 1px solid #8b4513; border-radius: 6px; padding: 10px; text-align: center;">
          <div style="color: #8b4513; font-size: 24px; font-weight: bold;">${totalStudents}</div>
          <div style="color: #15445A; font-size: 12px;">إجمالي الطلاب</div>
        </div>
        
        <div style="background: rgba(147, 51, 234, 0.1); border: 1px solid #9333ea; border-radius: 6px; padding: 10px; text-align: center;">
          <div style="color: #9333ea; font-size: 24px; font-weight: bold;">${totalLateRecords}</div>
          <div style="color: #15445A; font-size: 12px;">العدد الكلي للتأخر</div>
        </div>
      </div>
    </div>
    
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <thead>
        <tr style="background: linear-gradient(135deg, #07A869 0%, #0DA9A6 100%); color: white;">
          <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">م</th>
          <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">اسم الطالب</th>
          <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">الصف/الشعبة</th>
          <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">أيام التأخر</th>
          <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">تأخر متتالي</th>
          <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">الحالة</th>
        </tr>
      </thead>
      <tbody>
        ${sortedStudents.map((item, index) => {
          let status = 'طبيعي';
          let statusColor = '#07A869'; // report-green
          
          if (item.consecutiveLateDays >= 5) {
            status = 'تحذير شديد';
            statusColor = '#15445A'; // report-navy
          } else if (item.consecutiveLateDays >= 4) {
            status = 'تحذير عالي';
            statusColor = '#C1B48A'; // report-beige
          } else if (item.consecutiveLateDays >= 3) {
            status = 'تنبيه متوسط';
            statusColor = '#3D7EB9'; // report-blue
          } else if (item.totalLateDays >= 2) {
            status = 'تنبيه';
            statusColor = '#0DA9A6'; // report-teal
          }
          
          const rowBg = item.consecutiveLateDays >= 3 ? 'rgba(21, 68, 90, 0.05)' : (index % 2 === 0 ? 'rgba(194, 193, 193, 0.1)' : 'white');
          
          return `
            <tr style="background-color: ${rowBg};">
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; color: #15445A;">${index + 1}</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right; color: #15445A;">${item.student.name}</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; color: #15445A;">${item.student.grade} / ${item.student.section}</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; color: #15445A;">${item.totalLateDays}</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; color: #15445A;">${item.consecutiveLateDays}</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center; color: ${statusColor}; font-weight: bold;">${status}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
    
    <div style="margin-top: 40px; text-align: center; color: #15445A; font-size: 12px; opacity: 0.8;">
      <p>تم إنشاء هذا التقرير بواسطة نظام إدارة الحضور المدرسي</p>
    </div>
  `;
  
  // Add to document
  document.body.appendChild(tempDiv);
  
  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    // Add first page
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Generate filename
    const filterSuffix = [
      filters.selectedPeriod,
      filters.selectedStage,
      filters.selectedGrade,
      filters.selectedSection
    ].filter(Boolean).join('_');
    
    const fileName = filterSuffix 
      ? `Late_Attendance_Report_${filterSuffix}_${new Date().toISOString().split('T')[0]}.pdf`
      : `Late_Attendance_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Save the PDF
    pdf.save(fileName);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('فشل في إنشاء ملف PDF للتأخرات');
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
  }
};
