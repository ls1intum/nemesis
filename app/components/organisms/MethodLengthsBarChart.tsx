"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@components/ui/chart";
import { MethodLengthBucketDAO } from "@server/domain/dao/methodLengthBucket";

const chartConfig = {
  desktop: {
    label: "Public Methods",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface MultipleBarChartProps {
  title: string;
  methodLengths: MethodLengthBucketDAO[];
  color: string;
}

export function MethodLengthsBarChart({ title, methodLengths, color }: MultipleBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {methodLengths.length === 0 ? (
          <p>No entries</p>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={methodLengthsChartData(methodLengths)}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="start"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => `>= ${value}`}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="count" fill={color} radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

function methodLengthsChartData(methodLengths: Array<MethodLengthBucketDAO>) {
  return methodLengths
    .sort((a, b) => a.locStartInclusive - b.locStartInclusive)
    .map((methodLength) => ({
      start: methodLength.locStartInclusive,
      end: methodLength.locEndInclusive,
      count: methodLength.count,
    }));
}
