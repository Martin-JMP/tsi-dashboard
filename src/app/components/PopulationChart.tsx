'use client';
import { useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import styles from './PopulationChart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

const years = ['1960', '1961', '1962', '1963', '1964', '1965', '1966', '1967', '1968', '1969', '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'];

const rawFrancePopulation = [47412964, 47905982, 48389516, 48877567, 49401492, 49877725, 50311637, 50722791, 51112980, 51536014, 52007169, 52499553, 52962356, 53392161, 53746571, 54002853, 54232383, 54486467, 54734030, 54979851, 55274184, 55603353, 55806789, 56108330, 56383085, 56665619, 56956002, 57266167, 57598186, 57943062, 58261012, 58554242, 58846584, 59103094, 59324863, 59541294, 59754504, 59968066, 60190684, 60501986, 60918661, 61364377, 61812142, 62249855, 62707588, 63180854, 63622342, 64016890, 64375116, 64706436, 65026211, 65340830, 65657659, 65997932, 66312067, 66548272, 66724104, 66918020, 67158348, 67382061, 67601110, 67842811, 68065015];

const rawLatviaPopulation = [2120979, 2152681, 2181586, 2210919, 2240623, 2265919, 2283217, 2301220, 2323619, 2343173, 2359164, 2376389, 2395674, 2415819, 2437186, 2456130, 2470989, 2485073, 2497921, 2505953, 2511701, 2519421, 2531080, 2546011, 2562047, 2578873, 2599892, 2626583, 2653434, 2666955, 2663151, 2650581, 2614338, 2563290, 2520742, 2485056, 2457222, 2432851, 2410019, 2390482, 2367550, 2337170, 2310173, 2287955, 2263122, 2238799, 2218357, 2200325, 2177322, 2141669, 2097555, 2059709, 2034319, 2012647, 1993782, 1977527, 1959537, 1942248, 1927174, 1913822, 1900449, 1884490, 1879383];

// Calculer les variations en pourcentage par rapport à 1960
const percentageFrancePopulation = rawFrancePopulation.map((value, index) => 
  index === 0 ? 0 : ((value - rawFrancePopulation[0]) / rawFrancePopulation[0]) * 100
);

const percentageLatviaPopulation = rawLatviaPopulation.map((value, index) => 
  index === 0 ? 0 : ((value - rawLatviaPopulation[0]) / rawLatviaPopulation[0]) * 100
);

type ChartType = 'line';

interface PopulationChartProps {
  selectedCountry: string | null;
  onCountrySelect: (country: string | null) => void;
}

export default function PopulationChart({ selectedCountry, onCountrySelect }: PopulationChartProps) {
  const chartRef = useRef<ChartJS<ChartType>>(null);
  const [showPercentage, setShowPercentage] = useState(true);

  const getData = () => ({
    labels: years,
    datasets: [
      {
        label: 'France',
        data: showPercentage ? percentageFrancePopulation : rawFrancePopulation,
        borderColor: '#0055A4',
        backgroundColor: 'rgba(0, 85, 164, 0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#0055A4',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        hidden: selectedCountry !== null && selectedCountry !== 'France'
      },
      {
        label: 'Latvia',
        data: showPercentage ? percentageLatviaPopulation : rawLatviaPopulation,
        borderColor: '#9E3039',
        backgroundColor: 'rgba(158, 48, 57, 0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#9E3039',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
        hidden: selectedCountry !== null && selectedCountry !== 'Latvia'
      }
    ]
  });
  const options: ChartOptions<ChartType> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      // Explicitly disable datalabels for this line chart
      datalabels: {
        display: false
      },
      tooltip: {
        enabled: true,
        position: 'nearest',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        caretPadding: 5,
        cornerRadius: 4,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        callbacks: {
          title: (items: any[]) => `Year: ${items[0].label}`,
          label: (context: any) => {
            const value = context.raw;
            if (showPercentage) {
              return `${context.dataset.label}: ${value.toFixed(1)}%`;
            } else {
              return `${context.dataset.label}: ${value.toLocaleString()} people`;
            }
          },
        },
      },
      annotation: {
        annotations: {
          verticalLine: {
            type: 'line',
            xScaleID: 'x',
            xMin: '',
            xMax: '',
            borderColor: 'rgba(0, 0, 0, 0.2)',
            borderWidth: 1,
            borderDash: [5, 5],
            display: false,
          },
          year1991Line: {
            type: 'line',
            scaleID: 'x',
            value: years.indexOf('1991'),
            borderColor: 'rgba(255, 99, 132, 0.5)',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: '1991',
              display: true,
              position: 'start',
              backgroundColor: 'rgba(255, 99, 132, 0.8)',
              font: {
                size: 11
              }
            }
          }
        }
      },
      legend: {
        position: 'top',
        align: 'center',
        onClick: (e, legendItem, legend) => {
          onCountrySelect(legendItem.text as string);
        },
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return datasets.map((dataset, i) => ({
              text: dataset.label || '',
              fillStyle: dataset.backgroundColor as string,
              strokeStyle: dataset.borderColor as string,
              lineWidth: 2,
              hidden: dataset.hidden,
              index: i,
              textDecoration: selectedCountry && dataset.label !== selectedCountry ? 'line-through' : undefined,
            }));
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          display: true
        },
        ticks: {
          callback: (value: any) => showPercentage 
            ? `${value}%` 
            : `${(value / 1000000).toFixed(1)}M`,
          font: {
            size: 12
          }
        }
      }
    }
  };

  const handleHover = (_: any, elements: any[]) => {
    if (!chartRef.current) return;

    const chart = chartRef.current;
    if (elements.length) {
      const verticalLine = (chart as any).options.plugins.annotation.annotations.verticalLine;
      verticalLine.display = true;
      verticalLine.xMin = verticalLine.xMax = elements[0].index;
      chart.update('none');
    } else {
      const verticalLine = (chart as any).options.plugins.annotation.annotations.verticalLine;
      verticalLine.display = false;
      chart.update('none');
    }
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h2 className={styles.chartTitle}>
          Population {showPercentage ? 'Change Since 1960 (%)' : 'Total'}
        </h2>
        <div className={styles.buttonGroup}>
          <button 
            onClick={() => setShowPercentage(!showPercentage)}
            className={styles.toggleButton}
          >
            Show {showPercentage ? 'Values' : 'Percentage'}
          </button>
        </div>
      </div>
      <div className={styles.chartContent}>
        <Line 
          ref={chartRef}
          data={getData()}
          options={{
            ...options,
            onHover: handleHover
          }}
        />
      </div>
      <div className={styles.chartDescription}>
      This dataset shows the percentage change in population since 1960, highlighting long-term demographic growth trends.
      </div>
    </div>
  );
}