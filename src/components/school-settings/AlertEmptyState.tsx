
interface AlertEmptyStateProps {
  type: 'absence' | 'late';
}

export const AlertEmptyState = ({ type }: AlertEmptyStateProps) => {
  const isAbsence = type === 'absence';
  const textColor = isAbsence ? 'text-red-600/60' : 'text-yellow-600/60';
  const message = isAbsence ? 'لا توجد تنبيهات غياب مضافة' : 'لا توجد تنبيهات تأخر مضافة';

  return (
    <div className={`text-center py-6 ${textColor}`}>
      {message}
    </div>
  );
};
