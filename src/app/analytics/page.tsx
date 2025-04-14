'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Heatmap from '../components/Heatmap';
import styles from './analytics.module.css';
import { v4 as uuidv4 } from 'uuid';

interface ClickData {
  x: number;
  y: number;
  value: number;
  timestamp: number;
  sessionId: string;
  ip: string;
}

interface SessionData {
  sessionId: string;
  startTime: number;
  endTime: number;
  duration: number;
  ip: string;
}

interface SessionGroup {
  ip: string;
  sessions: SessionData[];
}

export default function AnalyticsPage() {
  const [clickData, setClickData] = useState<ClickData[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>('all');
  const [sessionGroups, setSessionGroups] = useState<SessionGroup[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const storedData = localStorage.getItem('userClickData');
    const storedSessions = localStorage.getItem('sessionData');
    
    if (storedData) {
      const parsedClickData = JSON.parse(storedData) as ClickData[];
      setClickData(parsedClickData);
    }
    if (storedSessions) {
      const sessionsData = JSON.parse(storedSessions) as SessionData[];
      setSessions(sessionsData);
      
      // Grouper les sessions par IP
      const sessionsByIp = sessionsData.reduce<{ [key: string]: SessionData[] }>((acc, session) => {
        if (!acc[session.ip]) {
          acc[session.ip] = [];
        }
        acc[session.ip].push(session);
        return acc;
      }, {});

      const groups: SessionGroup[] = Object.entries(sessionsByIp).map(([ip, sessions]) => ({
        ip,
        sessions: sessions.sort((a: SessionData, b: SessionData) => b.startTime - a.startTime)
      }));
      
      setSessionGroups(groups);
    }
  };

  const resetAnalytics = () => {
    // Sauvegarder la session courante si elle existe
    const currentSessionId = localStorage.getItem('currentSessionId');
    if (currentSessionId) {
      const sessionEndTime = Date.now();
      const sessionStartTime = parseInt(localStorage.getItem('sessionStartTime') || '0', 10);
      const sessionDuration = sessionEndTime - sessionStartTime;
      const currentIP = localStorage.getItem('currentIP') || 'unknown';

      const storedSessions = localStorage.getItem('sessionData');
      const sessions = storedSessions ? JSON.parse(storedSessions) : [];
      sessions.push({
        sessionId: currentSessionId,
        startTime: sessionStartTime,
        endTime: sessionEndTime,
        duration: sessionDuration,
        ip: currentIP
      });
      localStorage.setItem('sessionData', JSON.stringify(sessions));
    }    // Créer une nouvelle session
    const newSessionId = uuidv4();
    const newStartTime = Date.now().toString();
    localStorage.setItem('currentSessionId', newSessionId);
    localStorage.setItem('sessionStartTime', newStartTime);
    localStorage.setItem('userClickData', '[]');

    // Recharger les données et réinitialiser l'interface
    loadData();
    setClickData([]);
    setSelectedSession('all');
  };

  // Filtrer les données en fonction de la session sélectionnée
  const filteredClickData = selectedSession === 'all'
    ? clickData
    : clickData.filter((click: ClickData) => click.sessionId === selectedSession);

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>User Interaction Analytics</h1>
        <div className={styles.headerButtons}>
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className={styles.historyButton}
          >
            View History
          </button>
          <button
            onClick={resetAnalytics}
            className={styles.resetButton}
          >
            Reset Analytics
          </button>
          <Link href="/" className={styles.backButton}>
            Return to Dashboard
          </Link>
        </div>
      </div>

      {isHistoryModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Session History</h2>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              {sessionGroups.map((group, index) => (
                <div key={group.ip} className={styles.sessionGroup}>
                  <h3>Client {index + 1} (IP: {group.ip})</h3>
                  <div className={styles.sessionList}>
                    {group.sessions.map((session, sessionIndex) => (
                      <div 
                        key={session.sessionId}
                        className={styles.historySession}
                        onClick={() => {
                          setSelectedSession(session.sessionId);
                          setIsHistoryModalOpen(false);
                        }}
                      >
                        <div className={styles.sessionTime}>
                          {new Date(session.startTime).toLocaleString()}
                        </div>
                        <div className={styles.sessionDuration}>
                          Duration: {formatDuration(session.duration)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={styles.sessionSelect}>
        <label htmlFor="session-select">Select Session:</label>
        <select 
          id="session-select" 
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
        >
          <option value="all">All Sessions</option>
          {sessionGroups.map((group, index) => (
            <optgroup key={group.ip} label={`Client ${index + 1} (IP: ${group.ip})`}>
              {group.sessions.map((session, sessionIndex) => (
                <option key={session.sessionId} value={session.sessionId}>
                  Session {sessionIndex + 1} - {new Date(session.startTime).toLocaleString()} 
                  ({formatDuration(session.duration)})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.stat}>
          <h3>Total Clicks</h3>
          <p>{filteredClickData.length}</p>
        </div>
        <div className={styles.stat}>
          <h3>Time Range</h3>
          <p>
            {filteredClickData.length > 0 
              ? `${new Date(Math.min(...filteredClickData.map(d => d.timestamp))).toLocaleString()} - 
                 ${new Date(Math.max(...filteredClickData.map(d => d.timestamp))).toLocaleString()}`
              : 'No data'
            }
          </p>
        </div>
      </div>

      <div className={styles.sessionInfo}>
        {selectedSession !== 'all' && (
          <div className={styles.currentSession}>
            <h3>Current Session Details</h3>
            {sessions.filter(s => s.sessionId === selectedSession).map(session => (
              <div key={session.sessionId} className={styles.sessionDetails}>
                <p>IP Address: {session.ip}</p>
                <p>Duration: {formatDuration(session.duration)}</p>
                <p>Start: {new Date(session.startTime).toLocaleString()}</p>
                <p>End: {new Date(session.endTime).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.heatmapContainer}>
        <Heatmap clickData={filteredClickData.map(({ x, y, value }) => ({ x, y, value }))} />
      </div>
    </div>
  );
}
