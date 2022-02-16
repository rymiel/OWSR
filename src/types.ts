export const ROLES = ["Tank", "DPS", "Support", "Open"] as const;
export type Role = typeof ROLES[number];
export type Teamsize = 1 | 2 | 3 | 4 | 5 | 6;
export const WLDOptions = ["W", "L", "D", "*"] as const;
export type WLD = typeof WLDOptions[number];
type ArrayElement<A> = A extends readonly (infer T)[] ? T : never
export const RANK_THRESHOLDS = [
  [0, "Bronze"],
  [1500, "Silver"],
  [2000, "Gold"],
  [2500, "Platinum"],
  [3000, "Diamond"],
  [3500, "Master"],
  [4000, "Grandmaster"],
] as const;
export type Rank = ArrayElement<typeof RANK_THRESHOLDS>[1];

export const COLORS = {
  Tank: "#b43c4a",
  DPS: "#59c8ff",
  Support: "#6ad330",
  Open: "#b83cff",
};

export interface Entry {
  id: number;
  session: number;
  sr: number;
  role: Role;
  size: number;
  season: number;
  wld: WLD;
}
export type EntryDiff = {entry: Entry, diff: number};
export const DEFAULT_ENTRY: Entry = {
  id: 0,
  session: 1,
  sr: 2000,
  role: "Support",
  size: 2,
  season: 26,
  wld: "*",
};

export interface GroupStatEntry {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
}

export interface Stats {
  // General
  enhancedEntries: Entry[];
  gamesPlayed: number;
  startSr: number;
  high: number;
  low: number;
  win: number;
  loss: number;
  draw: number;
  winStreak: number;
  lossStreak: number;
  currentSr: number;
  srGain: number;
  winRate: number;
  srLoss: number;
  srWin: number;
  srAvg: number;
  // Group
  gamesPlayedGroup: GroupStatEntry;
  winGroup: GroupStatEntry;
  lossGroup: GroupStatEntry;
  drawGroup: GroupStatEntry;
  winRateGroup: GroupStatEntry;
  // Session
  sessionStart: number;
  sessionCurrent: number;
  sessionWin: number;
  sessionLoss: number;
  sessionDraw: number;
}
