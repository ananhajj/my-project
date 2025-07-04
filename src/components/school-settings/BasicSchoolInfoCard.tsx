
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { School } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BasicSchoolInfoCardProps {
  tempSchoolName: string;
  setTempSchoolName: (name: string) => void;
  handleSaveSettings: () => void;
  settings: any;
  updateSettings: (updates: any) => Promise<void>;
}

// Input validation function
const validateInput = (input: string): boolean => {
  const trimmedInput = input.trim();
  return trimmedInput.length >= 2 && trimmedInput.length <= 100;
};

// Sanitize input but preserve spaces
const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/<[^>]*>/g, '');
};

export const BasicSchoolInfoCard = ({ 
  tempSchoolName, 
  setTempSchoolName, 
  handleSaveSettings,
  settings,
  updateSettings
}: BasicSchoolInfoCardProps) => {
  const { toast } = useToast();
  const [country, setCountry] = useState('المملكة العربية السعودية');
  const [ministry, setMinistry] = useState('وزارة التعليم');
  const [educationDepartment, setEducationDepartment] = useState('إدارة التعليم ب...');
  const [educationalSupervision, setEducationalSupervision] = useState('الإشراف التربوي');

  // Load existing data from settings
  useEffect(() => {
    if (settings) {
      setCountry(settings.country || 'المملكة العربية السعودية');
      setMinistry(settings.ministry || 'وزارة التعليم');
      setEducationDepartment(settings.education_department || 'إدارة التعليم ب...');
      setEducationalSupervision(settings.educational_supervision || 'الإشراف التربوي');
    }
  }, [settings]);

  const handleInputChange = (value: string, setter: (value: string) => void) => {
    const sanitizedValue = sanitizeInput(value);
    setter(sanitizedValue);
  };

  const isValidForm = validateInput(tempSchoolName) && 
                     validateInput(country) && 
                     validateInput(ministry) && 
                     validateInput(educationDepartment) && 
                     validateInput(educationalSupervision);

  const handleSaveAllSettings = async () => {
    if (!isValidForm) return;

    try {
      await updateSettings({
        school_name: tempSchoolName.trim(),
        country: country.trim(),
        ministry: ministry.trim(),
        education_department: educationDepartment.trim(),
        educational_supervision: educationalSupervision.trim()
      });
      
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث معلومات المدرسة بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "لم نتمكن من حفظ المعلومات",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-[#F4F9FF]/90 backdrop-blur-md border border-primary-blue/10 shadow-md rounded-2xl" dir="rtl">
  <CardHeader className="bg-primary-navy/5 rounded-t-2xl">
    <CardTitle className="flex items-center gap-2 text-primary-navy justify-start">
      <School className="h-5 w-5" />
      <span>معلومات المدرسة الأساسية</span>
    </CardTitle>
    <CardDescription className="text-right">
      أدخل معلومات المدرسة الأساسية والجهات التابعة لها
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-4 pt-6 text-right">
    {/* الدولة */}
    <div>
      <Label htmlFor="country" className="text-primary-navy font-medium text-right block">الدولة</Label>
      <Input
        id="country"
        value={country}
        onChange={(e) => handleInputChange(e.target.value, setCountry)}
        placeholder="المملكة العربية السعودية"
        className="mt-2 border-primary-blue/30 focus:border-primary-green text-right"
        maxLength={100}
        dir="rtl"
      />
    </div>

    {/* الوزارة */}
    <div>
      <Label htmlFor="ministry" className="text-primary-navy font-medium text-right block">الوزارة</Label>
      <Input
        id="ministry"
        value={ministry}
        onChange={(e) => handleInputChange(e.target.value, setMinistry)}
        placeholder="وزارة التعليم"
        className="mt-2 border-primary-blue/30 focus:border-primary-green text-right"
        maxLength={100}
        dir="rtl"
      />
    </div>

    {/* إدارة التعليم */}
    <div>
      <Label htmlFor="educationDepartment" className="text-primary-navy font-medium text-right block">إدارة التعليم</Label>
      <Input
        id="educationDepartment"
        value={educationDepartment}
        onChange={(e) => handleInputChange(e.target.value, setEducationDepartment)}
        placeholder="إدارة التعليم ب..."
        className="mt-2 border-primary-blue/30 focus:border-primary-green text-right"
        maxLength={100}
        dir="rtl"
      />
    </div>

    {/* الإشراف التربوي */}
    <div>
      <Label htmlFor="educationalSupervision" className="text-primary-navy font-medium text-right block">الإشراف التربوي</Label>
      <Input
        id="educationalSupervision"
        value={educationalSupervision}
        onChange={(e) => handleInputChange(e.target.value, setEducationalSupervision)}
        placeholder="الإشراف التربوي"
        className="mt-2 border-primary-blue/30 focus:border-primary-green text-right"
        maxLength={100}
        dir="rtl"
      />
    </div>

    {/* اسم المدرسة */}
    <div>
      <Label htmlFor="schoolName" className="text-primary-navy font-medium text-right block">اسم المدرسة</Label>
      <Input
        id="schoolName"
        value={tempSchoolName}
        onChange={(e) => handleInputChange(e.target.value, setTempSchoolName)}
        placeholder="مدرسة النموذج الابتدائية"
        className="mt-2 border-primary-blue/30 focus:border-primary-green text-right"
        maxLength={100}
        dir="rtl"
      />
      <p className="text-xs text-gray-500 mt-1 text-right">
        عدد الأحرف: {tempSchoolName.length}/100
      </p>
      {tempSchoolName && !validateInput(tempSchoolName) && (
        <p className="text-red-500 text-sm mt-1 text-right">
          يجب أن يكون النص بين 2 و 100 حرف
        </p>
      )}
    </div>

    {/* زر الحفظ */}
    <Button 
      onClick={handleSaveAllSettings} 
      className="bg-primary-green hover:bg-primary-green/90 text-white w-full transition"
      disabled={!isValidForm}
    >
      حفظ المعلومات الأساسية
    </Button>
  </CardContent>
</Card>

  );
};
