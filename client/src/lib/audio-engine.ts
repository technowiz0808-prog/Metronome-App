export type SoundType = "click" | "beep" | "wood" | "cowbell" | "tick";

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize audio context:", error);
    }
  }

  async playSound(soundType: SoundType, volume: number = 0.75) {
    if (!this.audioContext || !this.gainNode) {
      await this.initialize();
    }

    if (!this.audioContext || !this.gainNode) return;

    // Resume audio context if suspended (required for user interaction)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    const oscillator = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();

    oscillator.connect(envelope);
    envelope.connect(this.gainNode);

    // Set volume
    this.gainNode.gain.value = volume / 100;

    const now = this.audioContext.currentTime;

    switch (soundType) {
      case "click":
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(1000, now);
        envelope.gain.setValueAtTime(0.3, now);
        envelope.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        break;

      case "beep":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(800, now);
        envelope.gain.setValueAtTime(0.3, now);
        envelope.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        break;

      case "wood":
        // Simulate wood block with filtered noise
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(2000, now);
        envelope.gain.setValueAtTime(0.5, now);
        envelope.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        break;

      case "cowbell":
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1);
        envelope.gain.setValueAtTime(0.4, now);
        envelope.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        break;

      case "tick":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(1200, now);
        envelope.gain.setValueAtTime(0.2, now);
        envelope.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        break;

      default:
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(1000, now);
        envelope.gain.setValueAtTime(0.3, now);
        envelope.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    }

    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }

  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.gainNode = null;
      this.isInitialized = false;
    }
  }
}

export const audioEngine = new AudioEngine();
