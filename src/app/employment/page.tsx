'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../styles/navigation.css';
import UnemploymentChart from '../components/UnemploymentChart';

export default function EmploymentPage() {
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
            <Link href="/employment" className={`nav-link ${pathname === '/employment' ? 'active' : ''}`}>
              Employment
            </Link>
          </li>
        </ul>
      </nav>

      <div className="container mx-auto p-4">
        <div className="card bg-base-100 shadow-xl p-6">
          <div className="card-body">
            <UnemploymentChart />
          </div>
        </div>
      </div>
    </div>
  );
}