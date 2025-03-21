import fs from 'fs';
import path from 'path';
import styles from './page.module.css';
import { parseCSVData, groupDataByCategory } from '../utils/data';
import DataGrid from '../components/DataGrid';

export default function Economy() {
  // Read the CSV file
  const csvFilePath = path.join(process.cwd(), 'src/app/DB/LIFE KPI(PIB...) FRANCE LATVIA.csv');
  const csvData = fs.readFileSync(csvFilePath, 'utf8');
  
  // Parse the data
  const parsedData = parseCSVData(csvData);
  const groupedData = groupDataByCategory(parsedData);
  
  // Get economic data
  const economyData = groupedData['Economy'] || [];

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Economic Indicators</h1>
      <p className={styles.pageDescription}>
        Compare key economic indicators between France and Latvia, including GDP, 
        unemployment rates, inflation, and trade balance.
      </p>
      
      <DataGrid data={economyData} title="Economy Comparison" />
      
      <div className={styles.analysis}>
        <h2>Key Insights</h2>
        <ul>
          <li>France has a significantly larger economy with a GDP of 2900 billion € compared to Latvia's 35 billion €.</li>
          <li>GDP per capita in France (43,000 €) is more than double that of Latvia (18,000 €).</li>
          <li>Latvia has a slightly better unemployment rate at 7.0% compared to France's 7.5%.</li>
          <li>France has a larger public debt at 112% of GDP, while Latvia's is at 43%.</li>
          <li>Latvia has a higher inflation rate (3.6%) compared to France (2.4%).</li>
        </ul>
      </div>
    </div>
  );
}
