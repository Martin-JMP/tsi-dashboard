import React from 'react';
import type { DataItem } from '../utils/data';
import styles from './comparisonCard.module.css';

interface ComparisonCardProps {
  item: DataItem;
  title?: string;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ item, title }) => {
  // Calculate a simple difference to know which country has a higher value
  const franceValue = item.franceNumeric ?? 0;
  const latviaValue = item.latviaNumeric ?? 0;
  const difference = franceValue - latviaValue;
  const percentageDiff = latviaValue !== 0 
    ? Math.abs(Math.round((difference / latviaValue) * 100)) 
    : 0;
  
  // Determine which value is better (simplified logic - higher is better by default)
  // For metrics like unemployment, inflation, etc. lower is better, so we invert the comparison
  const lowerIsBetter = [
    'Unemployment rate', 
    'Inflation', 
    'Public debt', 
    'Poverty rate',
    'Gini index',
    'CO2 emissions per capita'
  ].some(term => item.kpi.includes(term));
  
  const franceIsBetter = lowerIsBetter ? difference < 0 : difference > 0;
  
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title || item.kpi}</h3>
      <div className={styles.comparison}>
        <div className={styles.country}>
          <div className={styles.flag}>🇫🇷</div>
          <div className={styles.value}>{item.france}</div>
        </div>
        <div className={styles.vs}>vs</div>
        <div className={styles.country}>
          <div className={styles.flag}>🇱🇻</div>
          <div className={styles.value}>{item.latvia}</div>
        </div>
      </div>
      {percentageDiff > 0 && (
        <div className={styles.difference}>
          <span className={franceIsBetter ? styles.better : styles.worse}>
            France is {percentageDiff}% {franceIsBetter ? 'better' : 'worse'}
          </span>
        </div>
      )}
    </div>
  );
};

export default ComparisonCard;