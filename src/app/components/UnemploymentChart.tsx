'use client';
import { useRef, useEffect } from 'react';
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
import styles from './UnemploymentChart.module.css';

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

const years = ['1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];

const rawFranceUnemployment = [9.134, 10.203, 11.32, 12.593, 11.834, 12.367, 12.566, 12.074, 11.981, 10.218, 8.61, 8.702, 8.306, 8.914, 8.882, 8.832, 8.008, 7.386, 9.122, 9.279, 9.228, 9.841, 9.913, 10.273, 10.354, 10.057, 9.409, 9.018, 8.415, 8.009, 7.874, 7.308, 7.335];

const rawLatviaUnemployment = [2.7, 6.6, 16.7, 18.7, 19, 20.7, 17.569, 14.454, 13.79, 14.211, 13.821, 13.829, 12.061, 11.708, 10.033, 7.03, 6.052, 7.739, 17.515, 19.482, 16.206, 15.047, 11.867, 10.846, 9.873, 9.643, 8.715, 7.412, 6.312, 8.098, 7.513, 6.815, 6.465];

type ChartType = 'line';

interface UnemploymentChartProps {
  selectedCountry: string | null;
  onCountrySelect: (country: string | null) => void;
}

export default function UnemploymentChart({ selectedCountry, onCountrySelect }: UnemploymentChartProps) {
  const chartRef = useRef<ChartJS<ChartType>>(null);

  const getData = () => ({
    labels: years,
    datasets: [
      {
        label: 'France',
        data: rawFranceUnemployment,
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
        data: rawLatviaUnemployment,
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
            return `${context.dataset.label}: ${value.toFixed(1)}%`;
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
          callback: (value) => `${value}%`,
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
          Unemployment Rate 1991-2023 (%)
        </h2>
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
      This dataset presents the annual unemployment rate (%) from 1991 to 2023, providing insights into labor market trends over time.
      </div>
    </div>
  );
}