import { type MetronomePreset, type InsertMetronomePreset, type ProgressSession, type InsertProgressSession } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getPreset(id: string): Promise<MetronomePreset | undefined>;
  getPresets(): Promise<MetronomePreset[]>;
  createPreset(preset: InsertMetronomePreset): Promise<MetronomePreset>;
  deletePreset(id: string): Promise<void>;
  getSession(id: string): Promise<ProgressSession | undefined>;
  getSessions(): Promise<ProgressSession[]>;
  createSession(session: InsertProgressSession): Promise<ProgressSession>;
}

export class MemStorage implements IStorage {
  private presets: Map<string, MetronomePreset>;
  private sessions: Map<string, ProgressSession>;

  constructor() {
    this.presets = new Map();
    this.sessions = new Map();
  }

  async getPreset(id: string): Promise<MetronomePreset | undefined> {
    return this.presets.get(id);
  }

  async getPresets(): Promise<MetronomePreset[]> {
    return Array.from(this.presets.values());
  }

  async createPreset(insertPreset: InsertMetronomePreset): Promise<MetronomePreset> {
    const id = randomUUID();
    const preset: MetronomePreset = { 
      id,
      name: insertPreset.name,
      description: insertPreset.description || null,
      bpm: insertPreset.bpm || 120,
      visualEnabled: insertPreset.visualEnabled !== undefined ? insertPreset.visualEnabled : true,
      audioEnabled: insertPreset.audioEnabled !== undefined ? insertPreset.audioEnabled : true,
      tactileEnabled: insertPreset.tactileEnabled !== undefined ? insertPreset.tactileEnabled : false,
      visualType: insertPreset.visualType || "pendulum",
      soundType: insertPreset.soundType || "click",
      volume: insertPreset.volume || 75,
      vibrationIntensity: insertPreset.vibrationIntensity || 3,
      primaryColor: insertPreset.primaryColor || "#10b981",
      backgroundColor: insertPreset.backgroundColor || "#f1f5f9",
    };
    this.presets.set(id, preset);
    return preset;
  }

  async deletePreset(id: string): Promise<void> {
    this.presets.delete(id);
  }

  async getSession(id: string): Promise<ProgressSession | undefined> {
    return this.sessions.get(id);
  }

  async getSessions(): Promise<ProgressSession[]> {
    return Array.from(this.sessions.values());
  }

  async createSession(insertSession: InsertProgressSession): Promise<ProgressSession> {
    const id = randomUUID();
    const session: ProgressSession = { 
      id,
      startTime: insertSession.startTime,
      endTime: insertSession.endTime || null,
      duration: insertSession.duration || 0,
      totalBeats: insertSession.totalBeats || 0,
      averageBpm: insertSession.averageBpm || 120,
      settings: insertSession.settings || null,
    };
    this.sessions.set(id, session);
    return session;
  }
}

export const storage = new MemStorage();
