import React, { useState } from 'react';
import { X, Briefcase, Award, GraduationCap, CheckCircle2, MapPin } from 'lucide-react';
import { experienceData, ExperienceItem } from '../../data/experience';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const ExperienceModal: React.FC = () => {
  const { setActivePanel, audioEnabled } = useGameStore();
  const [filterType, setFilterType] = useState<string>('All');

  const filterOptions = ['All', 'Work Experience', 'Certification', 'Education'];

  const filteredItems = filterType === 'All'
    ? experienceData
    : experienceData.filter((item) => item.type === filterType);

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'Work Experience': return <Briefcase size={18} color="#ffb703" />;
      case 'Certification': return <Award size={18} color="#38bdf8" />;
      default: return <GraduationCap size={18} color="#a855f7" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" style={{ maxWidth: '940px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#ffb703',
                boxShadow: '0 0 10px #ffb703'
              }}
            />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff' }}>
                NETWORK OPERATIONS & CAREER TIMELINE
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                ISP Field Engineering, Cisco CCNA, Red Hat Linux & Software History
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(15, 23, 42, 0.4)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto'
          }}
        >
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                if (audioEnabled) sound.playClick();
                setFilterType(opt);
              }}
              style={{
                background: filterType === opt ? 'linear-gradient(135deg, rgba(255, 183, 3, 0.3) 0%, rgba(14, 165, 233, 0.25) 100%)' : 'rgba(30, 41, 59, 0.5)',
                border: `1px solid ${filterType === opt ? '#ffb703' : 'rgba(148, 163, 184, 0.2)'}`,
                color: filterType === opt ? '#ffffff' : '#94a3b8',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: filterType === opt ? '0 0 12px rgba(255, 183, 3, 0.35)' : 'none'
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Body Timeline */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderLeft: `4px solid ${item.type === 'Work Experience' ? '#ffb703' : item.type === 'Certification' ? '#38bdf8' : '#a855f7'}`,
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 14, 25, 0.95) 100%)'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(148, 163, 184, 0.2)'
                    }}
                  >
                    {getItemIcon(item.type)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                      {item.role}
                    </h3>
                    <p style={{ color: '#38bdf8', fontSize: '14px', fontWeight: 600, marginTop: '2px' }}>
                      {item.organization}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                      <MapPin size={13} color="#94a3b8" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      background: 'rgba(255, 183, 3, 0.15)',
                      border: '1px solid rgba(255, 183, 3, 0.35)',
                      color: '#fcd34d',
                      fontWeight: 600
                    }}
                  >
                    {item.period}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{item.type}</span>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#cbd5e1' }}>
                {item.description}
              </p>

              {/* Highlights */}
              {item.highlights.length > 0 && (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {item.highlights.map((h, hIdx) => (
                    <li key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                      <CheckCircle2 size={14} color="#ffb703" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Skills Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '4px' }}>
                {item.skills.map((s, sIdx) => (
                  <span key={sIdx} className="tech-tag" style={{ color: '#fcd34d', borderColor: 'rgba(255, 183, 3, 0.2)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
