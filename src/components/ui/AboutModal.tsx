import React from 'react';
import { X, Download, Mail, ExternalLink, Award, Cpu, Trophy, CheckCircle2, MapPin } from 'lucide-react';
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

  // Helper to parse {{ACCENT}}...{{/ACCENT}} inside headings
  const renderHeading = (text: string) => {
    const parts = text.split(/\{\{ACCENT\}\}|\{\{\/ACCENT\}\}/gi);
    if (parts.length === 1) return text;
    return parts.map((part, index) => {
      // Odd indices were inside {{ACCENT}}...{{/ACCENT}}
      if (index % 2 === 1) {
        return (
          <span key={index} style={{ color: '#28a745', fontWeight: 800 }}>
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const homeHeading = data.home_heading || "Hi, I'm {{ACCENT}}MD. Kaium Hasan{{/ACCENT}}. A Network Engineer.";
  const homeSubheading = data.home_subheading || "I'm a Network Engineer. I love to build functional and resilient networks. Networks are digital roads for deploying applications like Twitter and Google Maps.";
  const profileImage = data.home_profile_image || "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035635/portfolio/profile/kaium_profile_portrait.jpg";
  const cvLink = data.about_cv_link || data.home_cv_link || "https://files.catbox.moe/0juxap.pdf";
  const aboutText = data.about_info_text || "I am a highly motivated, skilled and qualified Network Engineer with over 1 years commercial experience working within various private sector and public sector fast paced dynamic environments. My experience includes Design, Security, Wireless, Project and BAU work.";

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: '1050px',
          width: '94%',
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
        {/* Modal Header - Fixed Strict Dark Theme */}
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
                  WELCOME PLAZA
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(40, 167, 69, 0.18)',
                    color: '#28a745',
                    border: '1px solid rgba(40, 167, 69, 0.4)'
                  }}
                >
                  Dark Theme
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#adb5bd' }}>
                MD. Kaium Hasan • Profile Dossier & Engineering Background
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Scrollable content in Dark Theme */}
        <div
          className="modal-body"
          style={{
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '36px',
            backgroundColor: '#212529'
          }}
        >
          {/* ======================================================== */}
          {/* SECTION 1: 2D HOME INFO (HERO)                          */}
          {/* ======================================================== */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #2b3035 0%, #1e2226 100%)',
              border: '1px solid #495057',
              borderRadius: '14px',
              padding: '28px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
            }}
          >
            {/* Left: Portrait Profile Image */}
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '260px',
                  aspectRatio: '3/4',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '2px solid #28a745',
                  boxShadow: '0 10px 30px rgba(40, 167, 69, 0.25)'
                }}
              >
                <img
                  src={profileImage}
                  alt="MD. Kaium Hasan"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/dgomoujlo/image/upload/v1791035635/portfolio/profile/kaium_profile_portrait.jpg';
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    background: 'linear-gradient(transparent, rgba(33, 37, 41, 0.95))',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#28a745', boxShadow: '0 0 8px #28a745' }} />
                  <span style={{ fontSize: '11px', color: '#d1f7d9', fontWeight: 600 }}>Active Network & Systems Eng.</span>
                </div>
              </div>
            </div>

            {/* Right: Intro & Call To Action */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', width: 'fit-content', background: 'rgba(40, 167, 69, 0.15)', border: '1px solid rgba(40, 167, 69, 0.35)', padding: '4px 12px', borderRadius: '20px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#28a745' }} />
                <span style={{ fontSize: '12px', color: '#28a745', fontWeight: 700, letterSpacing: '0.4px' }}>
                  {data.available_for_work ? 'AVAILABLE FOR OPPORTUNITIES' : 'NETWORK ENGINEER'}
                </span>
              </div>

              <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#f8f9fa', lineHeight: 1.25, margin: 0 }}>
                {renderHeading(homeHeading)}
              </h1>

              <p style={{ fontSize: '14px', lineHeight: '1.65', color: '#adb5bd', margin: 0 }}>
                {homeSubheading}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '8px' }}>
                <a
                  href={cvLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '9999px',
                    backgroundColor: '#28a745',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(40, 167, 69, 0.35)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Download size={15} />
                  Download CV
                </a>

                <button
                  onClick={() => handleOpenPanel('projects')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '9999px',
                    backgroundColor: 'transparent',
                    color: '#f8f9fa',
                    border: '1.5px solid #495057',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  View Projects
                </button>

                <button
                  onClick={() => handleOpenPanel('contact')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '9999px',
                    backgroundColor: 'transparent',
                    color: '#adb5bd',
                    border: '1px solid #343a40',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <Mail size={14} />
                  Get in Touch
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 2: 2D ABOUT ME & STATS                          */}
          {/* ======================================================== */}
          <div>
            <div style={{ borderBottom: '2px solid #343a40', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#f8f9fa', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="#28a745" />
                {data.about_info_heading || 'INFORMATION ABOUT ME'}
              </h2>
            </div>

            <p style={{ fontSize: '14.5px', lineHeight: '1.7', color: '#adb5bd', marginBottom: '24px' }}>
              {aboutText}
            </p>

            {/* Stats Cards Grid (CCNA, MIKROTIK, WINDOWS SERVER, LINUX SERVER, MTCNA, MTCRE) */}
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8f9fa', marginBottom: '14px', letterSpacing: '0.4px' }}>
              CERTIFICATIONS & DOMAIN MASTERY
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
              {(data.stats || []).map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#2b3035',
                    border: '1px solid #495057',
                    borderTop: '3px solid #28a745',
                    borderRadius: '10px',
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <span style={{ fontSize: '17px', fontWeight: 800, color: '#28a745', letterSpacing: '0.5px' }}>
                    {stat.heading}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#adb5bd', lineHeight: 1.45, fontWeight: 500 }}>
                    {stat.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 3: 2D SKILLS BARS                               */}
          {/* ======================================================== */}
          <div>
            <div style={{ borderBottom: '2px solid #343a40', paddingBottom: '10px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#f8f9fa', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={20} color="#28a745" />
                TECHNICAL SKILLS
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {(data.skills || []).map((skill, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8f9fa', letterSpacing: '0.4px' }}>
                      {skill.name}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#28a745' }}>
                      {skill.percent}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      backgroundColor: '#343a40',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      border: '1px solid #495057'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${skill.percent}%`,
                        backgroundColor: '#28a745',
                        borderRadius: '9999px',
                        boxShadow: '0 0 10px rgba(40, 167, 69, 0.5)',
                        transition: 'width 0.8s ease-in-out'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 4: 2D ACTIVITIES & INTERESTS                     */}
          {/* ======================================================== */}
          {(data.activities && data.activities.length > 0) && (
            <div>
              <div style={{ borderBottom: '2px solid #343a40', paddingBottom: '10px', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#f8f9fa', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trophy size={20} color="#28a745" />
                  CO-CURRICULAR ACTIVITIES & AWARDS
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                {data.activities.map((act, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#2b3035',
                      border: '1px solid #495057',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)'
                    }}
                  >
                    {act.imageUrl && (
                      <div style={{ height: '160px', overflow: 'hidden', backgroundColor: '#1a1d20' }}>
                        <img
                          src={act.imageUrl}
                          alt={act.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                      </div>
                    )}
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#f8f9fa', margin: 0 }}>
                        {act.title}
                      </h4>
                      <p style={{ fontSize: '13px', lineHeight: 1.55, color: '#adb5bd', margin: 0 }}>
                        {act.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            background: 'linear-gradient(180deg, #212529 0%, #1a1d20 100%)',
            borderTop: '1px solid #343a40',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <span style={{ fontSize: '12px', color: '#adb5bd' }}>
            Permanent Dark Theme • Powered by Central Portfolio Database
          </span>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleOpenPanel('resume')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: '#343a40',
                color: '#f8f9fa',
                border: '1px solid #495057',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Resume Vault
            </button>
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
    </div>
  );
};
