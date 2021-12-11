import { Button, Classes, Dialog, Intent } from "@blueprintjs/core";
import { ChangeEvent, Component } from "react";
import EntryTable from "./EntryTable";
import Graphs from "./Graphs";
import LastStats from "./LastStats";
import { getLastUpdate, loadFromLocalStorage, loadFromString, saveItems } from "./localStorage";
import { Entry, EntryDiff } from "./types";
import { download } from "./utils";

interface AppState {
  entries: Entry[];
  lastStats: EntryDiff[];
  roleFilter: string;
  overlay: boolean;
}

export default class App extends Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props);

    const entries = loadFromLocalStorage();
    this.state = {
      entries,
      roleFilter: "All",
      lastStats: this.updateStats(entries, "All"),
      overlay: false
    };
  }

  callback = (entry: Entry, modified: Partial<Entry>) => {
    console.log(entry, modified);
    this.applyEntries(s => s.entries.map(i => i == entry ? {...entry, ...modified} : i));
  };

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
      let gameResult: string;
      if (isNaN(i.diff)) gameResult = "*";
      else if (i.diff > 0) gameResult = "W";
      else if (i.diff < 0) gameResult = "L";
      else if (i.diff == 0) gameResult = "D";
      return gameResult != i.entry.wld ? {...i.entry, wld: gameResult} : i.entry;
    });
  }

  addRow() {
    const items = this.state.entries;
    const lastItem: Partial<Entry> = items[items.length - 1] || {};
    let session = lastItem.session || 1;

    const lastUpdate = getLastUpdate().getTime();
    const current = new Date().getTime();
    const diff = 1000 * 60 * 60 * 12;
    if (current - lastUpdate > diff) {
      session = session + 1;
    }

    const item = {
      id: lastItem.id + 1 || 1,
      session: session,
      sr: lastItem.sr || 2000,
      role: lastItem.role || "Support",
      size: lastItem.size || 2,
      season: lastItem.season || 26,
      wld: "default",
    };
    this.addItem(item);
    saveItems(items);

    // newRow.dataset.itemId = item.id.toString();

    // table.closest("div").scrollTop = table.closest("div").scrollHeight;
    // // updateWLD();
  }

  onStatRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const role = event.currentTarget.value;
    this.setState(s => ({lastStats: this.updateStats(s.entries, role)}));
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
    const file = event.target.files[0];
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
        <EntryTable items={this.state.entries} callback={this.callback} addItem={this.addItem} deleteItem={this.deleteItem} />
      </div>
      <div className="footer">
        <Button onClick={() => this.addRow()} intent={Intent.SUCCESS}>New entry</Button>
        <Button onClick={() => document.getElementById("importUpload").click()} intent={Intent.PRIMARY}>Import</Button>
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
      </div>
      <div className="mainRight">
        <Graphs items={this.state.entries} />
      </div>
    </div>;
  }
}
