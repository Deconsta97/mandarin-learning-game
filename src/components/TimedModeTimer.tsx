import { useEffect, useState, useRef } from 'react';
import { Progress } from './ui/progress';
import { Clock, Trophy, StopCircle, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { SystemLanguage } from '../types/game';
import { getTranslation } from '../utils/translations';

interface TimedModeTimerProps {
  durationMinutes: number;
  timeRemainingMs: number;
  score: number;
  possibleWords: string[];
  onTimeUp: () => void;
  onStopSession: () => void;
  systemLanguage: SystemLanguage;
}

export function TimedModeTimer({ 
  durationMinutes, 
  timeRemainingMs, 
  score,
  possibleWords,
  onTimeUp,
  onStopSession,
  systemLanguage
}: TimedModeTimerProps) {
  const t = getTranslation(systemLanguage);
  const [timeDisplay, setTimeDisplay] = useState('00:00');
  const [progressPercent, setProgressPercent] = useState(100);
  const [showBonus, setShowBonus] = useState(false);
  const previousScoreRef = useRef(score);
  
  // Show bonus indicator when score increases
  useEffect(() => {
    if (score > previousScoreRef.current) {
      setShowBonus(true);
      const timer = setTimeout(() => setShowBonus(false), 1000);
      previousScoreRef.current = score;
      return () => clearTimeout(timer);
    }
  }, [score]);

  useEffect(() => {
    if (timeRemainingMs <= 0) {
      setTimeDisplay('00:00');
      setProgressPercent(0);
      onTimeUp();
      return;
    }
    
    // Calculate display values
    const totalSeconds = Math.ceil(timeRemainingMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    setTimeDisplay(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    
    // Calculate progress percentage (remaining time / total time * 100)
    const totalMs = durationMinutes * 60 * 1000;
    const percent = (timeRemainingMs / totalMs) * 100;
    setProgressPercent(Math.max(0, Math.min(100, percent)));
  }, [timeRemainingMs, durationMinutes, onTimeUp]);
  
  // Color based on time remaining
  const getProgressColor = () => {
    if (progressPercent > 50) return 'bg-green-500';
    if (progressPercent > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div 
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4"
      style={{
        width: 'var(--progress-tracker-width)',
        maxWidth: 'var(--progress-tracker-max-width)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 relative">
          <Clock className="w-5 h-5 text-blue-600" />
          <span className="font-mono text-xl font-bold">{timeDisplay}</span>
          {showBonus && (
            <span 
              className="absolute -top-1 -right-12 text-green-600 font-bold text-sm flex items-center gap-0.5"
              style={{ animation: 'time-bonus-pop 1s ease-out' }}
            >
              <Plus className="w-3.5 h-3.5" />
              3s
            </span>
          )}
        </div>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={onStopSession}
          className="h-8 px-3 text-xs"
        >
          <StopCircle className="w-3.5 h-3.5 mr-1" />
          {t.timedTimer.stopSession}
        </Button>
        
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          <span className="text-xl font-bold text-gray-800">{score}</span>
        </div>
      </div>
      
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getProgressColor()} transition-all duration-300`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      
      <div className="mt-1 text-xs text-center text-gray-500">
        {possibleWords.length > 0 
          ? `${systemLanguage === 'pt' ? 'Modo Desafio Contra o Tempo' : 'Trial by Time Mode'} • ${possibleWords.length} ${systemLanguage === 'pt' ? 'palavras possíveis' : 'possible words'}`
          : (systemLanguage === 'pt' ? 'Modo Desafio Contra o Tempo' : 'Trial by Time Mode')}
      </div>
    </div>
  );
}