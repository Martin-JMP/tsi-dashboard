'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useMemo, useEffect, useCallback } from 'react';
import './styles/navigation.css';
import UnemploymentChart from './components/UnemploymentChart';
import PopulationChart from './components/PopulationChart';
import SalaryComparisonChart from './components/SalaryComparisonChart';
import EmploymentSectorChart from './components/EmploymentSectorChart';
import Navbar from './components/Navbar';
import styles from './labor-market/labor-market.module.css';

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
          <div className={styles.differenceSection2}>
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

export default function Home() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'global' | 'sector'>('global');
  const [selectedSector, setSelectedSector] = useState<string>("TOTAL");
  const [highlightedSectors, setHighlightedSectors] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleCountrySelect = useCallback((country: string | null) => {
    setSelectedCountry(country === selectedCountry ? null : country);
  }, [selectedCountry]);

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
  const handleSectorSelection = useCallback((sector: string | null) => {
    setSelectedSector(sector || "TOTAL");
  }, []);
    const handleHighlightChange = useCallback((sectors: string[]) => {
    setHighlightedSectors(sectors);
  }, []);
    return (
    <div>
      <Navbar />
      
      <div className={styles.container}>
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <div 
              className={`${styles.tab} ${activeTab === 'global' ? styles.active : ''}`}
              onClick={() => setActiveTab('global')}
            >
              Global
            </div>
            <div 
              className={`${styles.tab} ${activeTab === 'sector' ? styles.active : ''}`}
              onClick={() => setActiveTab('sector')}
            >
              Sector
            </div>
          </div>
        </div>

        <div className={styles.chartGrid}>
          {activeTab === 'global' && (
            <div className={styles.globalContainer}>
              <UnemploymentChart 
                selectedCountry={selectedCountry}
                onCountrySelect={handleCountrySelect}
              />
              <PopulationChart 
                selectedCountry={selectedCountry}
                onCountrySelect={handleCountrySelect}
              />
            </div>
          )}

          {activeTab === 'sector' && (
            <div className={styles.sectorContainer}>
              <div className={styles.card}>                
                <div className={styles.cardContent}>                  
                  <SalaryComparisonChart 
                    onSectorChange={handleSectorSelection} 
                    highlightedSectors={highlightedSectors}
                    highlightedSector={selectedSector}
                    onHighlightChange={handleHighlightChange}
                  />
                </div>
              </div>              
              <div className={styles.employmentContainer}>
                <div className={styles.salaryComparisonWrapper}>
                  <SalaryComparisonCard 
                    sector={selectedSectorData.name}
                    franceSalary={selectedSectorData.franceSalary}
                    latviaSalary={selectedSectorData.latviaSalary}
                  />
                </div>                
                <div className={styles.employmentCharts}>
                  <div className={styles.pieChartWrapper}>                    
                    <EmploymentSectorChart 
                      onSectorSelect={handleSectorSelection}
                      selectedSector={selectedSector}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
