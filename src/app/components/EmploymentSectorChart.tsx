'use client';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie } from 'react-chartjs-2';
import styles from './EmploymentSectorChart.module.css';

// Suppression de l'enregistrement global
ChartJS.register(ArcElement, Tooltip, Legend);

// Définition des secteurs NACE
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
  'M': 'Professional, scientific and technical activities',
  'N': 'Administrative and support services',
  'O': 'Public administration and defence',
  'P': 'Education',
  'Q': 'Human health and social work',
  'R': 'Arts, entertainment and recreation',
  'S': 'Other service activities',
  'TOTAL': 'All sectors'
};

// Couleurs pour les secteurs (pour assurer la cohérence entre les deux graphiques)
const sectorColors: { [key: string]: string } = {
  'A': 'rgba(255, 99, 132, 0.7)',
  'B': 'rgba(54, 162, 235, 0.7)',
  'C': 'rgba(255, 206, 86, 0.7)',
  'D': 'rgba(75, 192, 192, 0.7)',
  'E': 'rgba(153, 102, 255, 0.7)',
  'F': 'rgba(255, 159, 64, 0.7)',
  'G': 'rgba(199, 199, 199, 0.7)',
  'H': 'rgba(83, 102, 255, 0.7)',
  'I': 'rgba(255, 99, 255, 0.7)',
  'J': 'rgba(0, 162, 235, 0.7)',
  'K': 'rgba(255, 206, 0, 0.7)',
  'L': 'rgba(75, 75, 192, 0.7)',
  'M': 'rgba(153, 153, 255, 0.7)',
  'N': 'rgba(255, 99, 64, 0.7)',
  'O': 'rgba(155, 99, 132, 0.7)',
  'P': 'rgba(54, 54, 235, 0.7)',
  'Q': 'rgba(155, 206, 86, 0.7)',
  'R': 'rgba(25, 192, 192, 0.7)',
  'S': 'rgba(53, 102, 155, 0.7)',
  'TOTAL': 'rgba(100, 100, 100, 0.7)',
};

// Données d'emploi en France par secteur pour 2023
const frenchSectorData = {
  'A': 74770, 'B': 9080, 'C': 888790, 'D': 84280, 'E': 61190,
  'F': 891690, 'G': 1271930, 'H': 828540, 'I': 520030, 'J': 852710,
  'K': 339170, 'L': 91590, 'M': 597980, 'N': 1043890, 'O': 444440,
  'P': 92550, 'Q': 408980, 'R': 175730, 'S': 180930, 'TOTAL': 8858270
};

// Données d'emploi en Lettonie par secteur pour 2022
const latviaSectorData = {
  'A': 67966, 'B': 4360, 'C': 124882, 'D': 14533, 'E': 10173,
  'F': 60811, 'G': 112937, 'H': 67762, 'I': 45175, 'J': 21427,
  'K': 16723, 'L': 19968, 'M': 39228, 'N': 26152, 'O': 59961,
  'P': 79948, 'Q': 59961, 'R': 22644, 'S': 22644, 'TOTAL': 868633
};

export default function EmploymentSectorChart() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    // Simuler un chargement pour maintenir une expérience utilisateur cohérente
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Fonction pour trier les données par valeur décroissante
  const sortDataByValue = (data: { [key: string]: number }) => {
    return Object.entries(data)
      .filter(([sector]) => sector !== 'TOTAL')
      .sort(([, a], [, b]) => b - a);
  };

  const sortedFrenchData = sortDataByValue(frenchSectorData);
  const sortedLatvianData = sortDataByValue(latviaSectorData);

  // Ajustement de l'opacité en fonction de la catégorie active
  const getBackgroundColors = (data: [string, number][]) => {
    return data.map(([sector]) => {
      const color = sectorColors[sector];
      if (activeCategory === null) return color;
      return sector === activeCategory ? color : color.replace('0.7', '0.2');
    });
  };

  const frenchPieData = {
    labels: sortedFrenchData.map(([sector]) => sectorNames[sector]),
    datasets: [{
      data: sortedFrenchData.map(([, value]) => value),
      backgroundColor: getBackgroundColors(sortedFrenchData),
      borderColor: 'rgba(255, 255, 255, 0.8)',
      borderWidth: 1,
    }],
  };

  const latvianPieData = {
    labels: sortedLatvianData.map(([sector]) => sectorNames[sector]),
    datasets: [{
      data: sortedLatvianData.map(([, value]) => value),
      backgroundColor: getBackgroundColors(sortedLatvianData),
      borderColor: 'rgba(255, 255, 255, 0.8)',
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 10,
          font: {
            size: 11
          }
        },
        onClick: (_: any, legendItem: any) => {
          const index = legendItem.index;
          const data = sortedFrenchData[index]; // Utiliser French data comme référence
          const category = data[0]; // Obtenir la catégorie (A, B, C, etc.)
          setActiveCategory(activeCategory === category ? null : category);
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const dataset = context.dataset;
            const total = dataset.data.reduce((acc: number, data: number) => acc + data, 0);
            const value = dataset.data[context.dataIndex];
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value.toLocaleString()} (${percentage}%)`;
          }
        }
      },
      // Ajout de la configuration pour afficher les pourcentages sur le pie chart
      datalabels: {
        formatter: (value: number, ctx: any) => {
          const dataset = ctx.chart.data.datasets[0];
          const total = dataset.data.reduce((acc: number, data: number) => acc + data, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
        color: '#000000',
        anchor: 'center' as const, // Fix: utiliser une valeur littérale comme type
        align: 'center' as const, // Fix: utiliser une valeur littérale comme type
        font: {
          size: 11,
          weight: 'bold' as const // Fix: use string literal type for font weight
        },
        display: (ctx: any) => {
          const dataset = ctx.chart.data.datasets[0];
          const total = dataset.data.reduce((acc: number, data: number) => acc + data, 0);
          const value = dataset.data[ctx.dataIndex];
          return ((value / total) * 100) > 3; // N'affiche que les pourcentages > 3%
        }
      }
    },
    onClick: (event: any, elements: any, chart: any) => {
      if (elements.length > 0) {
        const element = elements[0];
        const index = element.index;
        const datasetLabel = chart.data.labels[index];
        // Trouver la catégorie correspondante
        const foundCategory = Object.entries(sectorNames).find(
          ([_, name]) => name === datasetLabel
        );
        // S'assurer que la catégorie existe avant de la définir
        const category = foundCategory ? foundCategory[0] : null;
        setActiveCategory(activeCategory === category ? null : category);
      } else {
        setActiveCategory(null);
      }
    }
  };

  if (isLoading) {
    return <div className={styles.loadingContainer}>Loading data...</div>;
  }

  if (error) {
    return <div className={styles.errorContainer}>Error: {error}</div>;
  }

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartsWrapper}>
        <div className={styles.pieChartContainer}>
          <h3 className={styles.countryTitle}>France</h3>
          <div className={styles.pieChart}>
            <Pie 
              data={frenchPieData} 
              options={chartOptions}
              plugins={[ChartDataLabels]} // Ajout local du plugin
            />
          </div>
        </div>
        
        <div className={styles.pieChartContainer}>
          <h3 className={styles.countryTitle}>Latvia</h3>
          <div className={styles.pieChart}>
            <Pie 
              data={latvianPieData} 
              options={chartOptions}
              plugins={[ChartDataLabels]} // Ajout local du plugin
            />
          </div>
        </div>
      </div>
    </div>
  );
}
