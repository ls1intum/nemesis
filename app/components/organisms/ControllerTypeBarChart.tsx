"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@components/ui/chart";
import { cn } from "@lib/cn";
import { EndpointTypeCountDAO } from "@server/domain/dao/endpointTypeCount";

const chartConfig = {
  count: {
    label: "count",
  },
  get: {
    label: "GET",
    color: "hsl(var(--chart-1))",
  },
  post: {
    label: "POST",
    color: "hsl(var(--chart-2))",
  },
  put: {
    label: "PUT",
    color: "hsl(var(--chart-3))",
  },
  patch: {
    label: "PATCH",
    color: "hsl(var(--chart-4))",
  },
  delete: {
    label: "DELETE",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

interface LabeledPieChartProps {
  className?: string;
  endpointTypeCount: EndpointTypeCountDAO;
}

export function ControllerTypeBarChart({ className, endpointTypeCount }: LabeledPieChartProps) {
  const data = restEndpointTypesChartData(endpointTypeCount);
  const totalNumberEndpoints = data.reduce((a, b) => a + b.count, 0);
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>REST Endpoint Types</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center pb-0">
        {totalNumberEndpoints === 0 ? (
          <p>No endpoints exist for this module</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-full max-h-[250px] w-full [&_.recharts-text]:fill-background">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
              <Pie data={data} dataKey="count"></Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="endpointType" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

function restEndpointTypesChartData(endpointTypeCount: EndpointTypeCountDAO) {
  return [
    { endpointType: "delete", count: endpointTypeCount.delete, fill: "var(--color-delete)" },
    { endpointType: "get", count: endpointTypeCount.get, fill: "var(--color-get)" },
    { endpointType: "patch", count: endpointTypeCount.patch, fill: "var(--color-patch)" },
    { endpointType: "post", count: endpointTypeCount.post, fill: "var(--color-post)" },
    { endpointType: "put", count: endpointTypeCount.put, fill: "var(--color-put)" },
  ];
}
