
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { FileText, Shield, Phone, Mail, MapPin, Save } from 'lucide-react';

interface ContentData {
  privacy_policy: string;
  terms_of_service: string;
  help_content: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
}

const ContentManagement = () => {
  const { toast } = useToast();
  const [contentData, setContentData] = useState<ContentData>({
    privacy_policy: '',
    terms_of_service: '',
    help_content: '',
    contact_email: 'support@school-system.com',
    contact_phone: '+966 50 123 4567',
    contact_address: 'المملكة العربية السعودية'
  });

  useEffect(() => {
    const savedContent = localStorage.getItem('siteContent');
    if (savedContent) {
      setContentData(JSON.parse(savedContent));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('siteContent', JSON.stringify(contentData));
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ محتوى الموقع بنجاح",
    });
  };

  const handleInputChange = (field: keyof ContentData, value: string) => {
    setContentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <div className="text-right">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <FileText className="h-8 w-8" />
            إدارة محتوى الموقع
          </h1>
          <p className="text-slate-600">تحكم في محتوى صفحات الموقع ومعلومات التواصل</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          حفظ جميع التغييرات
        </Button>
      </div>

      <Tabs defaultValue="privacy" className="space-y-6" dir="rtl">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="privacy">سياسة الخصوصية</TabsTrigger>
          <TabsTrigger value="terms">شروط الاستخدام</TabsTrigger>
          <TabsTrigger value="help">المساعدة</TabsTrigger>
          <TabsTrigger value="contact">معلومات التواصل</TabsTrigger>
        </TabsList>

        <TabsContent value="privacy">
          <Card>
            <CardHeader className="text-right">
              <CardTitle className="flex items-center gap-2 justify-start">
                <Shield className="h-5 w-5" />
                سياسة الخصوصية
              </CardTitle>
              <CardDescription className="text-right">
                اكتب محتوى سياسة الخصوصية الخاصة بالموقع
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={contentData.privacy_policy}
                onChange={(e) => handleInputChange('privacy_policy', e.target.value)}
                placeholder="اكتب محتوى سياسة الخصوصية هنا..."
                className="min-h-[400px] text-right"
                dir="rtl"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms">
          <Card>
            <CardHeader className="text-right">
              <CardTitle className="flex items-center gap-2 justify-start">
                <FileText className="h-5 w-5" />
                شروط الاستخدام
              </CardTitle>
              <CardDescription className="text-right">
                اكتب شروط الاستخدام الخاصة بالموقع
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={contentData.terms_of_service}
                onChange={(e) => handleInputChange('terms_of_service', e.target.value)}
                placeholder="اكتب شروط الاستخدام هنا..."
                className="min-h-[400px] text-right"
                dir="rtl"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help">
          <Card>
            <CardHeader className="text-right">
              <CardTitle className="flex items-center gap-2 justify-start">
                <FileText className="h-5 w-5" />
                صفحة المساعدة
              </CardTitle>
              <CardDescription className="text-right">
                اكتب محتوى صفحة المساعدة والدعم الفني
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={contentData.help_content}
                onChange={(e) => handleInputChange('help_content', e.target.value)}
                placeholder="اكتب محتوى المساعدة هنا..."
                className="min-h-[400px] text-right"
                dir="rtl"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader className="text-right">
              <CardTitle className="flex items-center gap-2 justify-start">
                <Phone className="h-5 w-5" />
                معلومات التواصل
              </CardTitle>
              <CardDescription className="text-right">
                تحديث معلومات التواصل التي تظهر في الموقع
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-right">
                <Label htmlFor="contact_email" className="flex items-center gap-2 justify-start">
                  <Mail className="h-4 w-4" />
                  البريد الإلكتروني
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={contentData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="البريد الإلكتروني للتواصل"
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2 text-right">
                <Label htmlFor="contact_phone" className="flex items-center gap-2 justify-start">
                  <Phone className="h-4 w-4" />
                  رقم الهاتف
                </Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={contentData.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  placeholder="رقم الهاتف للتواصل"
                  className="text-right"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2 text-right">
                <Label htmlFor="contact_address" className="flex items-center gap-2 justify-start">
                  <MapPin className="h-4 w-4" />
                  العنوان
                </Label>
                <Input
                  id="contact_address"
                  value={contentData.contact_address}
                  onChange={(e) => handleInputChange('contact_address', e.target.value)}
                  placeholder="العنوان"
                  className="text-right"
                  dir="rtl"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagement;
