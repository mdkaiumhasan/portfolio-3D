import React from 'react';
import { X, Award, GraduationCap, MapPin, Mail, Phone, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { profileData } from '../../data/profile';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const AboutModal: React.FC = () => {
  const { setActivePanel, audioEnabled } = useGameStore();

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  const handleOpenPanel = (panel: 'projects' | 'resume' | 'contact') => {
    if (audioEnabled) sound.playClick();
    setActivePanel(panel);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#00e5ff',
                boxShadow: '0 0 10px #00e5ff'
              }}
            />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff' }}>
                ABOUT THE DEVELOPER
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                System Architecture & Network Engineering Dossier
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Hero Profile Banner */}
          <div
            className="glass-panel"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              borderLeft: '4px solid #00e5ff',
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(13, 17, 27, 0.95) 100%)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
                  {profileData.name}
                </h1>
                <p style={{ color: '#38bdf8', fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                  Fullstack & Distributed Systems Developer | Certified Network Support Engineer (CCNA)
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '4px 12px', borderRadius: '20px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <span style={{ fontSize: '12px', color: '#6ee7b7', fontWeight: 600 }}>Available for Remote & Relocation</span>
              </div>
            </div>

            <p style={{ fontSize: '14px', lineHeight: '1.65', color: '#cbd5e1' }}>
              {profileData.bio}
            </p>

            {/* Quick Contact Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '6px', fontSize: '13px', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="#38bdf8" />
                <span>{profileData.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={15} color="#38bdf8" />
                <a href={`mailto:${profileData.email}`} style={{ color: '#e2e8f0', textDecoration: 'none' }}>
                  {profileData.email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={15} color="#38bdf8" />
                <span>{profileData.phone}</span>
              </div>
            </div>
          </div>

          {/* Key Metric Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            {profileData.stats.map((stat, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  background: 'rgba(15, 23, 42, 0.65)'
                }}
              >
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                  {stat.label}
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {stat.detail}
                </span>
              </div>
            ))}
          </div>

          {/* Education & Academic Rigor */}
          <div>
            <h3 style={{ fontSize: '15px', color: '#ffffff', fontFamily: 'var(--font-heading)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={18} color="#38bdf8" />
              ACADEMIC FOUNDATION
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {profileData.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="glass-panel"
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    background: 'rgba(15, 23, 42, 0.5)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '6px' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{edu.degree}</h4>
                      <p style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 500 }}>{edu.institution}</p>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        background: edu.status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                        color: edu.status === 'Completed' ? '#34d399' : '#38bdf8',
                        fontWeight: 600
                      }}
                    >
                      {edu.period} • {edu.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#94a3b8' }}>{edu.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '10px' }}>
            <button className="btn-cyber btn-cyber-primary" onClick={() => handleOpenPanel('projects')}>
              Explore Projects
            </button>
            <button className="btn-cyber" onClick={() => handleOpenPanel('resume')}>
              <FileText size={15} />
              View Resumes
            </button>
            <button className="btn-cyber" onClick={() => handleOpenPanel('contact')}>
              <Mail size={15} />
              Transmit Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
