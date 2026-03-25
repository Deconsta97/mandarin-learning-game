import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

interface FloatingBonusIndicatorProps {
  x: number;
  y: number;
  show: boolean;
  onComplete: () => void;
}

export function FloatingBonusIndicator({ x, y, show, onComplete }: FloatingBonusIndicatorProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <span 
        className="text-green-600 font-bold text-2xl flex items-center gap-1 drop-shadow-lg"
        style={{ animation: 'time-bonus-pop 1s ease-out' }}
      >
        <Plus className="w-6 h-6" />
        3s
      </span>
    </div>
  );
}
