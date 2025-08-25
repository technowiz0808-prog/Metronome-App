import { useState, useEffect, useRef, useCallback } from "react";
import { audioEngine } from "@/lib/audio-engine";
import { metronomeStorage } from "@/lib/storage";
import type { MetronomeState, MetronomeSettings } from "@shared/schema";

export function useMetronome() {
  const [state, setState] = useState<MetronomeState>(() => {
    const settings = metronomeStorage.getSettings();
    return {
      ...settings,
      isPlaying: false,
      currentBeat: 1,
    };
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const beatCountRef = useRef(0);
  const tapTimesRef = useRef<number[]>([]);
  const sessionStartRef = useRef<number | null>(null);

  // Initialize audio engine
  useEffect(() => {
    audioEngine.initialize();
    return () => audioEngine.destroy();
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    const settings: MetronomeSettings = {
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
    metronomeStorage.saveSettings(settings);
  }, [state]);

  const vibrate = useCallback((intensity: number) => {
    if (navigator.vibrate && state.tactileEnabled) {
      const duration = Math.min(intensity * 20, 100); // 20-100ms based on intensity
      navigator.vibrate(duration);
    }
  }, [state.tactileEnabled]);

  const playBeat = useCallback(() => {
    if (state.audioEnabled) {
      audioEngine.playSound(state.soundType, state.volume);
    }

    if (state.tactileEnabled) {
      vibrate(state.vibrationIntensity);
    }

    setState(prev => ({
      ...prev,
      currentBeat: prev.currentBeat >= 4 ? 1 : prev.currentBeat + 1,
    }));

    beatCountRef.current += 1;

    // Update current session if exists
    if (sessionStartRef.current) {
      const duration = Math.floor((Date.now() - sessionStartRef.current) / 1000);
      metronomeStorage.updateCurrentSession({
        duration,
        totalBeats: beatCountRef.current,
        averageBpm: state.bpm,
      });
    }
  }, [state.audioEnabled, state.tactileEnabled, state.soundType, state.volume, state.vibrationIntensity, state.bpm]);

  const start = useCallback(() => {
    if (state.isPlaying) return;

    // Start new session if none exists
    if (!sessionStartRef.current) {
      sessionStartRef.current = Date.now();
      beatCountRef.current = 0;
      metronomeStorage.saveSession({
        startTime: new Date().toISOString(),
        endTime: null,
        duration: 0,
        totalBeats: 0,
        averageBpm: state.bpm,
        settings: JSON.stringify(state),
      });
    }

    setState(prev => ({ ...prev, isPlaying: true }));
    
    const interval = 60000 / state.bpm; // milliseconds per beat
    
    // Play first beat immediately
    playBeat();
    
    intervalRef.current = setInterval(playBeat, interval);
  }, [state.isPlaying, state.bpm, playBeat]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setState(prev => ({ 
      ...prev, 
      isPlaying: false,
      currentBeat: 1,
    }));

    // End current session
    if (sessionStartRef.current) {
      const duration = Math.floor((Date.now() - sessionStartRef.current) / 1000);
      metronomeStorage.updateCurrentSession({
        endTime: new Date().toISOString(),
        duration,
        totalBeats: beatCountRef.current,
      });
      sessionStartRef.current = null;
      beatCountRef.current = 0;
    }
  }, []);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const setBpm = useCallback((bpm: number) => {
    const newBpm = Math.max(40, Math.min(200, bpm));
    setState(prev => ({ ...prev, bpm: newBpm }));

    // If playing, restart with new BPM
    if (state.isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      const interval = 60000 / newBpm;
      intervalRef.current = setInterval(playBeat, interval);
    }
  }, [state.isPlaying, playBeat]);

  const tapTempo = useCallback(() => {
    const now = Date.now();
    tapTimesRef.current.push(now);

    // Keep only last 4 taps for accuracy
    if (tapTimesRef.current.length > 4) {
      tapTimesRef.current.shift();
    }

    if (tapTimesRef.current.length >= 2) {
      const intervals = [];
      for (let i = 1; i < tapTimesRef.current.length; i++) {
        intervals.push(tapTimesRef.current[i] - tapTimesRef.current[i - 1]);
      }

      const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const newBpm = Math.round(60000 / averageInterval);
      setBpm(newBpm);
    }

    // Clear tap times after 3 seconds of inactivity
    setTimeout(() => {
      const lastTap = tapTimesRef.current[tapTimesRef.current.length - 1];
      if (lastTap && Date.now() - lastTap >= 3000) {
        tapTimesRef.current = [];
      }
    }, 3000);
  }, [setBpm]);

  const updateSettings = useCallback((updates: Partial<MetronomeSettings>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const loadPreset = useCallback((preset: MetronomeSettings) => {
    const wasPlaying = state.isPlaying;
    if (wasPlaying) {
      stop();
    }

    setState(prev => ({
      ...preset,
      isPlaying: false,
      currentBeat: 1,
    }));

    if (wasPlaying) {
      // Small delay to allow state to update
      setTimeout(() => start(), 100);
    }
  }, [state.isPlaying, stop, start]);

  const testSound = useCallback(() => {
    audioEngine.playSound(state.soundType, state.volume);
  }, [state.soundType, state.volume]);

  const testVibration = useCallback(() => {
    vibrate(state.vibrationIntensity);
  }, [vibrate, state.vibrationIntensity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    state,
    start,
    stop,
    pause,
    setBpm,
    tapTempo,
    updateSettings,
    loadPreset,
    testSound,
    testVibration,
  };
}
