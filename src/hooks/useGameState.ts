import { useState, useEffect } from 'react';
import { GameState, Word, HanziCard, CaptionSettings, Dictionary, DEFAULT_DICTIONARY, STORAGE_KEYS } from '../types/game';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    currentLevels: {},
    knownWords: [],
    captions: {
      showPinyin: true,
      showEnglish: true,
      showPortuguese: false,
      soundEnabled: true,
      systemLanguage: 'en' as const
    },
    canvasCards: [
      { id: 'initial-1', hanzi: '我', x: 100, y: 150, isOnCanvas: true },
      { id: 'initial-2', hanzi: '们', x: 250, y: 150, isOnCanvas: true }
    ],
    dictionaries: [DEFAULT_DICTIONARY],
    gameMode: 'free',
    timedMode: {
      isActive: false,
      durationMinutes: 0,
      timeRemainingMs: 0,
      startTime: null,
      availableCards: [],
      hanziPool: [],
      removedCards: [],
      score: 0,
      discoveredWords: [],
      possibleWords: []
    }
  });

  // Migration function to convert old dictionary format to new format
  const migrateDictionary = (oldDict: any): Dictionary => {
    // If it's already in the new format with progress, return as is
    if (oldDict.hanzi && typeof oldDict.hanzi === 'object' && !Array.isArray(oldDict.hanzi) && oldDict.progress) {
      return oldDict;
    }

    // If it's the old default dictionary, replace with new one
    if (oldDict.id === 'default' && oldDict.isDefault) {
      return {
        ...DEFAULT_DICTIONARY,
        isActive: oldDict.isActive
      };
    }

    // If it's new format but no progress (user-imported dictionary), add simple progress
    if (oldDict.hanzi && typeof oldDict.hanzi === 'object' && !Array.isArray(oldDict.hanzi) && !oldDict.progress) {
      return {
        ...oldDict,
        progress: {
          advanceRule: "5_words_or_all_combos" as const,
          levels: [
            {
              id: 1,
              hanzi: Object.keys(oldDict.hanzi),
              notes: "All hanzi available",
              availableExamples: Object.keys(oldDict.targetWords || {})
            }
          ]
        }
      };
    }

    // Convert old format to new format (legacy support)
    const newDict: Dictionary = {
      id: oldDict.id,
      name: oldDict.name,
      description: oldDict.description,
      isActive: oldDict.isActive,
      isDefault: oldDict.isDefault,
      hanzi: {},
      targetWords: {},
      progress: {
        advanceRule: "5_words_or_all_combos",
        levels: [
          {
            id: 1,
            hanzi: [],
            notes: "Migrated from old format",
            availableExamples: []
          }
        ]
      }
    };

    // Convert level1Hanzi array and separate translation objects to combined hanzi object
    if (oldDict.level1Hanzi) {
      newDict.progress!.levels[0].hanzi = [...oldDict.level1Hanzi];
      
      oldDict.level1Hanzi.forEach((hanzi: string) => {
        newDict.hanzi[hanzi] = {
          pinyin: oldDict.hanziPinyin?.[hanzi] || hanzi,
          en: oldDict.hanziEnglish?.[hanzi] || hanzi,
          pt: oldDict.hanziPortuguese?.[hanzi] || hanzi
        };
      });
    }

    // Convert targetWords array to object
    if (oldDict.targetWords && Array.isArray(oldDict.targetWords)) {
      oldDict.targetWords.forEach((word: any) => {
        newDict.targetWords[word.hanzi] = {
          pinyin: word.pinyin,
          en: word.en,
          pt: word.pt
        };
      });
      
      newDict.progress!.levels[0].availableExamples = Object.keys(newDict.targetWords);
    }

    return newDict;
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedLevel = localStorage.getItem(STORAGE_KEYS.level);
    const savedCurrentLevels = localStorage.getItem(STORAGE_KEYS.currentLevels);
    const savedKnownWords = localStorage.getItem(STORAGE_KEYS.knownWords);
    const savedCaptions = localStorage.getItem(STORAGE_KEYS.captions);
    const savedDictionaries = localStorage.getItem(STORAGE_KEYS.dictionaries);
    const savedGameMode = localStorage.getItem(STORAGE_KEYS.gameMode);

    let dictionaries = [DEFAULT_DICTIONARY];
    if (savedDictionaries) {
      try {
        const parsed = JSON.parse(savedDictionaries);
        dictionaries = parsed.map((dict: any) => migrateDictionary(dict));
      } catch (error) {
        console.error('Error parsing saved dictionaries:', error);
        dictionaries = [DEFAULT_DICTIONARY];
      }
    }

    // Initialize currentLevels with defaults for each dictionary
    let currentLevels: Record<string, number> = {};
    dictionaries.forEach(dict => {
      currentLevels[dict.id] = 1;
    });

    if (savedCurrentLevels) {
      try {
        const parsed = JSON.parse(savedCurrentLevels);
        currentLevels = { ...currentLevels, ...parsed };
      } catch (error) {
        console.error('Error parsing saved current levels:', error);
      }
    }

    setGameState(prev => ({
      ...prev,
      level: savedLevel ? parseInt(savedLevel) : 1,
      currentLevels,
      knownWords: savedKnownWords ? JSON.parse(savedKnownWords) : [],
      captions: savedCaptions ? {
        ...JSON.parse(savedCaptions),
        // Ensure soundEnabled is set for existing saves that don't have this property
        soundEnabled: JSON.parse(savedCaptions).soundEnabled ?? true,
        // Ensure systemLanguage is set for existing saves that don't have this property
        systemLanguage: JSON.parse(savedCaptions).systemLanguage ?? 'en'
      } : {
        showPinyin: true,
        showEnglish: true,
        showPortuguese: false,
        soundEnabled: true,
        systemLanguage: 'en' as const
      },
      dictionaries,
      gameMode: (savedGameMode as 'free' | 'timed') || 'free'
    }));
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.level, gameState.level.toString());
    localStorage.setItem(STORAGE_KEYS.currentLevels, JSON.stringify(gameState.currentLevels));
    localStorage.setItem(STORAGE_KEYS.knownWords, JSON.stringify(gameState.knownWords));
    localStorage.setItem(STORAGE_KEYS.captions, JSON.stringify(gameState.captions));
    localStorage.setItem(STORAGE_KEYS.dictionaries, JSON.stringify(gameState.dictionaries));
    localStorage.setItem(STORAGE_KEYS.gameMode, gameState.gameMode);
  }, [gameState]);

  const addKnownWord = (word: Word, onLevelUp?: (dictionaryName: string, newLevel: number) => void) => {
    setGameState(prev => {
      const newKnownWords = [...prev.knownWords, word];
      const newCurrentLevels = { ...prev.currentLevels };
      
      // Check level progression for each active dictionary
      prev.dictionaries.forEach(dict => {
        if (!dict.isActive || !dict.progress) return;
        
        const currentLevel = newCurrentLevels[dict.id] || 1;
        const maxLevel = dict.progress.levels.length;
        
        if (currentLevel < maxLevel) {
          // Get words discoverable up to current level
          const availableHanzi = getAvailableHanziForLevel(dict, currentLevel);
          const possibleWords = Object.keys(dict.targetWords).filter(wordHanzi => {
            return wordHanzi.split('').every(hanzi => availableHanzi.includes(hanzi));
          });
          
          // Count discovered words from this dictionary at current level
          const discoveredWords = newKnownWords.filter(kw => possibleWords.includes(kw.hanzi));
          
          // Check if should advance level
          const shouldAdvance = checkLevelAdvancement(dict, currentLevel, newKnownWords);
          
          if (shouldAdvance) {
            const newLevel = currentLevel + 1;
            newCurrentLevels[dict.id] = newLevel;
            
            // Trigger level up callback
            if (onLevelUp) {
              setTimeout(() => onLevelUp(dict.name, newLevel), 1000); // Delay to show after word celebration
            }
          }
        }
      });
      
      return {
        ...prev,
        knownWords: newKnownWords,
        currentLevels: newCurrentLevels
      };
    });
  };

  // Helper function to get available hanzi up to a specific level
  const getAvailableHanziForLevel = (dict: Dictionary, level: number): string[] => {
    if (!dict.progress) return Object.keys(dict.hanzi);
    
    const availableHanzi: string[] = [];
    for (let i = 0; i < level && i < dict.progress.levels.length; i++) {
      availableHanzi.push(...dict.progress.levels[i].hanzi);
    }
    return availableHanzi;
  };

  // Helper function to get discoverable target words for a specific level
  const getDiscoverableTargetWordsForLevel = (dict: Dictionary, level: number): string[] => {
    if (!dict.progress || level > dict.progress.levels.length) return [];
    
    const currentLevelData = dict.progress.levels[level - 1];
    return currentLevelData.availableExamples || [];
  };

  // Helper function to check if level should advance based on discovered target words
  const checkLevelAdvancement = (dict: Dictionary, currentLevel: number, knownWords: Word[]): boolean => {
    if (!dict.progress || currentLevel >= dict.progress.levels.length) return false;
    
    const discoverableWords = getDiscoverableTargetWordsForLevel(dict, currentLevel);
    const discoveredWords = knownWords.filter(word => discoverableWords.includes(word.hanzi));
    
    // Level up when all discoverable target words for this level are found
    return discoveredWords.length >= discoverableWords.length;
  };

  const togglePinyin = () => {
    setGameState(prev => ({
      ...prev,
      captions: { ...prev.captions, showPinyin: !prev.captions.showPinyin }
    }));
  };

  const toggleEnglish = () => {
    setGameState(prev => ({
      ...prev,
      captions: { ...prev.captions, showEnglish: !prev.captions.showEnglish }
    }));
  };

  const togglePortuguese = () => {
    setGameState(prev => ({
      ...prev,
      captions: { ...prev.captions, showPortuguese: !prev.captions.showPortuguese }
    }));
  };

  const toggleSound = () => {
    setGameState(prev => ({
      ...prev,
      captions: { ...prev.captions, soundEnabled: !prev.captions.soundEnabled }
    }));
  };

  const setSystemLanguage = (language: 'en' | 'pt') => {
    setGameState(prev => ({
      ...prev,
      captions: { ...prev.captions, systemLanguage: language }
    }));
  };

  const clearCanvas = () => {
    setGameState(prev => ({
      ...prev,
      canvasCards: []
    }));
  };

  const addCardToCanvas = (hanzi: string, x: number, y: number, word?: Word) => {
    const newCard: HanziCard = {
      id: `card-${Date.now()}-${Math.random()}`,
      hanzi,
      x,
      y,
      isOnCanvas: true,
      word
    };

    setGameState(prev => ({
      ...prev,
      canvasCards: [...prev.canvasCards, newCard]
    }));
  };

  const removeCardFromCanvas = (cardId: string) => {
    setGameState(prev => ({
      ...prev,
      canvasCards: prev.canvasCards.filter(card => card.id !== cardId)
    }));
  };

  const moveCardOnCanvas = (cardId: string, x: number, y: number) => {
    setGameState(prev => ({
      ...prev,
      canvasCards: prev.canvasCards.map(card => 
        card.id === cardId ? { ...card, x, y } : card
      )
    }));
  };

  const addDictionary = (dictionary: Dictionary) => {
    setGameState(prev => {
      // Make dictionaries mutually exclusive - deactivate all others and clear progress
      const updatedDictionaries = prev.dictionaries.map(dict => ({
        ...dict,
        isActive: false
      }));
      
      // Apply migration to new dictionary to ensure it has progress structure
      const migratedDictionary = migrateDictionary(dictionary);
      
      // Add new dictionary as the only active one
      const newDictionaries = [...updatedDictionaries, migratedDictionary];
      
      // Clear all progress and reset to level 1 for all dictionaries
      const newCurrentLevels: Record<string, number> = {};
      newDictionaries.forEach(dict => {
        newCurrentLevels[dict.id] = 1;
      });
      
      return {
        ...prev,
        dictionaries: newDictionaries,
        currentLevels: newCurrentLevels,
        knownWords: [], // Clear all known words
        canvasCards: [] // Clear canvas
      };
    });
  };

  const toggleDictionary = (dictionaryId: string) => {
    setGameState(prev => {
      const targetDict = prev.dictionaries.find(d => d.id === dictionaryId);
      if (!targetDict) return prev;
      
      // If trying to activate a dictionary, make it mutually exclusive
      if (!targetDict.isActive) {
        // Deactivate all others and clear progress
        const updatedDictionaries = prev.dictionaries.map(dict => ({
          ...dict,
          isActive: dict.id === dictionaryId
        }));
        
        // Clear all progress when switching dictionaries
        const newCurrentLevels: Record<string, number> = {};
        updatedDictionaries.forEach(dict => {
          newCurrentLevels[dict.id] = 1;
        });
        
        return {
          ...prev,
          dictionaries: updatedDictionaries,
          currentLevels: newCurrentLevels,
          knownWords: [], // Clear all known words
          canvasCards: [] // Clear canvas
        };
      }
      
      // Prevent turning off the last active dictionary
      const activeDictionaries = prev.dictionaries.filter(d => d.isActive);
      if (activeDictionaries.length === 1 && activeDictionaries[0].id === dictionaryId) {
        return prev;
      }

      return prev; // Don't allow deactivating if there's only one active
    });
  };

  const removeDictionary = (dictionaryId: string) => {
    setGameState(prev => {
      // Prevent removing default dictionary
      const dictionaryToRemove = prev.dictionaries.find(d => d.id === dictionaryId);
      if (dictionaryToRemove?.isDefault) {
        return prev;
      }

      const remainingDictionaries = prev.dictionaries.filter(dict => dict.id !== dictionaryId);
      
      // Ensure at least one dictionary remains active
      const activeRemaining = remainingDictionaries.filter(d => d.isActive);
      if (activeRemaining.length === 0) {
        // Activate the first remaining dictionary (which should be default)
        remainingDictionaries[0] = { ...remainingDictionaries[0], isActive: true };
      }

      return {
        ...prev,
        dictionaries: remainingDictionaries
      };
    });
  };

  // Helper function to reset progress
  const resetProgress = () => {
    setGameState(prev => {
      const newCurrentLevels: Record<string, number> = {};
      prev.dictionaries.forEach(dict => {
        newCurrentLevels[dict.id] = 1;
      });
      
      return {
        ...prev,
        level: 1,
        currentLevels: newCurrentLevels,
        knownWords: [],
        canvasCards: [],
        gameMode: 'free', // Reset to free mode
        timedMode: {
          isActive: false,
          durationMinutes: 0,
          timeRemainingMs: 0,
          startTime: null,
          availableCards: [],
          hanziPool: [],
          removedCards: [],
          score: 0,
          discoveredWords: [],
          possibleWords: []
        }
      };
    });
  };

  const getActiveDictionariesData = () => {
    const activeDictionaries = gameState.dictionaries.filter(d => d.isActive);
    
    const combined = {
      level1Hanzi: [] as string[],
      hanziPinyin: {} as Record<string, string>,
      hanziEnglish: {} as Record<string, string>,
      hanziPortuguese: {} as Record<string, string>,
      targetWords: [] as Word[]
    };

    activeDictionaries.forEach(dict => {
      // Get available hanzi based on current level for this dictionary
      const currentLevel = gameState.currentLevels[dict.id] || 1;
      const availableHanzi = getAvailableHanziForLevel(dict, currentLevel);
      
      combined.level1Hanzi.push(...availableHanzi);
      
      // Transform new format to legacy format for compatibility - only for available hanzi
      availableHanzi.forEach(hanzi => {
        const info = dict.hanzi[hanzi];
        if (info) {
          combined.hanziPinyin[hanzi] = info.pinyin;
          combined.hanziEnglish[hanzi] = info.en;
          combined.hanziPortuguese[hanzi] = info.pt;
        }
      });
      
      // Transform targetWords from new format to legacy format - only words that can be formed with available hanzi
      Object.entries(dict.targetWords).forEach(([hanzi, info]) => {
        const canForm = hanzi.split('').every(char => availableHanzi.includes(char));
        if (canForm) {
          combined.targetWords.push({
            hanzi,
            pinyin: info.pinyin,
            en: info.en,
            pt: info.pt
          });
        }
      });
    });

    // Remove duplicates
    combined.level1Hanzi = [...new Set(combined.level1Hanzi)];
    combined.targetWords = combined.targetWords.filter((word, index, self) => 
      index === self.findIndex(w => w.hanzi === word.hanzi)
    );

    return combined;
  };

  const setGameMode = (mode: 'free' | 'timed') => {
    setGameState(prev => ({
      ...prev,
      gameMode: mode
    }));
  };

  const startTimedMode = (durationMinutes: number, hanziPool: string[]) => {
    const startTime = Date.now();
    
    // Pick 10 random cards from the pool
    const shuffled = [...hanziPool].sort(() => Math.random() - 0.5);
    const initialCards = shuffled.slice(0, Math.min(10, hanziPool.length));
    
    // Calculate all possible 2-hanzi words based on current levels
    const possibleWords: string[] = [];
    const activeDicts = gameState.dictionaries.filter(d => d.isActive);
    
    activeDicts.forEach(dict => {
      if (!dict.progress) return;
      const currentLevel = gameState.currentLevels[dict.id] || 1;
      
      // Get all availableExamples up to current level
      for (let i = 0; i < currentLevel && i < dict.progress.levels.length; i++) {
        const levelExamples = dict.progress.levels[i].availableExamples;
        // Only include 2-hanzi words
        const twoHanziWords = levelExamples.filter(word => word.length === 2);
        possibleWords.push(...twoHanziWords);
      }
    });
    
    // Remove duplicates
    const uniquePossibleWords = [...new Set(possibleWords)];
    
    setGameState(prev => ({
      ...prev,
      gameMode: 'timed',
      timedMode: {
        isActive: true,
        durationMinutes,
        timeRemainingMs: durationMinutes * 60 * 1000,
        startTime,
        availableCards: initialCards,
        hanziPool,
        removedCards: [],
        score: 0,
        discoveredWords: [],
        possibleWords: uniquePossibleWords
      },
      canvasCards: [] // Clear canvas for new round
    }));
  };

  const updateTimedModeTime = (timeRemainingMs: number) => {
    setGameState(prev => ({
      ...prev,
      timedMode: {
        ...prev.timedMode,
        timeRemainingMs
      }
    }));
  };

  const addTimedModeScore = (word: string, onComplete?: () => void) => {
    setGameState(prev => {
      const newDiscoveredWords = [...prev.timedMode.discoveredWords, word];
      const { possibleWords, timeRemainingMs, durationMinutes } = prev.timedMode;
      
      // Check if all possible words have been discovered with the new word added
      const isComplete = possibleWords.length > 0 && 
        possibleWords.every(w => newDiscoveredWords.includes(w));
      
      // Call completion callback if all words found
      if (isComplete && onComplete) {
        setTimeout(() => onComplete(), 100);
      }
      
      // Add 3 seconds bonus time for discovering a word
      const BONUS_TIME_MS = 3000; // 3 seconds
      const maxTimeMs = durationMinutes * 60 * 1000; // Don't exceed initial duration
      const newTimeRemaining = Math.min(timeRemainingMs + BONUS_TIME_MS, maxTimeMs);
      
      return {
        ...prev,
        timedMode: {
          ...prev.timedMode,
          score: prev.timedMode.score + 1,
          discoveredWords: newDiscoveredWords,
          timeRemainingMs: newTimeRemaining
        }
      };
    });
  };

  const endTimedMode = () => {
    setGameState(prev => ({
      ...prev,
      timedMode: {
        ...prev.timedMode,
        isActive: false
      }
    }));
  };

  const resetToFreeMode = () => {
    setGameState(prev => ({
      ...prev,
      gameMode: 'free',
      timedMode: {
        isActive: false,
        durationMinutes: 0,
        timeRemainingMs: 0,
        startTime: null,
        availableCards: [],
        hanziPool: [],
        removedCards: [],
        score: 0,
        discoveredWords: [],
        possibleWords: []
      },
      canvasCards: []
    }));
  };

  const drawCard = () => {
    setGameState(prev => {
      const { availableCards, hanziPool, removedCards } = prev.timedMode;
      
      // Create pool of cards not currently available (from hanziPool + removedCards)
      const unavailableCards = hanziPool.filter(h => !availableCards.includes(h));
      const drawableCards = [...unavailableCards, ...removedCards];
      
      if (drawableCards.length === 0 || availableCards.length === 0) {
        // No cards to draw or no cards to remove
        return prev;
      }
      
      // Pick a random card from drawable cards
      const randomIndex = Math.floor(Math.random() * drawableCards.length);
      const newCard = drawableCards[randomIndex];
      
      // Remove the last card from available cards
      const lastCard = availableCards[availableCards.length - 1];
      
      // Update available cards: add new card to beginning, remove last card
      const newAvailableCards = [newCard, ...availableCards.slice(0, -1)];
      
      // Update removed cards: add the removed card, remove the newly drawn card if it was there
      const newRemovedCards = removedCards.includes(newCard)
        ? removedCards.filter(c => c !== newCard)
        : removedCards;
      newRemovedCards.push(lastCard);
      
      return {
        ...prev,
        timedMode: {
          ...prev.timedMode,
          availableCards: newAvailableCards,
          removedCards: newRemovedCards
        }
      };
    });
  };

  const checkTimedModeCompletion = (): boolean => {
    const { possibleWords, discoveredWords } = gameState.timedMode;
    
    // If no possible words, not complete
    if (possibleWords.length === 0) return false;
    
    // Check if all possible words have been discovered
    return possibleWords.every(word => discoveredWords.includes(word));
  };

  return {
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
    getAvailableHanziForLevel,
    checkLevelAdvancement,
    setGameMode,
    startTimedMode,
    updateTimedModeTime,
    addTimedModeScore,
    endTimedMode,
    resetToFreeMode,
    drawCard,
    checkTimedModeCompletion
  };
}