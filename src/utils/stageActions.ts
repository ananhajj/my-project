
export const handleAddSection = (sections: string[]): string => {
  const nextSection = String.fromCharCode(65 + sections.length);
  const arabicSection = nextSection === 'A' ? 'أ' : 
                       nextSection === 'B' ? 'ب' :
                       nextSection === 'C' ? 'ج' :
                       nextSection === 'D' ? 'د' :
                       nextSection === 'E' ? 'هـ' :
                       nextSection === 'F' ? 'و' : nextSection;
  
  return arabicSection;
};
