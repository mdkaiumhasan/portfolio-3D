import React from 'react';
import { AlertTriangle, Layout, RefreshCw } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGL2RenderingContext && canvas.getContext('webgl2')
    ) || Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackMode?: 'full' | 'world';
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unexpected rendering error occurred.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[Portfolio ErrorBoundary]:', error, info.componentStack);
  }

  handleSwitchTo2D = () => {
    this.setState({ hasError: false, errorMessage: '' });
    const store = useGameStore.getState();
    store.setIsIntroLoading(false);
    store.setActivePanel(null);
    store.setMode('2d');
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999999,
          background: 'radial-gradient(ellipse at center, #0f172a 0%, #050814 100%)',
          color: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: '460px',
            width: '100%',
            padding: '32px 26px',
            borderRadius: '18px',
            background: 'rgba(15, 23, 42, 0.92)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24',
            }}
          >
            <AlertTriangle size={28} />
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            3D Graphics Engine Paused
          </h2>

          <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#94a3b8', margin: 0 }}>
            Your browser or GPU encountered a WebGL memory or hardware acceleration limit. You can instantly open the full 2D Classic Portfolio with zero data loss.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', paddingTop: '6px' }}>
            <button
              type="button"
              onClick={this.handleSwitchTo2D}
              className="btn-cyber btn-cyber-primary"
              style={{ flex: '1 1 180px', justifyContent: 'center', padding: '11px 18px' }}
            >
              <Layout size={16} />
              Open 2D Portfolio
            </button>

            <button
              type="button"
              onClick={this.handleReload}
              className="btn-cyber"
              style={{ flex: '1 1 140px', justifyContent: 'center', padding: '11px 18px' }}
            >
              <RefreshCw size={15} />
              Retry 3D
            </button>
          </div>
        </div>
      </div>
    );
  }
}

