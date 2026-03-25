import { useDrag } from 'react-dnd';
import { Word, CaptionSettings } from '../types/game';
import { X } from 'lucide-react';
import { useSound } from '../hooks/useSound';

interface DraggableCardProps {
  hanzi: string;
  word?: Word;
  captions: CaptionSettings;
  isSource?: boolean;
  onCanvas?: boolean;
  x?: number;
  y?: number;
  cardId?: string;
  onRemove?: (cardId: string) => void;
  hanziPinyin?: Record<string, string>;
  hanziEnglish?: Record<string, string>;
  hanziPortuguese?: Record<string, string>;
}

export function DraggableCard({ 
  hanzi, 
  word, 
  captions, 
  isSource = false,
  onCanvas = false,
  x = 0,
  y = 0,
  cardId,
  onRemove,
  hanziPinyin = {},
  hanziEnglish = {},
  hanziPortuguese = {}
}: DraggableCardProps) {
  const { playWordSound } = useSound(captions.soundEnabled);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'hanzi-card',
    item: () => {
      // Play sound when drag begins for any hanzi card (single or multi-character)
      playWordSound(hanzi);
      
      return { 
        hanzi, 
        word, 
        isSource, 
        cardId: onCanvas ? cardId : undefined,
        isCanvasCard: onCanvas 
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const cardStyle = onCanvas ? {
    position: 'absolute' as const,
    left: x,
    top: y,
    transform: 'none'
  } : {};

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (cardId && onRemove) {
      onRemove(cardId);
    }
  };

  // Get responsive font size based on number of characters
  const getHanziFontSize = (text: string): React.CSSProperties => {
    const length = text.length;
    if (length === 1) return { fontSize: 'var(--card-hanzi-1)' };
    if (length === 2) return { fontSize: 'var(--card-hanzi-2)' };
    if (length === 3) return { fontSize: 'var(--card-hanzi-3)' };
    return { fontSize: 'var(--card-hanzi-4)' };
  };

  // Handle click to play sound for any hanzi card (single or multi-character)
  const handleClick = (e: React.MouseEvent) => {
    // Only play sound on direct clicks, not when removing cards
    if (e.target === e.currentTarget || 
        (e.target as HTMLElement).tagName === 'SPAN' ||
        (e.target as HTMLElement).closest('.card-content')) {
      playWordSound(hanzi);
    }
  };

  return (
    <div
      ref={drag}
      onClick={handleClick}
      className={`
        bg-white border-2 border-gray-300 rounded-lg 
        cursor-pointer shadow-md hover:shadow-lg transition-shadow
        flex flex-col relative
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${onCanvas ? '' : 'mb-2'}
      `}
      style={{
        ...cardStyle,
        width: 'var(--card-width)',
        height: 'var(--card-height)',
        padding: 'var(--card-padding)'
      }}
    >
      {onCanvas && cardId && onRemove && (
        <button
          onClick={handleRemove}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors z-10"
          style={{
            width: 'var(--card-remove-btn)',
            height: 'var(--card-remove-btn)'
          }}
          title="Remove card"
        >
          <X size={14} />
        </button>
      )}
      
      <div className="flex-1 flex items-center justify-center px-1 min-h-0 card-content">
        <span 
          className="text-center leading-none" 
          style={{ 
            fontFamily: 'Noto Sans SC, sans-serif',
            wordBreak: 'keep-all',
            whiteSpace: 'nowrap',
            ...getHanziFontSize(hanzi)
          }}
        >
          {hanzi}
        </span>
      </div>
      
      {(captions.showPinyin || captions.showEnglish || captions.showPortuguese) && (
        <div 
          className="text-center text-gray-600 space-y-0.5 mt-1 px-1"
          style={{ fontSize: 'var(--card-caption)' }}
        >
          {word ? (
            <>
              {captions.showPinyin && <div className="font-medium text-blue-700">{word.pinyin}</div>}
              {captions.showEnglish && <div className="text-gray-600">{word.en}</div>}
              {captions.showPortuguese && <div className="text-gray-600">{word.pt}</div>}
            </>
          ) : (
            <>
              {captions.showPinyin && (
                <div className="font-medium text-blue-700">
                  {hanzi.length === 1 
                    ? hanziPinyin[hanzi] || ''
                    : hanzi.split('').map(char => hanziPinyin[char] || char).join(' ')
                  }
                </div>
              )}
              {captions.showEnglish && (
                <div className="text-gray-600">
                  {hanzi.length === 1 
                    ? hanziEnglish[hanzi] || 'No translation'
                    : 'No translation'
                  }
                </div>
              )}
              {captions.showPortuguese && (
                <div className="text-gray-600">
                  {hanzi.length === 1 
                    ? hanziPortuguese[hanzi] || 'Sem tradução'
                    : 'Sem tradução'
                  }
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}