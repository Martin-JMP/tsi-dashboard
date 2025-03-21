import fs from 'fs';
import path from 'path';
import styles from './page.module.css';
import { parseCSVData, groupDataByCategory } from './utils/data';
import DataGrid from './components/DataGrid';
import ComparisonCard from './components/ComparisonCard';

export default function Home() {
  // Read the CSV file
  const csvFilePath = path.join(process.cwd(), 'src/app/DB/LIFE KPI(PIB...) FRANCE LATVIA.csv');
  const csvData = fs.readFileSync(csvFilePath, 'utf8');
  
  // Parse the data
  const parsedData = parseCSVData(csvData);
  const groupedData = groupDataByCategory(parsedData);
  
  // Get key statistics for the overview
  const keyStats = [
    // Demographics
    ...groupedData['Demographics'].filter(item => 
      ['Population (millions)', 'Birth rate (per 1000 inhabitants)'].includes(item.kpi)
    ),
    // Economy
    ...groupedData['Economy'].filter(item => 
      ['GDP per capita (€)', 'Unemployment rate (%)'].includes(item.kpi)
    ),
    // Society
    ...groupedData['Society and quality of life'].filter(item => 
      ['Life expectancy (years)', 'Human Development Index (HDI)'].includes(item.kpi)
    ),
    // Environment
    ...groupedData['Environment and energy'].filter(item => 
      ['Renewable energy (% of total)', 'CO2 emissions per capita (tons)'].includes(item.kpi)
    ),
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>France-Latvia Dashboard</h1>
      <p className={styles.pageDescription}>
        This dashboard presents a comparative analysis of key indicators between France and Latvia,
        highlighting differences in demographics, economy, society, and environment.
      </p>
      
      <div className={styles.keyMetrics}>
        <h2>Key Metrics Overview</h2>
        <div className={styles.metricsGrid}>
          {keyStats.map((item, index) => (
            <ComparisonCard key={index} item={item} />
          ))}
        </div>
      </div>
      
      <div className={styles.categoryLinks}>
        <h2>Explore Categories</h2>
        <div className={styles.categories}>
          <a href="/economy" className={styles.categoryCard}>
            <h3>Economy</h3>
            <p>GDP, Inflation, Unemployment and more</p>
          </a>
          <a href="/labor" className={styles.categoryCard}>
            <h3>Labor Market</h3>
            <p>Employment rates, education, and workforce data</p>
          </a>
          <a href="/society" className={styles.categoryCard}>
            <h3>Society & Quality of Life</h3>
            <p>Life expectancy, healthcare, education and more</p>
          </a>
          <a href="/environment" className={styles.categoryCard}>
            <h3>Environment & Energy</h3>
            <p>Emissions, renewable energy, and sustainability</p>
          </a>
        </div>
      </div>
    </div>
  );
}
