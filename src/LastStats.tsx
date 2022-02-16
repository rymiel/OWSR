import { H2, HTMLTable } from "@blueprintjs/core";
import { Component } from "react";
import { CtxWLD, RoleIcon } from "./Utils";
import { EntryDiff } from "./types";

interface LastStatsProps {
  lastStats: EntryDiff[];
}

export default class LastStats extends Component<LastStatsProps, Record<string, never>> {
  constructor(props: LastStatsProps) {
    super(props);
  }

  render() {
    return <div className="stats">
      <H2>Last 10 Games</H2>
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
