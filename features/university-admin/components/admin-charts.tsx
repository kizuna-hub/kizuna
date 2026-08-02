"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  activeVentureTrend,
  bottlenecks,
  readinessDistribution,
  stageMovement,
} from "../lib/university-admin-mock-data";

const axisTick = {
  fill: "var(--admin-muted)",
  fontSize: 10,
};

const tooltipStyle = {
  background: "var(--admin-surface)",
  border: "1px solid var(--admin-border)",
  borderRadius: "8px",
  color: "var(--admin-text)",
  fontSize: "11px",
};

export function ActiveVentureLineChart({
  compact = false,
  data = activeVentureTrend,
}: {
  compact?: boolean;
  data?: ReadonlyArray<{ label: string; value: number }>;
}) {
  return (
    <div className={compact ? "h-32" : "h-52"}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={[...data]}
          margin={{ top: 12, right: 16, left: -24, bottom: 0 }}
        >
          <CartesianGrid
            stroke="var(--admin-border)"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={axisTick}
            axisLine={{ stroke: "var(--admin-border)" }}
            tickLine={false}
          />
          <YAxis
            tick={axisTick}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Line
            type="monotone"
            dataKey="value"
            name="Venture hoạt động"
            stroke="var(--admin-primary)"
            strokeWidth={2.5}
            dot={{
              r: 3,
              fill: "var(--admin-surface)",
              stroke: "var(--admin-primary)",
              strokeWidth: 2,
            }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StageMovementChart({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className={compact ? "h-44" : "h-56"}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={stageMovement}
          margin={{ top: 12, right: 8, left: -24, bottom: 0 }}
        >
          <CartesianGrid
            stroke="var(--admin-border)"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={axisTick}
            axisLine={{ stroke: "var(--admin-border)" }}
            tickLine={false}
          />
          <YAxis tick={axisTick} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar
            dataKey="idea"
            name="Idea"
            stackId="stage"
            fill="var(--admin-primary)"
            radius={[0, 0, 3, 3]}
          />
          <Bar
            dataKey="prototype"
            name="Prototype"
            stackId="stage"
            fill="var(--admin-green)"
          />
          <Bar
            dataKey="pilot"
            name="Pilot"
            stackId="stage"
            fill="var(--admin-orange)"
          />
          <Bar
            dataKey="launched"
            name="Launched"
            stackId="stage"
            fill="var(--admin-purple)"
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BottlenecksChart({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className={compact ? "h-44" : "h-56"}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={bottlenecks}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid
            stroke="var(--admin-border)"
            strokeDasharray="3 3"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={axisTick}
            axisLine={{ stroke: "var(--admin-border)" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={112}
            tick={axisTick}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar
            dataKey="value"
            name="Số venture"
            fill="var(--admin-primary)"
            radius={[0, 4, 4, 0]}
            barSize={14}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReadinessDistributionChart({
  compact = false,
}: {
  compact?: boolean;
}) {
  const colors = [
    "var(--admin-primary)",
    "var(--admin-green)",
    "var(--admin-orange)",
    "var(--admin-purple)",
  ];
  return (
    <div className={compact ? "h-44" : "h-56"}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={readinessDistribution}
          margin={{ top: 12, right: 8, left: -24, bottom: 0 }}
        >
          <CartesianGrid
            stroke="var(--admin-border)"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={axisTick}
            axisLine={{ stroke: "var(--admin-border)" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            tick={axisTick}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`${value}%`, "Tỷ lệ"]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={28}>
            {readinessDistribution.map((entry, index) => (
              <Cell key={entry.label} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MentorDemandChart({
  data,
}: {
  data: ReadonlyArray<{ label: string; value: number }>;
}) {
  return (
    <div className="h-44">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={[...data]}
          layout="vertical"
          margin={{ top: 4, right: 14, left: 28, bottom: 0 }}
        >
          <XAxis
            type="number"
            tick={axisTick}
            axisLine={{ stroke: "var(--admin-border)" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={132}
            tick={axisTick}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar
            dataKey="value"
            name="Yêu cầu đang mở"
            fill="var(--admin-primary)"
            radius={[0, 3, 3, 0]}
            barSize={12}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
