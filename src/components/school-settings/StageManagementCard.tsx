
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { RealSchoolSettings } from '@/hooks/useRealSchoolSettings';
import { StageCard } from './StageCard';

interface StageManagementCardProps {
  orderedStages: any[];
  updateSettings: (updates: Partial<RealSchoolSettings>) => Promise<void>;
  settings: RealSchoolSettings;
}

export const StageManagementCard = ({ orderedStages, updateSettings, settings }: StageManagementCardProps) => {
  const toggleStage = async (stageId: string) => {
    if (!settings?.stages) return;
    
    const updatedStages = settings.stages.map((stage: any) =>
      stage.id === stageId ? { ...stage, enabled: !stage.enabled } : stage
    );
    
    await updateSettings({ stages: updatedStages });
  };

  const updateGradeSections = async (stageId: string, gradeId: string, sections: string[]) => {
    if (!settings?.stages) return;
    
    const updatedStages = settings.stages.map((stage: any) =>
      stage.id === stageId
        ? {
            ...stage,
            grades: stage.grades.map((grade: any) =>
              grade.id === gradeId ? { ...grade, sections } : grade
            ),
          }
        : stage
    );
    
    await updateSettings({ stages: updatedStages });
  };

  const addGrade = async (stageId: string, gradeName: string) => {
    if (!settings?.stages) return;
    
    const updatedStages = settings.stages.map((stage: any) =>
      stage.id === stageId
        ? {
            ...stage,
            grades: [
              ...stage.grades,
              {
                id: `grade_${Date.now()}`,
                name: gradeName,
                sections: ['أ'],
              },
            ],
          }
        : stage
    );
    
    await updateSettings({ stages: updatedStages });
  };

  const updateGradeName = async (stageId: string, gradeId: string, newName: string) => {
    if (!settings?.stages) return;
    
    const updatedStages = settings.stages.map((stage: any) =>
      stage.id === stageId
        ? {
            ...stage,
            grades: stage.grades.map((grade: any) =>
              grade.id === gradeId ? { ...grade, name: newName } : grade
            ),
          }
        : stage
    );
    
    await updateSettings({ stages: updatedStages });
  };

  const deleteGrade = async (stageId: string, gradeId: string) => {
    if (!settings?.stages) return;
    
    const updatedStages = settings.stages.map((stage: any) =>
      stage.id === stageId
        ? {
            ...stage,
            grades: stage.grades.filter((grade: any) => grade.id !== gradeId),
          }
        : stage
    );
    
    await updateSettings({ stages: updatedStages });
  };

  return (
    <Card className="bg-[#F4F9FF]/90 backdrop-blur-md border border-primary-blue/10 shadow-md rounded-2xl" dir="rtl">
    <CardHeader className="bg-primary-teal/5 rounded-t-2xl text-right">
      <CardTitle className="flex items-center gap-2 text-primary-navy justify-start">
        <Users className="h-5 w-5" />
        <span>المراحل الدراسية</span>
      </CardTitle>
      <CardDescription className="text-right">
        اختر المراحل الدراسية المتاحة في مدرستك وقم بتخصيص الصفوف والشعب
      </CardDescription>
    </CardHeader>
  
    <CardContent className="space-y-6 pt-6 text-right">
      {orderedStages && orderedStages.length > 0 ? (
        orderedStages.map((stage: any) => (
          <StageCard
            key={stage.id}
            stage={stage}
            onToggleStage={toggleStage}
            onUpdateGradeSections={updateGradeSections}
            onAddGrade={addGrade}
            onUpdateGradeName={updateGradeName}
            onDeleteGrade={deleteGrade}
          />
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-primary-navy/70">المراحل الدراسية محملة ومتاحة للتعديل</p>
        </div>
      )}
    </CardContent>
  </Card>
  
  );
};
