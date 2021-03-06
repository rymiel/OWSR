import { getItems, setItems, saveItems, getLastUpdate } from "./ItemManager";
import { ROLES } from "./Constants";
import { updateWLD } from "./InfoManager";

export function rebuildTable() {
  // clear table
  let items = getItems();
  document.querySelector("#entries tbody").innerHTML = "";

  if (!items) {
    addRow();
  } else {
    items.forEach((item) => {
      addRow(item);
    });
  }
  window.dispatchEvent(new Event("updateAll"));
}

export function addRow(item?) {
  const items = getItems();
  if (!item) {
    const lastItem: any = items[items.length - 1] || {};
    let session = lastItem.session || "1";

    const lastUpdate = getLastUpdate().getTime();
    const current = new Date().getTime();
    const diff = 1000 * 60 * 60 * 12;
    if (current - lastUpdate > diff) {
      session = parseInt(session, 10) + 1;
    }

    item = {
      id: lastItem.id + 1 || 1,
      session: session.toString(),
      sr: lastItem.sr || "2000",
      role: lastItem.role || "Support",
      size: lastItem.size || "2",
      season: lastItem.season || "26",
      wld: "default",
    };
    items.push(item);
    saveItems();
  }
  const table = document.querySelector("#entries tbody");
  const newRow = document.createElement("tr");
  table.appendChild(newRow);
  newRow.dataset.itemId = item.id;

  const sessionCol = document.createElement("td");
  newRow.appendChild(sessionCol);
  sessionCol.classList.add("session");
  const sessionInput = document.createElement("input");
  sessionCol.appendChild(sessionInput);
  sessionInput.setAttribute("type", "text");
  sessionInput.value = item.session;
  sessionInput.addEventListener("change", saveRow);

  const srCol = document.createElement("td");
  newRow.appendChild(srCol);
  srCol.classList.add("sr");
  const srInput = document.createElement("input");
  srCol.appendChild(srInput);
  srInput.setAttribute("type", "text");
  srInput.value = item.sr;
  srInput.addEventListener("change", saveRow);

  const roleCol = document.createElement("td");
  newRow.appendChild(roleCol);
  roleCol.classList.add("role");
  const roleDropdown = document.createElement("select");
  roleCol.appendChild(roleDropdown);
  ROLES.forEach((role) => {
    const roleOption = document.createElement("option");
    roleDropdown.appendChild(roleOption);
    roleOption.innerText = role;
    roleOption.setAttribute("value", role);
  });
  roleDropdown.value = item.role;
  roleDropdown.addEventListener("change", saveRow);

  const wldCol = document.createElement("td");
  newRow.appendChild(wldCol);
  wldCol.classList.add("wld");
  wldCol.textContent = "...";

  const sizeCol = document.createElement("td");
  newRow.appendChild(sizeCol);
  sizeCol.classList.add("size");
  const sizeInput = document.createElement("input");
  sizeCol.appendChild(sizeInput);
  sizeInput.setAttribute("type", "text");
  sizeInput.value = item.size;
  sizeInput.addEventListener("change", saveRow);

  const seasonCol = document.createElement("td");
  newRow.appendChild(seasonCol);
  seasonCol.classList.add("season");
  const seasonInput = document.createElement("input");
  seasonCol.appendChild(seasonInput);
  seasonInput.setAttribute("type", "text");
  seasonInput.value = item.season;
  seasonInput.addEventListener("change", saveRow);

  const deleteCol = document.createElement("td");
  newRow.appendChild(deleteCol);
  const deleteButton = document.createElement("button");
  deleteCol.appendChild(deleteButton);
  deleteButton.innerText = "X";
  deleteButton.addEventListener("click", deleteRow);

  table.closest("div").scrollTop = table.closest("div").scrollHeight;
  updateWLD();
}

function saveRow(oEvent) {
  const items = getItems();
  const row = oEvent.target.closest("tr");
  const itemId = row.dataset.itemId;
  const itemIndex = items.findIndex((item) => {
    return item.id == itemId;
  });
  const item = items[itemIndex];
  item.session = row.querySelector(".session input").value;
  item.sr = row.querySelector(".sr input").value;
  item.role = row.querySelector(".role select").value;
  item.size = row.querySelector(".size input").value;
  item.season = row.querySelector(".season input").value;
  item.wld = "default";
  saveItems();
}

function deleteRow(oEvent) {
  const row = oEvent.target.closest("tr");
  const itemId = row.dataset.itemId;
  const items = getItems().reduce((acc, item) => {
    if (item.id != itemId) {
      acc.push(item);
    }
    return acc;
  }, []);
  setItems(items);
  row.parentElement.removeChild(row);
  saveItems();
}
