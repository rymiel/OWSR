import { Component } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { COLORS, ROLES, Entry } from "./types";

interface GraphsProps {
  items: Entry[];
}
// const PROGRESS_ENTRY_LENGTH = 20;

export default class Graphs extends Component<GraphsProps, Record<string, never>> {
  constructor(props: GraphsProps) {
    super(props);
  }

  render() {
    const dataset = ROLES.map((group) => {
      const groupItems = this.props.items.filter(i => i.role == group);
      const stretchBy = groupItems.length - 1;
      return {
        role: group,
        data: groupItems.map((e, i) => ({sr: e.sr, id: i / stretchBy}))
      };
    });

    return <>
      <div style={{position: 'relative', width: '100%', paddingBottom: '30%'}}>
        <div className="graph-container">
          <ResponsiveContainer>
            <LineChart>
              <XAxis tick={false} dataKey="id" type="number" allowDuplicatedCategory={false} />
              <YAxis type="number" domain={['auto', 'auto']} />
              <CartesianGrid stroke="#151515" />
              {dataset.map(i => (
                <Line type="monotone" dataKey="sr" data={i.data}
                      key={i.role} name={i.role} stroke={COLORS[i.role]}
                      dot={false} strokeWidth={2} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>;
  }
}
