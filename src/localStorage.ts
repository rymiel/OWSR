import { Entry, Role } from "./types";

export interface LegacyEntry {
  id: number;
  session: string | number;
  sr: string | number;
  role: string;
  size: string | number;
  season: string | number;
  wld: string;
}

function migrateEntries(legacy: LegacyEntry[]): Entry[] {
  return legacy.map(i => ({
    id: i.id,
    session: parseInt(i.session.toString()),
    sr: parseInt((i.sr ?? 0).toString()),
    role: i.role as Role,
    size: parseInt(i.size.toString()),
    season: parseInt(i.season.toString()),
    wld: i.wld
  }));
}

export function loadFromString(input: string): Entry[] {
  return migrateEntries(JSON.parse(input) || []);
}

export function loadFromLocalStorage(): Entry[] {
  return migrateEntries(JSON.parse(localStorage.getItem("items")) || []);
}

export function saveItems(items: Entry[]) {
  setLastUpdate();
  localStorage.setItem("items", JSON.stringify(items));
  window.dispatchEvent(new Event("updateAll"));
}

export function getLastUpdate() {
  return new Date(parseInt(localStorage.getItem("lastUpdate"), 0) || 0);
}

export function setLastUpdate() {
  localStorage.setItem("lastUpdate", new Date().getTime().toString());
}
