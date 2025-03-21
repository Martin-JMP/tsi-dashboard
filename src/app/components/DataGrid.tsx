import React from 'react';
import styles from './dataGrid.module.css';
import ComparisonCard from './ComparisonCard';
import { DataItem } from '../utils/data';

interface DataGridProps {
  data: DataItem[];
  title: string;
}

const DataGrid: React.FC<DataGridProps> = ({ data, title }) => {
  return (
    <div className={styles.gridContainer}>
      <h2 className={styles.gridTitle}>{title}</h2>
      <div className={styles.grid}>
        {data.map((item, index) => (
          <ComparisonCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default DataGrid;