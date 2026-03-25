import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Word, SystemLanguage } from '../types/game';
import { getTranslation } from '../utils/translations';

interface CelebrationModalProps {
  isOpen: boolean;
  word: Word | null;
  onClose: () => void;
  systemLanguage: SystemLanguage;
}

export function CelebrationModal({ isOpen, word, onClose, systemLanguage }: CelebrationModalProps) {
  if (!word) return null;
  
  const t = getTranslation(systemLanguage);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-yellow-600">
            🎉 {t.celebration.title} 🎉
          </DialogTitle>
          <DialogDescription className="text-center">
            {t.celebration.youDiscovered}
          </DialogDescription>
        </DialogHeader>
        
        <div className="text-center space-y-4 py-6">
          <div className="text-6xl" style={{ fontFamily: 'Noto Sans SC, sans-serif' }}>
            {word.hanzi}
          </div>
          
          <div className="space-y-2">
            <div className="text-xl font-medium text-blue-600">
              {word.pinyin}
            </div>
            <div className="text-lg text-gray-700">
              🇺🇸 {word.en}
            </div>
            <div className="text-lg text-gray-700">
              🇧🇷 {word.pt}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button onClick={onClose} className="px-8">
            {t.celebration.keepGoing}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}