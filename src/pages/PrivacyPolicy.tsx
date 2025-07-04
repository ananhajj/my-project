
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      const data = JSON.parse(savedContent);
      setContent(data.privacy_policy || '');
    }
  }, []);

  const defaultContent = `
# سياسة الخصوصية

## مقدمة
نحن في منصة حاضرون التعليمية نقدر خصوصيتك ونلتزم بحماية معلوماتك الشخصية.

## جمع المعلومات
نقوم بجمع المعلومات التالية:
- المعلومات التي تقدمها عند التسجيل
- معلومات الاستخدام والتفاعل مع المنصة
- معلومات الطلاب والحضور

## استخدام المعلومات
نستخدم المعلومات المجمعة من أجل:
- تقديم خدمات المنصة التعليمية
- تحسين تجربة المستخدم
- إنشاء التقارير والإحصائيات

## حماية المعلومات
نتخذ إجراءات أمنية متقدمة لحماية بياناتك من الوصول غير المصرح به.

## الاتصال بنا
للاستفسارات حول سياسة الخصوصية، يرجى التواصل معنا.
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
                <Shield className="h-8 w-8 text-blue-600" />
                سياسة الخصوصية
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

export default PrivacyPolicy;
