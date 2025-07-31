"use client";

import { useState } from "react";
import { ExperimentDataPoint } from "@/types/experiments";
import { FileUpload } from "./file-upload";
import { ExperimentSelector } from "./experiment-selector";
import { MetricCharts } from "./metric-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Beaker, UploadCloud } from "lucide-react";
import { EmptyChartState } from "./empty-chart-state";

const PALETTE = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(22, 82%, 52%)",
  "hsl(150, 68%, 40%)",
  "hsl(300, 76%, 60%)",
];

export default function ExperimentDashboard() {
  const [data, setData] = useState<ExperimentDataPoint[]>([]);
  const [selectedExperiments, setSelectedExperiments] = useState<string[]>([]);
  const [experimentColors, setExperimentColors] = useState<Record<string, string>>({});

  const experiments = Array.from(new Set(data.map((d) => d.experiment_id)));

  const handleDataLoaded = (loadedData: ExperimentDataPoint[]) => {
    setData(loadedData);
    const uniqueExperiments = Array.from(new Set(loadedData.map((d) => d.experiment_id)));
    const newColors: Record<string, string> = {};
    uniqueExperiments.forEach((id, index) => {
      newColors[id] = PALETTE[index % PALETTE.length];
    });
    setExperimentColors(newColors);
    setSelectedExperiments(uniqueExperiments); // Select all by default
  };
  
  const handleClearData = () => {
    setData([]);
    setSelectedExperiments([]);
    setExperimentColors({});
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Experiment Inspector
          </h1>
          <p className="text-muted-foreground">
            Upload, inspect, and compare machine learning experiment logs.
          </p>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
          <aside className="col-span-1 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UploadCloud className="h-5 w-5" />
                  <span>Upload Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload onDataLoaded={handleDataLoaded} onClear={handleClearData} hasData={data.length > 0} />
              </CardContent>
            </Card>

            {data.length > 0 && (
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="h-5 w-5" />
                    <span>Experiments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ExperimentSelector
                    experiments={experiments}
                    selectedExperiments={selectedExperiments}
                    onSelectionChange={setSelectedExperiments}
                    experimentColors={experimentColors}
                  />
                </CardContent>
              </Card>
            )}
          </aside>

          <main className="col-span-1 lg:col-span-3">
            {selectedExperiments.length > 0 ? (
              <MetricCharts
                data={data}
                selectedExperiments={selectedExperiments}
                experimentColors={experimentColors}
              />
            ) : (
              <EmptyChartState />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
