'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useMemo, useEffect, useCallback } from 'react';
import '../styles/navigation.css';
import UnemploymentChart from '../components/UnemploymentChart';
import SalaryComparisonChart from '../components/SalaryComparisonChart';
import EmploymentSectorChart from '../components/EmploymentSectorChart';
import styles from './labor-market.module.css';

// Raw salary data for France and Latvia
const sectorNames = {
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

const franceSalaries = {
  'A': 2200, 'B': 2400, 'C': 2400, 'D': 2600, 'E': 2100,
  'F': 2100, 'G': 2000, 'H': 2500, 'I': 1900, 'J': 4200,
  'K': 4800, 'L': 2600, 'M': 4300, 'N': 2200, 'O': 3100,
  'P': 2400, 'Q': 2500, 'R': 2800, 'S': 2000, 'TOTAL': 2600
};

const latviaSalaries = {
  'A': 1124, 'B': 1239, 'C': 1070, 'D': 1452, 'E': 1099,
  'F': 1048, 'G': 1008, 'H': 1072, 'I': 738, 'J': 1817,
  'K': 1928, 'L': 909, 'M': 1416, 'N': 963, 'O': 1313,
  'P': 918, 'Q': 1192, 'R': 951, 'S': 926, 'TOTAL': 1119
};

// SalaryComparisonCard component integrated directly in page.tsx
function SalaryComparisonCard({ sector, franceSalary, latviaSalary }: { sector: string; franceSalary: number; latviaSalary: number }) {
  const difference = franceSalary - latviaSalary;
  const percentageDiff = ((difference / latviaSalary) * 100).toFixed(1);

  return (
    <div className={styles.salaryComparisonContainer}>
      <div className={styles.salaryHeader}>
        <h3 className={styles.salaryTitle}>{sector}</h3>
      </div>
      
      <div className={styles.salaryBody}>

        <div className={`${styles.countryBlock} ${styles.countryLatvia}`}>
          <div className={styles.countryName}>LATVIA</div>
          <div className={styles.salaryValue}>
            {latviaSalary.toLocaleString()} €
          </div>
        </div>

        <div className={styles.differenceSection}>
          <div className={styles.differenceBar}>
            <div 
              className={styles.differenceProgress} 
              style={{width: `${Math.min(Math.abs(Number(percentageDiff)), 150)}%`}}
            ></div>
          </div>
          <div>
            <div className={styles.differenceLabel}>DIFFERENCE</div>
            <div className={styles.differenceAmount}>
              {difference > 0 ? '+' : '-'}{Math.abs(difference).toLocaleString()} €
            </div>
            <div>
              <span className={styles.differencePercent}>
                {difference > 0 ? '+' : '-'}{Math.abs(Number(percentageDiff))}%
              </span>
            </div>
          </div>
        </div>

        <div className={`${styles.countryBlock} ${styles.countryFrance}`}>
          <div className={styles.countryName}>FRANCE</div>
          <div className={styles.salaryValue}>
            {franceSalary.toLocaleString()} €
          </div>
        </div>

      </div>
    </div>
  );
}

// New component for displaying top differences
function TopDifferencesCard({ 
  sectorNames, 
  franceSalaries, 
  latviaSalaries,
  onHighlightChange 
}: { 
  sectorNames: Record<string, string>; 
  franceSalaries: Record<string, number>; 
  latviaSalaries: Record<string, number>;
  onHighlightChange: (sectors: string[]) => void;
}) {
  const [showHighest, setShowHighest] = useState(true);
  
  const differencesData = useMemo(() => {
    const result = Object.keys(sectorNames)
      .filter(key => key !== 'TOTAL') // Exclude total from the comparison
      .map(sectorKey => {
        const franceSalary = franceSalaries[sectorKey as keyof typeof franceSalaries];
        const latviaSalary = latviaSalaries[sectorKey as keyof typeof latviaSalaries];
        const difference = franceSalary - latviaSalary;
        const percentageDiff = (difference / latviaSalary) * 100;
        
        return {
          sectorKey,
          sectorName: sectorNames[sectorKey as keyof typeof sectorNames],
          percentageDiff,
          franceSalary,
          latviaSalary
        };
      });
    
    // Sort by percentage difference (absolute value for proper comparison)
    if (showHighest) {
      return result.sort((a, b) => b.percentageDiff - a.percentageDiff).slice(0, 3);
    } else {
      return result.sort((a, b) => a.percentageDiff - b.percentageDiff).slice(0, 3);
    }
  }, [sectorNames, franceSalaries, latviaSalaries, showHighest]);
  
  // Fix: Only call when showHighest changes instead of on every render
  useEffect(() => {
    const topSectorKeys = differencesData.map(item => item.sectorKey);
    onHighlightChange(topSectorKeys);
  }, [showHighest]); // Only depend on showHighest, not differencesData or onHighlightChange
  
  const handleToggleHighest = () => {
    setShowHighest(true);
  };
  
  const handleToggleLowest = () => {
    setShowHighest(false);
  };
  
  return (
    <div className={styles.topDifferencesContainer}>
      <div className={styles.topDifferencesHeader}>
        <h3 className={styles.topDifferencesTitle}>
          {showHighest ? 'Highest' : 'Lowest'} Salary Differences
        </h3>
        <div className={styles.toggleButtons}>
          <button 
            className={`${styles.toggleButton} ${showHighest ? styles.activeButton : ''}`}
            onClick={handleToggleHighest}
          >
            High
          </button>
          <button 
            className={`${styles.toggleButton} ${!showHighest ? styles.activeButton : ''}`}
            onClick={handleToggleLowest}
          >
            Low
          </button>
        </div>
      </div>
      
      <div className={styles.topDifferencesList}>
        {differencesData.map((item, index) => (
          <div key={item.sectorKey} className={styles.topDifferenceItem}>
            <div className={styles.topDifferenceRank}>{index + 1}</div>
            <div className={styles.topDifferenceSector}>{item.sectorName}</div>
            <div className={styles.topDifferenceValue}>
              <span className={item.percentageDiff > 0 ? styles.positiveValue : styles.negativeValue}>
                {item.percentageDiff > 0 ? '+' : ''}{item.percentageDiff.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LaborMarketPage() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'unemployment' | 'salary' | 'employment'>('unemployment');
  const [selectedSector, setSelectedSector] = useState<string>("TOTAL");
  const [highlightedSectors, setHighlightedSectors] = useState<string[]>([]);
  
  // Get data for the selected sector
  const getSelectedSectorData = () => {
    return {
      id: selectedSector,
      name: sectorNames[selectedSector as keyof typeof sectorNames],
      franceSalary: franceSalaries[selectedSector as keyof typeof franceSalaries],
      latviaSalary: latviaSalaries[selectedSector as keyof typeof latviaSalaries]
    };
  };
  
  const selectedSectorData = getSelectedSectorData();
  
  // Handle sector selection from chart
  const handleSectorSelection = (sector: string) => {
    setSelectedSector(sector);
  };
  
  // Handle highlighted sectors from TopDifferencesCard
  const handleHighlightChange = useCallback((sectors: string[]) => {
    setHighlightedSectors(sectors);
  }, []);

  return (
    <div>
      <nav className="nav-container">
        <ul className="nav-list">
          <li>
            <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
              GDP
            </Link>
          </li>
          <li>
            <Link href="/population" className={`nav-link ${pathname === '/population' ? 'active' : ''}`}>
              Population
            </Link>
          </li>
          <li>
            <Link href="/labor-market" className={`nav-link ${pathname === '/labor-market' ? 'active' : ''}`}>
              Labor Market
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.container}>
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <div 
              className={`${styles.tab} ${activeTab === 'unemployment' ? styles.active : ''}`}
              onClick={() => setActiveTab('unemployment')}
            >
              Unemployment Rate
            </div>
            <div 
              className={`${styles.tab} ${activeTab === 'salary' ? styles.active : ''}`}
              onClick={() => setActiveTab('salary')}
            >
              Salary Comparison
            </div>
            <div 
              className={`${styles.tab} ${activeTab === 'employment' ? styles.active : ''}`}
              onClick={() => setActiveTab('employment')}
            >
              Employment
            </div>
          </div>
        </div>

        <div className={styles.chartGrid}>
          {activeTab === 'unemployment' && (
            <div className={styles.row}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Unemployment Rate Trends (1991-2023)</h2>
                </div>
                <div className={styles.cardContent}>
                  <UnemploymentChart />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'salary' && (
            <div className={styles.row}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Salary Comparison by Sector (2023)</h2>
                </div>
                <div className={styles.cardContent}>
                  <SalaryComparisonChart 
                    onSectorChange={handleSectorSelection} 
                    highlightedSectors={highlightedSectors}
                  />
                  <div className={styles.comparisonRow}>
                    <SalaryComparisonCard 
                      sector={selectedSectorData.name}
                      franceSalary={selectedSectorData.franceSalary}
                      latviaSalary={selectedSectorData.latviaSalary}
                    />
                    <TopDifferencesCard 
                      sectorNames={sectorNames}
                      franceSalaries={franceSalaries}
                      latviaSalaries={latviaSalaries}
                      onHighlightChange={handleHighlightChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'employment' && (
            <div className={styles.row}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Employment by Sector (2023)</h2>
                </div>
                <div className={styles.cardContent}>
                  <EmploymentSectorChart />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}