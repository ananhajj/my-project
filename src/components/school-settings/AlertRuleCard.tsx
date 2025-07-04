
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';
import { AlertRule } from '@/types/alertSettings';

interface AlertRuleCardProps {
  rule: AlertRule;
  type: 'absence' | 'late';
  onUpdate: (rule: AlertRule) => void;
  onDelete: (ruleId: string) => void;
}

export const AlertRuleCard = ({ rule, type, onUpdate, onDelete }: AlertRuleCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRule, setEditedRule] = useState(rule);

  const handleSave = () => {
    onUpdate(editedRule);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedRule(rule);
    setIsEditing(false);
  };

  const handleToggle = (enabled: boolean) => {
    const updatedRule = { ...rule, enabled };
    setEditedRule(updatedRule);
    onUpdate(updatedRule);
  };

  const typeColor = type === 'absence' ? 'red' : 'yellow';
  const bgColor = type === 'absence' ? 'bg-red-50' : 'bg-yellow-50';
  const borderColor = type === 'absence' ? 'border-red-200' : 'border-yellow-200';
  const textColor = type === 'absence' ? 'text-red-700' : 'text-yellow-700';

  return (
    <Card className={`${bgColor} ${borderColor} border-2`} dir="rtl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(rule.id)}
                  className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className={`h-8 w-8 p-0 hover:bg-${typeColor}-100`}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSave}
                  className="h-8 w-8 p-0 hover:bg-green-100 text-green-600"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </>
            )}
            <Switch
              checked={rule.enabled}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
          <CardTitle className={`text-sm ${textColor} text-right`}>
            {type === 'absence' ? 'تنبيه غياب' : 'تنبيه تأخر'} - {rule.threshold} {type === 'absence' ? 'أيام' : 'مرات'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-right">
        {isEditing ? (
          <>
            <div>
              <Label className={`${textColor} block text-right mb-1`}>
                {type === 'absence' ? 'عدد الأيام' : 'عدد المرات'}
              </Label>
              <Input
                type="number"
                min="1"
                max={type === 'absence' ? "30" : "20"}
                value={editedRule.threshold}
                onChange={(e) => setEditedRule({
                  ...editedRule,
                  threshold: parseInt(e.target.value) || 1
                })}
                className="bg-white/70 text-right"
                dir="rtl"
              />
            </div>
            <div>
              <Label className={`${textColor} block text-right mb-1`}>عنوان التنبيه</Label>
              <Input
                value={editedRule.title}
                onChange={(e) => setEditedRule({
                  ...editedRule,
                  title: e.target.value
                })}
                className="bg-white/70 text-right"
                dir="rtl"
              />
            </div>
            <div>
              <Label className={`${textColor} block text-right mb-1`}>وصف التنبيه</Label>
              <Textarea
                value={editedRule.description}
                onChange={(e) => setEditedRule({
                  ...editedRule,
                  description: e.target.value
                })}
                className="bg-white/70 text-right"
                rows={2}
                dir="rtl"
              />
            </div>
          </>
        ) : (
          <div className="space-y-2 text-right">
            <div>
              <p className={`font-medium ${textColor} text-right`}>{rule.title}</p>
              <p className={`text-sm ${textColor}/80 text-right`}>{rule.description}</p>
            </div>
            <div className={`text-xs ${textColor}/60 text-right`}>
              الحالة: {rule.enabled ? 'مفعل' : 'معطل'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
