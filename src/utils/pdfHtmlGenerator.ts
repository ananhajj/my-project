export const generatePDFHtml = (
  schoolInfo: SchoolInfo,
  studentsData: any[],
  selectedGrade: string,
  totalStudents: number
): string => {
  const currentDate = new Date().toLocaleDateString('ar-SA');
  const sortedStudents = [...studentsData].sort((a, b) => b.absenceDays - a.absenceDays);
  const filterInfo = selectedGrade ? `الصف: ${selectedGrade}` : 'جميع الطلاب';

  return `
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
          <div><strong>عدد الطلاب:</strong> ${totalStudents}</div>
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
          ${sortedStudents.map((student, index) => {
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
};
