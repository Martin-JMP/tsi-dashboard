'use client';
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './SalaryComparisonChart.module.css';
import SalaryComparisonCard from './SalaryComparisonCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Type definitions for the salary data
type SalaryData = {
  Sector_ID: string;
  Sector_Name: string;
  Country: string;
  Average_Salary_2023: number;
  Salary_Currency: string;
};

type SectorData = {
  id: string;
  name: string;
  franceSalary: number;
  latviaSalary: number;
};

// Raw salary data for France and Latvia
const sectors = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'TOTAL'
];

const sectorNames = {
  'A': 'Agriculture, forestry and fishing',
  'B': 'Mining and quarrying',
  'C': 'Manufacturing',
  'D': 'Electricity, gas, steam and air conditioning supply',
  'E': 'Water supply, sewerage, waste management',
  'F': 'Construction',
  'G': 'Wholesale and retail trade',
  'H': 'Transportation and storage',
  'I': 'Accommodation and food service',
  'J': 'Information and communication',
  'K': 'Financial and insurance activities',
  'L': 'Real estate activities',
  'M': 'Professional, scientific and technical activities',
  'N': 'Administrative and support services',
  'O': 'Public administration and defence',
  'P': 'Education',
  'Q': 'Human health and social work',
  'R': 'Arts, entertainment and recreation',
  'S': 'Other service activities',
  'TOTAL': 'All sectors'
};

const franceSalaries = {
  'A': 2200, 'B': 2400, 'C': 2400, 'D': 2600, 'E': 2100,
  'F': 2100, 'G': 2000, 'H': 2500, 'I': 1900, 'J': 4200,
  'K': 4800, 'L': 2600, 'M': 4300, 'N': 2200, 'O': 3100,
  'P': 2400, 'Q': 2500, 'R': 2800, 'S': 2000, 'TOTAL': 2600
};

const latviaSalaries = {
  'A': 1124, 'B': 1239, 'C': 1070, 'D': 1452, 'E': 1099,
  'F': 1048, 'G': 1008, 'H': 1072, 'I': 738, 'J': 1817,
  'K': 1928, 'L': 909, 'M': 1416, 'N': 963, 'O': 1313,
  'P': 918, 'Q': 1192, 'R': 951, 'S': 926, 'TOTAL': 1119
};

interface SalaryComparisonChartProps {
  onSectorChange?: (sector: string) => void;
  highlightedSectors?: string[];
}

export default function SalaryComparisonChart({ 
  onSectorChange,
  highlightedSectors = []
}: SalaryComparisonChartProps) {
  // State for selected sector
  const [selectedSector, setSelectedSector] = useState<string>("TOTAL");
  
  // Process data to sort by France salary from lowest to highest
  const processedData = sectors
    .filter(sector => sector !== 'TOTAL') // Exclude TOTAL from the main chart
    .map(sector => ({
      id: sector,
      name: sectorNames[sector as keyof typeof sectorNames],
      franceSalary: franceSalaries[sector as keyof typeof franceSalaries],
      latviaSalary: latviaSalaries[sector as keyof typeof latviaSalaries]
    }))
    .sort((a, b) => a.franceSalary - b.franceSalary); // Sort by France salary from lowest to highest
  
  // Handle click on chart bars
  const handleBarClick = (event: any, elements: any[]) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const sectorId = processedData[index].id;
      setSelectedSector(sectorId);
      if (onSectorChange) {
        onSectorChange(sectorId);
      }
    }
  };

  // Notify parent component about sector change
  useEffect(() => {
    if (onSectorChange) {
      onSectorChange(selectedSector);
    }
  }, [selectedSector, onSectorChange]);

  // Get data for the selected sector
  const getSelectedSectorData = () => {
    if (selectedSector === "TOTAL") {
      return {
        id: "TOTAL",
        name: sectorNames["TOTAL"],
        franceSalary: franceSalaries["TOTAL"],
        latviaSalary: latviaSalaries["TOTAL"]
      };
    } else {
      return processedData.find(item => item.id === selectedSector) || {
        id: "TOTAL",
        name: sectorNames["TOTAL"],
        franceSalary: franceSalaries["TOTAL"],
        latviaSalary: latviaSalaries["TOTAL"]
      };
    }
  };

  // Calculate differences for the selected sector
  const selectedSectorData = getSelectedSectorData();
  const absoluteDifference = selectedSectorData.franceSalary - selectedSectorData.latviaSalary;
  const percentageDifference = (absoluteDifference / selectedSectorData.latviaSalary) * 100;

  // Chart data and options
  const chartData = {
    labels: processedData.map(item => item.id),
    datasets: [
      {
        label: 'France',
        data: processedData.map(item => item.franceSalary),
        backgroundColor: processedData.map(item => 
          highlightedSectors.length > 0 && !highlightedSectors.includes(item.id)
            ? 'rgba(0, 85, 164, 0.3)' // More transparent if not highlighted
            : 'rgba(0, 81, 255, 0.8)' // Original opacity if highlighted or no highlights
        ),
        borderColor: '#0055A4',
        borderWidth: 1,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      },
      {
        label: 'Latvia',
        data: processedData.map(item => item.latviaSalary),
        backgroundColor: processedData.map(item => 
          highlightedSectors.length > 0 && !highlightedSectors.includes(item.id)
            ? 'rgba(158, 48, 57, 0.3)' // More transparent if not highlighted
            : 'rgba(226, 0, 19, 0.8)' // Original opacity if highlighted or no highlights
        ),
        borderColor: '#9E3039',
        borderWidth: 1,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }
    ]
  };

  // Chart options avec maintainAspectRatio à false pour respecter la hauteur définie
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Important pour contrôler la hauteur
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          title: function(context: any) {
            const index = context[0].dataIndex;
            return processedData[index].name;
          },
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw} €`;
          }
        }
      },
      datalabels: {
        display: true,
        color: 'white',
        align: 'end',
        anchor: 'end',
        formatter: function(value: number) {
          return value + ' €';
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Salary (EUR)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Sector'
        },
        ticks: {
          callback: function(value: any, index: number) {
            return processedData[index].id;
          }
        }
      }
    },
    onClick: handleBarClick
  };

  return (
    <div className={styles.dashboardCard}>
      <div className={styles.cardGlass}>
        <div className={styles.chartLayout}>
          <div className={styles.mainChart}>
            <Bar 
              data={chartData}
              options={chartOptions}
              height={300} // Définir la hauteur explicite à 300px
              plugins={[
                {
                  id: 'customBarLabels',
                  afterDatasetsDraw: function(chart: any) {
                    const ctx = chart.ctx;
                    chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
                      const meta = chart.getDatasetMeta(datasetIndex);
                      if (!meta.hidden) {
                        meta.data.forEach((bar: any, index: number) => {
                          const data = dataset.data[index].toString();
                          ctx.fillStyle = '#333';
                          ctx.font = '10px Arial';
                          ctx.textAlign = 'center';
                          ctx.textBaseline = 'bottom';
                          ctx.fillText(data + ' €', bar.x, bar.y - 5);
                        });
                      }
                    });
                  }
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}