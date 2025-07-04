
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { usePeriodSettings, PeriodSetting } from "@/hooks/usePeriodSettings";

export const PeriodSettingsManager = () => {
  const { periodSettings, loading, createPeriodSetting, updatePeriodSetting, deletePeriodSetting } = usePeriodSettings();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<PeriodSetting | null>(null);
  const [formData, setFormData] = useState({
    period_type: 'weekly' as 'weekly' | 'monthly' | 'quarterly' | 'yearly',
    start_date: '',
    end_date: '',
    academic_year: '',
    is_active: true
  });

  const periodTypeLabels = {
    weekly: 'أسبوعي',
    monthly: 'شهري',
    quarterly: 'فصلي',
    yearly: 'سنوي'
  };

  const resetForm = () => {
    setFormData({
      period_type: 'weekly',
      start_date: '',
      end_date: '',
      academic_year: '',
      is_active: true
    });
    setEditingSetting(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSetting) {
      const success = await updatePeriodSetting(editingSetting.id, formData);
      if (success) {
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const result = await createPeriodSetting(formData);
      if (result) {
        setIsDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleEdit = (setting: PeriodSetting) => {
    setEditingSetting(setting);
    setFormData({
      period_type: setting.period_type,
      start_date: setting.start_date,
      end_date: setting.end_date,
      academic_year: setting.academic_year,
      is_active: setting.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الإعداد؟')) {
      await deletePeriodSetting(id);
    }
  };

  const getCurrentAcademicYear = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // إذا كان الشهر الحالي قبل سبتمبر، فالسنة الدراسية الحالية تبدأ من العام السابق
    if (currentMonth < 8) { // 8 = سبتمبر (0-indexed)
      return `${currentYear - 1}-${currentYear}`;
    } else {
      return `${currentYear}-${currentYear + 1}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          إدارة إعدادات الفترات الزمنية
        </CardTitle>
        <CardDescription>
          إدارة الفترات الزمنية للتقارير والإحصائيات
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            إجمالي الإعدادات: {periodSettings.length}
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                إضافة إعداد جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" dir="rtl">
              <DialogHeader>
                <DialogTitle>
                  {editingSetting ? 'تعديل إعدادات الفترة' : 'إضافة إعدادات فترة جديدة'}
                </DialogTitle>
                <DialogDescription>
                  قم بتحديد نوع الفترة والتواريخ والسنة الدراسية
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="period_type">نوع الفترة</Label>
                  <Select 
                    value={formData.period_type} 
                    onValueChange={(value: 'weekly' | 'monthly' | 'quarterly' | 'yearly') => 
                      setFormData(prev => ({ ...prev, period_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">أسبوعي</SelectItem>
                      <SelectItem value="monthly">شهري</SelectItem>
                      <SelectItem value="quarterly">فصلي</SelectItem>
                      <SelectItem value="yearly">سنوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">تاريخ البداية</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">تاريخ النهاية</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academic_year">السنة الدراسية</Label>
                  <Input
                    id="academic_year"
                    type="text"
                    placeholder={getCurrentAcademicYear()}
                    value={formData.academic_year}
                    onChange={(e) => setFormData(prev => ({ ...prev, academic_year: e.target.value }))}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">نشط</Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit">
                    {editingSetting ? 'تحديث' : 'حفظ'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نوع الفترة</TableHead>
                <TableHead>تاريخ البداية</TableHead>
                <TableHead>تاريخ النهاية</TableHead>
                <TableHead>السنة الدراسية</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periodSettings.map((setting) => (
                <TableRow key={setting.id}>
                  <TableCell className="font-medium">
                    {periodTypeLabels[setting.period_type]}
                  </TableCell>
                  <TableCell>
                    {new Date(setting.start_date).toLocaleDateString('ar-SA')}
                  </TableCell>
                  <TableCell>
                    {new Date(setting.end_date).toLocaleDateString('ar-SA')}
                  </TableCell>
                  <TableCell>{setting.academic_year}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      setting.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {setting.is_active ? 'نشط' : 'غير نشط'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(setting)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(setting.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {periodSettings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    لا توجد إعدادات فترات زمنية مضافة بعد
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
