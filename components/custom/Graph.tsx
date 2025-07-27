"use client";

import React from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
    color: "var(--primary)",
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
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <LineChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            scale="point"
            domain={["dataMin", "dataMax"]}
            padding={{ left: 0, right: 0 }}
            tickMargin={8}
            minTickGap={32}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <YAxis
            width={30}
            tickFormatter={(value) => {
              if (value >= 1_000_000_000) return `${value / 1_000_000_000}B`;
              if (value >= 1_000_000) return `${value / 1_000_000}M`;
              if (value >= 1_000) return `${value / 1_000}k`;
              return value;
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                nameKey="Amount"
                indicator="line"
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
              />
            }
          />
          <Line
            dataKey="amount"
            type="monotone"
            stroke={chartConfig.amount.color}
            strokeWidth={2}
          />
        </LineChart>
      </ChartContainer>
    </>
  );
}
