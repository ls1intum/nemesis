"use client";

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@components/ui/chart";

const chartConfig = {
  count: {
    label: "count",
  },
  controller: {
    label: "Controller",
    color: "hsl(var(--controller))",
  },
  service: {
    label: "Service",
    color: "hsl(var(--service))",
  },
  repository: {
    label: "Repository",
    color: "hsl(var(--repository))",
  },
  entity: {
    label: "Entity",
    color: "hsl(var(--entity))",
  },
  dto: {
    label: "DTO",
    color: "hsl(var(--dto))",
  },
} satisfies ChartConfig;

interface ClassTypeChartData {
  semanticClassType: string;
  count: number;
  fill: string;
}

interface SimpleBarChartProps {
  className?: string;
  chartData: ClassTypeChartData[];
  title: string;
}

export function ClassTypeBarChartCard({ className, title, chartData }: SimpleBarChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="semanticClassType" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="count"
              strokeWidth={2}
              radius={8}
              activeIndex={2}
              activeBar={({ ...props }) => {
                // eslint-disable-next-line react/prop-types
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                );
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
