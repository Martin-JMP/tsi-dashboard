import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Bar } from 'react-chartjs-2';
import styles from './SalaryComparisonChart.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

// Sector names object for lookup
const sectorNames: { [key: string]: string } = {
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
  'M': 'Professional, scientific and technical',
  'N': 'Administrative and support services',
  'O': 'Public administration and defence',
  'P': 'Education',
  'Q': 'Human health and social work',
  'R': 'Arts, entertainment and recreation',
  'S': 'Other service activities',
  'TOTAL': 'Total All Sectors'
};

// French salaries for each sector (EUR)
const franceSalaries: { [key: string]: number } = {
  'A': 2012, 'B': 3183, 'C': 3115, 'D': 3542, 'E': 2584,
  'F': 2163, 'G': 2245, 'H': 2812, 'I': 1817, 'J': 3924,
  'K': 4181, 'L': 2714, 'M': 3415, 'N': 2132, 'O': 2543,
  'P': 2348, 'Q': 2165, 'R': 2043, 'S': 2142, 'TOTAL': 2512
};

// Latvian salaries for each sector (EUR)
const latviaSalaries: { [key: string]: number } = {
  'A': 978, 'B': 1280, 'C': 1119, 'D': 1525, 'E': 1004,
  'F': 1048, 'G': 1008, 'H': 1072, 'I': 738, 'J': 1817,
  'K': 1928, 'L': 909, 'M': 1416, 'N': 963, 'O': 1313,
  'P': 918, 'Q': 1192, 'R': 951, 'S': 926, 'TOTAL': 1119
};

interface SalaryComparisonChartProps {
  onSectorChange?: (sector: string | null) => void;
  highlightedSector?: string | null;
  highlightedSectors?: string[];
  onHighlightChange?: (sectors: string[]) => void;
}

interface ProcessedData {
  id: string;
  name: string;
  franceSalary: number;
  latviaSalary: number;
  percentageDiff: number;
}

type SortOrderType = 'asc' | 'desc' | 'default' | 'latvia';

export default function SalaryComparisonChart({
  onSectorChange,
  highlightedSector,
  highlightedSectors = [],
  onHighlightChange
}: SalaryComparisonChartProps) {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrderType>('default');

  // Process raw data into a format suitable for charting
  const processedData = useMemo<ProcessedData[]>(() => {
    return Object.keys(sectorNames)
      .map(id => ({
        id,
        name: sectorNames[id],
        franceSalary: franceSalaries[id],
        latviaSalary: latviaSalaries[id],
        percentageDiff: ((franceSalaries[id] - latviaSalaries[id]) / latviaSalaries[id]) * 100
      }));
  }, []);
  // Sorted data based on the current sort order
  const sortedData = useMemo(() => {
    switch (sortOrder) {
      case 'latvia':
        // Tri des salaires lettons du plus bas au plus haut (gauche à droite)
        return [...processedData].sort((a, b) => a.latviaSalary - b.latviaSalary);
      case 'asc':
        return [...processedData].sort((a, b) => a.percentageDiff - b.percentageDiff);
      case 'desc':
        return [...processedData].sort((a, b) => b.percentageDiff - a.percentageDiff);
      default:
        // Tri des salaires français du plus bas au plus haut (gauche à droite)
        return [...processedData].sort((a, b) => a.franceSalary - b.franceSalary);
    }
  }, [sortOrder, processedData]);

  // Update highlighted sectors when sorting changes
  useEffect(() => {
    const sortedSectors = sortOrder ? sortedData.slice(0, 3).map(item => item.id) : [];
    onHighlightChange?.(sortedSectors);
  }, [sortOrder, sortedData, onHighlightChange]);

  // Handle click on chart bars
  const handleBarClick = useCallback((event: any, elements: Array<{index: number}>) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const currentData = sortOrder ? sortedData : processedData;
      const sectorId = currentData[index].id;

      if (selectedSector === sectorId) {
        setSelectedSector(null);
        onSectorChange?.(null);
      } else {
        setSelectedSector(sectorId);
        onSectorChange?.(sectorId);
      }
    }
  }, [processedData, sortedData, sortOrder, onSectorChange, selectedSector]);
  // Chart data with memoization
  const chartData = useMemo(() => ({
    labels: (sortOrder ? sortedData : processedData).map(item => item.name),
    datasets: [
      {        
        label: 'Latvia',
        data: (sortOrder ? sortedData : processedData).map(item => item.latviaSalary),
        backgroundColor: (sortOrder ? sortedData : processedData).map(item => {
          if (!highlightedSector || highlightedSector === "TOTAL") {
            return 'rgba(226, 0, 19, 0.7)';
          }
          return highlightedSector === item.id ? 'rgba(226, 0, 19, 0.8)' : 'rgba(226, 0, 19, 0.2)';
        }),
        borderColor: (sortOrder ? sortedData : processedData).map(item => {
          if (!highlightedSector || highlightedSector === "TOTAL") {
            return '#9E3039';
          }
          return highlightedSector === item.id ? '#9E3039' : '#9E303940';
        }),
        borderWidth: 1,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      },
      {
        label: 'France',
        data: (sortOrder ? sortedData : processedData).map(item => item.franceSalary),
        backgroundColor: (sortOrder ? sortedData : processedData).map(item => {
          if (!highlightedSector || highlightedSector === "TOTAL") {
            return '#0055A4';
          }
          return highlightedSector === item.id ? '#0055A4' : '#0055A440';
        }),
        borderColor: (sortOrder ? sortedData : processedData).map(item => {
          if (!highlightedSector || highlightedSector === "TOTAL") {
            return '#0055A4';
          }
          return highlightedSector === item.id ? '#0055A4' : '#0055A440';
        }),
        borderWidth: 1,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }
    ]
  }), [sortOrder, sortedData, processedData, highlightedSector]);  // Chart options with memoization
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {      
      // Plugin personnalisé pour afficher le pourcentage de différence
      customPercentage: {
        id: 'customPercentage',
        afterDatasetsDraw: (chart: any) => {
          const ctx = chart.ctx;
          const currentData = sortOrder ? sortedData : processedData;
          
          // Position et style des textes
          ctx.textAlign = 'center';
          
          // Pour chaque barre
          for (let i = 0; i < currentData.length; i++) {
            const meta1 = chart.getDatasetMeta(0); // Latvia Dataset
            const meta2 = chart.getDatasetMeta(1); // France Dataset
            
            if (!meta1.visible || !meta2.visible) continue;
            
            const item = currentData[i];
            const latviaSalary = item.latviaSalary;
            const franceSalary = item.franceSalary;
            const percentageDiff = ((franceSalary - latviaSalary) / latviaSalary * 100).toFixed(1);
            
            // Position pour les deux barres
            const x1 = meta1.data[i].x;
            const y1 = meta1.data[i].y;
            const x2 = meta2.data[i].x;
            const y2 = meta2.data[i].y;
            
            // Position du pourcentage de différence (entre les deux barres)
            const midX = (x1 + x2) / 2;
            const midY = Math.min(y1, y2) - 25;
            
            // Style pour le pourcentage de différence
            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = Number(percentageDiff) >= 0 ? '#4CAF50' : '#F44336';
            // Dessiner une pastille de fond pour améliorer la lisibilité
            const textWidth = ctx.measureText(`${percentageDiff}%`).width;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(midX - textWidth / 2 - 5, midY - 10, textWidth + 10, 20);
            
            // Dessiner le pourcentage de différence
            ctx.fillStyle = Number(percentageDiff) >= 0 ? '#4CAF50' : '#F44336';
            ctx.fillText(`${percentageDiff}%`, midX, midY);
              // Afficher les valeurs de salaire au-dessus de chaque barre avec fond pour meilleure lisibilité
            // Latvia Salary
            ctx.font = 'bold 12px Arial';
            ctx.fillStyle = '#9E3039';
            const latviaText = `${latviaSalary.toLocaleString()} €`;
            const latviaTextWidth = ctx.measureText(latviaText).width;
            // Fond blanc pour améliorer la lisibilité
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(x1 - latviaTextWidth/2 - 4, y1 - 20, latviaTextWidth + 8, 20);
            ctx.fillStyle = '#9E3039';
            ctx.fillText(latviaText, x1, y1 - 5);
            
            // France Salary
            ctx.font = 'bold 12px Arial';
            const franceText = `${franceSalary.toLocaleString()} €`;
            const franceTextWidth = ctx.measureText(franceText).width;
            // Fond blanc pour améliorer la lisibilité
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(x2 - franceTextWidth/2 - 4, y2 - 20, franceTextWidth + 8, 20);
            ctx.fillStyle = '#0055A4';
            ctx.fillText(franceText, x2, y2 - 5);
          }
        }
      },      tooltip: {
        enabled: true,
        position: 'nearest' as const,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          title: (context: Array<{ dataIndex: number }>) => {
            if (!context.length) return '';
            const index = context[0].dataIndex;
            const currentData = sortOrder ? sortedData : processedData;
            return currentData[index].name;
          },
          label: (context: { datasetIndex: number; dataIndex: number }) => {
            const currentData = sortOrder ? sortedData : processedData;
            const item = currentData[context.dataIndex];
            const value = context.datasetIndex === 0 ? item.latviaSalary : item.franceSalary;
            return `${context.datasetIndex === 0 ? 'Latvia' : 'France'}: ${value.toLocaleString()} €`;
          }
        }
      },      datalabels: {
        display: true,
        color: (context: any) => {
          // Couleur noire pour les deux pays
          return 'black';
        },
        align: 'top' as const,
        anchor: 'end' as const,
        formatter: (value: number, context: any) => {
          return value.toLocaleString() + ' €';
        },
        font: {
          weight: 'bold' as const,
          size: 11
        },        padding: {
          top: 5,
          bottom: 5
        },
        // Assurer que les étiquettes soient visibles en les positionnant au-dessus de chaque barre
        offset: 0,
        textAlign: 'center' as const
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
          callback(value: any, index: number) {
            const currentData = sortOrder ? sortedData : processedData;
            return currentData[index].name.length > 20
              ? currentData[index].name.slice(0, 20) + '...'
              : currentData[index].name;
          }
        }
      }
    },
    onClick: handleBarClick
  }), [processedData, sortedData, sortOrder, handleBarClick]);

  return (
    <div className={styles.dashboardCard}>
      <div className={styles.cardGlass}>        <div className={styles.chartHeader}>
          <div className={styles.titleContainer} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 className={styles.title} style={{margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#1f2937'}}>Salary Comparison by Sector</h2>
            <button
              className={styles.toggleButton}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '0.5rem',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: 'none',
                boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
                marginLeft: 'auto'
              }}
              onClick={() => {
                setSortOrder(current => {
                  if (current === 'default') return 'asc';
                  if (current === 'asc') return 'desc';
                  if (current === 'desc') return 'latvia';
                  return 'default';
                });
              }}
            >
              {sortOrder === 'default' ? 'French Salary ↑' : 
               sortOrder === 'asc' ? 'Difference ↑' : 
               sortOrder === 'desc' ? 'Difference ↓' : 
               'Latvia Salary ↑'}
            </button>
          </div>
        </div>        <div className={styles.mainChart}>
          <Bar 
            data={chartData}
            options={chartOptions}
            height={250}
          />
        </div>        <div className={styles.chartDescription} style={{
          fontSize: '.75rem',
          color: '#4b5563',
          textAlign: 'left',
          padding: '.75rem 1rem',
          backgroundColor: '#3b82f60d',
          border: '1px solid #3b82f61a',
          borderRadius: '.375rem',
          lineHeight: 1.4,
          position: 'relative',
          paddingLeft: '2rem',
          marginBottom: '10px'
        }}>
          This chart compares average monthly salaries between Latvia and France across different economic sectors in 2023. 
        </div>
      </div>
    </div>
  );
}