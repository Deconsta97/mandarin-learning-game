import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Settings, X, Clock, BookOpen } from "lucide-react";
import { CaptionSettings, SystemLanguage } from "../types/game";
import { getTranslation } from "../utils/translations";

interface LeftPanelProps {
  captions: CaptionSettings;
  onSettings: () => void;
  onDictionary: () => void;
  onTogglePinyin: () => void;
  onToggleEnglish: () => void;
  onTogglePortuguese: () => void;
  onToggleSound: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  gameMode: "free" | "timed";
  onGameModeChange: (mode: "free" | "timed") => void;
  isTimedModeActive: boolean;
}

export function LeftPanel({
  captions,
  onSettings,
  onDictionary,
  onTogglePinyin,
  onToggleEnglish,
  onTogglePortuguese,
  onToggleSound,
  isCollapsed,
  onToggleCollapse,
  gameMode,
  onGameModeChange,
  isTimedModeActive,
}: LeftPanelProps) {
  const t = getTranslation(captions.systemLanguage);
  
  return (
    <>
      {/* Collapsed state - show expand button */}
      {isCollapsed && (
        <button
          onClick={onToggleCollapse}
          className="fixed top-4 left-4 z-50 bg-white border-2 border-gray-300 rounded-md p-2 hover:bg-gray-50 shadow-lg"
          aria-label="Expand panel"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Overlay backdrop when expanded */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onToggleCollapse}
        />
      )}

      {/* Panel */}
      <div
        className={`
          fixed top-0 left-0 h-full z-50 bg-gray-100 border-r border-gray-300 p-4 space-y-3
          transition-transform duration-300 ease-in-out
          ${isCollapsed ? "-translate-x-full" : "translate-x-0"}
          w-auto min-w-48 max-w-xs
        `}
      >
        {/* Collapse button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={onToggleCollapse}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded p-1"
            aria-label="Collapse panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Button
          variant="outline"
          className="w-full justify-start whitespace-nowrap"
          onClick={onSettings}
        >
          ⚙️ {t.leftPanel.settings}
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start whitespace-nowrap"
          onClick={onDictionary}
        >
          📚 {t.leftPanel.dictionary}
        </Button>

        <Separator />

        {/* Game Mode Section */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 mb-3">
            {t.leftPanel.gameMode}
          </div>

          <Button
            variant={
              gameMode === "free" && !isTimedModeActive
                ? "default"
                : "outline"
            }
            className="w-full justify-start whitespace-nowrap"
            onClick={() =>
              !isTimedModeActive && onGameModeChange("free")
            }
            disabled={isTimedModeActive}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {t.leftPanel.freeLearning}
          </Button>

          <Button
            variant={
              gameMode === "timed" && !isTimedModeActive
                ? "default"
                : "outline"
            }
            className="w-full justify-start whitespace-nowrap"
            onClick={() =>
              !isTimedModeActive && onGameModeChange("timed")
            }
            disabled={isTimedModeActive}
          >
            <Clock className="w-4 h-4 mr-2" />
            {t.leftPanel.trialByTime}
          </Button>

          {isTimedModeActive && (
            <div className="text-xs text-amber-600 mt-1 px-1">
              ⚠️ {captions.systemLanguage === 'pt' ? 'Termine a sessão atual primeiro' : 'Finish current session first'}
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <Button
            variant={
              captions.soundEnabled ? "default" : "outline"
            }
            className="w-full justify-start whitespace-nowrap"
            onClick={onToggleSound}
          >
            {captions.soundEnabled ? "🔊" : "🔇"} {t.leftPanel.sound}
          </Button>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 mb-3">
            {t.leftPanel.captions}
          </div>

          <Button
            variant={
              captions.showPinyin ? "default" : "outline"
            }
            className="w-full justify-start whitespace-nowrap"
            onClick={onTogglePinyin}
          >
            🔤 {t.leftPanel.pinyin}
          </Button>

          <Button
            variant={
              captions.showEnglish ? "default" : "outline"
            }
            className="w-full justify-start whitespace-nowrap"
            onClick={onToggleEnglish}
          >
            🇺🇸 {t.leftPanel.english}
          </Button>

          <Button
            variant={
              captions.showPortuguese ? "default" : "outline"
            }
            className="w-full justify-start whitespace-nowrap"
            onClick={onTogglePortuguese}
          >
            🇧🇷 {t.leftPanel.portuguese}
          </Button>
        </div>

        <div className="text-xs text-gray-400 mt-4">
          {captions.systemLanguage === 'pt' 
            ? '* Dicionário e modal de nova palavra sempre mostram informação completa'
            : '* Dictionary & New word modal always show full info'}
        </div>
      </div>
    </>
  );
}