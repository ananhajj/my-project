
import { useMemo } from 'react';

export const useStageOrdering = (stages: any[] | undefined) => {
  const getOrderedStages = useMemo(() => {
    if (!stages) return [];
    
    const stageOrder = ['kindergarten', 'early_childhood', 'elementary', 'middle', 'high'];
    
    return stageOrder.map(stageId => 
      stages.find((stage: any) => stage.id === stageId)
    ).filter(Boolean);
  }, [stages]);

  return getOrderedStages;
};
