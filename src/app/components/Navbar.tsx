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
          <Link href="/more" className={`nav-link ${pathname === '/more' ? 'active' : ''}`}>
            More
          </Link>
        </li>
      </ul>
      <div style={{ width: '40px' }}></div> {/* Spacer to balance the layout */}
    </nav>
  );
}
