'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-16">
          <div className="flex space-x-12 items-center">
            <Link 
              href="/" 
              className={`inline-flex items-center px-6 py-2 text-lg font-medium rounded-lg transition-all duration-200 
                ${pathname === '/' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-blue-50'
                }`}
            >
              GDP
            </Link>

            <Link 
              href="/population"
              className={`inline-flex items-center px-6 py-2 text-lg font-medium rounded-lg transition-all duration-200 
                ${pathname === '/population' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-blue-50'
                }`}
            >
              Population
            </Link>

            <Link 
              href="/labor-market"
              className={`inline-flex items-center px-6 py-2 text-lg font-medium rounded-lg transition-all duration-200 
                ${pathname === '/labor-market' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-blue-50'
                }`}
            >
              Labor Market
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}