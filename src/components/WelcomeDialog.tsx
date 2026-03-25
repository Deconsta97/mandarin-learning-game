import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Gamepad2, Clock, Trophy, Settings, Sparkles } from "lucide-react";
import { SystemLanguage } from "../types/game";
import { getTranslation } from "../utils/translations";

interface WelcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  systemLanguage: SystemLanguage;
}

export function WelcomeDialog({ isOpen, onClose, systemLanguage }: WelcomeDialogProps) {
  const t = getTranslation(systemLanguage);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center mb-2">
            {t.welcome.title}
          </DialogTitle>
          <DialogDescription className="text-base text-center">
            {t.welcome.subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Game Modes Section */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg">
              <Gamepad2 className="w-5 h-5 text-blue-600" />
              {t.welcome.gameModes}
            </h3>

            {/* Free Learning Mode */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">{t.welcome.freeLearning.title}</h4>
              </div>
              <p className="text-sm text-blue-800">
                {t.welcome.freeLearning.description}
              </p>
              <div className="flex items-start gap-2 mt-2 bg-blue-100 rounded p-2">
                <Trophy className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-900">
                  {t.welcome.freeLearning.unlockInfo}
                </p>
              </div>
            </div>

            {/* Trial by Time Mode */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold text-orange-900">{t.welcome.trialByTime.title}</h4>
              </div>
              <p className="text-sm text-orange-800">
                {t.welcome.trialByTime.description}
              </p>
              <div className="flex items-start gap-2 mt-2 bg-orange-100 rounded p-2">
                <Sparkles className="w-4 h-4 text-orange-700 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-orange-900">
                  {t.welcome.trialByTime.bonusInfo}
                </p>
              </div>
            </div>
          </div>

          {/* Custom Dictionary Section */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-purple-900">{t.welcome.customDictionaries.title}</h4>
            </div>
            <p className="text-sm text-purple-800">
              {t.welcome.customDictionaries.description}
            </p>
          </div>

          {/* How to Play */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">{t.welcome.quickStart.title}</h3>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>{t.welcome.quickStart.step1}</li>
              <li>{t.welcome.quickStart.step2}</li>
              <li>{t.welcome.quickStart.step3}</li>
              <li>{t.welcome.quickStart.step4}</li>
              <li>{t.welcome.quickStart.step5}</li>
            </ol>
          </div>

          {/* Let's Play Button */}
          <Button
            onClick={onClose}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {t.welcome.letsPlay}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
