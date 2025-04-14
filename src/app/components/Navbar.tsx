'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../styles/navigation.css';

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="nav-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src="/Logo_of_Transport_and_Telecommunication_Institute.png" 
          alt="TSI Logo" 
          style={{ 
            height: '40px', 
            marginLeft: '5px' 
          }} 
        />
      </div>
      <ul className="nav-list" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <li>
          <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
            Labor-Market
          </Link>
        </li>
        <li>
          <Link href="/education" className={`nav-link ${pathname === '/education' ? 'active' : ''}`}>
            Education
          </Link>
        </li>
        <li>
          <Link href="/more" className={`nav-link ${pathname === '/more' ? 'active' : ''}`}>
            More
          </Link>
        </li>
      </ul>      <Link 
        href="/analytics" 
        className="nav-link" 
        style={{ 
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M3 3v18h18" />
          <path d="M18 9l-5 5-2-2-3 3" />
        </svg>
        Analytics
      </Link>
    </nav>
  );
}
