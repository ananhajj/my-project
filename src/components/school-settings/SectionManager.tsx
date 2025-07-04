
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { handleAddSection } from '@/utils/stageActions';

interface SectionManagerProps {
  sections: string[];
  onAddSection: () => void;
  onRemoveSection: (index: number) => void;
}

export const SectionManager = ({ sections, onAddSection, onRemoveSection }: SectionManagerProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      {/* Right side - الشعب label and add button */}
      <div className="flex items-center gap-2 order-2">
        <span className="text-sm text-school-navy/70">:الشعب</span>
        <Button
          onClick={onAddSection}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 text-school-teal hover:text-school-teal/70"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      {/* Left side - Sections with delete buttons */}
      <div className="flex items-center gap-2 flex-wrap order-1">
        {sections.map((section: string, index: number) => (
          <div key={index} className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
              {section}
            </Badge>
            {sections.length > 1 && (
              <Button
                onClick={() => onRemoveSection(index)}
                size="sm"
                variant="ghost"
                className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
              >
                <X className="h-2 w-2" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
