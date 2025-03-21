import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from './layout.module.css';
import Header from './components/Header';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'France-Latvia Dashboard',
  description: 'Compare Key Indicators Between France and Latvia',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        <main className={styles.main}>
          {children}
        </main>
      </body>
=======
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
    {children}
    </body>
>>>>>>> 777c0d21785fdce457f3f78f8555d3a8e8826ba8
    </html>
  );
}

