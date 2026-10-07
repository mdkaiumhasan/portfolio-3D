import React, { useState, useMemo } from 'react';
import { 
  X, 
  Briefcase, 
  Calendar, 
  CheckCircle2
} from 'lucide-react';
import { usePortfolioData, ExperienceItem } from '../../hooks/usePortfolioData';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const ExperienceModal: React.FC = () => {
  const { setActivePanel, audioEnabled } = useGameStore();
  const { data } = usePortfolioData();
  const [enlargedImage, setEnlargedImage] = useState<{ url: string; title: string } | null>(null);

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  const dynamicExperiences = useMemo(() => {
    return (data.experiences || []).filter(
      (e: ExperienceItem) => e && e.title && e.title.trim().length > 0
    );
  }, [data.experiences]);

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '1060px', 
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'radial-gradient(ellipse at top, #111b2b 0%, #090e17 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(6, 182, 212, 0.15)'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="modal-header" style={{ padding: '18px 24px', borderBottom: '1px solid rgba(56, 189, 248, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: '#00e5ff',
                boxShadow: '0 0 12px #00e5ff',
                animation: 'pulse 2s infinite'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff', letterSpacing: '0.6px', margin: 0 }}>
                  NETWORK OPERATIONS CENTER (NOC) & EXPERIENCE TIMELINE
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: 'rgba(0, 229, 255, 0.12)',
                    border: '1px solid rgba(0, 229, 255, 0.35)',
                    color: '#00e5ff',
                    letterSpacing: '0.4px',
                    fontFamily: 'var(--font-hud)'
                  }}
                >
                  LIVE NOC CONSOLE
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
                Operational Infrastructure Engagements, Field Engineering & Technical Milestones
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Direct Professional Grid without category tabs */}
        <div 
          className="modal-body" 
          style={{ 
            padding: '24px', 
            overflowY: 'auto',
            flex: 1
          }}
        >
          {dynamicExperiences.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
                gap: '18px'
              }}
            >
              {dynamicExperiences.map((exp: ExperienceItem, idx: number) => {
                const hasValidImage = exp.imageUrl && exp.imageUrl.trim().length > 0;

                return (
                  <div
                    key={`exp-card-${idx}`}
                    className="glass-panel glass-panel-hover"
                    style={{
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 14, 25, 0.95) 100%)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      borderRadius: '12px',
                      position: 'relative',
                      transition: 'all 0.25s ease',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
                    }}
                  >
                    {/* Top Row: Image Avatar, Title & Date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                        {/* Role Logo / Image Avatar */}
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '10px',
                            background: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            overflow: 'hidden',
                            boxShadow: '0 0 12px rgba(6, 182, 212, 0.15)',
                            cursor: hasValidImage ? 'pointer' : 'default'
                          }}
                          onClick={() => {
                            if (hasValidImage) {
                              setEnlargedImage({ url: exp.imageUrl || '', title: exp.title });
                            }
                          }}
                          title={hasValidImage ? "Click to inspect image" : undefined}
                        >
                          {hasValidImage ? (
                            <img
                              src={exp.imageUrl}
                              alt={exp.title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                padding: '3px',
                                display: 'block'
                              }}
                            />
                          ) : (
                            <Briefcase size={22} color="#00e5ff" />
                          )}
                        </div>

                        {/* Title */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3
                            style={{
                              fontSize: '16px',
                              fontWeight: 700,
                              color: '#ffffff',
                              letterSpacing: '0.3px',
                              margin: 0,
                              lineHeight: 1.35
                            }}
                          >
                            {exp.title}
                          </h3>
                        </div>
                      </div>

                      {/* Date Badge */}
                      {exp.date && (
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            background: 'rgba(56, 189, 248, 0.1)',
                            border: '1px solid rgba(56, 189, 248, 0.25)',
                            color: '#38bdf8',
                            fontWeight: 700,
                            fontFamily: 'var(--font-hud)',
                            letterSpacing: '0.3px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                          }}
                        >
                          <Calendar size={12} color="#38bdf8" />
                          {exp.date}
                        </span>
                      )}
                    </div>

                    {/* Description Text */}
                    {exp.description && (
                      <div
                        style={{
                          fontSize: '13.5px',
                          lineHeight: '1.6',
                          color: '#cbd5e1',
                          background: 'rgba(0, 0, 0, 0.2)',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.04)'
                        }}
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: 'rgba(15, 23, 42, 0.4)',
                borderRadius: '12px',
                border: '1px dashed rgba(148, 163, 184, 0.2)'
              }}
            >
              <p style={{ fontSize: '15px', color: '#ffffff', fontWeight: 600 }}>
                No experience records found
              </p>
            </div>
          )}
        </div>

        {/* Bottom Footer Information Bar */}
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(10, 14, 25, 0.8)',
            borderTop: '1px solid rgba(56, 189, 248, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={14} color="#00e5ff" />
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              All experience records are managed live via the MongoDB Admin Console.
            </span>
          </div>

          <button
            onClick={handleClose}
            className="btn-cyber"
            style={{
              padding: '6px 18px',
              fontSize: '12px',
              fontFamily: 'var(--font-hud)',
              fontWeight: 700
            }}
          >
            DISMISS CONSOLE
          </button>
        </div>
      </div>

      {/* Enlarged Image Lightbox */}
      {enlargedImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setEnlargedImage(null)}
        >
          <div
            style={{
              maxWidth: '850px',
              width: '100%',
              background: '#0f172a',
              borderRadius: '12px',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h4 style={{ margin: 0, fontSize: '15px', color: '#ffffff', fontWeight: 600 }}>
                {enlargedImage.title}
              </h4>
              <button
                onClick={() => setEnlargedImage(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
              <img
                src={enlargedImage.url}
                alt={enlargedImage.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  borderRadius: '6px'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
