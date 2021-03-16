import React, { useCallback, useState } from "react";
import { PieChart, Pie, Cell, Sector } from "recharts";

const COLORS = ["#00B74A", "#F93154", "#FFA900"];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    value,
    name,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 10) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 6;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 3}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${name}: ${value}`}</text>
    </g>
  );
};
const ProficiencyChart = ({ proficiency }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );
  const onPieLeave = () => {
    setActiveIndex(-1)
  }
  let cnvProficiency = Object.keys(proficiency).map((key) => ({
    name: key,
    value: Number(proficiency[key]),
    color:
      key === "correct" ? COLORS[0] : key === "wrong" ? COLORS[1] : COLORS[2],
  }));
  return (
    <PieChart width={290} height={200}>
      <Pie
        activeIndex={activeIndex}
        activeShape={renderActiveShape}
        data={cnvProficiency}
        dataKey="value"
        cx="50%"
        cy="51.5%"
        innerRadius={41}
        outerRadius={53}
        fill="#82ca9d"
        paddingAngle={2}
        onMouseEnter={onPieEnter}
        onMouseLeave={onPieLeave}
      >
        {cnvProficiency.map(({ color }, index) => (
          <Cell key={`cell-${index}`} fill={color} />
        ))}
      </Pie>
    </PieChart>
  );
};

export { ProficiencyChart };
