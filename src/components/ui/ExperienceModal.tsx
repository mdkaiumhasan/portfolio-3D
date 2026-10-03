import React from 'react';
import { X, Briefcase, Calendar, CheckCircle2 } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const ExperienceModal: React.FC = () => {
  const { setActivePanel, audioEnabled } = useGameStore();
  const { data } = usePortfolioData();

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  const experiences = (data.experiences || []).filter((e) => e.title && e.title.trim().length > 0);

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: '940px',
          width: '95%',
          maxHeight: '88vh',
          backgroundColor: '#212529',
          color: '#f8f9fa',
          border: '1px solid #495057',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(40, 167, 69, 0.15)',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="modal-header"
          style={{
            background: 'linear-gradient(180deg, #2b3035 0%, #212529 100%)',
            borderBottom: '1px solid #343a40',
            padding: '18px 24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#28a745',
                boxShadow: '0 0 12px #28a745'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#f8f9fa', letterSpacing: '0.5px' }}>
                  EXPERIENCE & TIMELINE
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(40, 167, 69, 0.18)',
                    color: '#28a745',
                    border: '1px solid rgba(40, 167, 69, 0.4)'
                  }}
                >
                  Network & Systems
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#adb5bd' }}>
                Professional history, infrastructure engineering roles & enterprise milestones
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div
          className="modal-body"
          style={{
            padding: '24px',
            overflowY: 'auto',
            backgroundColor: '#212529',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#2b3035',
                border: '1px solid #495057',
                borderLeft: '4px solid #28a745',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                gap: '18px',
                alignItems: 'flex-start',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
              }}
            >
              {exp.imageUrl ? (
                <div style={{ width: '70px', height: '70px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#181b1e' }}>
                  <img
                    src={exp.imageUrl}
                    alt={exp.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <div style={{ width: '50px', height: '50px', borderRadius: '10px', backgroundColor: 'rgba(40, 167, 69, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Briefcase size={22} color="#28a745" />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8f9fa', margin: 0 }}>
                    {exp.title}
                  </h3>
                  {exp.date && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '20px',
                        backgroundColor: '#343a40',
                        color: '#28a745',
                        border: '1px solid #495057'
                      }}
                    >
                      <Calendar size={12} />
                      {exp.date}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#adb5bd', margin: 0 }}>
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            background: 'linear-gradient(180deg, #212529 0%, #1a1d20 100%)',
            borderTop: '1px solid #343a40',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '12px', color: '#adb5bd' }}>
            Permanent Dark Theme • Station: Network Ops Center
          </span>

          <button
            onClick={handleClose}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              backgroundColor: '#28a745',
              color: '#ffffff',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Back to 3D World
          </button>
        </div>
      </div>
    </div>
  );
};
