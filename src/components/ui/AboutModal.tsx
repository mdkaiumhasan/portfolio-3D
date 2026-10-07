import React from 'react';
import { X, Award, MapPin, Mail, Phone, FileText, Terminal } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const AboutModal: React.FC = () => {
  const { setActivePanel, audioEnabled } = useGameStore();
  const { data } = usePortfolioData();

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  const handleOpenPanel = (panel: 'projects' | 'resume' | 'contact') => {
    if (audioEnabled) sound.playClick();
    setActivePanel(panel);
  };

  // Helper to render accent tags identically to 2D
  const renderAccentText = (text: string) => {
    if (!text) return null;
    const normalized = text
      .replace(/<span[^>]*class=["'](?:text-accent|accent)[^"']*["'][^>]*>(.*?)<\/span>/gi, '{{ACCENT}}$1{{/ACCENT}}')
      .replace(/<span[^>]*>(.*?)<\/span>/gi, '{{ACCENT}}$1{{/ACCENT}}');
    const parts = normalized.split(/\{\{ACCENT\}\}|\{\{\/ACCENT\}\}/gi);
    if (parts.length === 1) return text.replace(/<[^>]+>/g, '');
    return parts.map((part, index) => {
      const cleanPart = part.replace(/<[^>]+>/g, '');
      if (index % 2 === 1) {
        return (
          <span
            key={index}
            style={{
              color: '#00e5ff',
              textShadow: '0 0 14px rgba(0, 229, 255, 0.45)',
              fontWeight: 800
            }}
          >
            {cleanPart}
          </span>
        );
      }
      return cleanPart;
    });
  };

  const profileImage = data.home_profile_image || "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035635/portfolio/profile/kaium_profile_portrait.jpg";

  // Dynamic Contact helpers from database
  const getDetail = (type: string, fallback: string) => {
    const item = data.contactDetails?.find((d) => d.type.toLowerCase().includes(type.toLowerCase()));
    return item ? item.value : fallback;
  };

  const email = getDetail('email', 'mdkaiumhasan2005@gmail.com');
  const phone = getDetail('contact number', '+880 1560-014339');
  const location = getDetail('location', 'Dhanmondi, Dhaka, Bangladesh');

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" style={{ maxWidth: '980px' }} onClick={(e) => e.stopPropagation()}>
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
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff', letterSpacing: '0.5px' }}>
                {data.about_info_heading || 'INFORMATION ABOUT ME'}
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
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Dynamic Hero Profile Card */}
          <div
            className="glass-panel"
            style={{
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(0, 229, 255, 0.35)',
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(13, 18, 30, 0.95) 100%)',
              boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 20px -5px rgba(0, 229, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Top Row: Dynamic Portrait + Heading + Subheading */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Profile Image with Cyber Border */}
              <div
                style={{
                  width: '110px',
                  height: '110px',
                  minWidth: '110px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '2px solid #00e5ff',
                  boxShadow: '0 0 18px rgba(0, 229, 255, 0.35), 0 8px 16px rgba(0, 0, 0, 0.6)',
                  backgroundColor: '#0f172a',
                  flexShrink: 0
                }}
              >
                <img
                  src={profileImage}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center',
                    display: 'block'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
                  }}
                />
              </div>

              {/* Title & Status */}
              <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: 'rgba(0, 229, 255, 0.12)',
                      border: '1px solid rgba(0, 229, 255, 0.35)',
                      padding: '3px 12px',
                      borderRadius: '20px'
                    }}
                  >
                    <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600, letterSpacing: '0.3px' }}>
                      {data.about_info_heading || 'INFORMATION ABOUT ME'}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: data.available_for_work !== false ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      border: `1px solid ${data.available_for_work !== false ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                      padding: '3px 10px',
                      borderRadius: '20px'
                    }}
                  >
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: data.available_for_work !== false ? '#10b981' : '#ef4444',
                        boxShadow: data.available_for_work !== false ? '0 0 8px #10b981' : '0 0 8px #ef4444'
                      }}
                    />
                    <span style={{ fontSize: '11px', color: data.available_for_work !== false ? '#6ee7b7' : '#fca5a5', fontWeight: 600 }}>
                      {data.available_for_work !== false ? 'Available for Work' : 'Currently Engaged'}
                    </span>
                  </div>
                </div>

                {/* Main Heading dynamically from data.home_heading */}
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px', lineHeight: 1.35, margin: 0 }}>
                  {renderAccentText(data.home_heading || "Hi, I'm {{ACCENT}}MD. Kaium Hasan{{/ACCENT}}. A Network Engineer.")}
                </h1>

                {/* Subheading dynamically from data.home_subheading */}
                {data.home_subheading && (
                  <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', margin: 0 }}>
                    {data.home_subheading}
                  </p>
                )}
              </div>
            </div>

            {/* Detailed About Narrative from data.about_info_text */}
            {data.about_info_text && (
              <p style={{ fontSize: '13.5px', lineHeight: '1.65', color: '#cbd5e1', margin: 0 }}>
                {data.about_info_text}
              </p>
            )}

            {/* Quick Contact Chips from data.contactDetails */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '14px',
                paddingTop: '6px',
                fontSize: '12.5px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                <MapPin size={14} color="#00e5ff" />
                <span style={{ color: '#e2e8f0' }}>{location}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} color="#00e5ff" />
                <a href={`mailto:${email}`} style={{ color: '#e2e8f0', textDecoration: 'none' }}>
                  {email}
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} color="#00e5ff" />
                <a href={`tel:${phone}`} style={{ color: '#e2e8f0', textDecoration: 'none' }}>
                  {phone}
                </a>
              </div>
            </div>
          </div>

          {/* Key Metric Stats Grid (Dynamic from Admin Panel / DB) */}
          {data.stats && data.stats.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {data.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="glass-panel"
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '12px'
                  }}
                >
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
                    {stat.heading}
                  </span>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#f8fafc' }}>
                    {stat.description}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Activities / Extra Curricular from Admin Panel / DB */}
          {data.activities && data.activities.length > 0 && (
            <div>
              <h3 style={{ fontSize: '15px', color: '#ffffff', fontFamily: 'var(--font-heading)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={18} color="#38bdf8" />
                EXTRA CURRICULAR ACTIVITIES
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {data.activities.map((act, idx) => (
                  <div
                    key={idx}
                    className="glass-panel"
                    style={{
                      padding: '16px',
                      display: 'flex',
                      gap: '12px',
                      background: 'rgba(15, 23, 42, 0.5)',
                      borderRadius: '12px',
                      alignItems: 'center'
                    }}
                  >
                    {act.imageUrl && (
                      <img
                        src={act.imageUrl}
                        alt={act.title}
                        style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                      />
                    )}
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', margin: 0 }}>{act.title}</h4>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0', lineHeight: '1.4' }}>{act.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '4px' }}>
            <button className="btn-cyber btn-cyber-primary" onClick={() => handleOpenPanel('projects')}>
              <Terminal size={14} />
              Explore Projects
            </button>
            <button className="btn-cyber" onClick={() => handleOpenPanel('resume')}>
              <FileText size={15} />
              Download Resumes
            </button>
            <button className="btn-cyber" onClick={() => handleOpenPanel('contact')}>
              <Mail size={15} />
              Get in Touch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
