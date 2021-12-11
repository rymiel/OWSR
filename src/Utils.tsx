import { RANK_THRESHOLDS, Role } from "./types";


export function CtxWLD(p: {value: number | string, style?: React.CSSProperties}) {
  let color = "white";
  if (p.value === "W" || p.value > 0) color = "lime";
  else if (p.value === "L" || p.value < 0) color = "red";
  else if (p.value === "D" || p.value === 0) color = "yellow";
  return <span style={{...p.style, color, fontWeight: "bold"}}>{p.value}</span>;
}

export function RankIcon(p: {sr: number}) {
  const highestMatchingRank = RANK_THRESHOLDS.filter((i) => p.sr >= i[0]).reduce((prev, curr) => prev[0] > curr[0] ? prev : curr);
  return <img src={`assets/rank-${highestMatchingRank[1]}Tier.png`} style={{height: "30px"}} />;
}

export function RoleIcon(p: {role: Role}) {
  return <img src={`assets/role-${p.role}.png`} style={{height: "22px", marginLeft: "auto"}} />;
}
