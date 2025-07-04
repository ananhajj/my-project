
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { GradeCard } from './GradeCard';
import { AddGradeForm } from './AddGradeForm';
import { handleAddSection } from '@/utils/stageActions';

interface StageCardProps {
  stage: any;
  onToggleStage: (stageId: string) => void;
  onUpdateGradeSections: (stageId: string, gradeId: string, sections: string[]) => void;
  onAddGrade: (stageId: string, gradeName: string) => void;
  onUpdateGradeName: (stageId: string, gradeId: string, newName: string) => void;
  onDeleteGrade: (stageId: string, gradeId: string) => void;
}

export const StageCard = ({ 
  stage, 
  onToggleStage, 
  onUpdateGradeSections, 
  onAddGrade, 
  onUpdateGradeName, 
  onDeleteGrade 
}: StageCardProps) => {
  const [editingGrade, setEditingGrade] = useState<string | null>(null);
  const [addingGrade, setAddingGrade] = useState(false);

  const handleAddSection = (gradeId: string) => {
    const grade = stage.grades.find((g: any) => g.id === gradeId);
    if (grade) {
      const nextSection = handleAddSection(grade.sections);
      onUpdateGradeSections(stage.id, gradeId, [...grade.sections, nextSection]);
    }
  };

  const handleRemoveSection = (gradeId: string, sectionIndex: number) => {
    const grade = stage.grades.find((g: any) => g.id === gradeId);
    if (grade) {
      const newSections = grade.sections.filter((_: any, index: number) => index !== sectionIndex);
      onUpdateGradeSections(stage.id, gradeId, newSections);
    }
  };

  const handleEditGrade = (gradeId: string) => {
    setEditingGrade(gradeId);
  };

  const handleSaveGradeEdit = (gradeId: string, newName: string) => {
    onUpdateGradeName(stage.id, gradeId, newName);
    setEditingGrade(null);
  };

  const handleCancelGradeEdit = () => {
    setEditingGrade(null);
  };

  const handleDeleteGrade = (gradeId: string) => {
    onDeleteGrade(stage.id, gradeId);
  };

  const handleAddGrade = (gradeName: string) => {
    onAddGrade(stage.id, gradeName);
    setAddingGrade(false);
  };

  const handleCancelAddGrade = () => {
    setAddingGrade(false);
  };

  return (
    <div className="border border-school-gray/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Switch
            checked={stage.enabled}
            onCheckedChange={() => onToggleStage(stage.id)}
            className="data-[state=checked]:bg-school-green"
          />
          <h3 className="font-semibold text-school-navy">{stage.name}</h3>
          <Badge variant={stage.enabled ? "default" : "secondary"} className={stage.enabled ? "bg-school-green" : ""}>
            {stage.enabled ? 'مفعل' : 'معطل'}
          </Badge>
        </div>
      </div>

      {stage.enabled && (
        <div className="space-y-3">
          {stage.grades.map((grade: any) => (
            <GradeCard
              key={grade.id}
              grade={grade}
              stageId={stage.id}
              isEditing={editingGrade === grade.id}
              onStartEdit={() => handleEditGrade(grade.id)}
              onSaveEdit={(newName) => handleSaveGradeEdit(grade.id, newName)}
              onCancelEdit={handleCancelGradeEdit}
              onDelete={() => handleDeleteGrade(grade.id)}
              onAddSection={() => handleAddSection(grade.id)}
              onRemoveSection={(index) => handleRemoveSection(grade.id, index)}
            />
          ))}
          
          <div className="border-t border-school-gray/20 pt-3">
            <AddGradeForm
              isActive={addingGrade}
              onActivate={() => setAddingGrade(true)}
              onAdd={handleAddGrade}
              onCancel={handleCancelAddGrade}
            />
          </div>
        </div>
      )}
    </div>
  );
};
