import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

export const Classic2DView: React.FC = () => {
  const setMode = useGameStore((s) => s.setMode);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  // Relay real-time database updates to classic.html iframe
  useEffect(() => {
    const notifyIframe = (data?: any) => {
      try {
        iframeRef.current?.contentWindow?.postMessage({ type: 'PORTFOLIO_UPDATED', data }, '*');
      } catch (_) {}
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'portfolio_data_updated_at') {
        let payload: any = null;
        try {
          const cached = localStorage.getItem('portfolio_cached_data');
          if (cached) payload = JSON.parse(cached);
        } catch (_) {}
        notifyIframe(payload);
      }
    };
    window.addEventListener('storage', handleStorage);

    let channel: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('portfolio_data_updated');
        channel.onmessage = (msg) => {
          notifyIframe(msg.data?.data);
        };
      } catch (_) {}
    }

    return () => {
      window.removeEventListener('storage', handleStorage);
      channel?.close();
    };
  }, []);

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
        ref={iframeRef}
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
