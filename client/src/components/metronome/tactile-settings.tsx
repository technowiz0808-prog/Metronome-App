import { useState } from "react";
import { ChevronDown, Smartphone, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TactileSettingsProps {
  vibrationIntensity: number;
  onVibrationIntensityChange: (intensity: number) => void;
  onTestVibration: () => void;
}

export function TactileSettings({
  vibrationIntensity,
  onVibrationIntensityChange,
  onTestVibration,
}: TactileSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleIntensityChange = (values: number[]) => {
    onVibrationIntensityChange(values[0]);
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity <= 1) return "Light";
    if (intensity <= 2) return "Mild";
    if (intensity <= 3) return "Medium";
    if (intensity <= 4) return "Strong";
    return "Very Strong";
  };

  return (
    <div className="bg-white dark:bg-primary-800 rounded-xl shadow-lg border border-primary-200 dark:border-primary-700 overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full p-6 text-left hover:bg-primary-50 dark:hover:bg-primary-700 transition-colors duration-200 justify-between"
            data-testid="button-toggle-tactile-settings"
          >
            <h3 className="text-lg font-semibold">Tactile Settings</h3>
            <ChevronDown 
              className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              size={20} 
            />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-6 pb-6 space-y-4">
            {/* Vibration Intensity */}
            <div>
              <Label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Vibration Intensity
              </Label>
              <Slider
                value={[vibrationIntensity]}
                onValueChange={handleIntensityChange}
                min={1}
                max={5}
                step={1}
                className="w-full"
                data-testid="slider-vibration-intensity"
              />
              <div className="flex justify-between text-xs text-primary-500 dark:text-primary-400 mt-1">
                <span>Light</span>
                <span data-testid="text-intensity-display">{getIntensityLabel(vibrationIntensity)}</span>
                <span>Strong</span>
              </div>
            </div>

            {/* Test Vibration */}
            <Button
              onClick={onTestVibration}
              className="w-full py-2 px-4 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 hover:bg-accent-200 dark:hover:bg-accent-800 rounded-lg font-medium transition-colors duration-200"
              data-testid="button-test-vibration"
            >
              <Smartphone className="mr-2" size={16} />
              Test Vibration
            </Button>

            {/* Device Support Notice */}
            <div className="text-xs text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-700 p-3 rounded-lg">
              <Info className="inline mr-2" size={12} />
              Vibration requires device support and user permission
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
