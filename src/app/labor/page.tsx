import fs from 'fs';
import path from 'path';
import styles from './page.module.css';
import { parseCSVData, groupDataByCategory } from '../utils/data';
import DataGrid from '../components/DataGrid';
import ComparisonCard from '../components/ComparisonCard';

export default function LaborMarket() {
  // Read the CSV file
  const csvFilePath = path.join(process.cwd(), 'src/app/DB/LIFE KPI(PIB...) FRANCE LATVIA.csv');
  const csvData = fs.readFileSync(csvFilePath, 'utf8');
  
  // Parse the data
  const parsedData = parseCSVData(csvData);
  
  // Get labor market related data
  const laborData = [
    // Unemployment from Economy section
    ...parsedData.filter(item => item.kpi.includes('Unemployment')),
    // Education-related from Society section
    ...parsedData.filter(item => item.kpi.includes('education')),
    // Demographics that might affect labor market
    ...parsedData.filter(item => item.kpi.includes('Population')),
    ...parsedData.filter(item => item.kpi.includes('Median age')),
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Labor Market Comparison</h1>
      <p className={styles.pageDescription}>
        Compare labor market indicators between France and Latvia, including unemployment rates, 
        higher education statistics, and demographic factors affecting the workforce.
      </p>
      
      <div className={styles.highlightSection}>
        <h2>Unemployment Rate Comparison</h2>
        <div className={styles.highlightContainer}>
          {parsedData.filter(item => item.kpi.includes('Unemployment')).map((item, index) => (
            <ComparisonCard key={index} item={item} />
          ))}
        </div>
      </div>
      
      <DataGrid data={laborData} title="Labor Market Indicators" />
      
      <div className={styles.analysis}>
        <h2>Labor Market Analysis</h2>
        <p>
          France and Latvia have similar unemployment rates, with Latvia having a slightly better figure at 7.0% compared to 
          France's 7.5%. However, France has a higher percentage of population with higher education (38% vs 34% in Latvia).
        </p>
        <p>
          The labor markets in both countries are influenced by their demographic profiles. France has a significantly larger 
          population (68 million vs 1.9 million), which creates a larger and more diverse labor pool. Latvia's population is 
          slightly older with a median age of 44 compared to France's 42.
        </p>
        <p>
          These demographic factors, combined with economic indicators like GDP per capita and public debt levels, contribute to 
          the different labor market dynamics in each country.
        </p>
      </div>
    </div>
  );
}
