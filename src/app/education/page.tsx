'use client';
import Navbar from '../components/Navbar';
import EducationChart from '../components/EducationChart';
import '../styles/navigation.css';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EducationPage() {
  return (
    <div>
      <Navbar />

        <div className="w-full max-w-6xl" style={{ display: 'flex', justifyContent: 'center'}}>
          <EducationChart />
        </div>
    </div>
  );
}
