import { useState, useMemo, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { MouseTransition, TouchTransition, MultiBackend } from "dnd-multi-backend";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { LeftPanel } from "./components/LeftPanel";
import { Canvas } from "./components/Canvas";
import { RightPanel } from "./components/RightPanel";
import { CelebrationModal } from "./components/CelebrationModal";
import { LevelProgressModal } from "./components/LevelProgressModal";
import { DictionaryModal } from "./components/DictionaryModal";
import { SettingsModal } from "./components/SettingsModal";
import { TimeSelectionDialog } from "./components/TimeSelectionDialog";
import { TimedModeTimer } from "./components/TimedModeTimer";
import { TimedModeResultsModal } from "./components/TimedModeResultsModal";
import { FloatingDictionaryButton } from "./components/FloatingDictionaryButton";
import { FloatingBonusIndicator } from "./components/FloatingBonusIndicator";
import { WelcomeDialog } from "./components/WelcomeDialog";
import { useGameState } from "./hooks/useGameState";
import { useSound } from "./hooks/useSound";
import { Word } from "./types/game";
import { getTranslation } from "./utils/translations";

export default function App() {
  const {
    gameState,
    addKnownWord,
    togglePinyin,
    toggleEnglish,
    togglePortuguese,
    toggleSound,
    setSystemLanguage,
    clearCanvas,
    addCardToCanvas,
    removeCardFromCanvas,
    moveCardOnCanvas,
    addDictionary,
    toggleDictionary,
    removeDictionary,
    resetProgress,
    getActiveDictionariesData,
    setGameMode,
    startTimedMode,
    updateTimedModeTime,
    addTimedModeScore,
    endTimedMode,
    resetToFreeMode,
    drawCard,
    checkTimedModeCompletion,
  } = useGameState();

  const [celebrationWord, setCelebrationWord] =
    useState<Word | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showIndividualWords, setShowIndividualWords] =
    useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<{
    dictionaryName: string;
    level: number;
  } | null>(null);
  const [showLevelProgress, setShowLevelProgress] =
    useState(false);
  const [showTimeSelection, setShowTimeSelection] = useState(false);
  const [showTimedResults, setShowTimedResults] = useState(false);
  const [bonusIndicator, setBonusIndicator] = useState<{ show: boolean; x: number; y: number }>({
    show: false,
    x: 0,
    y: 0,
  });

  // Welcome dialog state - check localStorage for first visit
  const [showWelcome, setShowWelcome] = useState(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    return !hasSeenWelcome;
  });

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  // Memoize active dictionaries data to prevent expensive recalculations
  const activeDictionariesData = useMemo(() => {
    return getActiveDictionariesData();
  }, [gameState.dictionaries, gameState.currentLevels]);

  // Check if there are more levels to unlock in any active dictionary
  const hasMoreLevelsToUnlock = useMemo(() => {
    const activeDicts = gameState.dictionaries.filter(d => d.isActive);
    return activeDicts.some(dict => {
      if (!dict.progress) return false;
      const currentLevel = gameState.currentLevels[dict.id] || 1;
      const maxLevel = dict.progress.levels.length;
      return currentLevel < maxLevel;
    });
  }, [gameState.dictionaries, gameState.currentLevels]);

  // Initialize sound system
  const { playCelebrationSound, playLevelUpSound } = useSound(
    gameState.captions.soundEnabled,
  );

  // Timer for timed mode
  useEffect(() => {
    if (!gameState.timedMode.isActive || !gameState.timedMode.startTime) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - gameState.timedMode.startTime!;
      const remaining = Math.max(0, (gameState.timedMode.durationMinutes * 60 * 1000) - elapsed);
      
      updateTimedModeTime(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        handleTimedModeEnd();
      }
    }, 100); // Update every 100ms for smooth countdown

    return () => clearInterval(interval);
  }, [gameState.timedMode.isActive, gameState.timedMode.startTime]);

  const handleNewWord = (word: Word, cursorX?: number, cursorY?: number) => {
    // In timed mode, just increment score without showing celebration
    if (gameState.gameMode === 'timed' && gameState.timedMode.isActive) {
      addTimedModeScore(word.hanzi, () => {
        // Called when all possible words are discovered
        handleTimedModeEnd();
      });
      playCelebrationSound();
      
      // Show floating +3s bonus indicator at cursor position
      if (cursorX !== undefined && cursorY !== undefined) {
        setBonusIndicator({ show: true, x: cursorX, y: cursorY });
      }
      
      return;
    }

    // Free mode: normal celebration flow
    addKnownWord(
      word,
      (dictionaryName: string, newLevel: number) => {
        setLevelUpInfo({ dictionaryName, level: newLevel });
        setShowLevelProgress(true);
        playLevelUpSound();
      },
    );

    setCelebrationWord(word);
    setShowCelebration(true);

    // Play celebration sound for new word discovery
    playCelebrationSound();
  };

  const handleCloseCelebration = () => {
    setShowCelebration(false);
    setCelebrationWord(null);
  };

  const handleCloseLevelProgress = () => {
    setShowLevelProgress(false);
    setLevelUpInfo(null);
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleGameModeChange = (mode: 'free' | 'timed') => {
    if (mode === 'timed') {
      // Show time selection dialog
      setShowTimeSelection(true);
    } else {
      // Switch to free mode
      setGameMode(mode);
    }
  };

  const handleStartTimedMode = (durationMinutes: number) => {
    setShowTimeSelection(false);
    
    // Get all hanzi from active dictionaries at current levels
    const activeDicts = gameState.dictionaries.filter(d => d.isActive);
    const allHanzi: string[] = [];
    
    activeDicts.forEach(dict => {
      if (!dict.progress) return;
      const currentLevel = gameState.currentLevels[dict.id] || 1;
      
      // Get all hanzi up to current level
      for (let i = 0; i < currentLevel && i < dict.progress.levels.length; i++) {
        allHanzi.push(...dict.progress.levels[i].hanzi);
      }
    });
    
    // Remove duplicates
    const uniqueHanzi = [...new Set(allHanzi)];
    
    if (uniqueHanzi.length < 10) {
      const t = getTranslation(gameState.captions.systemLanguage);
      toast.error(t.toasts.notEnoughHanzi.title, {
        description: t.toasts.notEnoughHanzi.description,
        duration: 3000,
      });
      return;
    }

    // Start timed mode with all available hanzi
    startTimedMode(durationMinutes, uniqueHanzi);
  };

  const handleTimedModeEnd = () => {
    endTimedMode();
    setShowTimedResults(true);
  };

  const handleTimedModePlayAgain = () => {
    setShowTimedResults(false);
    setShowTimeSelection(true);
  };

  const handleBackToFreeMode = () => {
    setShowTimedResults(false);
    resetToFreeMode();
  };

  const handleToggleDictionary = (id: string) => {
    toggleDictionary(id);
    clearCanvas(); // Clear canvas when dictionaries change to prevent bugs
  };

  const handleAddDictionary = (dictionary: any) => {
    addDictionary(dictionary);
    clearCanvas(); // Clear canvas when new dictionary is added to prevent bugs
  };

  const handleRemoveDictionary = (id: string) => {
    removeDictionary(id);
    clearCanvas(); // Clear canvas when dictionary is removed to prevent bugs
  };

  const handleResetProgress = () => {
    resetProgress();
    // Close any open modals
    setShowCelebration(false);
    setShowLevelProgress(false);
    setShowTimedResults(false);
    setCelebrationWord(null);
    setLevelUpInfo(null);
    // Show info message
    const t = getTranslation(gameState.captions.systemLanguage);
    toast(t.toasts.progressReset.title, {
      description: t.toasts.progressReset.description,
      className: 'bg-blue-50 text-blue-900 border-blue-200',
    });
  };

  const handleDropCard = (
    hanzi: string,
    x: number,
    y: number,
    word?: Word,
  ) => {
    addCardToCanvas(hanzi, x, y, word);
  };

  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(true); // Start collapsed

  // Multi-backend configuration for seamless mouse and touch support
  const HTML5toTouch = {
    backends: [
      {
        id: 'html5',
        backend: HTML5Backend,
        transition: MouseTransition,
      },
      {
        id: 'touch',
        backend: TouchBackend,
        options: { 
          delayTouchStart: 0, // Instant drag on touch - no delay
          enableMouseEvents: false,
          ignoreContextMenu: true,
          touchSlop: 0, // Minimum distance before drag starts - set to 0 for instant response
        },
        preview: true,
        transition: TouchTransition,
      },
    ],
  };

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className="min-h-screen flex flex-col bg-white">
        {/* Main content area with canvas */}
        <div className="flex-1 flex relative overflow-hidden">
          {/* Collapsible Left Panel - overlays with high z-index */}
          <LeftPanel
            captions={gameState.captions}
            onSettings={handleSettings}
            onDictionary={() => setShowDictionary(true)}
            onTogglePinyin={togglePinyin}
            onToggleEnglish={toggleEnglish}
            onTogglePortuguese={togglePortuguese}
            onToggleSound={toggleSound}
            isCollapsed={leftPanelCollapsed}
            onToggleCollapse={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            gameMode={gameState.gameMode}
            onGameModeChange={handleGameModeChange}
            isTimedModeActive={gameState.timedMode.isActive}
          />

          <Canvas
            canvasCards={gameState.canvasCards}
            captions={gameState.captions}
            knownWords={gameState.knownWords}
            progressCurrent={gameState.knownWords.length}
            progressTotal={
              activeDictionariesData.targetWords.length
            }
            targetWords={activeDictionariesData.targetWords}
            hanziPinyin={activeDictionariesData.hanziPinyin}
            hanziEnglish={activeDictionariesData.hanziEnglish}
            hanziPortuguese={
              activeDictionariesData.hanziPortuguese
            }
            currentLevels={gameState.currentLevels}
            activeDictionaries={gameState.dictionaries.filter(
              (d) => d.isActive,
            )}
            onDropCard={handleDropCard}
            onMoveCard={moveCardOnCanvas}
            onNewWord={handleNewWord}
            onRemoveCard={removeCardFromCanvas}
            onClearCanvas={clearCanvas}
            gameMode={gameState.gameMode}
            timedMode={gameState.timedMode}
          />

          {/* Timed Mode Timer */}
          {gameState.gameMode === 'timed' && gameState.timedMode.isActive && (
            <TimedModeTimer
              durationMinutes={gameState.timedMode.durationMinutes}
              timeRemainingMs={gameState.timedMode.timeRemainingMs}
              score={gameState.timedMode.score}
              possibleWords={gameState.timedMode.possibleWords}
              onTimeUp={handleTimedModeEnd}
              onStopSession={handleTimedModeEnd}
              systemLanguage={gameState.captions.systemLanguage}
            />
          )}

          {/* Floating Dictionary Button */}
          <FloatingDictionaryButton
            onClick={() => setShowDictionary(true)}
            isTimedMode={gameState.gameMode === 'timed' && gameState.timedMode.isActive}
            systemLanguage={gameState.captions.systemLanguage}
          />
        </div>

        {/* Horizontal Bottom Panel - show timed mode cards or normal dictionary */}
        <RightPanel
          captions={gameState.captions}
          knownWords={gameState.knownWords}
          showIndividualWords={showIndividualWords}
          levelHanzi={
            gameState.gameMode === 'timed' && gameState.timedMode.isActive
              ? gameState.timedMode.availableCards
              : activeDictionariesData.level1Hanzi
          }
          hanziPinyin={activeDictionariesData.hanziPinyin}
          hanziEnglish={activeDictionariesData.hanziEnglish}
          hanziPortuguese={
            activeDictionariesData.hanziPortuguese
          }
          onToggleIndividualWords={() =>
            setShowIndividualWords(!showIndividualWords)
          }
          isTimedMode={gameState.gameMode === 'timed' && gameState.timedMode.isActive}
          onDrawCard={drawCard}
        />

        <WelcomeDialog
          isOpen={showWelcome}
          onClose={handleCloseWelcome}
          systemLanguage={gameState.captions.systemLanguage}
        />

        <CelebrationModal
          isOpen={showCelebration}
          word={celebrationWord}
          onClose={handleCloseCelebration}
          systemLanguage={gameState.captions.systemLanguage}
        />

        <LevelProgressModal
          isOpen={showLevelProgress}
          dictionaryName={levelUpInfo?.dictionaryName || ""}
          newLevel={levelUpInfo?.level || 1}
          onClose={handleCloseLevelProgress}
          systemLanguage={gameState.captions.systemLanguage}
        />

        <DictionaryModal
          isOpen={showDictionary}
          onClose={() => setShowDictionary(false)}
          targetWords={activeDictionariesData.targetWords}
          activeDictionaries={gameState.dictionaries.filter(d => d.isActive)}
          currentLevels={gameState.currentLevels}
          systemLanguage={gameState.captions.systemLanguage}
        />

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          dictionaries={gameState.dictionaries}
          systemLanguage={gameState.captions.systemLanguage}
          onToggleDictionary={handleToggleDictionary}
          onAddDictionary={handleAddDictionary}
          onRemoveDictionary={handleRemoveDictionary}
          onResetProgress={handleResetProgress}
          onSetSystemLanguage={setSystemLanguage}
        />

        <TimeSelectionDialog
          isOpen={showTimeSelection}
          onStart={handleStartTimedMode}
          onCancel={() => {
            setShowTimeSelection(false);
            setGameMode('free'); // Revert to free mode if cancelled
          }}
          systemLanguage={gameState.captions.systemLanguage}
        />

        <TimedModeResultsModal
          isOpen={showTimedResults}
          score={gameState.timedMode.score}
          durationMinutes={gameState.timedMode.durationMinutes}
          discoveredWords={gameState.timedMode.discoveredWords}
          possibleWords={gameState.timedMode.possibleWords}
          hasMoreLevelsToUnlock={hasMoreLevelsToUnlock}
          onPlayAgain={handleTimedModePlayAgain}
          onBackToFree={handleBackToFreeMode}
          systemLanguage={gameState.captions.systemLanguage}
        />

        <FloatingBonusIndicator
          show={bonusIndicator.show}
          x={bonusIndicator.x}
          y={bonusIndicator.y}
          onComplete={() => setBonusIndicator({ show: false, x: 0, y: 0 })}
        />

        <Toaster />
      </div>
    </DndProvider>
  );
}