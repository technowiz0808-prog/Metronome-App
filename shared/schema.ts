import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const metronomePresets = pgTable("metronome_presets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  bpm: integer("bpm").notNull().default(120),
  visualEnabled: boolean("visual_enabled").notNull().default(true),
  audioEnabled: boolean("audio_enabled").notNull().default(true),
  tactileEnabled: boolean("tactile_enabled").notNull().default(false),
  visualType: text("visual_type").notNull().default("pendulum"), // "pendulum" | "pulse"
  soundType: text("sound_type").notNull().default("click"), // "click" | "beep" | "wood" | "cowbell" | "tick"
  volume: integer("volume").notNull().default(75), // 0-100
  vibrationIntensity: integer("vibration_intensity").notNull().default(3), // 1-5
  primaryColor: text("primary_color").notNull().default("#10b981"),
  backgroundColor: text("background_color").notNull().default("#f1f5f9"),
});

export const progressSessions = pgTable("progress_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  startTime: text("start_time").notNull(),
  endTime: text("end_time"),
  duration: integer("duration").notNull().default(0), // seconds
  totalBeats: integer("total_beats").notNull().default(0),
  averageBpm: integer("average_bpm").notNull().default(120),
  settings: jsonb("settings"), // Store the metronome settings used
});

export const insertMetronomePresetSchema = createInsertSchema(metronomePresets).omit({
  id: true,
});

export const insertProgressSessionSchema = createInsertSchema(progressSessions).omit({
  id: true,
});

export type MetronomePreset = typeof metronomePresets.$inferSelect;
export type InsertMetronomePreset = z.infer<typeof insertMetronomePresetSchema>;
export type ProgressSession = typeof progressSessions.$inferSelect;
export type InsertProgressSession = z.infer<typeof insertProgressSessionSchema>;

// Types for the metronome state
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
