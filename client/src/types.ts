// Frontend-only types for GitHub Pages deployment
export type MetronomePreset = {
  id: string;
  name: string;
  description?: string | null;
  bpm: number;
  visualEnabled: boolean;
  audioEnabled: boolean;
  tactileEnabled: boolean;
  visualType: "pendulum" | "pulse";
  soundType: "click" | "beep" | "wood" | "cowbell" | "tick";
  volume: number; // 0-100
  vibrationIntensity: number; // 1-5
  primaryColor: string;
  backgroundColor: string;
};

export type ProgressSession = {
  id: string;
  startTime: string;
  endTime?: string | null;
  duration: number; // seconds
  totalBeats: number;
  averageBpm: number;
  settings?: any; // metronome settings used
};

export type MetronomeState = {
  bpm: number;
  isPlaying: boolean;
  currentBeat: number;
  visualEnabled: boolean;
  audioEnabled: boolean;
  tactileEnabled: boolean;
  visualType: "pendulum" | "pulse";
  soundType: "click" | "beep" | "wood" | "cowbell" | "tick";
  volume: number;
  vibrationIntensity: number;
  primaryColor: string;
  backgroundColor: string;
};

export type MetronomeSettings = Omit<MetronomeState, "isPlaying" | "currentBeat">;