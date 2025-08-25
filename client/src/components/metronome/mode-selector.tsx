import { Eye, Volume2, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ModeSelectorProps {
  visualEnabled: boolean;
  audioEnabled: boolean;
  tactileEnabled: boolean;
  onVisualToggle: (enabled: boolean) => void;
  onAudioToggle: (enabled: boolean) => void;
  onTactileToggle: (enabled: boolean) => void;
}

export function ModeSelector({
  visualEnabled,
  audioEnabled,
  tactileEnabled,
  onVisualToggle,
  onAudioToggle,
  onTactileToggle,
}: ModeSelectorProps) {
  return (
    <div className="bg-white dark:bg-primary-800 rounded-xl shadow-lg p-6 border border-primary-200 dark:border-primary-700">
      <h3 className="text-lg font-semibold mb-4" data-testid="text-modes-title">Metronome Modes</h3>
      
      <div className="space-y-4">
        {/* Visual Mode */}
        <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <Eye className="text-accent-500" size={20} />
            <span className="font-medium" data-testid="text-visual-mode-label">Visual</span>
          </div>
          <Switch
            checked={visualEnabled}
            onCheckedChange={onVisualToggle}
            data-testid="switch-visual-mode"
          />
        </div>

        {/* Audio Mode */}
        <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <Volume2 className="text-accent-500" size={20} />
            <span className="font-medium" data-testid="text-audio-mode-label">Audio</span>
          </div>
          <Switch
            checked={audioEnabled}
            onCheckedChange={onAudioToggle}
            data-testid="switch-audio-mode"
          />
        </div>

        {/* Tactile Mode */}
        <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <Smartphone className="text-accent-500" size={20} />
            <span className="font-medium" data-testid="text-tactile-mode-label">Tactile</span>
          </div>
          <Switch
            checked={tactileEnabled}
            onCheckedChange={onTactileToggle}
            data-testid="switch-tactile-mode"
          />
        </div>
      </div>
    </div>
  );
}
