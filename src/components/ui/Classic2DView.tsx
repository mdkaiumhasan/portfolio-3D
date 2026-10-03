import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

export const Classic2DView: React.FC = () => {
  const { setMode } = useGameStore();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ENTER_3D') {
        setMode('3d');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setMode]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#ffffff' }}>
      <iframe
        src="/classic.html"
        title="Classic 2D Portfolio - MD. Kaium Hasan"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block'
        }}
      />
    </div>
  );
};

export default Classic2DView;
