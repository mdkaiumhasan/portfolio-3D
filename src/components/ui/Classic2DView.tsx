import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

export const Classic2DView: React.FC = () => {
  const setMode = useGameStore((s) => s.setMode);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin && event.origin !== window.location.origin) return;
      if (event.data?.type === 'ENTER_3D') {
        try {
          const url = new URL(window.location.href);
          if (url.searchParams.has('view')) {
            url.searchParams.delete('view');
            window.history.replaceState({}, '', url.pathname + url.search + url.hash);
          }
        } catch {
          // Ignore URL history update errors
        }
        const state = useGameStore.getState();
        if (!state.isWorldSceneReady) {
          state.setIsIntroLoading(true);
        }
        setMode('3d');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setMode]);

  return (
    <div style={{ width: '100vw', height: '100dvh', position: 'relative', overflow: 'hidden', background: '#0b0f17' }}>
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
