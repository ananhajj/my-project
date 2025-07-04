
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AlertRule, AlertSettings, createDefaultAlertRule } from '@/types/alertSettings';
import { AlertSection } from './AlertSection';

interface AlertSettingsCardProps {
  settings: any;
  updateSettings: (updates: any) => Promise<void>;
}

export const AlertSettingsCard = ({ settings, updateSettings }: AlertSettingsCardProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [alertSettings, setAlertSettings] = useState<AlertSettings>({
    absence_alerts: [],
    late_alerts: []
  });

  // تحويل الإعدادات القديمة إلى النظام الجديد
  useEffect(() => {
    if (settings) {
      const convertedSettings: AlertSettings = {
        absence_alerts: [],
        late_alerts: []
      };

      if (settings.alert_rules) {
        // النظام الجديد موجود
        convertedSettings.absence_alerts = settings.alert_rules.absence_alerts || [];
        convertedSettings.late_alerts = settings.alert_rules.late_alerts || [];
      } else {
        // تحويل من النظام القديم
        if (settings.absence_alert_days) {
          convertedSettings.absence_alerts = [
            createDefaultAlertRule('absence', settings.absence_alert_days)
          ];
          if (settings.absence_alert_title) {
            convertedSettings.absence_alerts[0].title = settings.absence_alert_title;
          }
          if (settings.absence_alert_description) {
            convertedSettings.absence_alerts[0].description = settings.absence_alert_description;
          }
        }

        if (settings.late_alert_count) {
          convertedSettings.late_alerts = [
            createDefaultAlertRule('late', settings.late_alert_count)
          ];
          if (settings.late_alert_title) {
            convertedSettings.late_alerts[0].title = settings.late_alert_title;
          }
          if (settings.late_alert_description) {
            convertedSettings.late_alerts[0].description = settings.late_alert_description;
          }
        }
      }

      setAlertSettings(convertedSettings);
    }
  }, [settings]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateSettings({
        alert_rules: alertSettings
      });
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث إعدادات التنبيهات بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "لم نتمكن من حفظ إعدادات التنبيهات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addAlert = (type: 'absence' | 'late') => {
    const newThreshold = type === 'absence' ? 5 : 5;
    const newAlert = createDefaultAlertRule(type, newThreshold);
    
    setAlertSettings(prev => ({
      ...prev,
      [`${type}_alerts`]: [...prev[`${type}_alerts`], newAlert]
    }));
  };

  const updateAlert = (type: 'absence' | 'late', updatedRule: AlertRule) => {
    setAlertSettings(prev => ({
      ...prev,
      [`${type}_alerts`]: prev[`${type}_alerts`].map(rule => 
        rule.id === updatedRule.id ? updatedRule : rule
      )
    }));
  };

  const deleteAlert = (type: 'absence' | 'late', ruleId: string) => {
    setAlertSettings(prev => ({
      ...prev,
      [`${type}_alerts`]: prev[`${type}_alerts`].filter(rule => rule.id !== ruleId)
    }));
  };

  return (
<Card className="bg-[#FEF8F5]/90 backdrop-blur-md border border-accent-orange/30 shadow-md rounded-2xl" dir="rtl">
  <CardHeader className="pb-4 text-right">
    <CardTitle className="flex items-center gap-2 text-accent-orange justify-center">
      <span>إعدادات التنبيهات المتقدمة</span>
      <AlertTriangle className="h-5 w-5" />
    </CardTitle>
    <p className="text-sm text-accent-orange/80 text-right">
      أضف تنبيهات متعددة للغياب والتأخر بعتبات مختلفة
    </p>
  </CardHeader>

  <CardContent className="space-y-6 text-right">
    {/* تنبيهات الغياب */}
    <AlertSection
      type="absence"
      alerts={alertSettings.absence_alerts}
      onAddAlert={() => addAlert('absence')}
      onUpdateAlert={(updatedRule) => updateAlert('absence', updatedRule)}
      onDeleteAlert={(ruleId) => deleteAlert('absence', ruleId)}
    />

    {/* تنبيهات التأخر */}
    <AlertSection
      type="late"
      alerts={alertSettings.late_alerts}
      onAddAlert={() => addAlert('late')}
      onUpdateAlert={(updatedRule) => updateAlert('late', updatedRule)}
      onDeleteAlert={(ruleId) => deleteAlert('late', ruleId)}
    />

    {/* زر الحفظ */}
    <div className="pt-4 border-t border-accent-orange/30 flex justify-end">
      <Button
        onClick={handleSave}
        disabled={loading}
        className="bg-accent-orange hover:bg-accent-orange/90 text-white transition"
      >
        <Save className="h-4 w-4 ml-2" />
        {loading ? 'جاري الحفظ...' : 'حفظ إعدادات التنبيهات'}
      </Button>
    </div>
  </CardContent>
</Card>

  );
};
