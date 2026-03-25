import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Word, Dictionary, SystemLanguage } from '../types/game';
import { getTranslation } from '../utils/translations';

interface DictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetWords: Word[];
  activeDictionaries: Dictionary[];
  currentLevels: Record<string, number>;
  systemLanguage: SystemLanguage;
}

export function DictionaryModal({ isOpen, onClose, targetWords, activeDictionaries, currentLevels, systemLanguage }: DictionaryModalProps) {
  const t = getTranslation(systemLanguage);
  
  // Get all availableExamples cumulatively up to current level
  const availableExampleHanzi: string[] = [];
  
  activeDictionaries.forEach(dict => {
    if (!dict.progress) return;
    const currentLevel = currentLevels[dict.id] || 1;
    
    // Collect availableExamples from all levels up to current
    for (let i = 0; i < currentLevel && i < dict.progress.levels.length; i++) {
      availableExampleHanzi.push(...(dict.progress.levels[i].availableExamples || []));
    }
  });
  
  // Filter targetWords to only show those in availableExamples
  const filteredWords = targetWords.filter(word => 
    availableExampleHanzi.includes(word.hanzi)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            📚 {t.dictionaryModal.title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t.dictionaryModal.subtitle}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {filteredWords.map((word, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl" style={{ fontFamily: 'Noto Sans SC, sans-serif' }}>
                    {word.hanzi}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-lg font-medium text-blue-600">
                      {word.pinyin}
                    </div>
                    <div className="text-gray-700">
                      🇺🇸 {word.en}
                    </div>
                    <div className="text-gray-700">
                      🇧🇷 {word.pt}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}