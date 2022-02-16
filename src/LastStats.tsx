import { H2, HTMLSelect, HTMLTable } from "@blueprintjs/core";
import { ChangeEvent, Component } from "react";
import { CtxWLD, RoleIcon } from "./Utils";
import { EntryDiff, ROLES } from "./types";

interface LastStatsProps {
  lastStats: EntryDiff[];
  updateStats: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export default class LastStats extends Component<LastStatsProps, Record<string, never>> {
  constructor(props: LastStatsProps) {
    super(props);
  }

  render() {
    return <div className="stats">
      <H2>Last 10 Games</H2>
      <span>Role</span>
      <HTMLSelect options={["All", ...ROLES]} onChange={this.props.updateStats}></HTMLSelect>
      <div className="table">
        <HTMLTable>
          <tbody>
            {this.props.lastStats.map(i =>
              <tr key={i.entry.id}>
                <td style={{textAlign: "center"}}><CtxWLD value={i.entry.wld} /></td>
                <td style={{textAlign: "right"}}><CtxWLD value={i.diff} /></td>
                <td><div style={{display: "flex"}}>
                  <RoleIcon role={i.entry.role} />
                </div></td>
                <td>{i.entry.role}</td>
              </tr>
            )}
          </tbody>
        </HTMLTable>
      </div>
    </div>;
  }
}
