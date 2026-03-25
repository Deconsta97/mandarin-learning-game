import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { SystemLanguage } from '../types/game';
import { getTranslation } from '../utils/translations';

interface TimeSelectionDialogProps {
  isOpen: boolean;
  onStart: (durationMinutes: number) => void;
  onCancel: () => void;
  systemLanguage: SystemLanguage;
}

export function TimeSelectionDialog({ isOpen, onStart, onCancel, systemLanguage }: TimeSelectionDialogProps) {
  const t = getTranslation(systemLanguage);
  const [minutes, setMinutes] = useState('3');
  
  const handleStart = () => {
    const duration = parseInt(minutes);
    if (duration > 0 && duration <= 60) {
      onStart(duration);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStart();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.timeSelection.title}</DialogTitle>
          <DialogDescription>
            {t.timeSelection.subtitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="duration">{t.timeSelection.selectDuration}</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="60"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
              placeholder={systemLanguage === 'pt' ? 'Digite a duração em minutos' : 'Enter duration in minutes'}
            />
            <p className="text-xs text-muted-foreground">
              {systemLanguage === 'pt' ? 'Escolha entre 1 e 60 minutos' : 'Choose between 1 and 60 minutes'}
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-medium text-blue-900 mb-2">
              {systemLanguage === 'pt' ? 'Regras do Jogo:' : 'Game Rules:'}
            </h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>{systemLanguage === 'pt' ? 'Apenas palavras de 2 hanzi contam' : 'Only 2-hanzi words count'}</li>
              <li>{systemLanguage === 'pt' ? 'Forme o máximo de palavras possível' : 'Form as many words as possible'}</li>
              <li>{systemLanguage === 'pt' ? 'Cada palavra adiciona' : 'Each word adds'} <strong>+3 {systemLanguage === 'pt' ? 'segundos' : 'seconds'}</strong> {systemLanguage === 'pt' ? 'ao cronômetro' : 'to the timer'}</li>
              <li>{systemLanguage === 'pt' ? 'Cronômetro conta regressivamente até zero' : 'Timer counts down to zero'}</li>
              <li>{systemLanguage === 'pt' ? 'Sem progressão de nível neste modo' : 'No level progression in this mode'}</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            {t.timeSelection.cancel}
          </Button>
          <Button 
            onClick={handleStart}
            disabled={!minutes || parseInt(minutes) < 1 || parseInt(minutes) > 60}
          >
            {t.timeSelection.startSession}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}