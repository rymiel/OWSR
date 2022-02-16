import { Button, Classes, Dialog, HTMLSelect, Intent } from "@blueprintjs/core";
import { ChangeEvent, Component } from "react";
import EntryTable from "./EntryTable";
import Graphs from "./Graphs";
import LastStats from "./LastStats";
import { getLastUpdate, loadFromLocalStorage, loadFromString, saveItems } from "./localStorage";
import SeasonStats from "./SeasonStats";
import { DEFAULT_ENTRY, Entry, EntryDiff, ROLES, WLD } from "./types";
import { download, last } from "./utils";

interface AppState {
  entries: Entry[];
  lastStats: EntryDiff[];
  roleFilter: string;
  seasonFilter: string;
  overlay: boolean;
}

export default class App extends Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props);

    const entries = this.updateWLD(loadFromLocalStorage());
    this.state = {
      entries,
      roleFilter: "All",
      seasonFilter: "All",
      lastStats: this.updateStats(entries, "All"),
      overlay: false
    };
  }

  callback = (entry: Entry, modified: Partial<Entry>) => {
    console.log(entry, modified);
    this.applyEntries(s => s.entries.map(i => i == entry ? {...entry, ...modified} : i));
  };

  setSeasonFilter = (season : string) => {
    this.setState({seasonFilter: season});
  }

  setRoleFilter = (role : string) => {
    this.setState(s => ({roleFilter: role, lastStats: this.updateStats(s.entries, role)}));
  }

  addItem = (item: Entry) => {
    this.applyEntries(s => [...s.entries, item]);
  }

  deleteItem = (item: Entry) => {
    this.applyEntries(s => s.entries.filter(i => i != item));
  }

  applyEntries = (entryProvider: (s: AppState) => Entry[]) => {
    return this.setState((s) => {
      const newEntries = this.updateWLD(entryProvider(s));
      saveItems(newEntries);
      return {
        entries: newEntries,
        lastStats: this.updateStats(newEntries, s.roleFilter)
      };
    });
  }

  entryDiffs(entries: Entry[]): EntryDiff[] {
    return entries.map(i => {
      const prevSrFilter = entries
        .filter((j) => j.role === i.role && j.id < i.id)
        .slice(-1);
      let diff = NaN;
      if (prevSrFilter.length === 1) {
        const oldSr = prevSrFilter[0].sr;
        const newSr = i.sr;
        diff = newSr - oldSr;
      }
      return {entry: i, diff: diff};
    });
  }

  updateWLD(entries: Entry[]): Entry[] {
    return this.entryDiffs(entries).map(i => {
      let gameResult: WLD;
      if (i.diff > 0) gameResult = "W";
      else if (i.diff < 0) gameResult = "L";
      else if (i.diff == 0) gameResult = "D";
      else gameResult = "*";
      return gameResult != i.entry.wld ? {...i.entry, wld: gameResult} : i.entry;
    });
  }

  addRow() {
    const items = this.state.entries;
    const lastItem = last(items, DEFAULT_ENTRY);

    const lastUpdate = getLastUpdate().getTime();
    const current = new Date().getTime();
    const diff = 1000 * 60 * 60 * 12;
    const item = {...lastItem, id: lastItem.id + 1};
    if (current - lastUpdate > diff) item.session += 1;

    this.addItem(item);
    saveItems(items);

    // table.closest("div").scrollTop = table.closest("div").scrollHeight;
  }

  onStatSeasonChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const season = event.currentTarget.value;
    this.setSeasonFilter(season);
  }

  onStatRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const role = event.currentTarget.value;
    this.setRoleFilter(role);
  }

  updateStats = (items: Entry[], role: string) => {
    const entries = items.filter((item) => {
      if (role == "All") return true;
      return item.role == role;
    });
    const count = Math.min(entries.length, 10);

    return this.entryDiffs(entries).splice(entries.length - count, count);
  }

  toggleOverlay = () => {
    this.setState(s => ({overlay: !s.overlay}));
  }

  importFromFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files === null) return;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const importedItems  = loadFromString(reader.result as string);
          this.applyEntries(() => []);
          this.applyEntries(() => importedItems);
        } catch (error) {
          console.log(error);
          // err handling
        }
      };
      reader.readAsText(file);
    }
  }

  render() {
    return <div id="main">
      <div id="hidden">
        <input id="importUpload" type="file" accept=".txt,.json" multiple={false} onChange={this.importFromFile} />
      </div>
      <div className="mainLeft">
        <EntryTable items={this.state.entries} roleFilter={this.state.roleFilter} seasonFilter={this.state.seasonFilter}
          callback={this.callback} addItem={this.addItem} deleteItem={this.deleteItem} />
      </div>
      <div className="footer">
        Filter by Role: <HTMLSelect options={["All", ...ROLES]} onChange={this.onStatRoleChange}></HTMLSelect>
        Season: <HTMLSelect options={["All", ...new Set(this.state.entries.map(i => `S${i.season}`))]} onChange={this.onStatRoleChange}></HTMLSelect>
        <Button onClick={() => this.addRow()} intent={Intent.SUCCESS}>New entry</Button>
        <Button onClick={() => document.getElementById("importUpload")!.click()} intent={Intent.PRIMARY}>Import</Button>
        <Button onClick={() => download(JSON.stringify(this.state.entries), "entries.json", "application/json")} intent={Intent.PRIMARY}>Export</Button>
        <div>
          <Button text="Show overlay" onClick={this.toggleOverlay} />
          <Dialog isOpen={this.state.overlay} onClose={this.toggleOverlay}>
            <div className={Classes.DIALOG_BODY}>
              <p>
                Overlaid contents...
              </p>
            </div>
          </Dialog>
        </div>
      </div>
      <div className="mainMid">
        <LastStats lastStats={this.state.lastStats} updateStats={this.onStatRoleChange} />
        <SeasonStats entries={this.state.entries} season={this.state.seasonFilter === "All" ? 0 : parseInt(this.state.seasonFilter.substring(1))} />
      </div>
      <div className="mainRight">
        <Graphs items={this.state.entries} />
      </div>
    </div>;
  }
}
