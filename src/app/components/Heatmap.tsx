'use client';
import { useEffect, useRef, useState } from 'react';
import h337 from 'heatmap.js';
import styles from './Heatmap.module.css';

interface HeatmapProps {
  clickData: { x: number; y: number; value: number; sessionId?: string }[];
  onDeleteSession?: (sessionId: string) => void;
  backgroundImage?: string;
}

export default function Heatmap({ 
  clickData, 
  onDeleteSession, 
  backgroundImage = '/capture_ecran_2025-04-14_193033.png' // Revert to original filename that might exist
}: HeatmapProps) {
  const heatmapRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);
  
  // Check if the image exists before displaying it
  useEffect(() => {
    if (backgroundImage) {
      console.log("Attempting to load image:", backgroundImage);
      const img = new Image();
      img.onload = () => {
        console.log("Image loaded successfully");
        setImgLoaded(true);
        setImgError(null);
      };
      img.onerror = (e) => {
        const errorMsg = `Unable to load image: ${backgroundImage}. Make sure the file exists in the public folder at the root of your project.`;
        console.error(errorMsg, e);
        setImgLoaded(false);
        setImgError(errorMsg);
      };
      img.src = backgroundImage;
    }
  }, [backgroundImage]);
  
  // Create and update the heatmap
  useEffect(() => {
    if (heatmapRef.current) {
      // Clear any previous instance
      heatmapRef.current.innerHTML = '';
      const heatmapInstance = h337.create({
        container: heatmapRef.current,
        radius: 25,
        maxOpacity: 0.7,
        minOpacity: 0.2,
        blur: 0.85,
        width: 1700,
        height: 2000,
        gradient: {
          '.2': '#1E88E5',
          '.4': '#1E88E5',
          '.6': '#FFA000',
          '.8': '#FF3D00',
          '1': '#D50000'
        },
        // Add custom canvas style configuration to override default inline styles
        defaultCanvas: {
          styleProperty: false // Disable inline style attributes
        }
      } as any);

      // After the heatmap is created, find and clean up the canvas element
      const canvas = heatmapRef.current.querySelector('.heatmap-canvas');
      if (canvas && canvas instanceof HTMLElement) {
        // Remove any inline styles
        canvas.removeAttribute('style');
      }

      // Normalize duration data for the heatmap
      const maxDuration = Math.max(...clickData.map(point => point.value));
      const normalizedData = clickData.map(point => ({
        x: Math.round(point.x),
        y: Math.round(point.y),
        value: Math.round((point.value / maxDuration) * 100)
      }));

      heatmapInstance.setData({
        max: 100,
        data: normalizedData,
      });
    }
  }, [clickData]);

  return (
    <div className={styles.heatmapWrapper}>
      <div className={styles.heatmapContainerWrapper}>
        {backgroundImage && imgLoaded ? (
          <div 
            className={styles.backgroundImage} 
            style={{ 
              backgroundImage: `url("${encodeURI(backgroundImage)}")`,
              border: '1px solid green' // Green border indicates successful load
            }} 
          />
        ) : (
          <div 
            className={styles.backgroundImage} 
            style={{ 
              backgroundColor: '#f0f0f0', // Gray fallback background
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid red'
            }} 
          >
            {imgError ? 'Image failed to load' : 'Loading image...'}
          </div>
        )}
        <div ref={heatmapRef} className={styles.heatmapContainer} />
      </div>
      
      {onDeleteSession && (
        <div className={styles.sessionControls}>
          {Array.from(new Set(clickData.map(click => click.sessionId))).map(sessionId => (
            sessionId && (
              <button
                key={sessionId}
                onClick={() => onDeleteSession(sessionId)}
                className={styles.deleteButton}
              >
                Supprimer session {sessionId.slice(0, 6)}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}
