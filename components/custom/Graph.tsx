"use client";

import React from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";

type chartData = {
  date: string;
  amount: number;
};

interface iAppProps {
  data: chartData[];
}

const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--primary))",
  },
};

export default function Graph({ data }: iAppProps) {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No paid invoices yet
      </p>
    );
  }
  return (
    <>
      <ChartContainer config={chartConfig} className="min-h-[300px]">
        <LineChart accessibilityLayer data={data}>
          <XAxis
            dataKey="date"
            tickMargin={8}
            tickFormatter={(str) =>
              new Date(str).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />
          <YAxis
            tickFormatter={(value) => {
              if (value >= 1_000_000_000) return `${value / 1_000_000_000}B`;
              if (value >= 1_000_000) return `${value / 1_000_000}M`;
              if (value >= 1_000) return `${value / 1_000}k`;
              return value;
            }}
          />

          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Line
            dataKey="amount"
            stroke={chartConfig.amount.color}
            type="monotone"
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </>
  );
}
