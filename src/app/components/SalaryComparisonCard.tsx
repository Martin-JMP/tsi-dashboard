import React from 'react';
import styles from './SalaryComparisonChart.module.css';

interface SalaryComparisonCardProps {
    sector: string;
    franceSalary: number;
    latviaSalary: number;
}

export default function SalaryComparisonCard({ 
    sector,
    franceSalary, 
    latviaSalary 
}: SalaryComparisonCardProps) {
    const difference = franceSalary - latviaSalary;
    const percentageDiff = ((difference / latviaSalary) * 100).toFixed(1);
    
    return (
        <div className={styles.horizontalCard}>
            <div className={styles.sectorInfo}>
                <h3 className={styles.sectorTitle}>{sector}</h3>
            </div>
            
            <div className={styles.horizontalComparison}>
                <div className={styles.countryItem}>
                    <div className={styles.countryLabel}>LATVIA</div>
                    <div className={styles.countryValue}>{latviaSalary.toLocaleString()} €</div>
                </div>
                
                <div className={styles.differenceItem}>
                    <div className={styles.diffBar}>
                        <div 
                            className={styles.diffProgress} 
                            style={{width: `${Math.min(Math.abs(Number(percentageDiff)), 100)}%`}}
                        ></div>
                    </div>
                    <div className={styles.diffValues}>
                        <span className={styles.diffAmount}>{difference.toLocaleString()} €</span>
                        <span className={styles.diffPercent}>{percentageDiff}%</span>
                    </div>
                </div>
                
                <div className={styles.countryItem}>
                    <div className={styles.countryLabel}>FRANCE</div>
                    <div className={styles.countryValue}>{franceSalary.toLocaleString()} €</div>
                </div>
            </div>
        </div>
    );
}
