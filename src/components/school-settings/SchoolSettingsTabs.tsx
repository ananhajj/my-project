import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BasicSchoolInfoCard } from './BasicSchoolInfoCard';
import { StageManagementCard } from './StageManagementCard';
import { AttendanceTypeCard } from './AttendanceTypeCard';
import { AlertSettingsCard } from './AlertSettingsCard';
import { SettingsSummaryCard } from './SettingsSummaryCard';

interface SchoolSettingsTabsProps {
  settings: any;
  orderedStages: any[];
  tempSchoolName: string;
  setTempSchoolName: (name: string) => void;
  handleSaveSettings: () => void;
  updateSettings: (updates: any) => Promise<void>;
}

export const SchoolSettingsTabs = ({
  settings,
  orderedStages,
  tempSchoolName,
  setTempSchoolName,
  handleSaveSettings,
  updateSettings,
}: SchoolSettingsTabsProps) => {
  return (
    <Tabs defaultValue="basic" className="w-full" dir="rtl">
      <TabsList className="grid w-full grid-cols-5 mb-8 bg-[#F4F9FF]/70 backdrop-blur-md rounded-xl shadow-sm border border-primary-blue/10">
        <TabsTrigger value="basic" className="text-sm font-medium text-primary-navy/70 data-[state=active]:text-primary-blue data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:border-primary-blue transition">المعلومات الأساسية</TabsTrigger>
        <TabsTrigger value="stages" className="text-sm font-medium text-primary-navy/70 data-[state=active]:text-primary-blue data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:border-primary-blue transition">المراحل والصفوف</TabsTrigger>
        <TabsTrigger value="attendance" className="text-sm font-medium text-primary-navy/70 data-[state=active]:text-primary-blue data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:border-primary-blue transition">نوع الحضور</TabsTrigger>
        <TabsTrigger value="alerts" className="text-sm font-medium text-primary-navy/70 data-[state=active]:text-primary-blue data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:border-primary-blue transition">إعدادات التنبيهات</TabsTrigger>
        <TabsTrigger value="summary" className="text-sm font-medium text-primary-navy/70 data-[state=active]:text-primary-blue data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:border-primary-blue transition">ملخص الإعدادات</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-6">
        <BasicSchoolInfoCard
          tempSchoolName={tempSchoolName}
          setTempSchoolName={setTempSchoolName}
          handleSaveSettings={handleSaveSettings}
          settings={settings}
          updateSettings={updateSettings}
        />
      </TabsContent>

      <TabsContent value="stages" className="space-y-6">
        <StageManagementCard 
          orderedStages={orderedStages} 
          updateSettings={updateSettings}
          settings={settings}
        />
      </TabsContent>

      <TabsContent value="attendance" className="space-y-6">
        <AttendanceTypeCard 
          settings={settings}
          updateSettings={updateSettings}
        />
      </TabsContent>

      <TabsContent value="alerts" className="space-y-6">
        <AlertSettingsCard 
          settings={settings}
          updateSettings={updateSettings}
        />
      </TabsContent>

      <TabsContent value="summary" className="space-y-6">
        <SettingsSummaryCard settings={settings} />
      </TabsContent>
    </Tabs>
  );
};
