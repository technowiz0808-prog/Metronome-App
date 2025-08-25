import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VisualMetronomeProps {
  isPlaying: boolean;
  bpm: number;
  visualType: "pendulum" | "pulse";
  primaryColor: string;
  backgroundColor: string;
  onVisualizationChange: (type: "pendulum" | "pulse") => void;
  onPrimaryColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
}

export function VisualMetronome({
  isPlaying,
  bpm,
  visualType,
  primaryColor,
  backgroundColor,
  onVisualizationChange,
  onPrimaryColorChange,
  onBackgroundColorChange,
}: VisualMetronomeProps) {
  const animationDuration = 60 / bpm; // seconds per beat

  return (
    <div className="bg-white dark:bg-primary-800 rounded-xl shadow-lg p-6 border border-primary-200 dark:border-primary-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold" data-testid="text-visual-metronome-title">Visual Metronome</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-primary-600 dark:text-primary-300">Visualization</span>
          <Select value={visualType} onValueChange={onVisualizationChange}>
            <SelectTrigger 
              className="w-32 bg-primary-50 dark:bg-primary-700 border border-primary-300 dark:border-primary-600"
              data-testid="select-visualization-type"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendulum">Pendulum</SelectItem>
              <SelectItem value="pulse">Pulse Circle</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Visualization Area */}
      <div 
        className="relative h-64 rounded-lg border border-primary-200 dark:border-primary-600 overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${backgroundColor}, ${backgroundColor}dd)` 
        }}
        data-testid="visualization-area"
      >
        
        {/* Pendulum Visualization */}
        {visualType === "pendulum" && (
          <div className="absolute inset-0 flex items-center justify-center" data-testid="pendulum-visualization">
            <div className="relative w-48 h-48">
              {/* Pendulum Arm */}
              <div 
                className={`absolute top-4 left-1/2 w-1 h-32 origin-top transform -translate-x-1/2 ${
                  isPlaying ? "animate-pendulum" : ""
                }`}
                style={{ 
                  backgroundColor: primaryColor,
                  animationDuration: `${animationDuration}s`,
                }}
                data-testid="pendulum-arm"
              />
              {/* Pendulum Bob */}
              <div 
                className={`absolute top-36 left-1/2 w-8 h-8 rounded-full transform -translate-x-1/2 shadow-lg ${
                  isPlaying ? "animate-pendulum" : ""
                }`}
                style={{ 
                  backgroundColor: primaryColor,
                  animationDuration: `${animationDuration}s`,
                }}
                data-testid="pendulum-bob"
              />
              {/* Pivot Point */}
              <div 
                className="absolute top-3 left-1/2 w-3 h-3 rounded-full transform -translate-x-1/2"
                style={{ backgroundColor: primaryColor }}
                data-testid="pendulum-pivot"
              />
            </div>
          </div>
        )}

        {/* Pulse Visualization */}
        {visualType === "pulse" && (
          <div className="absolute inset-0 flex items-center justify-center" data-testid="pulse-visualization">
            <div 
              className={`w-24 h-24 rounded-full opacity-80 ${
                isPlaying ? "animate-pulse-beat" : ""
              }`}
              style={{ 
                backgroundColor: primaryColor,
                animationDuration: `${animationDuration}s`,
              }}
              data-testid="pulse-circle-large"
            />
            <div 
              className={`absolute w-16 h-16 rounded-full ${
                isPlaying ? "animate-pulse-beat" : ""
              }`}
              style={{ 
                backgroundColor: `${primaryColor}cc`,
                animationDuration: `${animationDuration}s`,
                animationDelay: "0.1s",
              }}
              data-testid="pulse-circle-medium"
            />
            <div 
              className={`absolute w-8 h-8 rounded-full ${
                isPlaying ? "animate-pulse-beat" : ""
              }`}
              style={{ 
                backgroundColor: primaryColor,
                animationDuration: `${animationDuration}s`,
                animationDelay: "0.2s",
              }}
              data-testid="pulse-circle-small"
            />
          </div>
        )}
      </div>

      {/* Visual Customization */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
            Primary Color
          </Label>
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => onPrimaryColorChange(e.target.value)}
            className="w-full h-10 rounded-lg border border-primary-300 dark:border-primary-600 cursor-pointer"
            data-testid="input-primary-color"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
            Background Color
          </Label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => onBackgroundColorChange(e.target.value)}
            className="w-full h-10 rounded-lg border border-primary-300 dark:border-primary-600 cursor-pointer"
            data-testid="input-background-color"
          />
        </div>
      </div>
    </div>
  );
}
