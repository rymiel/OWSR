import { H2, HTMLTable } from "@blueprintjs/core";
import { Component } from "react";
import { Entry, ROLES, WLDOptions } from "./types";

interface SeasonStatsProps {
  entries: Entry[];
  season: number;
}

export default class SeasonStats extends Component<SeasonStatsProps, Record<string, never>> {
  constructor(props: SeasonStatsProps) {
    super(props);
  }

  asPercentage(i: number) {
    if (isNaN(i)) {
      return "?";
    } else {
      return (i * 100).toFixed(1) + "%";
    }
  }

  render() {
    const rolesWithAll = ["All", ...ROLES] as const;
    const entriesByRole = new Map(rolesWithAll.map(
      i => [i, this.props.entries.filter(
        j => (this.props.season === 0 || j.season === this.props.season) && (i === "All" || j.role === i))]
      )
    );
    const wldByRole = new Map([...entriesByRole].map(
      ([k, v]) => [k, new Map(WLDOptions.map(
        j => [j, v.filter(k => k.wld === j)]
      ))]
    ));
    const winrateByRole = new Map([...wldByRole].map(
      ([k, v]) => [k, (v.get("W")!.length / (entriesByRole.get(k)!.length - v.get("D")!.length - v.get("*")!.length))]
    ));
    return <div className="stats">
      <H2>{this.props.season === 0 ? "Overall" : `Season ${this.props.season}`} Stats</H2>
      <div className="table">
        <HTMLTable>
          <thead>
            <tr>
              <th></th>
              <th>W</th>
              <th>L</th>
              <th>D</th>
              <th>Winrate</th>
            </tr>
          </thead>
          <tbody>
            {rolesWithAll.map(i => <tr key={i}>
              <th>{i}</th>
              <td>{wldByRole.get(i)!.get("W")!.length}</td>
              <td>{wldByRole.get(i)!.get("L")!.length}</td>
              <td>{wldByRole.get(i)!.get("D")!.length}</td>
              <td>{this.asPercentage(winrateByRole.get(i)!)}</td>
            </tr>)}
          </tbody>
        </HTMLTable>
      </div>
    </div>;
  }
}
