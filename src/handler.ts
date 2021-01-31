import { loadFromLocalStorage } from "./ItemManager";
import {
  getDirtyState,
  initIgnoreDirtyState,
  setDirtyState,
} from "./DirtyState";
import { initCharts, updateCharts } from "./GraphManager";
import {
  updateStats,
  updateInfo,
  updateSeasonSelect,
  updateWLD,
} from "./InfoManager";
import { addRow, rebuildTable } from "./TableManager";
import { importEntries } from "./importData";
import { exportEntries } from "./exportData";

declare const window: any;

export function init() {
  window.addEventListener("load", () => {
    initIgnoreDirtyState(document.querySelector("#cbxDirtyState"));
    loadFromLocalStorage();
    initCharts();
    rebuildTable();
    setDirtyState(false);
    window.dispatchEvent(new Event("updateAll"));
  });

  window.addEventListener("beforeunload", (event) => {
    if (getDirtyState()) {
      const message = "You may export the latest changes";
      event.returnValue = message;
      return message;
    }
  });

  window.addEventListener("updateAll", () => {
    updateSeasonSelect();
    updateCharts();
    updateStats();
    updateInfo();
    updateWLD();
  });

  window.updateStats = updateStats;
  window.updateSeasonStats = () => {
    updateCharts();
  };
  window.addRow = addRow;
  window.exportEntries = exportEntries;
  window.importEntries = importEntries;
  window.setProgressChart = (event) => {
    // Reset Charts
    const progressCharts = ["ctxProgress1", "ctxProgress2"];
    progressCharts.forEach((value) => {
      const element = document.getElementById(value);
      element.style.display = "none";
    });

    // Show correct chart
    const select = <HTMLSelectElement>document.getElementById("progressSelect");
    const value = select.value;
    const element = document.getElementById(value);
    element.style.display = "";
  };
}
