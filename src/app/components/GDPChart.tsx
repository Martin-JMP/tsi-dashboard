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
import styles from './GDPChart.module.css';

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

const years = ['1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];
const rawFranceGDP = [1595219345511.89, 1598889216566.23, 1449392222971.45, 1496906382032.47, 1486915879701.93, 1360959069477.49, 1370376677298.86, 1492427756382.43, 1835095983049.09, 2109792297237.03, 2192146403028.17, 2317861544690.82, 2655816911866.56, 2926802941585.86, 2700075882518.98, 2646230027988.34, 2870408553990.28, 2683007095787.23, 2816077607875.26, 2861236112552.42, 2442483452642.5, 2470407619777.13, 2588868323334.71, 2781576320884.39, 2722793515171.76, 2647926055110.05, 2966433692008.09, 2796302210398.84, 3051831611384.76];
const rawLatviaGDP = [5608208784.9401, 5799465288.41246, 6349481006.53278, 6974112951.26891, 7324192889.74297, 7761252607.18424, 8190888739.6463, 9249030241.01864, 11244337719.8377, 13827070378.5612, 16306935905.4138, 20434922247.3037, 29420499247.7089, 34135200994.0067, 25691530442.035, 23468324572.3343, 26575547900.8247, 27116149948.6683, 29152128167.8438, 30277203767.4058, 26344565876.8902, 27117105059.5075, 29391059767.4259, 33247935477.3576, 33099503950.847, 33379927434.6149, 38185125732.9451, 38018905782.397, 42247850064.5125];

// Calculer les variations en pourcentage par rapport à 1995
const percentageFranceGDP = rawFranceGDP.map((value, index) =>
  index === 0 ? 0 : ((value - rawFranceGDP[0]) / rawFranceGDP[0]) * 100
);

const percentageLatviaGDP = rawLatviaGDP.map((value, index) =>
  index === 0 ? 0 : ((value - rawLatviaGDP[0]) / rawLatviaGDP[0]) * 100
);

type ChartType = 'line';

export default function GDPChart() {
  const chartRef = useRef<ChartJS<ChartType>>(null);
  const [showPercentage, setShowPercentage] = useState(true);

  const getData = () => ({

    labels: years,
    datasets: [
      {
        label: 'France',
        data: showPercentage ? percentageFranceGDP : rawFranceGDP,
        borderColor: '#0055A4',
        backgroundColor: 'rgba(0, 85, 164, 0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#0055A4',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
      {
        label: 'Latvia',
        data: showPercentage ? percentageLatviaGDP : rawLatviaGDP,
        borderColor: '#9E3039',
        backgroundColor: 'rgba(158, 48, 57, 0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#9E3039',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
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
              return `${context.dataset.label}: $${(value / 1e9).toFixed(2)}B`;
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
          }
        }
      },
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 14,
            weight: 'bold' as const,
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
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          display: true
        },
        ticks: {
          callback: (value: any) => showPercentage ? `${value}%` : `$${(value / 1e9).toFixed(0)}B`,
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
          GDP {showPercentage ? 'Growth Since 1995 (%)' : '(Current US$)'}
        </h2>
        <button
          onClick={() => setShowPercentage(!showPercentage)}
          className={styles.toggleButton}
        >
          Show {showPercentage ? 'Values' : 'Percentage'}
        </button>
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
        GDP at purchaser&#39;s prices is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products.
      </div>
    </div>
  );
}
