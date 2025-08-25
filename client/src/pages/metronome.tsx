import { Header } from "@/components/metronome/header";
import { MetronomeController } from "@/components/metronome/metronome-controller";
import { VisualMetronome } from "@/components/metronome/visual-metronome";
import { ModeSelector } from "@/components/metronome/mode-selector";
import { AudioSettings } from "@/components/metronome/audio-settings";
import { TactileSettings } from "@/components/metronome/tactile-settings";
import { ProgressTracker } from "@/components/metronome/progress-tracker";
import { Presets } from "@/components/metronome/presets";
import { useMetronome } from "@/hooks/use-metronome";

export default function MetronomePage() {
  const {
    state,
    start,
    stop,
    setBpm,
    tapTempo,
    updateSettings,
    loadPreset,
    testSound,
    testVibration,
  } = useMetronome();

  const handlePlayPause = () => {
    if (state.isPlaying) {
      stop();
    } else {
      start();
    }
  };

  const currentSettings = {
    bpm: state.bpm,
    visualEnabled: state.visualEnabled,
    audioEnabled: state.audioEnabled,
    tactileEnabled: state.tactileEnabled,
    visualType: state.visualType,
    soundType: state.soundType,
    volume: state.volume,
    vibrationIntensity: state.vibrationIntensity,
    primaryColor: state.primaryColor,
    backgroundColor: state.backgroundColor,
  };

  return (
    <div className="min-h-screen bg-primary-50 dark:bg-primary-900">
      <Header currentSettings={currentSettings} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Main Controls & Visualization */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Metronome Control Card */}
            <MetronomeController
              bpm={state.bpm}
              isPlaying={state.isPlaying}
              currentBeat={state.currentBeat}
              onBpmChange={setBpm}
              onPlay={handlePlayPause}
              onStop={stop}
              onTapTempo={tapTempo}
            />

            {/* Visual Metronome */}
            {state.visualEnabled && (
              <VisualMetronome
                isPlaying={state.isPlaying}
                bpm={state.bpm}
                visualType={state.visualType}
                primaryColor={state.primaryColor}
                backgroundColor={state.backgroundColor}
                onVisualizationChange={(type) => updateSettings({ visualType: type })}
                onPrimaryColorChange={(color) => updateSettings({ primaryColor: color })}
                onBackgroundColorChange={(color) => updateSettings({ backgroundColor: color })}
              />
            )}

            {/* Progress Tracking */}
            <ProgressTracker
              isPlaying={state.isPlaying}
              currentBeat={state.currentBeat}
            />
          </div>

          {/* Right Column: Settings & Presets */}
          <div className="space-y-6">

            {/* Mode Selection */}
            <ModeSelector
              visualEnabled={state.visualEnabled}
              audioEnabled={state.audioEnabled}
              tactileEnabled={state.tactileEnabled}
              onVisualToggle={(enabled) => updateSettings({ visualEnabled: enabled })}
              onAudioToggle={(enabled) => updateSettings({ audioEnabled: enabled })}
              onTactileToggle={(enabled) => updateSettings({ tactileEnabled: enabled })}
            />

            {/* Audio Settings */}
            {state.audioEnabled && (
              <AudioSettings
                volume={state.volume}
                soundType={state.soundType}
                onVolumeChange={(volume) => updateSettings({ volume })}
                onSoundTypeChange={(soundType) => updateSettings({ soundType })}
                onTestSound={testSound}
              />
            )}

            {/* Tactile Settings */}
            {state.tactileEnabled && (
              <TactileSettings
                vibrationIntensity={state.vibrationIntensity}
                onVibrationIntensityChange={(intensity) => updateSettings({ vibrationIntensity: intensity })}
                onTestVibration={testVibration}
              />
            )}

            {/* Presets */}
            <Presets
              currentSettings={currentSettings}
              onLoadPreset={loadPreset}
            />

          </div>
        </div>
      </main>
    </div>
  );
}
