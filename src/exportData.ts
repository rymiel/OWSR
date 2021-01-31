import { setDirtyState } from "./DirtyState";
import { getItems } from "./ItemManager";

export function exportEntries() {
  const text = JSON.stringify(getItems());
  download(text, "entries.txt", "text/plain");
  setDirtyState(false);
}

function download(content, fileName, contentType) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
