'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../styles/navigation.css';
import PopulationChart from '../components/PopulationChart';

export default function PopulationPage() {
  const pathname = usePathname();

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

      <div className="flex justify-center items-center mt-8">
        <PopulationChart  onCountrySelect={() => null} selectedCountry={null}/>
      </div>
    </div>
  );
}
