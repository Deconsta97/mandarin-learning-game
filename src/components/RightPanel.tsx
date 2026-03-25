import { useRef } from 'react';
import { DraggableCard } from './DraggableCard';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Plus } from 'lucide-react';
import { Word, CaptionSettings, SystemLanguage } from '../types/game';
import { getTranslation } from '../utils/translations';

interface RightPanelProps {
  captions: CaptionSettings;
  knownWords: Word[];
  showIndividualWords: boolean;
  levelHanzi: string[];
  hanziPinyin: Record<string, string>;
  hanziEnglish: Record<string, string>;
  hanziPortuguese: Record<string, string>;
  onToggleIndividualWords: () => void;
  isTimedMode?: boolean;
  onDrawCard?: () => void;
}

export function RightPanel({ 
  captions, 
  knownWords, 
  showIndividualWords,
  levelHanzi,
  hanziPinyin,
  hanziEnglish,
  hanziPortuguese,
  onToggleIndividualWords,
  isTimedMode = false,
  onDrawCard
}: RightPanelProps) {
  const t = getTranslation(captions.systemLanguage);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Convert vertical scroll to horizontal scroll
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      // Prevent default vertical scroll
      e.preventDefault();
      
      // Scroll horizontally based on vertical wheel delta
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };
  
  // Get individual hanzi from discovered words if toggle is on
  const individualHanziFromWords = showIndividualWords 
    ? knownWords.flatMap(word => word.hanzi.split(''))
    : [];

  return (
    <div className="w-full bg-gray-100 border-t border-gray-300 flex flex-col">
      {/* Header with toggle */}
      <div className="px-4 py-2 border-b border-gray-300 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-gray-700">
            {isTimedMode ? (captions.systemLanguage === 'pt' ? 'Cartas Disponíveis' : 'Available Cards') : (captions.systemLanguage === 'pt' ? 'Hanzi do Nível' : 'Level Hanzi')}
          </h3>
        </div>
        {knownWords.length > 0 && !isTimedMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleIndividualWords}
            className="text-xs"
          >
            {showIndividualWords 
              ? (captions.systemLanguage === 'pt' ? 'Esconder' : 'Hide')
              : (captions.systemLanguage === 'pt' ? 'Mostrar' : 'Show')
            } {captions.systemLanguage === 'pt' ? 'Palavras' : 'Words'}
          </Button>
        )}
      </div>
      
      {/* Horizontal scrollable card list */}
      <div 
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className="px-4 overflow-x-auto overflow-y-visible custom-scrollbar"
        style={{ 
          paddingTop: 'var(--panel-padding-y)',
          paddingBottom: 'var(--panel-padding-bottom)'
        }}
      >
        <div className="flex gap-2 items-start" style={{ minHeight: 'var(--card-height)' }}>
          {/* Draw Card button - only in timed mode */}
          {isTimedMode && onDrawCard && (
            <div className="flex-shrink-0">
              <button
                onClick={onDrawCard}
                className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2 border-2 border-blue-400"
                style={{
                  width: 'var(--card-width)',
                  height: 'var(--card-height)',
                  padding: 'var(--card-padding)'
                }}
              >
                <Plus className="w-12 h-12" strokeWidth={3} />
                <span className="text-xs font-semibold">{t.rightPanel.drawCard}</span>
              </button>
            </div>
          )}
          
          {/* Deduplicated individual hanzi - combine levelHanzi and individualHanziFromWords, remove duplicates */}
          {[...new Set([...levelHanzi, ...(showIndividualWords ? individualHanziFromWords : [])])].map((hanzi) => (
            <div key={`hanzi-${hanzi}`} className="flex-shrink-0">
              <DraggableCard
                hanzi={hanzi}
                captions={captions}
                isSource={true}
                hanziPinyin={hanziPinyin}
                hanziEnglish={hanziEnglish}
                hanziPortuguese={hanziPortuguese}
              />
            </div>
          ))}
          
          {/* Discovered words as composite cards */}
          {showIndividualWords && knownWords.map((word, index) => (
            <div key={`word-${word.hanzi}-${index}`} className="flex-shrink-0">
              <DraggableCard
                hanzi={word.hanzi}
                word={word}
                captions={captions}
                isSource={true}
                hanziPinyin={hanziPinyin}
                hanziEnglish={hanziEnglish}
                hanziPortuguese={hanziPortuguese}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer note */}
      {showIndividualWords && knownWords.length > 0 && (
        <div className="px-4 pb-2 border-t border-gray-300 pt-2">
          <div className="text-xs text-gray-400">
            {captions.systemLanguage === 'pt' 
              ? '* Palavras descobertas incluídas'
              : '* Discovered words included'}
          </div>
        </div>
      )}
    </div>
  );
}