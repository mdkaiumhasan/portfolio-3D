import React from 'react';
import { X, Award, GraduationCap, MapPin, Mail, Phone, ExternalLink, FileText, CheckCircle2, Sparkles, Terminal } from 'lucide-react';
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

  // Helper to extract clean name and role from home_heading if present
  const rawHeading = data.home_heading || "Hi, I'm {{ACCENT}}MD. Kaium Hasan{{/ACCENT}}. A Network Engineer.";
  const cleanHeadingText = rawHeading.replace(/\{\{ACCENT\}\}|\{\{\/ACCENT\}\}/gi, '');

  const bioText = data.about_info_text || data.home_subheading || "Fullstack developer with hands-on experience building production React, Next.js, and TypeScript applications across food-delivery, child-safety, and content-automation platforms. Comfortable owning features end-to-end — states, edge cases, and performance, not just the happy path — while pairing REST/GraphQL data layers with clean, accessible UI. CCNA (200-301) certified with deep hands-on ISP field experience in MikroTik router/switch/OLT configuration, bandwidth management, and Linux server administration.";

  // Dynamic stats from database (fallback to standard stats if empty)
  const statsList = (data.stats && data.stats.length > 0)
    ? data.stats
    : [
        { heading: "2+ Yrs", description: "Production Experience" },
        { heading: "CCNA", description: "Cisco Certified Network Associate" },
        { heading: "6+", description: "Enterprise Projects" },
        { heading: "236+", description: "RBAC Security Policies" }
      ];

  const education = [
    {
      degree: "Bachelor of Science (B.Sc.) in Computer Science & Engineering",
      institution: "Northern University Bangladesh",
      period: "Present",
      status: "In Progress",
      details: "Focus on Distributed Systems, Network Security, Database Architecture, and Advanced Software Engineering."
    },
    {
      degree: "Diploma in Engineering (Computer Science & Technology)",
      institution: "Mymensingh Polytechnic Institute",
      period: "Graduated 2026",
      status: "Completed",
      details: "Comprehensive foundation in computer networking, data structures, algorithms, microprocessor hardware, and systems programming."
    }
  ];

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
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 229, 255, 0.12)', border: '1px solid rgba(0, 229, 255, 0.35)', padding: '3px 10px', borderRadius: '20px', marginBottom: '8px' }}>
                  <Sparkles size={13} color="#00e5ff" />
                  <span style={{ fontSize: '11.5px', color: '#38bdf8', fontWeight: 600 }}>
                    Enterprise Fullstack Developer & CCNA Network Engineer
                  </span>
                </div>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px', lineHeight: 1.3 }}>
                  Engineering Resilient Software Platforms & High-Capacity Network Infrastructure
                </h1>
                <p style={{ color: '#38bdf8', fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>
                  MD. Kaium Hasan • Fullstack & Systems // CCNA Certified
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '4px 12px', borderRadius: '20px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <span style={{ fontSize: '12px', color: '#6ee7b7', fontWeight: 600 }}>
                  {data.available_for_work ? 'Available for Remote & Relocation' : 'System Architect'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '14px', lineHeight: '1.65', color: '#cbd5e1' }}>
              {bioText}
            </p>

            {/* Quick Contact Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '6px', fontSize: '13px', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="#38bdf8" />
                <span>Dhanmondi, Dhaka, Bangladesh</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={15} color="#38bdf8" />
                <a href="mailto:mdkaiumhasan2005@gmail.com" style={{ color: '#e2e8f0', textDecoration: 'none' }}>
                  mdkaiumhasan2005@gmail.com
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={15} color="#38bdf8" />
                <span>+880 1560-014339</span>
              </div>
            </div>
          </div>

          {/* Key Metric Stats Grid (Dynamic from Database) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            {statsList.map((stat, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(56, 189, 248, 0.2)'
                }}
              >
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
                  {stat.heading}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                  {stat.description}
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
              {education.map((edu, idx) => (
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
