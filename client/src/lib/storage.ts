import type { MetronomePreset, MetronomeSettings, ProgressSession } from "../types";

const PRESETS_KEY = "metronome_presets";
const SESSIONS_KEY = "progress_sessions";
const SETTINGS_KEY = "metronome_settings";

export class MetronomeStorage {
  // Presets
  getPresets(): MetronomePreset[] {
    try {
      const stored = localStorage.getItem(PRESETS_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultPresets();
    } catch {
      return this.getDefaultPresets();
    }
  }

  savePreset(preset: Omit<MetronomePreset, "id">): MetronomePreset {
    const presets = this.getPresets();
    const newPreset: MetronomePreset = {
      ...preset,
      id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    presets.push(newPreset);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
    return newPreset;
  }

  deletePreset(id: string): void {
    const presets = this.getPresets().filter(p => p.id !== id);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  }

  updatePreset(id: string, updates: Partial<MetronomePreset>): MetronomePreset | null {
    const presets = this.getPresets();
    const index = presets.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    presets[index] = { ...presets[index], ...updates };
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
    return presets[index];
  }

  private getDefaultPresets(): MetronomePreset[] {
    const defaults: MetronomePreset[] = [
      {
        id: "default_1",
        name: "Practice Slow",
        description: "60 BPM • Audio + Visual",
        bpm: 60,
        visualEnabled: true,
        audioEnabled: true,
        tactileEnabled: false,
        visualType: "pendulum",
        soundType: "click",
        volume: 75,
        vibrationIntensity: 3,
        primaryColor: "#10b981",
        backgroundColor: "#f1f5f9",
      },
      {
        id: "default_2",
        name: "Standard Practice",
        description: "120 BPM • All modes",
        bpm: 120,
        visualEnabled: true,
        audioEnabled: true,
        tactileEnabled: true,
        visualType: "pulse",
        soundType: "beep",
        volume: 75,
        vibrationIntensity: 3,
        primaryColor: "#10b981",
        backgroundColor: "#f1f5f9",
      },
      {
        id: "default_3",
        name: "Fast Practice",
        description: "160 BPM • Audio only",
        bpm: 160,
        visualEnabled: false,
        audioEnabled: true,
        tactileEnabled: false,
        visualType: "pendulum",
        soundType: "wood",
        volume: 85,
        vibrationIntensity: 3,
        primaryColor: "#10b981",
        backgroundColor: "#f1f5f9",
      },
    ];

    localStorage.setItem(PRESETS_KEY, JSON.stringify(defaults));
    return defaults;
  }

  // Settings
  getSettings(): MetronomeSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultSettings();
    } catch {
      return this.getDefaultSettings();
    }
  }

  saveSettings(settings: MetronomeSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  private getDefaultSettings(): MetronomeSettings {
    return {
      bpm: 120,
      visualEnabled: true,
      audioEnabled: true,
      tactileEnabled: false,
      visualType: "pendulum",
      soundType: "click",
      volume: 75,
      vibrationIntensity: 3,
      primaryColor: "#10b981",
      backgroundColor: "#f1f5f9",
    };
  }

  // Progress Sessions
  getSessions(): ProgressSession[] {
    try {
      const stored = localStorage.getItem(SESSIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveSession(session: Omit<ProgressSession, "id">): ProgressSession {
    const sessions = this.getSessions();
    const newSession: ProgressSession = {
      ...session,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    sessions.push(newSession);
    
    // Keep only last 50 sessions
    if (sessions.length > 50) {
      sessions.splice(0, sessions.length - 50);
    }
    
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    return newSession;
  }

  getCurrentSession(): ProgressSession | null {
    const sessions = this.getSessions();
    return sessions.find(s => !s.endTime) || null;
  }

  updateCurrentSession(updates: Partial<ProgressSession>): void {
    const sessions = this.getSessions();
    const currentIndex = sessions.findIndex(s => !s.endTime);
    
    if (currentIndex !== -1) {
      sessions[currentIndex] = { ...sessions[currentIndex], ...updates };
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    }
  }
}

export const metronomeStorage = new MetronomeStorage();
