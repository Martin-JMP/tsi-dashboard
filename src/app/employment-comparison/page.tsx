'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import '../styles/navigation.css';
import EmploymentSectorChart from '../components/EmploymentSectorChart';
import SalaryComparisonChart from '../components/SalaryComparisonChart';

export default function EmploymentComparisonPage() {
  const pathname = usePathname();
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const handleSectorSelect = (sectorId: string | null) => {
    setSelectedSector(sectorId);
  };

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
            <Link href="/employment" className={`nav-link ${pathname === '/employment' ? 'active' : ''}`}>
              Employment
            </Link>
          </li>
          <li>
            <Link href="/employment-comparison" className={`nav-link ${pathname === '/employment-comparison' ? 'active' : ''}`}>
              Employment Comparison
            </Link>
          </li>
        </ul>
      </nav>

      <div className="container mx-auto p-4">
        <div className="card bg-base-100 shadow-xl p-6">
          <div className="card-body">
            <div className="grid grid-rows-2 gap-4 h-full">
              <div className="w-full h-[400px]">
                <EmploymentSectorChart onSectorSelect={handleSectorSelect} />
              </div>
              <div className="w-full h-[400px]">
                <SalaryComparisonChart 
                  highlightedSector={selectedSector}
                  onSectorChange={setSelectedSector}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
