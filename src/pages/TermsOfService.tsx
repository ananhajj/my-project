
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      const data = JSON.parse(savedContent);
      setContent(data.terms_of_service || '');
    }
  }, []);

  const defaultContent = `
# شروط الاستخدام

## القبول بالشروط
باستخدام منصة حاضرون التعليمية، فإنك توافق على الالتزام بهذه الشروط.

## استخدام المنصة
- يجب استخدام المنصة للأغراض التعليمية فقط
- لا يُسمح بنشر محتوى غير لائق أو مخالف
- يجب المحافظة على سرية معلومات تسجيل الدخول

## المسؤوليات
- المدرسة مسؤولة عن دقة بيانات الطلاب
- المنصة غير مسؤولة عن أي أضرار تنتج عن سوء الاستخدام
- يجب الإبلاغ عن أي مشاكل فنية فور حدوثها

## الملكية الفكرية
جميع حقوق الملكية الفكرية للمنصة محفوظة.

## إنهاء الخدمة
يحق لنا إنهاء الخدمة في حالة مخالفة هذه الشروط.

## التعديل على الشروط
نحتفظ بالحق في تعديل هذه الشروط في أي وقت.
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

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3">
                <FileText className="h-8 w-8 text-green-600" />
                شروط الاستخدام
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none text-right">
              <div className="whitespace-pre-wrap leading-relaxed">
                {content || defaultContent}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
