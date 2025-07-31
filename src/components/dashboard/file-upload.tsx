"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ExperimentDataPoint } from "@/types/experiments";
import { Upload, Trash2 } from "lucide-react";
import React from "react";

interface FileUploadProps {
  onDataLoaded: (data: ExperimentDataPoint[]) => void;
  onClear: () => void;
  hasData: boolean;
}

export function FileUpload({ onDataLoaded, onClear, hasData }: FileUploadProps) {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a valid CSV file.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const parsedData = parseCSV(text);
        onDataLoaded(parsedData);
        toast({
          title: "File Loaded",
          description: `${parsedData.length} data points parsed successfully.`,
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "CSV Parsing Error",
          description: error.message || "Could not parse the CSV file.",
        });
      }
    };
    reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "File Read Error",
            description: "Could not read the selected file.",
        });
    }
    reader.readAsText(file);
    
    // Reset file input to allow re-uploading the same file
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const parseCSV = (content: string): ExperimentDataPoint[] => {
    const lines = content.trim().split(/\r?\n/);
    if (lines.length < 2) {
      throw new Error("CSV file is empty or has only a header.");
    }

    const header = lines[0].split(",").map(h => h.trim());
    const requiredCols = ["experiment_id", "metric_name", "step", "value"];
    const colIndices: Record<string, number> = {};

    requiredCols.forEach(col => {
        const index = header.indexOf(col);
        if (index === -1) {
            throw new Error(`Missing required column: ${col}`);
        }
        colIndices[col] = index;
    });

    return lines.slice(1).map((line, i) => {
      if (!line.trim()) return null; // Skip empty lines
      const values = line.split(",");
      if (values.length !== header.length) {
          console.warn(`Row ${i + 2}: Mismatched number of columns. Expected ${header.length}, got ${values.length}. Skipping.`);
          return null;
      }
      try {
        return {
          experiment_id: values[colIndices.experiment_id].trim(),
          metric_name: values[colIndices.metric_name].trim(),
          step: parseInt(values[colIndices.step].trim(), 10),
          value: parseFloat(values[colIndices.value].trim()),
        };
      } catch (e) {
          console.warn(`Could not parse row ${i + 2}: "${line}". Skipping.`);
          return null;
      }
    }).filter((p): p is ExperimentDataPoint => p !== null && !isNaN(p.step) && !isNaN(p.value));
  };
  
  if (hasData) {
    return (
        <Button variant="destructive" className="w-full" onClick={onClear}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear Data
        </Button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Input
        id="csv-upload"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
      <label htmlFor="csv-upload" className="w-full">
        <Button asChild className="w-full cursor-pointer">
          <span>
            <Upload className="mr-2 h-4 w-4" /> Upload CSV
          </span>
        </Button>
      </label>
      <p className="text-xs text-center text-muted-foreground">Select a file from your machine.</p>
    </div>
  );
}
