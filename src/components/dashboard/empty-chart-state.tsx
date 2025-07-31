import { Card } from "@/components/ui/card";
import { Rocket } from "lucide-react";

export function EmptyChartState() {
  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[500px] border-dashed">
      <div className="rounded-full bg-primary/10 p-4">
        <Rocket className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-6 text-2xl font-semibold tracking-tight">
        Ready to Inspect?
      </h3>
      <p className="mt-2 text-muted-foreground">
        Upload a CSV file and select experiments to visualize the metrics.
      </p>
    </Card>
  );
}
