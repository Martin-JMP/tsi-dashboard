'use client';
import { useRef, useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import type { ChartOptions, LegendItem } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import styles from './EducationChart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

// Years from 1998 to 2023
const years = ['1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];

// Data for education level "Less than primary, primary and lower secondary education (levels 0-2)"
const franceLowEducation = [41.1, 40.1, 39.1, 38.3, 37.0, 36.3, 35.5, 35.0, 34.0, 33.0, 32.4, 31.9, 31.2, 30.4, 28.0, 26.5, 25.9, 25.5, 25.2, 24.4, 23.4, 22.3, 22.1, 21.3, 21.1, 21.1];
const latviaLowEducation = [23.3, 23.4, 24.1, 27.7, 25.4, 25.6, 24.5, 24.6, 24.6, 24.0, 22.8, 21.5, 19.5, 19.5, 17.4, 16.6, 16.1, 15.6, 14.9, 15.2, 15.3, 14.9, 14.6, 14.2, 14.9, 16.0];

// Data for education level "Upper secondary and post-secondary non-tertiary education (levels 3-4)"
const franceMidEducation = [41.4, 41.2, 41.3, 41.1, 41.0, 41.0, 42.0, 42.2, 42.1, 42.2, 42.3, 42.2, 41.6, 42.2, 43.0, 43.5, 43.3, 43.1, 43.0, 43.4, 43.1, 42.3, 42.1, 42.0, 41.8, 41.8];
const latviaMidEducation = [57.8, 57.6, 57.2, 54.8, 55.6, 56.2, 57.3, 57.0, 57.1, 57.2, 58.7, 58.6, 60.1, 57.5, 58.8, 59.8, 60.1, 59.9, 59.2, 57.6, 57.5, 56.9, 56.6, 57.0, 56.5, 55.8];

// Data for education level "Tertiary education (levels 5-8)"
const franceHighEducation = [17.5, 18.7, 19.6, 20.6, 22.0, 22.7, 22.5, 22.8, 23.9, 24.8, 25.3, 25.9, 27.2, 27.4, 29.0, 30.0, 30.8, 31.4, 31.8, 32.2, 33.5, 35.4, 35.8, 36.7, 37.1, 37.1];
const latviaHighEducation = [18.9, 19.0, 18.7, 17.5, 19.0, 18.2, 18.2, 18.4, 18.3, 18.8, 18.5, 19.9, 20.4, 23.0, 23.8, 23.6, 23.8, 24.5, 25.9, 27.2, 27.2, 28.2, 28.8, 28.8, 28.6, 28.2];

// Education levels names
const educationLevels = [
  "Levels 0-2: Less than primary, primary and lower secondary",
  "Levels 3-4: Upper secondary and post-secondary non-tertiary",
  "Levels 5-8: Tertiary education"
];

// Short level names for heatmap
const shortLevelNames = [
  "Levels 0-2",
  "Levels 3-4",
  "Levels 5-8"
];

// Visualization types
type VisualizationType = 'bars' | 'lines' | 'heatmap';

export default function EducationChart() {
  const chartRef = useRef<ChartJS<'bar' | 'line'>>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(years.length - 1); // Default to latest year
  const [showComparison, setShowComparison] = useState<boolean>(true); // Show comparison or evolution
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null); // For visualizing a single country's evolution
  const [selectedEducationType, setSelectedEducationType] = useState<string | undefined>(undefined);
  const [visualizationType, setVisualizationType] = useState<VisualizationType>('bars');
  
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleEducationTypeChange = (type: string) => {
    setSelectedEducationType(selectedEducationType === type ? undefined : type);
  };

  // Get data for bar chart visualization
  const getBarData = () => {
    if (showComparison) {
      // Comparative mode for selected year
      return {
        labels: ['France', 'Latvia'],
        datasets: [
          {
            label: educationLevels[0],
            data: [franceLowEducation[selectedYear], latviaLowEducation[selectedYear]],
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
            stack: 'stack0',
          },
          {
            label: educationLevels[1],
            data: [franceMidEducation[selectedYear], latviaMidEducation[selectedYear]],
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            stack: 'stack0',
          },
          {
            label: educationLevels[2],
            data: [franceHighEducation[selectedYear], latviaHighEducation[selectedYear]],
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
            stack: 'stack0',
          }
        ]
      };
    } else {
      // Evolution mode for selected country (or both)
      const filteredYears = years.filter((_, idx) => idx % 5 === 0 || idx === years.length - 1); // Select spaced years for clarity
      
      // Data structure for evolution over time
      return {
        labels: filteredYears,
        datasets: [
          // France - Levels 0-2
          {
            label: 'France - ' + educationLevels[0],
            data: franceLowEducation.filter((_, idx) => idx % 5 === 0 || idx === franceLowEducation.length - 1),
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
            stack: 'France',
            hidden: selectedCountry === 'Latvia',
          },
          // France - Levels 3-4
          {
            label: 'France - ' + educationLevels[1],
            data: franceMidEducation.filter((_, idx) => idx % 5 === 0 || idx === franceMidEducation.length - 1),
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
            stack: 'France',
            hidden: selectedCountry === 'Latvia',
          },
          // France - Levels 5-8
          {
            label: 'France - ' + educationLevels[2],
            data: franceHighEducation.filter((_, idx) => idx % 5 === 0 || idx === franceHighEducation.length - 1),
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
            stack: 'France',
            hidden: selectedCountry === 'Latvia',
          },
          // Latvia - Levels 0-2
          {
            label: 'Latvia - ' + educationLevels[0],
            data: latviaLowEducation.filter((_, idx) => idx % 5 === 0 || idx === latviaLowEducation.length - 1),
            backgroundColor: 'rgba(255, 159, 64, 0.8)',
            borderColor: 'rgb(255, 159, 64)',
            borderWidth: 1,
            stack: 'Latvia',
            hidden: selectedCountry === 'France',
          },
          // Latvia - Levels 3-4
          {
            label: 'Latvia - ' + educationLevels[1],
            data: latviaMidEducation.filter((_, idx) => idx % 5 === 0 || idx === latviaMidEducation.length - 1),
            backgroundColor: 'rgba(153, 102, 255, 0.8)',
            borderColor: 'rgb(153, 102, 255)',
            borderWidth: 1,
            stack: 'Latvia',
            hidden: selectedCountry === 'France',
          },
          // Latvia - Levels 5-8
          {
            label: 'Latvia - ' + educationLevels[2],
            data: latviaHighEducation.filter((_, idx) => idx % 5 === 0 || idx === latviaHighEducation.length - 1),
            backgroundColor: 'rgba(255, 206, 86, 0.8)',
            borderColor: 'rgb(255, 206, 86)',
            borderWidth: 1,
            stack: 'Latvia',
            hidden: selectedCountry === 'France',
          },
        ]
      };
    }
  };

  // Get data for line chart visualization
  const getLineData = () => {
    return {
      labels: years,
      datasets: [
        {
          label: 'France - ' + shortLevelNames[0],
          data: franceLowEducation,
          borderColor: '#0055A4',
          backgroundColor: 'rgba(0, 85, 164, 0.1)',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.3,
          hidden: selectedEducationType !== undefined && selectedEducationType !== 'low',
        },
        {
          label: 'Latvia - ' + shortLevelNames[0],
          data: latviaLowEducation,
          borderColor: '#9E3039',
          backgroundColor: 'rgba(158, 48, 57, 0.1)',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.3,
          hidden: selectedEducationType !== undefined && selectedEducationType !== 'low',
        },
        {
          label: 'France - ' + shortLevelNames[1],
          data: franceMidEducation,
          borderColor: '#0055A4',
          backgroundColor: 'rgba(0, 85, 164, 0.1)',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.3,
          borderDash: [5, 5],
          hidden: selectedEducationType !== undefined && selectedEducationType !== 'mid',
        },
        {
          label: 'Latvia - ' + shortLevelNames[1],
          data: latviaMidEducation,
          borderColor: '#9E3039',
          backgroundColor: 'rgba(158, 48, 57, 0.1)',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.3,
          borderDash: [5, 5],
          hidden: selectedEducationType !== undefined && selectedEducationType !== 'mid',
        },
        {
          label: 'France - ' + shortLevelNames[2],
          data: franceHighEducation,
          borderColor: '#0055A4',
          backgroundColor: 'rgba(0, 85, 164, 0.1)',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.3,
          borderDash: [2, 2],
          hidden: selectedEducationType !== undefined && selectedEducationType !== 'high',
        },
        {
          label: 'Latvia - ' + shortLevelNames[2],
          data: latviaHighEducation,
          borderColor: '#9E3039',
          backgroundColor: 'rgba(158, 48, 57, 0.1)',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.3,
          borderDash: [2, 2],
          hidden: selectedEducationType !== undefined && selectedEducationType !== 'high',
        },
      ]
    };
  };

  // Get data for heatmap visualization
  const getHeatmapData = () => {
    // For heatmap we need to format the data differently
    // The heatmap will be visualized using a Bar chart with custom coloring
    
    // Prepare data for France
    const franceData = [
      // Each array corresponds to a dataset for one education level
      franceLowEducation,
      franceMidEducation,
      franceHighEducation
    ];

    // Prepare data for Latvia
    const latviaData = [
      latviaLowEducation,
      latviaMidEducation,
      latviaHighEducation
    ];

    // Choose dataset based on selected country
    const dataToUse = selectedCountry === 'France' ? franceData : 
                      selectedCountry === 'Latvia' ? latviaData : 
                      franceData; // Default to France if nothing selected
    
    return {
      labels: years,
      datasets: [
        {
          label: selectedCountry || 'France',
          data: Array(years.length).fill(1), // Dummy data for spacing
          backgroundColor: 'rgba(0, 0, 0, 0)', // Invisible
          borderColor: 'rgba(0, 0, 0, 0)',
          borderWidth: 0,
          stack: 'stack1',
          barPercentage: 0.95,
          categoryPercentage: 0.95,
        },
        {
          label: shortLevelNames[0],
          data: dataToUse[0],
          backgroundColor: (context: any) => {
            const value = context.dataset.data[context.dataIndex];
            // Colorize based on value (lower = darker blue for Levels 0-2)
            return `rgba(255, 99, 132, ${Math.min(0.3 + value/60, 1)})`; // Red shade
          },
          borderColor: 'rgba(255, 99, 132, 0.8)',
          borderWidth: 1,
          stack: 'stack2',
          barPercentage: 0.95,
          categoryPercentage: 0.95,
        },
        {
          label: shortLevelNames[1],
          data: dataToUse[1],
          backgroundColor: (context: any) => {
            const value = context.dataset.data[context.dataIndex];
            // Colorize based on value (higher = darker green for Levels 3-4)
            return `rgba(54, 162, 235, ${Math.min(0.3 + value/60, 1)})`; // Blue shade
          },
          borderColor: 'rgba(54, 162, 235, 0.8)',
          borderWidth: 1,
          stack: 'stack3',
          barPercentage: 0.95,
          categoryPercentage: 0.95,
        },
        {
          label: shortLevelNames[2],
          data: dataToUse[2],
          backgroundColor: (context: any) => {
            const value = context.dataset.data[context.dataIndex];
            // Colorize based on value (higher = darker purple for Levels 5-8)
            return `rgba(75, 192, 192, ${Math.min(0.3 + value/40, 1)})`; // Teal shade
          },
          borderColor: 'rgba(75, 192, 192, 0.8)',
          borderWidth: 1,
          stack: 'stack4',
          barPercentage: 0.95,
          categoryPercentage: 0.95,
        }
      ]
    };
  };

  // Options for bar chart
  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            label += context.parsed.y.toFixed(1) + '%';
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Population Percentage (%)'
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  // Options for line chart
  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          filter: (legendItem: LegendItem) => {
            // Show main legends only for each education type
            if (selectedEducationType === undefined) {
              return true;
            }
            
            return legendItem.text?.includes(selectedEducationType === 'low' ? 'Levels 0-2' : 
                                        selectedEducationType === 'mid' ? 'Levels 3-4' : 
                                        'Levels 5-8') || false;
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            label += context.parsed.y.toFixed(1) + '%';
            return label;
          }
        }
      },
      datalabels: {
        display: false // <-- Empêche l'affichage des valeurs sur le line chart
      }
    },
    scales: {
      y: {
        min: 0,
        max: 70,
        title: {
          display: true,
          text: 'Population Percentage (%)'
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  // Options for heatmap
  const heatmapOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x' as const,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        }
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            return `Year: ${context[0].label}`;
          },
          label: function(context) {
            const level = context.dataset.label || '';
            const value = context.parsed.y;
            return `${level}: ${value.toFixed(1)}%`;
          }
        }
      },
      datalabels: {
        display: false // Désactive l'affichage des valeurs sur la heatmap
      }
    },
    scales: {
      x: {
        stacked: false,
        offset: true,
        grid: {
          display: false,
        }
      },
      y: {
        stacked: false,
        min: 0,
        max: 70,
        title: {
          display: true,
          text: 'Population Percentage (%)'
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h2 className={styles.chartTitle}>
          {visualizationType === 'bars' && showComparison 
            ? `Education Level Distribution in ${years[selectedYear]}` 
            : visualizationType === 'bars' 
              ? 'Education Level Evolution (1998-2023)'
              : visualizationType === 'lines'
                ? 'Education Level Trends (1998-2023)'
                : `Education Level Heatmap (1998-2023)`}
        </h2>
        <div className={styles.buttonGroup}>
          <button 
            className={`${styles.visualizationButton} ${visualizationType === 'bars' ? styles.active : ''}`} 
            onClick={() => setVisualizationType('bars')}
          >
            Bar Chart
          </button>
          <button 
            className={`${styles.visualizationButton} ${visualizationType === 'lines' ? styles.active : ''}`} 
            onClick={() => setVisualizationType('lines')}
          >
            Line Chart
          </button>
          <button 
            className={`${styles.visualizationButton} ${visualizationType === 'heatmap' ? styles.active : ''}`} 
            onClick={() => setVisualizationType('heatmap')}
          >
            Heatmap
          </button>
        </div>
      </div>
      
      {visualizationType === 'bars' && (
        <>
          <div className={styles.tabButtonGroup}>
            <button 
              className={`${styles.toggleButton} ${showComparison ? styles.active : ''}`} 
              onClick={() => setShowComparison(true)}
            >
              Comparison
            </button>
            <button 
              className={`${styles.toggleButton} ${!showComparison ? styles.active : ''}`} 
              onClick={() => setShowComparison(false)}
            >
              Evolution
            </button>
          </div>

          {showComparison && (
            <div className={styles.sliderContainer}>
              <span className={styles.yearLabel}>{years[0]}</span>
              <input 
                type="range" 
                min="0" 
                max={years.length - 1} 
                value={selectedYear} 
                onChange={handleYearChange}
                className={styles.yearSlider}
              />
              <span className={styles.yearLabel}>{years[years.length - 1]}</span>
              <div className={styles.selectedYear}>Year: {years[selectedYear]}</div>
            </div>
          )}
          
          {!showComparison && (
            <div className={styles.countrySelector}>
              <button 
                className={`${styles.countryButton} ${selectedCountry === null ? styles.active : ''}`}
                onClick={() => setSelectedCountry(null)}
              >
                Both countries
              </button>
              <button 
                className={`${styles.countryButton} ${selectedCountry === 'France' ? styles.active : ''}`}
                onClick={() => setSelectedCountry('France')}
              >
                France
              </button>
              <button 
                className={`${styles.countryButton} ${selectedCountry === 'Latvia' ? styles.active : ''}`}
                onClick={() => setSelectedCountry('Latvia')}
              >
                Latvia
              </button>
            </div>
          )}
          
          <div className={styles.chartContent}>
            <Bar 
              data={getBarData()}
              options={barOptions}
            />
          </div>
        </>
      )}

      {visualizationType === 'lines' && (
        <>
          <div className={styles.filterGroup}>
            <div className={styles.filterButtons}>
              <button 
                className={`${styles.filterButton} ${selectedEducationType === 'low' ? styles.active : ''}`}
                onClick={() => handleEducationTypeChange('low')}
              >
                Levels 0-2
              </button>
              <button 
                className={`${styles.filterButton} ${selectedEducationType === 'mid' ? styles.active : ''}`}
                onClick={() => handleEducationTypeChange('mid')}
              >
                Levels 3-4
              </button>
              <button 
                className={`${styles.filterButton} ${selectedEducationType === 'high' ? styles.active : ''}`}
                onClick={() => handleEducationTypeChange('high')}
              >
                Levels 5-8
              </button>
              {selectedEducationType && (
                <button 
                  className={styles.resetButton}
                  onClick={() => setSelectedEducationType(undefined)}
                >
                  Show All
                </button>
              )}
            </div>
          </div>

          <div className={styles.chartContent}>
            <Line 
              data={getLineData()}
              options={lineOptions}
            />
          </div>
        </>
      )}

      {visualizationType === 'heatmap' && (
        <>
          <div className={styles.countrySelector}>
            <button 
              className={`${styles.countryButton} ${selectedCountry === 'France' ? styles.active : ''}`}
              onClick={() => setSelectedCountry('France')}
            >
              France
            </button>
            <button 
              className={`${styles.countryButton} ${selectedCountry === 'Latvia' ? styles.active : ''}`}
              onClick={() => setSelectedCountry('Latvia')}
            >
              Latvia
            </button>
          </div>
          
          <div className={styles.chartContent}>
            <Bar 
              data={getHeatmapData()}
              options={heatmapOptions}
            />
          </div>
        </>
      )}
      
      <div className={styles.chartDescription}>
        <p><strong>ISCED 2011 Education Levels:</strong></p>
        <div className={styles.legendItems}>
          <div className={styles.legendItem}>
            <span className={styles.colorSquare} style={{backgroundColor: 'rgba(255, 99, 132, 0.8)'}}></span>
            <span><strong>Levels 0-2:</strong> Less than primary, primary and lower secondary education</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.colorSquare} style={{backgroundColor: 'rgba(54, 162, 235, 0.8)'}}></span>
            <span><strong>Levels 3-4:</strong> Upper secondary and post-secondary non-tertiary education</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.colorSquare} style={{backgroundColor: 'rgba(75, 192, 192, 0.8)'}}></span>
            <span><strong>Levels 5-8:</strong> Tertiary education</span>
          </div>
        </div>
        <p>These data show the distribution of education levels as percentage of population aged 15-64 years.</p>
      </div>
    </div>
  );
}
