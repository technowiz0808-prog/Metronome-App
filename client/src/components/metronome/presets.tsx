import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { metronomeStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import type { MetronomePreset, MetronomeSettings } from "../../types";

interface PresetsProps {
  currentSettings: MetronomeSettings;
  onLoadPreset: (preset: MetronomeSettings) => void;
}

export function Presets({ currentSettings, onLoadPreset }: PresetsProps) {
  const [presets, setPresets] = useState<MetronomePreset[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetDescription, setNewPresetDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setPresets(metronomeStorage.getPresets());
  }, []);

  const handleCreatePreset = () => {
    if (!newPresetName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a preset name.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newPreset = metronomeStorage.savePreset({
        name: newPresetName.trim(),
        description: newPresetDescription.trim() || `${currentSettings.bpm} BPM • Custom preset`,
        ...currentSettings,
      });

      setPresets(metronomeStorage.getPresets());
      setNewPresetName("");
      setNewPresetDescription("");
      setIsCreateDialogOpen(false);

      toast({
        title: "Preset created",
        description: `"${newPreset.name}" has been saved successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create preset. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePreset = (id: string, name: string) => {
    try {
      metronomeStorage.deletePreset(id);
      setPresets(metronomeStorage.getPresets());

      toast({
        title: "Preset deleted",
        description: `"${name}" has been removed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete preset. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLoadPreset = (preset: MetronomePreset) => {
    const settings: MetronomeSettings = {
      bpm: preset.bpm,
      visualEnabled: preset.visualEnabled,
      audioEnabled: preset.audioEnabled,
      tactileEnabled: preset.tactileEnabled,
      visualType: preset.visualType as "pendulum" | "pulse",
      soundType: preset.soundType as "click" | "beep" | "wood" | "cowbell" | "tick",
      volume: preset.volume,
      vibrationIntensity: preset.vibrationIntensity,
      primaryColor: preset.primaryColor,
      backgroundColor: preset.backgroundColor,
    };
    onLoadPreset(settings);

    toast({
      title: "Preset loaded",
      description: `"${name}" settings have been applied.`,
    });
  };

  const getModeDescription = (preset: MetronomePreset) => {
    const modes = [];
    if (preset.visualEnabled) modes.push("Visual");
    if (preset.audioEnabled) modes.push("Audio");
    if (preset.tactileEnabled) modes.push("Tactile");
    return `${preset.bpm} BPM • ${modes.join(" + ")}`;
  };

  return (
    <div className="bg-white dark:bg-primary-800 rounded-xl shadow-lg p-6 border border-primary-200 dark:border-primary-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" data-testid="text-presets-title">Presets</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="px-3 py-1 bg-accent-500 hover:bg-accent-600 text-white text-sm rounded-lg font-medium transition-colors duration-200"
              data-testid="button-create-preset"
            >
              <Plus className="mr-1" size={14} />
              New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Preset</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="preset-name">Preset Name</Label>
                <Input
                  id="preset-name"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="Enter preset name"
                  data-testid="input-preset-name"
                />
              </div>
              <div>
                <Label htmlFor="preset-description">Description (optional)</Label>
                <Input
                  id="preset-description"
                  value={newPresetDescription}
                  onChange={(e) => setNewPresetDescription(e.target.value)}
                  placeholder="Brief description"
                  data-testid="input-preset-description"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  data-testid="button-cancel-preset"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePreset}
                  data-testid="button-save-preset"
                >
                  Save Preset
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-2">
        {presets.map((preset) => (
          <div
            key={preset.id}
            className="p-3 bg-primary-50 dark:bg-primary-700 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-600 cursor-pointer transition-colors duration-200"
            onClick={() => handleLoadPreset(preset)}
            data-testid={`preset-item-${preset.id}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium" data-testid={`preset-name-${preset.id}`}>
                  {preset.name}
                </div>
                <div className="text-xs text-primary-600 dark:text-primary-300" data-testid={`preset-description-${preset.id}`}>
                  {preset.description || getModeDescription(preset)}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePreset(preset.id, preset.name);
                }}
                className="text-primary-400 hover:text-red-500 transition-colors duration-200 p-1"
                data-testid={`button-delete-preset-${preset.id}`}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
        
        {presets.length === 0 && (
          <div className="text-center py-8 text-primary-500 dark:text-primary-400" data-testid="text-no-presets">
            No presets saved yet. Create your first preset to get started!
          </div>
        )}
      </div>
    </div>
  );
}
