
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, ArrowRight, Phone, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Help = () => {
  const [content, setContent] = useState('');
  const [contactInfo, setContactInfo] = useState({
    contact_email: 'support@school-system.com',
    contact_phone: '+966 50 123 4567'
  });

  useEffect(() => {
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      const data = JSON.parse(savedContent);
      setContent(data.help_content || '');
      setContactInfo({
        contact_email: data.contact_email || 'support@school-system.com',
        contact_phone: data.contact_phone || '+966 50 123 4567'
      });
    }
  }, []);

  const defaultContent = `
# مركز المساعدة والدعم الفني

## الأسئلة الشائعة

### كيف أسجل الدخول للمنصة؟
1. اذهب إلى صفحة تسجيل الدخول
2. أدخل البريد الإلكتروني وكلمة المرور
3. اضغط على "تسجيل الدخول"

### كيف أضيف طلاب جدد؟
1. اذهب إلى صفحة "إدارة الطلاب"
2. اضغط على "إضافة طالب جديد"
3. املأ البيانات المطلوبة
4. احفظ البيانات

### كيف أسجل الحضور؟
1. اذهب إلى صفحة "تسجيل الحضور"
2. اختر الصف والتاريخ
3. حدد حالة كل طالب
4. احفظ الحضور

### كيف أصدر التقارير؟
1. اذهب إلى صفحة "التقارير"
2. اختر نوع التقرير المطلوب
3. حدد الفترة الزمنية
4. اضغط على "تصدير"

## المشاكل الفنية الشائعة

### لا أستطيع تسجيل الدخول
- تأكد من صحة البريد الإلكتروني وكلمة المرور
- تأكد من اتصالك بالإنترنت
- امسح ذاكرة التخزين المؤقت للمتصفح

### البيانات لا تظهر
- أعد تحميل الصفحة
- تأكد من اتصالك بالإنترنت
- تواصل مع الدعم الفني

## طرق التواصل
للحصول على مساعدة إضافية، يمكنك التواصل معنا عبر:
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                العودة للرئيسية
              </Button>
            </Link>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3">
                <HelpCircle className="h-8 w-8 text-orange-600" />
                مركز المساعدة
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none text-right">
              <div className="whitespace-pre-wrap leading-relaxed">
                {content || defaultContent}
              </div>
            </CardContent>
          </Card>

          {/* معلومات التواصل */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">البريد الإلكتروني</h3>
                <p className="text-gray-600">{contactInfo.contact_email}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">الهاتف</h3>
                <p className="text-gray-600">{contactInfo.contact_phone}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
