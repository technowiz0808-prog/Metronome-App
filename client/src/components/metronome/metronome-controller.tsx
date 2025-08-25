import { Play, Pause, Square, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Minus, Plus } from "lucide-react";

interface MetronomeControllerProps {
  bpm: number;
  isPlaying: boolean;
  currentBeat: number;
  onBpmChange: (bpm: number) => void;
  onPlay: () => void;
  onStop: () => void;
  onTapTempo: () => void;
}

export function MetronomeController({
  bpm,
  isPlaying,
  currentBeat,
  onBpmChange,
  onPlay,
  onStop,
  onTapTempo,
}: MetronomeControllerProps) {
  const incrementBpm = () => {
    onBpmChange(Math.min(200, bpm + 1));
  };

  const decrementBpm = () => {
    onBpmChange(Math.max(40, bpm - 1));
  };

  const handleSliderChange = (values: number[]) => {
    onBpmChange(values[0]);
  };

  return (
    <div className="bg-white dark:bg-primary-800 rounded-xl shadow-lg p-6 border border-primary-200 dark:border-primary-700">
      {/* BPM Display & Controls */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <span className="text-sm font-medium text-primary-600 dark:text-primary-300 uppercase tracking-wider">
            Tempo (BPM)
          </span>
        </div>
        <div className="flex items-center justify-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={decrementBpm}
            className="w-12 h-12 bg-primary-100 dark:bg-primary-700 hover:bg-primary-200 dark:hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors duration-200"
            data-testid="button-decrement-bpm"
          >
            <Minus className="text-primary-600 dark:text-primary-300" size={18} />
          </Button>
          
          <div className="text-center">
            <div className="text-5xl font-bold text-accent-500" data-testid="text-bpm-display">
              {bpm}
            </div>
            <div className="text-sm text-primary-500 dark:text-primary-400 mt-1">
              Beats per minute
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={incrementBpm}
            className="w-12 h-12 bg-primary-100 dark:bg-primary-700 hover:bg-primary-200 dark:hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors duration-200"
            data-testid="button-increment-bpm"
          >
            <Plus className="text-primary-600 dark:text-primary-300" size={18} />
          </Button>
        </div>
        
        {/* BPM Slider */}
        <div className="mt-6 px-8">
          <Slider
            value={[bpm]}
            onValueChange={handleSliderChange}
            min={40}
            max={200}
            step={1}
            className="w-full"
            data-testid="slider-bpm"
          />
          <div className="flex justify-between text-xs text-primary-500 dark:text-primary-400 mt-2">
            <span>40</span>
            <span>120</span>
            <span>200</span>
          </div>
        </div>
      </div>

      {/* Play Controls */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <Button
          onClick={onPlay}
          size="lg"
          className="w-16 h-16 bg-accent-500 hover:bg-accent-600 text-white rounded-full flex items-center justify-center text-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          data-testid="button-play-pause"
        >
          {isPlaying ? (
            <Pause size={24} />
          ) : (
            <Play size={24} />
          )}
        </Button>
        
        <Button
          onClick={onStop}
          size="sm"
          className="w-12 h-12 bg-primary-400 hover:bg-primary-500 text-white rounded-full flex items-center justify-center transition-all duration-200"
          data-testid="button-stop"
        >
          <Square size={16} />
        </Button>
        
        <Button
          onClick={onTapTempo}
          variant="ghost"
          className="px-6 py-3 bg-primary-100 dark:bg-primary-700 hover:bg-primary-200 dark:hover:bg-primary-600 rounded-lg font-medium transition-colors duration-200"
          data-testid="button-tap-tempo"
        >
          <Hand className="mr-2" size={16} />
          Tap Tempo
        </Button>
      </div>

      {/* Beat Counter */}
      <div className="text-center">
        <div className="text-sm text-primary-600 dark:text-primary-300 mb-2" data-testid="text-current-beat-label">
          Current Beat
        </div>
        <div className="flex justify-center space-x-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index + 1}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                currentBeat === index + 1
                  ? "bg-accent-500"
                  : "bg-primary-300 dark:bg-primary-600"
              }`}
              data-testid={`beat-indicator-${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
