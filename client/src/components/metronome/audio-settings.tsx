import { useState } from "react";
import { ChevronDown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { SoundType } from "@/lib/audio-engine";

interface AudioSettingsProps {
  volume: number;
  soundType: SoundType;
  onVolumeChange: (volume: number) => void;
  onSoundTypeChange: (soundType: SoundType) => void;
  onTestSound: () => void;
}

export function AudioSettings({
  volume,
  soundType,
  onVolumeChange,
  onSoundTypeChange,
  onTestSound,
}: AudioSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleVolumeChange = (values: number[]) => {
    onVolumeChange(values[0]);
  };

  return (
    <div className="bg-white dark:bg-primary-800 rounded-xl shadow-lg border border-primary-200 dark:border-primary-700 overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full p-6 text-left hover:bg-primary-50 dark:hover:bg-primary-700 transition-colors duration-200 justify-between"
            data-testid="button-toggle-audio-settings"
          >
            <h3 className="text-lg font-semibold">Audio Settings</h3>
            <ChevronDown 
              className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              size={20} 
            />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-6 pb-6 space-y-4">
            {/* Volume Control */}
            <div>
              <Label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Volume
              </Label>
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                min={0}
                max={100}
                step={1}
                className="w-full"
                data-testid="slider-volume"
              />
              <div className="flex justify-between text-xs text-primary-500 dark:text-primary-400 mt-1">
                <span>0%</span>
                <span data-testid="text-volume-display">{volume}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Sound Selection */}
            <div>
              <Label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Sound Type
              </Label>
              <Select value={soundType} onValueChange={onSoundTypeChange}>
                <SelectTrigger 
                  className="w-full bg-primary-50 dark:bg-primary-700 border border-primary-300 dark:border-primary-600"
                  data-testid="select-sound-type"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="click">Digital Click</SelectItem>
                  <SelectItem value="beep">Beep</SelectItem>
                  <SelectItem value="wood">Wood Block</SelectItem>
                  <SelectItem value="cowbell">Cowbell</SelectItem>
                  <SelectItem value="tick">Analog Tick</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Test Sound */}
            <Button
              onClick={onTestSound}
              className="w-full py-2 px-4 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 hover:bg-accent-200 dark:hover:bg-accent-800 rounded-lg font-medium transition-colors duration-200"
              data-testid="button-test-sound"
            >
              <Play className="mr-2" size={16} />
              Test Sound
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
