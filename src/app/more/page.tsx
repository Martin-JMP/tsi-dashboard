'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../styles/navigation.css';
import styles from '../labor-market/labor-market.module.css';
import Navbar from '../components/Navbar';

export default function MorePage() {
  const pathname = usePathname();
    return (
    <div>      <nav className="nav-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

      <div className={styles.container}>
        <div className={styles.card} style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>          <h1 className={styles.cardTitle} style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            France & Latvia Comparison Dashboard
          </h1>
            <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#1f2937' }}>Project Summary</h2>
            <p style={{ lineHeight: '1.6', fontSize: '1rem', textAlign: 'justify' }}>
              <strong>Background:</strong> This dashboard represents an evolution from traditional data visualization to storytelling dashboards. 
              By combining effective visualization with a compelling narrative, we create a powerful and memorable data-driven story that resonates with the audience.
              While conventional dashboards often present disconnected charts lacking context, our approach combines data with narrative flow,
              enhancing understanding, engagement, and retention of information.
            </p>
            <p style={{ lineHeight: '1.6', fontSize: '1rem', marginTop: '0.75rem', textAlign: 'justify' }}>
              <strong>Goal:</strong> This project aims to take different datasets about France and Latvia, explore the data, and develop a dashboard 
              that tells a specific data-driven narrative using various visualisations. We've created a more intuitive tool that supports clearer insights 
              and more confident decision-making, minimizing misinterpretations and making complex economic relationships between the two countries more accessible.
            </p>
          </section>
          
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#1f2937' }}>Team</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p><strong>Students:</strong></p>
              <ul style={{ listStyle: 'none', paddingLeft: '1rem' }}>
                <li>Martin JONCOURT ST63562</li>
                <li>Matthieu LAPORTE ST63557</li>
                <li>Julien LECORDIER ST63559</li>
                <li>Kevin RIZK ST63555</li>
              </ul>
              <p style={{ marginTop: '0.5rem' }}><strong>Supervisor:</strong></p>
              <p style={{ paddingLeft: '1rem' }}>Dr.sc.ing., Associate Professor Nadezda Spiridovska</p>
            </div>
          </section>
            <section>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#1f2937' }}>Data Sources</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px', fontSize: '0.9rem' }}>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.4', marginTop: 0 }}>
                <li><a href="https://stat.gov.lv/en/statistics-themes/labour-market/wages-and-salaries/tables/dsv030-average-monthly-wages-and-salaries?themeCode=DS" target="_blank" rel="noopener noreferrer">Latvia Monthly Wages and Salaries</a></li>
                <li><a href="https://www.insee.fr/fr/outil-interactif/5369554/salaires-par-profession-dans-le-secteur-prive" target="_blank" rel="noopener noreferrer">France Wages by Profession</a></li>
                <li><a href="https://stat.gov.lv/en/statistics-themes/economy/national-accounts/tables/ikr020-value-added-and-its-share-total" target="_blank" rel="noopener noreferrer">Latvia Value Added by Sector</a></li>
                <li><a href="https://www.insee.fr/fr/statistiques/2424696#tableau-figure1" target="_blank" rel="noopener noreferrer">France Economic Statistics</a></li>
                <li><a href="https://www.insee.fr/fr/statistiques/4277700?sommaire=4318291#graphique-figure6" target="_blank" rel="noopener noreferrer">France Employment Statistics</a></li>
                <li><a href="https://data.worldbank.org/indicator/NY.GDP.PCAP.CD" target="_blank" rel="noopener noreferrer">World Bank GDP Per Capita</a></li>
              </ul>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.4', marginTop: 0 }}>
                <li><a href="https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG" target="_blank" rel="noopener noreferrer">World Bank Inflation Data</a></li>
                <li><a href="https://data.worldbank.org/indicator/BX.TRF.PWKR.DT.GD.ZS" target="_blank" rel="noopener noreferrer">World Bank Remittances</a></li>
                <li><a href="https://ec.europa.eu/eurostat/databrowser/view/PRC_HICP_MANR__custom_3761882/bookmark/table?lang=en&bookmarkId=4ad27e6f-358a-4a3d-82a0-587d69a833eb" target="_blank" rel="noopener noreferrer">Eurostat HICP Inflation Rate</a></li>
                <li><a href="https://ec.europa.eu/eurostat/databrowser/view/nama_10_gdp/default/table?lang=en" target="_blank" rel="noopener noreferrer">Eurostat GDP Components</a></li>
                <li><a href="https://www.oecd.org/en/data/indicators/employee-compensation-by-activity.html" target="_blank" rel="noopener noreferrer">OECD Employee Compensation</a></li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
