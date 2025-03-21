import React from 'react';
import Link from 'next/link';
import styles from './header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          France-Latvia <span>Dashboard</span>
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/economy" className={styles.navLink}>
            Economy
          </Link>
          <Link href="/labor" className={styles.navLink}>
            Labor
          </Link>
          <Link href="/society" className={styles.navLink}>
            Society
          </Link>
          <Link href="/environment" className={styles.navLink}>
            Environment
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;