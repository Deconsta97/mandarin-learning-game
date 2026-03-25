import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Trophy, Clock } from 'lucide-react';
import { SystemLanguage } from '../types/game';
import { getTranslation } from '../utils/translations';

interface TimedModeResultsModalProps {
  isOpen: boolean;
  score: number;
  durationMinutes: number;
  discoveredWords: string[];
  possibleWords: string[];
  hasMoreLevelsToUnlock: boolean;
  onPlayAgain: () => void;
  onBackToFree: () => void;
  systemLanguage: SystemLanguage;
}

export function TimedModeResultsModal({ 
  isOpen, 
  score, 
  durationMinutes,
  discoveredWords,
  possibleWords,
  hasMoreLevelsToUnlock,
  onPlayAgain, 
  onBackToFree,
  systemLanguage
}: TimedModeResultsModalProps) {
  const t = getTranslation(systemLanguage);
  
  // Check if all possible words were discovered
  const allWordsDiscovered = possibleWords.length > 0 && 
    possibleWords.every(word => discoveredWords.includes(word));
  
  const getRankMessage = () => {
    // Perfect completion - all words discovered
    if (allWordsDiscovered) {
      return { title: systemLanguage === 'pt' ? '完美！Todas as Palavras Encontradas!' : '完美！All Words Found!', emoji: '🎉', color: 'text-yellow-600' };
    }
    
    if (score >= 20) return { title: systemLanguage === 'pt' ? '完美！Perfeito!' : '完美！Perfect!', emoji: '🏆', color: 'text-yellow-600' };
    if (score >= 15) return { title: systemLanguage === 'pt' ? '优秀！Excelente!' : '优秀！Excellent!', emoji: '🌟', color: 'text-blue-600' };
    if (score >= 10) return { title: systemLanguage === 'pt' ? '很好！Muito Bom!' : '很好！Very Good!', emoji: '👍', color: 'text-green-600' };
    if (score >= 5) return { title: systemLanguage === 'pt' ? '不错！Nada Mal!' : '不错！Not Bad!', emoji: '💪', color: 'text-purple-600' };
    return { title: systemLanguage === 'pt' ? '加油！Continue Tentando!' : '加油！Keep Trying!', emoji: '📚', color: 'text-gray-600' };
  };
  
  const rank = getRankMessage();
  
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {allWordsDiscovered ? t.timedResults.sessionComplete : t.timedResults.timesUp}
          </DialogTitle>
          <DialogDescription className="text-center">
            {allWordsDiscovered 
              ? (
                  <div className="space-y-1">
                    <div>{systemLanguage === 'pt' ? 'Você descobriu todas as palavras possíveis!' : 'You discovered all possible words!'}</div>
                    {hasMoreLevelsToUnlock && (
                      <div className="text-blue-600">
                        {t.timedResults.tryAgain}
                      </div>
                    )}
                  </div>
                )
              : (systemLanguage === 'pt' ? 'Aqui estão seus resultados' : 'Here are your results')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="text-6xl">{rank.emoji}</div>
          
          <div className={`text-3xl font-bold ${rank.color}`}>
            {rank.title}
          </div>
          
          <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
            <div className="flex flex-col items-center p-6 bg-blue-50 rounded-lg">
              <Trophy className="w-8 h-8 text-blue-600 mb-3" />
              <div className="text-4xl font-bold text-blue-900">{score}</div>
              <div className="text-sm text-blue-700 mt-1">{t.timedResults.wordsDiscovered}</div>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-purple-50 rounded-lg">
              <Clock className="w-8 h-8 text-purple-600 mb-3" />
              <div className="text-4xl font-bold text-purple-900">{durationMinutes}</div>
              <div className="text-sm text-purple-700 mt-1">{t.timeSelection.minutes}</div>
            </div>
          </div>
          
          {discoveredWords.length > 0 && (
            <div className="w-full max-w-md">
              <h4 className="font-semibold mb-2 text-center">{t.timedResults.discoveredWordsList}</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {discoveredWords.map((word, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onBackToFree} className="flex-1">
            {t.timedResults.backToFree}
          </Button>
          <Button onClick={onPlayAgain} className="flex-1">
            {t.timedResults.playAgain}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}