import { Button } from './ui/button';
import { Book } from 'lucide-react';
import { SystemLanguage } from '../types/game';
import { getTranslation } from '../utils/translations';

interface FloatingDictionaryButtonProps {
  onClick: () => void;
  isTimedMode?: boolean;
  systemLanguage: SystemLanguage;
}

export function FloatingDictionaryButton({ 
  onClick,
  isTimedMode = false,
  systemLanguage
}: FloatingDictionaryButtonProps) {
  const t = getTranslation(systemLanguage);
  
  return (
    <div 
      className={`
        fixed left-1/2 transform -translate-x-1/2 z-20
        transition-all duration-200
        ${isTimedMode 
          ? 'top-[132px] sm:top-[136px]' // Below timer (padding + content + small gap)
          : 'top-[120px] sm:top-[124px]' // Below progress bar (smaller height + small gap)
        }
      `}
    >
      <Button
        onClick={onClick}
        variant="outline"
        size="sm"
        className="
          bg-white/95 hover:bg-blue-50 backdrop-blur-sm
          border-2 border-blue-500 text-blue-700 
          shadow-lg hover:shadow-xl transition-all duration-200 
          h-8 px-2.5 text-xs
          sm:h-9 sm:px-3 sm:text-sm
        "
      >
        <Book className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
        <span className="hidden min-[480px]:inline">
          {systemLanguage === 'pt' ? 'Dicionário & Dicas' : 'Dictionary & Hints'}
        </span>
        <span className="inline min-[480px]:hidden">{t.floatingDictionary.viewDictionary}</span>
      </Button>
    </div>
  );
}
