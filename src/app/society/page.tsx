import fs from 'fs';
import path from 'path';
import styles from './page.module.css';
import { parseCSVData, groupDataByCategory } from '../utils/data';
import DataGrid from '../components/DataGrid';
import ComparisonCard from '../components/ComparisonCard';

export default function Society() {
  // Read the CSV file
  const csvFilePath = path.join(process.cwd(), 'src/app/DB/LIFE KPI(PIB...) FRANCE LATVIA.csv');
  const csvData = fs.readFileSync(csvFilePath, 'utf8');
  
  // Parse the data
  const parsedData = parseCSVData(csvData);
  const groupedData = groupDataByCategory(parsedData);
  
  // Get society and quality of life data
  const societyData = groupedData['Society and quality of life'] || [];

  // Key metrics to highlight
  const keyMetrics = societyData.filter(item => 
    ['Life expectancy (years)', 'Human Development Index (HDI)', 'Poverty rate (%)'].includes(item.kpi)
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Society & Quality of Life</h1>
      <p className={styles.pageDescription}>
        Compare social indicators and quality of life metrics between France and Latvia, including life expectancy, 
        education, healthcare, and measures of equality and development.
      </p>
      
      <div className={styles.highlightSection}>
        <h2>Key Social Indicators</h2>
        <div className={styles.highlightGrid}>
          {keyMetrics.map((item, index) => (
            <ComparisonCard key={index} item={item} />
          ))}
        </div>
      </div>
      
      <DataGrid data={societyData} title="All Quality of Life Indicators" />
      
      <div className={styles.analysis}>
        <h2>Society & Quality of Life Analysis</h2>
        <p>
          France shows higher social development metrics across most indicators. Life expectancy in France (82.5 years) is significantly 
          higher than Latvia (75.0 years), representing a difference of 7.5 years.
        </p>
        <p>
          Healthcare expenditure in France (11% of GDP) is nearly double that of Latvia (6%), which may contribute to the difference in 
          life expectancy and overall quality of healthcare.
        </p>
        <p>
          Latvia has a higher income inequality with a Gini index of 0.35 compared to France's 0.29 (lower is better), and a higher poverty 
          rate of 22% compared to France's 14%.
        </p>
        <p>
          Both countries have strong higher education rates, with France at 38% and Latvia at 34%, demonstrating a commitment to education 
          despite their economic differences.
        </p>
      </div>
    </div>
  );
}