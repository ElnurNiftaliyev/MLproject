"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

interface ExperimentSelectorProps {
  experiments: string[];
  selectedExperiments: string[];
  onSelectionChange: (selected: string[]) => void;
  experimentColors: Record<string, string>;
}

export function ExperimentSelector({
  experiments,
  selectedExperiments,
  onSelectionChange,
  experimentColors,
}: ExperimentSelectorProps) {
  const handleSelectAll = () => {
    onSelectionChange(experiments);
  };

  const handleDeselectAll = () => {
    onSelectionChange([]);
  };

  const handleExperimentToggle = (experimentId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedExperiments, experimentId]);
    } else {
      onSelectionChange(selectedExperiments.filter((id) => id !== experimentId));
    }
  };

  const allSelected = experiments.length > 0 && selectedExperiments.length === experiments.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button
          variant="link"
          className="p-0 h-auto"
          onClick={allSelected ? handleDeselectAll : handleSelectAll}
        >
          {allSelected ? "Deselect All" : "Select All"}
        </Button>
        <div className="text-sm text-muted-foreground">
          {selectedExperiments.length} / {experiments.length} selected
        </div>
      </div>
      <ScrollArea className="h-64">
        <div className="flex flex-col gap-3 pr-4">
          {experiments.map((id) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={selectedExperiments.includes(id)}
                onCheckedChange={(checked) =>
                  handleExperimentToggle(id, checked as boolean)
                }
                style={{
                  backgroundColor: selectedExperiments.includes(id)
                    ? experimentColors[id]
                    : undefined,
                  borderColor: experimentColors[id],
                }}
              />
              <Label
                htmlFor={id}
                className="flex-1 cursor-pointer truncate"
                title={id}
              >
                {id}
              </Label>
              <div
                className="h-4 w-4 rounded-full shrink-0"
                style={{ backgroundColor: experimentColors[id] }}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
