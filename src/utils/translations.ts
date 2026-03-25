export type SystemLanguage = 'en' | 'pt';

export interface Translations {
  // Welcome Dialog
  welcome: {
    title: string;
    subtitle: string;
    gameModes: string;
    freeLearning: {
      title: string;
      description: string;
      unlockInfo: string;
    };
    trialByTime: {
      title: string;
      description: string;
      bonusInfo: string;
    };
    customDictionaries: {
      title: string;
      description: string;
    };
    quickStart: {
      title: string;
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
    };
    letsPlay: string;
  };

  // Left Panel
  leftPanel: {
    settings: string;
    dictionary: string;
    captions: string;
    pinyin: string;
    english: string;
    portuguese: string;
    sound: string;
    gameMode: string;
    freeLearning: string;
    trialByTime: string;
  };

  // Canvas
  canvas: {
    clearCanvas: string;
    progress: string;
    of: string;
    words: string;
    discovered: string;
  };

  // Right Panel
  rightPanel: {
    levelHanzi: string;
    discoveredWords: string;
    drawCard: string;
    cardsRemaining: string;
  };

  // Celebration Modal
  celebration: {
    title: string;
    youDiscovered: string;
    pinyin: string;
    english: string;
    portuguese: string;
    awesome: string;
    keepGoing: string;
  };

  // Level Progress Modal
  levelProgress: {
    levelUp: string;
    level: string;
    newHanziUnlocked: string;
    keepExploring: string;
  };

  // Dictionary Modal
  dictionaryModal: {
    title: string;
    subtitle: string;
    currentLevel: string;
    level: string;
    targetWords: string;
    hanziCharacters: string;
    pinyin: string;
    english: string;
    portuguese: string;
    close: string;
  };

  // Settings Modal
  settings: {
    title: string;
    subtitle: string;
    systemLanguage: {
      title: string;
      description: string;
      english: string;
      portuguese: string;
    };
    myDictionaries: string;
    active: string;
    on: string;
    off: string;
    default: string;
    hanzi: string;
    targetWords: string;
    atLeastOne: string;
    importDictionary: string;
    selectFile: string;
    import: string;
    selected: string;
    formatTitle: string;
    gameSettings: string;
    resetProgress: {
      title: string;
      description: string;
      button: string;
    };
    deleteDialog: {
      title: string;
      description: string;
      warning: string;
      cancel: string;
      delete: string;
    };
    resetDialog: {
      title: string;
      description: string;
      warning: string;
      cancel: string;
      reset: string;
    };
  };

  // Time Selection Dialog
  timeSelection: {
    title: string;
    subtitle: string;
    selectDuration: string;
    minutes: string;
    startSession: string;
    cancel: string;
  };

  // Timed Mode Timer
  timedTimer: {
    timeRemaining: string;
    score: string;
    stopSession: string;
  };

  // Timed Mode Results Modal
  timedResults: {
    timesUp: string;
    sessionComplete: string;
    wordsDiscovered: string;
    totalPossible: string;
    discoveredWordsList: string;
    noWords: string;
    tryAgain: string;
    unlockMore: string;
    playAgain: string;
    backToFree: string;
  };

  // Floating Dictionary Button
  floatingDictionary: {
    viewDictionary: string;
  };

  // Toast Messages
  toasts: {
    progressReset: {
      title: string;
      description: string;
    };
    dictionaryImported: {
      title: string;
      description: string;
    };
    importFailed: {
      title: string;
      description: string;
    };
    validationFailed: {
      title: string;
      description: string;
    };
    notEnoughHanzi: {
      title: string;
      description: string;
    };
    invalidJson: {
      title: string;
      description: string;
    };
  };
}

export const translations: Record<SystemLanguage, Translations> = {
  en: {
    welcome: {
      title: "Welcome to Hanzi Word Builder! 🎮",
      subtitle: "Learn Mandarin by building words with Chinese characters",
      gameModes: "Game Modes",
      freeLearning: {
        title: "Free Learning Mode",
        description: "Explore at your own pace! Drag hanzi cards onto the canvas and combine them to discover new words. Each valid word you create unlocks progress and new characters to learn.",
        unlockInfo: "Unlock new hanzi: Progress through levels by discovering words. Each level introduces new characters and expands your vocabulary!"
      },
      trialByTime: {
        title: "Trial by Time Mode",
        description: "Race against the clock! Create as many valid words as possible before time runs out. Each word you discover adds +3 seconds to your timer, keeping the challenge alive.",
        bonusInfo: "Bonus time: Every word discovered gives you 3 extra seconds. The more words you find, the longer you can play!"
      },
      customDictionaries: {
        title: "Custom Dictionaries",
        description: "Want to learn specific vocabulary? Upload your own custom dictionary in the Settings menu! Create personalized learning experiences tailored to your needs."
      },
      quickStart: {
        title: "Quick Start:",
        step1: "Drag hanzi cards from the bottom panel onto the canvas",
        step2: "Combine cards by dropping them on top of each other",
        step3: "Valid word combinations will trigger a celebration!",
        step4: "Discover words to unlock new levels and characters",
        step5: "Switch between Free Learning and Trial by Time in the left panel"
      },
      letsPlay: "Let's Play! 🚀"
    },
    leftPanel: {
      settings: "Settings",
      dictionary: "Dictionary",
      captions: "Captions",
      pinyin: "Pinyin",
      english: "English",
      portuguese: "Portuguese",
      sound: "Sound",
      gameMode: "Game Mode",
      freeLearning: "Free Learning",
      trialByTime: "Trial by Time"
    },
    canvas: {
      clearCanvas: "Clear Canvas",
      progress: "Progress",
      of: "of",
      words: "words",
      discovered: "discovered"
    },
    rightPanel: {
      levelHanzi: "Level Hanzi",
      discoveredWords: "Discovered Words",
      drawCard: "Draw Card",
      cardsRemaining: "cards remaining"
    },
    celebration: {
      title: "Match Found!",
      youDiscovered: "You discovered",
      pinyin: "Pinyin",
      english: "English",
      portuguese: "Portuguese",
      awesome: "Awesome!",
      keepGoing: "Keep Going!"
    },
    levelProgress: {
      levelUp: "Level Up!",
      level: "Level",
      newHanziUnlocked: "New hanzi unlocked! Keep exploring to discover more words.",
      keepExploring: "Keep Exploring"
    },
    dictionaryModal: {
      title: "Dictionary",
      subtitle: "Browse all target words and hanzi characters",
      currentLevel: "Current Level",
      level: "Level",
      targetWords: "Target Words",
      hanziCharacters: "Hanzi Characters",
      pinyin: "Pinyin",
      english: "English",
      portuguese: "Portuguese",
      close: "Close"
    },
    settings: {
      title: "⚙️ Settings",
      subtitle: "Manage your dictionaries and game preferences",
      systemLanguage: {
        title: "🌐 System Language",
        description: "Choose your preferred language for the game interface",
        english: "English (US)",
        portuguese: "Português (BR)"
      },
      myDictionaries: "📚 My Dictionaries",
      active: "Active",
      on: "On",
      off: "Off",
      default: "Default",
      hanzi: "hanzi characters",
      targetWords: "target words",
      atLeastOne: "At least one dictionary must be active",
      importDictionary: "Import Custom Dictionary",
      selectFile: "Select JSON Dictionary File",
      import: "Import",
      selected: "selected",
      formatTitle: "Dictionary Format",
      gameSettings: "🎮 Game Settings",
      resetProgress: {
        title: "Reset Progress",
        description: "Clear all discovered words and level progress. Custom dictionaries will be preserved.",
        button: "Reset All Progress"
      },
      deleteDialog: {
        title: "Delete Dictionary?",
        description: "Are you sure you want to delete the",
        warning: "This action cannot be undone.",
        cancel: "Cancel",
        delete: "Delete Dictionary"
      },
      resetDialog: {
        title: "Reset All Progress?",
        description: "This will clear all known words and current level progress for all dictionaries. Custom dictionaries will be preserved, but your progress will be reset to Level 1.",
        warning: "This action cannot be undone.",
        cancel: "Cancel",
        reset: "Reset Progress"
      }
    },
    timeSelection: {
      title: "⏱️ Trial by Time",
      subtitle: "How long do you want to play?",
      selectDuration: "Select Duration",
      minutes: "minutes",
      startSession: "Start Session",
      cancel: "Cancel"
    },
    timedTimer: {
      timeRemaining: "Time Remaining",
      score: "Score",
      stopSession: "Stop Session"
    },
    timedResults: {
      timesUp: "⏰ Time's Up!",
      sessionComplete: "Session Complete",
      wordsDiscovered: "Words Discovered",
      totalPossible: "Total Possible",
      discoveredWordsList: "Words You Discovered:",
      noWords: "No words discovered yet. Try again!",
      tryAgain: "Keep playing to unlock more levels and hanzi in Free Learning mode!",
      unlockMore: "Unlock more levels to discover additional words!",
      playAgain: "Play Again",
      backToFree: "Back to Free Learning"
    },
    floatingDictionary: {
      viewDictionary: "View Dictionary"
    },
    toasts: {
      progressReset: {
        title: "Progress Reset",
        description: "All progress has been cleared. You are back to level 1."
      },
      dictionaryImported: {
        title: "Dictionary Imported Successfully!",
        description: "has been added to your collection."
      },
      importFailed: {
        title: "Import Failed",
        description: "The file contains invalid JSON format."
      },
      validationFailed: {
        title: "Validation Failed",
        description: "validation error(s). Check the error messages below."
      },
      notEnoughHanzi: {
        title: "Not Enough Hanzi Available",
        description: "You need at least 10 hanzi unlocked to play Trial by Time mode."
      },
      invalidJson: {
        title: "Invalid JSON",
        description: "Please select a valid JSON file"
      }
    }
  },
  pt: {
    welcome: {
      title: "Bem-vindo ao Hanzi Word Builder! 🎮",
      subtitle: "Aprenda Mandarim construindo palavras com caracteres chineses",
      gameModes: "Modos de Jogo",
      freeLearning: {
        title: "Modo Aprendizado Livre",
        description: "Explore no seu próprio ritmo! Arraste cartões hanzi para a tela e combine-os para descobrir novas palavras. Cada palavra válida que você criar desbloqueia progresso e novos caracteres para aprender.",
        unlockInfo: "Desbloqueie novos hanzi: Progrida através dos níveis descobrindo palavras. Cada nível introduz novos caracteres e expande seu vocabulário!"
      },
      trialByTime: {
        title: "Modo Desafio Contra o Tempo",
        description: "Corra contra o relógio! Crie o máximo de palavras válidas possível antes que o tempo acabe. Cada palavra que você descobrir adiciona +3 segundos ao seu temporizador, mantendo o desafio vivo.",
        bonusInfo: "Tempo bônus: Cada palavra descoberta dá 3 segundos extras. Quanto mais palavras você encontrar, mais tempo terá para jogar!"
      },
      customDictionaries: {
        title: "Dicionários Personalizados",
        description: "Quer aprender vocabulário específico? Carregue seu próprio dicionário personalizado no menu Configurações! Crie experiências de aprendizado personalizadas adaptadas às suas necessidades."
      },
      quickStart: {
        title: "Início Rápido:",
        step1: "Arraste cartões hanzi do painel inferior para a tela",
        step2: "Combine cartões soltando-os um sobre o outro",
        step3: "Combinações de palavras válidas acionarão uma celebração!",
        step4: "Descubra palavras para desbloquear novos níveis e caracteres",
        step5: "Alterne entre Aprendizado Livre e Desafio Contra o Tempo no painel esquerdo"
      },
      letsPlay: "Vamos Jogar! 🚀"
    },
    leftPanel: {
      settings: "Configurações",
      dictionary: "Dicionário",
      captions: "Legendas",
      pinyin: "Pinyin",
      english: "Inglês",
      portuguese: "Português",
      sound: "Som",
      gameMode: "Modo de Jogo",
      freeLearning: "Aprendizado Livre",
      trialByTime: "Desafio Contra o Tempo"
    },
    canvas: {
      clearCanvas: "Limpar Tela",
      progress: "Progresso",
      of: "de",
      words: "palavras",
      discovered: "descobertas"
    },
    rightPanel: {
      levelHanzi: "Hanzi do Nível",
      discoveredWords: "Palavras Descobertas",
      drawCard: "Puxar Carta",
      cardsRemaining: "cartas restantes"
    },
    celebration: {
      title: "Palavra Encontrada!",
      youDiscovered: "Você descobriu",
      pinyin: "Pinyin",
      english: "Inglês",
      portuguese: "Português",
      awesome: "Incrível!",
      keepGoing: "Continue Assim!"
    },
    levelProgress: {
      levelUp: "Subiu de Nível!",
      level: "Nível",
      newHanziUnlocked: "Novos hanzi desbloqueados! Continue explorando para descobrir mais palavras.",
      keepExploring: "Continue Explorando"
    },
    dictionaryModal: {
      title: "Dicionário",
      subtitle: "Navegue por todas as palavras-alvo e caracteres hanzi",
      currentLevel: "Nível Atual",
      level: "Nível",
      targetWords: "Palavras-Alvo",
      hanziCharacters: "Caracteres Hanzi",
      pinyin: "Pinyin",
      english: "Inglês",
      portuguese: "Português",
      close: "Fechar"
    },
    settings: {
      title: "⚙️ Configurações",
      subtitle: "Gerencie seus dicionários e preferências do jogo",
      systemLanguage: {
        title: "🌐 Idioma do Sistema",
        description: "Escolha seu idioma preferido para a interface do jogo",
        english: "English (US)",
        portuguese: "Português (BR)"
      },
      myDictionaries: "📚 Meus Dicionários",
      active: "Ativo",
      on: "Ligado",
      off: "Desligado",
      default: "Padrão",
      hanzi: "caracteres hanzi",
      targetWords: "palavras-alvo",
      atLeastOne: "Pelo menos um dicionário deve estar ativo",
      importDictionary: "Importar Dicionário Personalizado",
      selectFile: "Selecionar Arquivo JSON de Dicionário",
      import: "Importar",
      selected: "selecionado",
      formatTitle: "Formato do Dicionário",
      gameSettings: "🎮 Configurações do Jogo",
      resetProgress: {
        title: "Resetar Progresso",
        description: "Limpar todas as palavras descobertas e progresso de nível. Dicionários personalizados serão preservados.",
        button: "Resetar Todo o Progresso"
      },
      deleteDialog: {
        title: "Excluir Dicionário?",
        description: "Tem certeza que deseja excluir o dicionário",
        warning: "Esta ação não pode ser desfeita.",
        cancel: "Cancelar",
        delete: "Excluir Dicionário"
      },
      resetDialog: {
        title: "Resetar Todo o Progresso?",
        description: "Isso limpará todas as palavras conhecidas e progresso de nível atual para todos os dicionários. Dicionários personalizados serão preservados, mas seu progresso será resetado para o Nível 1.",
        warning: "Esta ação não pode ser desfeita.",
        cancel: "Cancelar",
        reset: "Resetar Progresso"
      }
    },
    timeSelection: {
      title: "⏱️ Desafio Contra o Tempo",
      subtitle: "Por quanto tempo você quer jogar?",
      selectDuration: "Selecionar Duração",
      minutes: "minutos",
      startSession: "Iniciar Sessão",
      cancel: "Cancelar"
    },
    timedTimer: {
      timeRemaining: "Tempo Restante",
      score: "Pontuação",
      stopSession: "Parar Sessão"
    },
    timedResults: {
      timesUp: "⏰ Tempo Esgotado!",
      sessionComplete: "Sessão Completa",
      wordsDiscovered: "Palavras Descobertas",
      totalPossible: "Total Possível",
      discoveredWordsList: "Palavras Que Você Descobriu:",
      noWords: "Nenhuma palavra descoberta ainda. Tente novamente!",
      tryAgain: "Continue jogando para desbloquear mais níveis e hanzi no modo Aprendizado Livre!",
      unlockMore: "Desbloqueie mais níveis para descobrir palavras adicionais!",
      playAgain: "Jogar Novamente",
      backToFree: "Voltar ao Aprendizado Livre"
    },
    floatingDictionary: {
      viewDictionary: "Ver Dicionário"
    },
    toasts: {
      progressReset: {
        title: "Progresso Resetado",
        description: "Todo o progresso foi limpo. Você voltou ao nível 1."
      },
      dictionaryImported: {
        title: "Dicionário Importado com Sucesso!",
        description: "foi adicionado à sua coleção."
      },
      importFailed: {
        title: "Importação Falhou",
        description: "O arquivo contém formato JSON inválido."
      },
      validationFailed: {
        title: "Validação Falhou",
        description: "erro(s) de validação. Verifique as mensagens de erro abaixo."
      },
      notEnoughHanzi: {
        title: "Hanzi Insuficientes Disponíveis",
        description: "Você precisa de pelo menos 10 hanzi desbloqueados para jogar o modo Desafio Contra o Tempo."
      },
      invalidJson: {
        title: "JSON Inválido",
        description: "Por favor, selecione um arquivo JSON válido"
      }
    }
  }
};

export function getTranslation(language: SystemLanguage): Translations {
  return translations[language];
}
