import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { StudentWithAttendance } from '@/hooks/useAttendance';
import { fetchSchoolInfo } from '@/services/schoolInfoService';

export const generateStudentsListPDF = async (
  studentsData: StudentWithAttendance[],
  schoolName: string,
  filterInfo: string,
  selectedGrade?: string,
  selectedSection?: string,
  selectedStage?: string
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

  // Generate the HTML content

 const schoolInfo = await fetchSchoolInfo();
 const currentDate = new Date().toLocaleDateString('ar-SA');
 const sortedStudents = [...studentsData].sort((a, b) => b.absenceDays - a.absenceDays);

 tempDiv.innerHTML = `
 <!DOCTYPE html>
 <html dir="rtl" lang="ar">
 <head>
   <meta charset="UTF-8">
   <style>
     body { 
       font-family: 'Segoe UI', Tahoma, Arial, sans-serif; 
       direction: rtl; 
       margin: 0; 
       padding: 20px;
       background: white;
       color: #000;
       font-size: 12px;
     }
     .header { 
       display: flex;
       justify-content: space-between;
       margin-bottom: 25px;
       padding-bottom: 15px;
       border-bottom: 2px solid #2563eb;
     }
     .school-logo {
       text-align: left;
     }
     .school-logo img {
       width: 90px;
       height: auto;
     }
     .school-info {
       text-align: left;
       font-size: 14px;
       color: #333;
     }
     .school-info div {
       margin: 5px 0;
     }
     .school-name {
       font-weight: bold;
       font-size: 20px;
       color: #2563eb;
     }
     .report-info {
       text-align: right;
       font-size: 14px;
       color: #333;
       margin-top: 10px;
     }
     .report-info div {
       margin: 5px 0;
     }
     .title { 
       text-align: center; 
       margin: 20px 0; 
       font-size: 18px !important; 
       font-weight: bold;
       color: #174459;
     }
     .table { 
       width: 100%; 
       border-collapse: collapse; 
       margin-top: 20px;
     }
     .table th { 
       background-color: #174459; 
       color: white; 
       padding: 12px; 
       border: 1px solid #000; 
       text-align: center; 
       font-weight: bold; 
     }
     .table td { 
       padding: 10px; 
       border: 1px solid #000; 
       text-align: center; 
     }
     .table tr:nth-child(even) { background-color: #f8fafc; }
     .status-normal { color: #10b981; font-weight: bold; }
     .status-warning { color: #eab308; font-weight: bold; }
     .status-medium { color: #d97706; font-weight: bold; }
     .status-high { color: #ea580c; font-weight: bold; }
     .status-severe { color: #dc2626; font-weight: bold; }
     .footer { margin-top: 40px; text-align: center; color: #666; font-size: 10px; }
   </style>
 </head>
 <body>
   <div class="header">
     <div class="school-info">
       <div><strong>الدولة:</strong> ${schoolInfo.country}</div>
       <div><strong>الوزارة:</strong> ${schoolInfo.ministry}</div>
       <div><strong>إدارة التعليم:</strong> ${schoolInfo.education_department}</div>
       <div><strong>الإشراف التربوي:</strong> ${schoolInfo.educational_supervision}</div>
       <div><strong>المدرسة:</strong> ${schoolInfo.school_name}</div>
     </div>
     <div class="school-logo">
       <img src="/public/LogoS.png" alt="Logo" class="w-36 h-auto">
     </div>
       <div class="report-info">
          <div><strong>تاريخ التقرير:</strong> ${currentDate}</div>
          <div><strong>الفئة المستهدفة:</strong> ${filterInfo}</div>
        
        </div>
   </div>
   
   <div class="title">تقرير الغياب خلال الفترة</div>
   
   <table class="table">
     <thead>
       <tr>
         <th>م</th>
         <th>اسم الطالب</th>
         <th>الصف/الشعبة</th>
         <th>أيام الغياب</th>
         <th>نسبة الحضور</th>
         <th>الحالة</th>
       </tr>
     </thead>
     <tbody>
       ${studentsData.map((student, index) => {
         let status = 'طبيعي';
         let statusClass = 'status-normal';
         
         if (student.absenceDays >= 5) {
           status = 'تحذير شديد';
           statusClass = 'status-severe';
         } else if (student.absenceDays >= 4) {
           status = 'تحذير عالي';
           statusClass = 'status-high';
         } else if (student.absenceDays >= 3) {
           status = 'تحذير متوسط';
           statusClass = 'status-medium';
         } else if (student.absenceDays >= 2) {
           status = 'تنبيه';
           statusClass = 'status-warning';
         }
         
         return `
           <tr>
             <td>${index + 1}</td>
             <td style="text-align: right;">${student.name}</td>
             <td>${student.grade} / ${student.section}</td>
             <td>${student.absenceDays}</td>
             <td>${student.attendancePercentage}%</td>
             <td class="${statusClass}">${status}</td>
           </tr>
         `;
       }).join('')}
     </tbody>
   </table>
   
   <div class="footer">
     <p>تم إنشاء هذا التقرير بواسطة نظام إدارة الحضور المدرسي - منصة حاضرون التعليمية</p>
   </div>
 </body>
 </html>
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

    // Generate filename based on filters
    let fileName = 'تقرير_الغياب_المفصل';
    if (selectedGrade) fileName += `_${selectedGrade}`;
    if (selectedSection) fileName += `_${selectedSection}`;
    fileName += `_${new Date().toISOString().split('T')[0]}.pdf`;

    // Save the PDF
    pdf.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('فشل في إنشاء ملف PDF');
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
  }
};
