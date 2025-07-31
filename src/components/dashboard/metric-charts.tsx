"use client";

import { useMemo } from "react";
import { ExperimentDataPoint } from "@/types/experiments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";

interface MetricChartsProps {
  data: ExperimentDataPoint[];
  selectedExperiments: string[];
  experimentColors: Record<string, string>;
}

type ChartData = {
  metricName: string;
  dataForChart: (Record<string, number | string>)[];
};

export function MetricCharts({
  data,
  selectedExperiments,
  experimentColors,
}: MetricChartsProps) {
  const chartData = useMemo<ChartData[]>(() => {
    const filteredData = data.filter((d) =>
      selectedExperiments.includes(d.experiment_id)
    );

    const metrics = filteredData.reduce((acc, point) => {
      const { metric_name } = point;
      if (!acc[metric_name]) {
        acc[metric_name] = [];
      }
      acc[metric_name].push(point);
      return acc;
    }, {} as Record<string, ExperimentDataPoint[]>);

    return Object.entries(metrics).map(([metricName, points]) => {
      const steps = new Map<number, Record<string, number | string>>();
      points.forEach((p) => {
        if (!steps.has(p.step)) {
          steps.set(p.step, { step: p.step });
        }
        steps.get(p.step)![p.experiment_id] = p.value;
      });
      const dataForChart = Array.from(steps.values()).sort(
        (a, b) => (a.step as number) - (b.step as number)
      );
      return { metricName, dataForChart };
    });
  }, [data, selectedExperiments]);

  if (chartData.length === 0) {
    return (
        <Card className="flex flex-col items-center justify-center p-8 text-center h-96">
            <h3 className="text-lg font-semibold">No Metrics to Display</h3>
            <p className="text-sm text-muted-foreground">The selected experiments do not have any metrics to visualize.</p>
        </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {chartData.map(({ metricName, dataForChart }) => (
        <Card key={metricName}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5 text-primary" />
                <span className="truncate">{metricName}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-64 w-full">
                <ResponsiveContainer>
                    <LineChart data={dataForChart} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="step" type="number" domain={['dataMin', 'dataMax']} tickLine={false} axisLine={false} tickMargin={8} name="Step" />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.toPrecision(3)}/>
                        <ChartTooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                         <ChartLegend content={<ChartLegendContent />} />
                        {selectedExperiments.map((id) => (
                            <Line
                            key={id}
                            type="monotone"
                            dataKey={id}
                            stroke={experimentColors[id] || "#000"}
                            strokeWidth={2}
                            dot={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
