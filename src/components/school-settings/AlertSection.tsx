
import { AlertRule } from '@/types/alertSettings';
import { AlertRuleCard } from './AlertRuleCard';
import { AlertSectionHeader } from './AlertSectionHeader';
import { AlertEmptyState } from './AlertEmptyState';

interface AlertSectionProps {
  type: 'absence' | 'late';
  alerts: AlertRule[];
  onAddAlert: () => void;
  onUpdateAlert: (updatedRule: AlertRule) => void;
  onDeleteAlert: (ruleId: string) => void;
}

export const AlertSection = ({ 
  type, 
  alerts, 
  onAddAlert, 
  onUpdateAlert, 
  onDeleteAlert 
}: AlertSectionProps) => {
  const sectionClass =
    type === 'absence'
      ? 'bg-accent-peach/5 border border-accent-peach/20'
      : 'bg-accent-orange/5 border border-accent-orange/20';

  return (
    <div className={`space-y-4 rounded-xl p-4 ${sectionClass}`}>
      <AlertSectionHeader type={type} onAddAlert={onAddAlert} />
      
      <div className="grid gap-3">
        {alerts.map((rule) => (
          <AlertRuleCard
            key={rule.id}
            rule={rule}
            type={type}
            onUpdate={onUpdateAlert}
            onDelete={onDeleteAlert}
          />
        ))}
        {alerts.length === 0 && <AlertEmptyState type={type} />}
      </div>
    </div>
  );
};
