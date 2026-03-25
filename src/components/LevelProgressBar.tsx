import { useMemo } from 'react';
import { Dictionary, Word } from '../types/game';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Star, Lock, CheckCircle } from 'lucide-react';

interface LevelProgressBarProps {
  activeDictionaries: Dictionary[];
  currentLevels: Record<string, number>;
  knownWords: Word[];
  totalWords: number;
}

interface LevelMarker {
  position: number;
  level: number;
  isUnlocked: boolean;
  isActive: boolean;
  dictionaryName: string;
  wordCount: number;
  notes?: string;
}

export function LevelProgressBar({ 
  activeDictionaries, 
  currentLevels, 
  knownWords, 
  totalWords 
}: LevelProgressBarProps) {
  
  const levelMarkers = useMemo(() => {
    const markers: LevelMarker[] = [];
    
    // Since dictionaries are now mutually exclusive, show progress for the active dictionary
    const activeDict = activeDictionaries[0];
    if (!activeDict?.progress) return markers;
    
    const currentLevel = currentLevels[activeDict.id] || 1;
    const totalLevels = activeDict.progress.levels.length;
    
    activeDict.progress.levels.forEach((level, index) => {
      const levelNumber = index + 1;
      const position = totalLevels === 1 ? 50 : (index / (totalLevels - 1)) * 100;
      
      markers.push({
        position,
        level: levelNumber,
        isUnlocked: levelNumber <= currentLevel,
        isActive: levelNumber === currentLevel,
        dictionaryName: activeDict.name.split(' ')[0], // Shortened name
        wordCount: level.availableExamples?.length || 0,
        notes: level.notes
      });
    });
    
    return markers;
  }, [activeDictionaries, currentLevels]);
  
  // Calculate progress based on current level's discovered words
  const progressData = useMemo(() => {
    if (activeDictionaries.length === 0) return {
      percentage: 0,
      currentLevelWords: 0,
      currentLevelTotal: 0,
      totalDiscovered: 0,
      grandTotal: 0
    };
    
    const activeDict = activeDictionaries[0];
    if (!activeDict?.progress) return {
      percentage: 0,
      currentLevelWords: 0,
      currentLevelTotal: 0,
      totalDiscovered: 0,
      grandTotal: 0
    };
    
    const currentLevel = currentLevels[activeDict.id] || 1;
    const currentLevelData = activeDict.progress.levels[currentLevel - 1];
    const currentLevelTargets = currentLevelData?.availableExamples || [];
    
    // Count discovered words in current level
    const currentLevelDiscovered = knownWords.filter(word => 
      currentLevelTargets.includes(word.hanzi)
    ).length;
    
    // Calculate total words discovered across all levels up to current
    const allAvailableWords = activeDict.progress.levels
      .slice(0, currentLevel)
      .reduce((acc, level) => [...acc, ...(level.availableExamples || [])], [] as string[]);
    
    const totalDiscovered = knownWords.filter(word => 
      allAvailableWords.includes(word.hanzi)
    ).length;
    
    // Calculate grand total across all levels
    const grandTotal = activeDict.progress.levels
      .reduce((total, level) => total + (level.availableExamples?.length || 0), 0);
    
    // Progress percentage based on total words discovered vs grand total
    const percentage = grandTotal > 0 ? (totalDiscovered / grandTotal) * 100 : 0;
    
    return {
      percentage,
      currentLevelWords: currentLevelDiscovered,
      currentLevelTotal: currentLevelTargets.length,
      totalDiscovered,
      grandTotal
    };
  }, [activeDictionaries, currentLevels, knownWords]);
  
  const getDictionaryInfo = () => {
    if (activeDictionaries.length === 0) return null;
    
    const activeDict = activeDictionaries[0];
    const currentLevel = currentLevels[activeDict.id] || 1;
    const maxLevel = activeDict.progress?.levels.length || 1;
    
    return {
      name: activeDict.name.split(' ')[0], // Shortened name like "Magic" from "Magic Box Deck"
      currentLevel,
      maxLevel,
      color: 'bg-blue-500'
    };
  };

  return (
    <div 
      className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-3 shadow-lg"
      style={{
        minWidth: 'var(--progress-tracker-width)',
        maxWidth: 'var(--progress-tracker-max-width)'
      }}
    >
      <div className="space-y-3 p-[0px]">
        {/* Main Progress Info */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Dictionary Progress
          </span>
          <span className="text-xs text-gray-500">
            {progressData.totalDiscovered}/{progressData.grandTotal} words discovered
          </span>
        </div>
        
        {/* Level Progress Bar with Markers */}
        <div className="relative">
          {/* Base Progress Bar */}
          <div className="relative h-4 bg-gray-200 rounded-full overflow-visible">
            {/* Overall Progress Fill */}
            <div 
              className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 transition-all duration-700 ease-out shadow-inner rounded-full"
              style={{ width: `${progressData.percentage}%` }}
            />
            
            {/* Level Markers */}
            {levelMarkers.map((marker, index) => (
              <div
                key={index}
                className="absolute top-0 transform -translate-x-1/2 group"
                style={{ left: `${marker.position}%` }}
              >
                {/* Marker Line */}
                <div className={`w-0.5 h-4 ${marker.isUnlocked ? 'bg-white' : 'bg-gray-500'}`} />
                
                {/* Marker Icon */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                    marker.isUnlocked 
                      ? marker.isActive 
                        ? 'bg-yellow-400 border-yellow-500 animate-pulse' 
                        : 'bg-green-400 border-green-500'
                      : 'bg-gray-300 border-gray-400'
                  }`}>
                    {marker.isUnlocked ? (
                      marker.isActive ? (
                        <Star className="w-3 h-3 text-yellow-800 fill-current" />
                      ) : (
                        <CheckCircle className="w-3 h-3 text-green-800" />
                      )
                    ) : (
                      <Lock className="w-2.5 h-2.5 text-gray-600" />
                    )}
                  </div>
                </div>
                
                {/* Level Number Below */}
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2">
                  <span className={`text-xs font-medium ${
                    marker.isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {marker.level}
                  </span>
                </div>
                
                {/* Enhanced Tooltip on Hover */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg max-w-xs min-w-[120px]">
                    <div className="font-medium">Level {marker.level}</div>
                    <div className="text-gray-300">{marker.dictionaryName}</div>
                    {marker.notes && (
                      <div className="text-gray-400 mt-1 whitespace-normal">{marker.notes}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Dictionary Details */}
        <div className="space-y-1">
          {(() => {
            const dictInfo = getDictionaryInfo();
            if (!dictInfo) return null;
            
            return (
              <div className="flex items-center gap-2 text-xs mt-6">
                <div className={`w-2 h-2 rounded-full ${dictInfo.color}`} />
                <span className="font-medium text-gray-700">{dictInfo.name}</span>
                <span className="text-gray-500">
                  Level {dictInfo.currentLevel}/{dictInfo.maxLevel}
                </span>
                <span className="text-gray-500">
                  Words {progressData.currentLevelWords}/{progressData.currentLevelTotal}
                </span>
                <div className="flex-1" />
                <Badge 
                  variant="secondary" 
                  className="text-xs px-2 py-0"
                >
                  {Math.round(progressData.percentage)}%
                </Badge>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}