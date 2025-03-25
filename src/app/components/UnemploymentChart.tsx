import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useRef } from 'react';
import styles from './UnemploymentChart.module.css';

ChartJS.register(annotationPlugin);

const years = ['1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];

const rawFranceUnemployment = [9.134, 10.203, 11.32, 12.593, 11.834, 12.367, 12.566, 12.074, 11.981, 10.218, 8.61, 8.702, 8.306, 8.914, 8.882, 8.832, 8.008, 7.386, 9.122, 9.279, 9.228, 9.841, 9.913, 10.273, 10.354, 10.057, 9.409, 9.018, 8.415, 8.009, 7.874, 7.308, 7.335];

const rawLatviaUnemployment = [2.7, 6.6, 16.7, 18.7, 19, 20.7, 17.569, 14.454, 13.79, 14.211, 13.821, 13.829, 12.061, 11.708, 10.033, 7.03, 6.052, 7.739, 17.515, 19.482, 16.206, 15.047, 11.867, 10.846, 9.873, 9.643, 8.715, 7.412, 6.312, 8.098, 7.513, 6.815, 6.465];

// Calculer les variations en pourcentage par rapport à 1991
const percentageFranceUnemployment = rawFranceUnemployment.map((value, index) => 
  index === 0 ? 0 : ((value - rawFranceUnemployment[0]) / rawFranceUnemployment[0]) * 100
);

const percentageLatviaUnemployment = rawLatviaUnemployment.map((value, index) => 
  index === 0 ? 0 : ((value - rawLatviaUnemployment[0]) / rawLatviaUnemployment[0]) * 100
);

type ChartType = 'line';

export default function UnemploymentChart() {
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
      }
    ]
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      annotation: {
        annotations: {
          verticalLine: {
            type: 'line' as const,
            xMin: 0,
            xMax: 0,
            borderColor: 'rgba(0, 0, 0, 0.2)',
            borderWidth: 1,
            display: false,
            yMin: 'bottom',
            yMax: 'top'
          }
        }
      },
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    hover: {
      mode: 'nearest' as const,
      intersect: false
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        title: {
          display: true,
          text: 'Unemployment Rate (%)'
        }
      }
    }
  };

  const handleHover = (event: any, elements: any[]) => {
    if (elements.length) {
      const chart = chartRef.current;
      if (!chart) return;
      
      const verticalLine = (chart as any).options.plugins.annotation.annotations.verticalLine;
      verticalLine.display = true;
      verticalLine.xMin = verticalLine.xMax = elements[0].index;
      chart.update('none');
    } else {
      const chart = chartRef.current;
      if (!chart) return;
      
      const verticalLine = (chart as any).options.plugins.annotation.annotations.verticalLine;
      verticalLine.display = false;
      chart.update('none');
    }
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h2 className={styles.chartTitle}>
          Unemployment Rate (%)
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
        Total unemployment rate represents the percentage of the labor force that is without work but available for and seeking employment.
      </div>
    </div>
  );
}