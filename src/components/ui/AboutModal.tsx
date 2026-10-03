import React from 'react';
import { X, GraduationCap, MapPin, Mail, Phone, FileText, Sparkles, Terminal } from 'lucide-react';
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

  const bioText = data.about_info_text || data.home_subheading || "Fullstack developer with 2+ years of hands-on experience building production React, Next.js, and TypeScript applications across food-delivery, child-safety, and content-automation platforms. Comfortable owning features end-to-end — states, edge cases, and performance, not just the happy path — while pairing REST/GraphQL data layers with clean, accessible UI. CCNA (200-301) certified with deep hands-on ISP field experience in MikroTik router/switch/OLT configuration, bandwidth management, and Linux server administration. Daily user of AI-assisted tooling (Claude, Cursor, Antigravity, MCP) to build faster without cutting corners.";

  const profileImage = data.home_profile_image || "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035635/portfolio/profile/kaium_profile_portrait.jpg";

  // Dynamic stats from database
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
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Standard Premium Profile Card */}
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
            {/* Top Row: Avatar + Headline Block */}
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
                  alt="MD. Kaium Hasan"
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

              {/* Title & Badges */}
              <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(0, 229, 255, 0.12)',
                      border: '1px solid rgba(0, 229, 255, 0.35)',
                      padding: '3px 10px',
                      borderRadius: '20px'
                    }}
                  >
                    <Sparkles size={12} color="#00e5ff" />
                    <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600, letterSpacing: '0.3px' }}>
                      Enterprise Fullstack Developer & CCNA Network Engineer
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
                      {data.available_for_work !== false ? 'Available for Remote & Relocation' : 'Currently Engaged'}
                    </span>
                  </div>
                </div>

                <h1 style={{ fontSize: '21px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px', lineHeight: 1.3, margin: 0 }}>
                  Engineering Resilient Software Platforms & High-Capacity Network Infrastructure
                </h1>

                <p style={{ color: '#38bdf8', fontSize: '12.5px', fontWeight: 600, margin: 0 }}>
                  MD. Kaium Hasan • Fullstack & Systems // CCNA Certified
                </p>
              </div>
            </div>

            {/* Bio Narrative */}
            <p style={{ fontSize: '13.5px', lineHeight: '1.65', color: '#cbd5e1', margin: 0 }}>
              {bioText}
            </p>

            {/* Quick Contact Chips */}
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

          {/* Key Metric Stats Grid (Dynamic from Database) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            {statsList.map((stat, idx) => (
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className="glass-panel"
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '6px' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>{edu.degree}</h4>
                      <p style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 500, margin: '2px 0 0 0' }}>{edu.institution}</p>
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
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>{edu.details}</p>
                </div>
              ))}
            </div>
          </div>

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
