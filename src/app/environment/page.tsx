import fs from 'fs';
import path from 'path';
import styles from './page.module.css';
import { parseCSVData, groupDataByCategory } from '../utils/data';
import DataGrid from '../components/DataGrid';
import ComparisonCard from '../components/ComparisonCard';

export default function Environment() {
  // Read the CSV file
  const csvFilePath = path.join(process.cwd(), 'src/app/DB/LIFE KPI(PIB...) FRANCE LATVIA.csv');
  const csvData = fs.readFileSync(csvFilePath, 'utf8');
  
  // Parse the data
  const parsedData = parseCSVData(csvData);
  const groupedData = groupDataByCategory(parsedData);
  
  // Get environment and energy data
  const environmentData = groupedData['Environment and energy'] || [];
  
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Environment & Energy</h1>
      <p className={styles.pageDescription}>
        Compare environmental sustainability and energy usage between France and Latvia, 
        highlighting differences in renewable energy adoption, forest coverage, and carbon emissions.
      </p>
      
      <div className={styles.highlight}>
        {environmentData.map((item, index) => (
          <div key={index} className={styles.highlightCard}>
            <ComparisonCard item={item} />
          </div>
        ))}
      </div>
      
      <div className={styles.analysis}>
        <h2>Environmental Comparison</h2>
        <p>
          Latvia shows stronger environmental performance in several key areas, particularly in renewable 
          energy and forest coverage.
        </p>
        
        <ul className={styles.analysisList}>
          <li>
            <strong>Renewable Energy:</strong> Latvia generates 41% of its energy from renewable sources, 
            more than double France's 19%. This reflects Latvia's commitment to sustainable energy sources.
          </li>
          <li>
            <strong>Forest Coverage:</strong> Latvia maintains 54% of its territory as forest, significantly 
            higher than France's 31%. This contributes to biodiversity and carbon sequestration.
          </li>
          <li>
            <strong>Carbon Emissions:</strong> Latvia has lower per capita CO2 emissions at 3.5 tons compared 
            to France's 4.6 tons, indicating a smaller carbon footprint.
          </li>
        </ul>
        
        <p>
          While France has made progress in areas like nuclear energy (which has low carbon emissions but isn't 
          classified as renewable), Latvia demonstrates strong environmental stewardship, particularly impressive 
          given its status as a developing economy.
        </p>
      </div>
    </div>
  );
}