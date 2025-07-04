
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const renderHtmlToPDF = async (htmlContent: string, fileName: string): Promise<boolean> => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.left = '-9999px';
  iframe.style.top = '-9999px';
  iframe.style.width = '794px';
  iframe.style.height = '1123px';
  document.body.appendChild(iframe);

  console.log('جاري تحضير المحتوى...');
  
  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) throw new Error('فشل في إنشاء مستند PDF');
  
  doc.open();
  doc.write(htmlContent);
  doc.close();

  // انتظار أطول لضمان تحميل المحتوى والخطوط والصور
  console.log('انتظار تحميل المحتوى والصور...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('جاري تصوير المحتوى...');
  
  const canvas = await html2canvas(doc.body, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    width: 794,
    height: doc.body.scrollHeight,
    onclone: (clonedDoc) => {
      console.log('جاري تطبيق الأنماط المخصصة...');
      
      // إضافة أنماط مخصصة للتأكد من التطبيق الصحيح
      const style = clonedDoc.createElement('style');
      style.textContent = `
        * { 
          font-family: 'Segoe UI', Tahoma, Arial, sans-serif !important; 
        }
        .school-name { 
          font-weight: bold !important; 
          color: #2563eb !important; 
          font-size: 14px !important;
          margin-top: 8px !important;
        }
        .title { 
          font-size: 18px !important; 
          font-weight: bold !important; 
          color: #174459 !important;
          text-align: center !important;
          margin: 20px 0 !important;
        }
        .logo-section img { 
          width: 100px !important; 
          height: 100px !important;
          object-fit: contain !important;
          display: block !important;
        }
        .org-info {
          font-size: 11px !important;
          line-height: 1.6 !important;
          text-align: right !important;
        }
        .org-field {
          font-size: 10px !important;
          margin-bottom: 6px !important;
          color: #333 !important;
        }
        .target-info {
          font-size: 11px !important;
          line-height: 1.8 !important;
          text-align: left !important;
        }
        .target-field {
          margin-bottom: 8px !important;
        }
        .header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          margin-bottom: 25px !important;
          border-bottom: 2px solid #333 !important;
          padding-bottom: 15px !important;
          min-height: 120px !important;
        }
      `;
      clonedDoc.head.appendChild(style);
      
      // التأكد من تطبيق خصائص الصورة مع type casting
      const logoImages = clonedDoc.querySelectorAll('.logo-section img');
      logoImages.forEach(img => {
        const htmlImg = img as HTMLImageElement;
        htmlImg.setAttribute('width', '100');
        htmlImg.setAttribute('height', '100');
        htmlImg.style.width = '100px';
        htmlImg.style.height = '100px';
        htmlImg.style.objectFit = 'contain';
        htmlImg.style.display = 'block';
      });
      
      // التأكد من عرض اسم المدرسة بشكل صحيح مع type casting
      const schoolNameElements = clonedDoc.querySelectorAll('.school-name');
      schoolNameElements.forEach(element => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.fontWeight = 'bold';
        htmlElement.style.color = '#2563eb';
        htmlElement.style.fontSize = '14px';
        console.log('اسم المدرسة في العنصر:', element.textContent);
      });
      
      // التأكد من عرض العنوان بشكل صحيح مع type casting  
      const titleElements = clonedDoc.querySelectorAll('.title');
      titleElements.forEach(element => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.fontSize = '18px';
        htmlElement.style.fontWeight = 'bold';
        htmlElement.style.color = '#174459';
        htmlElement.style.textAlign = 'center';
      });
    }
  });

  console.log('جاري إنشاء ملف PDF...');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(canvas.toDataURL('image/png', 0.9), 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/png', 0.9), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  document.body.removeChild(iframe);
  
  console.log('تم إنشاء التقرير بنجاح!');
  pdf.save(fileName);
  
  return true;
};
