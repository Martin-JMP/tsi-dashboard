// Utility to parse and process CSV data

export type DataItem = {
  group: string;
  kpi: string;
  france: string;
  latvia: string;
  // For numerical comparisons
  franceNumeric?: number;
  latviaNumeric?: number;
};

// Data structure grouped by category
export type DataByGroup = {
  [key: string]: DataItem[];
};

// Parse CSV data into a structured format
export function parseCSVData(csvData: string): DataItem[] {
  const lines = csvData.trim().split('\n');
  
  return lines.slice(1).map(line => {
    const values = line.split(';');
    const item: DataItem = {
      group: values[0],
      kpi: values[1],
      france: values[2],
      latvia: values[3],
    };
    
    // Convert numerical values (replacing comma with dot for proper parsing)
    const franceValue = values[2].replace(',', '.');
    const latviaValue = values[3].replace(',', '.');
    
    if (!isNaN(Number(franceValue))) {
      item.franceNumeric = Number(franceValue);
    }
    
    if (!isNaN(Number(latviaValue))) {
      item.latviaNumeric = Number(latviaValue);
    }
    
    return item;
  });
}

// Group data by the 'Group KPI' category
export function groupDataByCategory(data: DataItem[]): DataByGroup {
  return data.reduce((groups, item) => {
    if (!groups[item.group]) {
      groups[item.group] = [];
    }
    groups[item.group].push(item);
    return groups;
  }, {} as DataByGroup);
}

// Get all unique groups
export function getUniqueGroups(data: DataItem[]): string[] {
  return Array.from(new Set(data.map(item => item.group)));
}

// Format value for display (adding % symbol, etc. based on KPI)
export function formatValue(value: string, kpi: string): string {
  if (kpi.includes('%')) {
    return value + '%';
  }
  return value;
}