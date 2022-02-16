import { Button, HTMLSelect, HTMLTable, Intent, NumericInput } from "@blueprintjs/core";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, Component, memo } from "react";
import { CtxWLD, RankIcon, RoleIcon } from "./Utils";
import { Entry, Role, ROLES } from "./types";

type AppCallback = (entry: Entry, modified: Partial<Entry>) => void;
type ItemCallback = (entry: Entry) => void;
interface EntryTableProps {
  callback: AppCallback;
  addItem: ItemCallback;
  deleteItem: ItemCallback;
  seasonFilter: string;
  roleFilter: string;
  items: Entry[];
}

export default class EntryTable extends Component<EntryTableProps, Record<string, never>> {
  constructor(props: EntryTableProps) {
    super(props);
  }

  render() {
    let items = this.props.items;
    if (this.props.roleFilter !== "All") items = items.filter(item => item.role == this.props.roleFilter);
    if (this.props.seasonFilter !== "All") items = items.filter(item => `S${item.season}` == this.props.seasonFilter);

    return <div id="entries">
      <HTMLTable>
        <thead>
          <tr>
            <th>Session</th>
            <th>SR</th>
            <th>Role</th>
            <th>W/L/D</th>
            <th>Team Size</th>
            <th>Season</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => <MemoEntryRow callback={this.props.callback} key={i.id} entry={i} deleteItem={this.props.deleteItem} />)}
        </tbody>
      </HTMLTable>
    </div>;
  }
}

const MemoEntryRow = memo(EntryRow, (prev, next) => prev.entry == next.entry);

function EntryRowInput(p: {callback: AppCallback, entry: Entry, entryKey: keyof Entry, size: number}) {
  const value = p.entry[p.entryKey];
  const handleChange = (newNumber: number) => p.callback(p.entry, {[p.entryKey]: newNumber});
  return <NumericInput buttonPosition="none" className="flex-input" size={p.size} defaultValue={value} onValueChange={handleChange} />;
}

function RoleDropdown(p: {callback: AppCallback, entry: Entry}) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => p.callback(p.entry, {role: event.currentTarget.value as Role});
  return <HTMLSelect options={[...ROLES]} defaultValue={p.entry.role} onChange={handleChange}></HTMLSelect>;
}

function EntryRow(p: {callback: AppCallback, entry: Entry, deleteItem: ItemCallback}) {
  return <tr>
    <td><EntryRowInput callback={p.callback} size={3} entry={p.entry} entryKey="session" /></td>
    <td>
      <div style={{display: "flex"}}>
        <EntryRowInput callback={p.callback} size={4} entry={p.entry} entryKey="sr" />
        <RankIcon sr={p.entry.sr} />
      </div>
    </td>
    <td>
      <div style={{display: "flex", alignItems: "center", height: "30px"}}>
        <span style={{marginRight: "0.25em"}}><RoleDropdown callback={p.callback} entry={p.entry} /></span>
        <RoleIcon role={p.entry.role} />
      </div>
    </td>
    <td style={{verticalAlign: "middle", textAlign: "center", fontSize: "18px"}}>
      <CtxWLD value={p.entry.wld} />
    </td>
    <td><EntryRowInput callback={p.callback} size={1} entry={p.entry} entryKey="size" /></td>
    <td><EntryRowInput callback={p.callback} size={2} entry={p.entry} entryKey="season" /></td>
    <td><Button intent={Intent.DANGER} onClick={() => p.deleteItem(p.entry)}><FontAwesomeIcon icon={faTrashAlt} /></Button></td>
  </tr>;
}
