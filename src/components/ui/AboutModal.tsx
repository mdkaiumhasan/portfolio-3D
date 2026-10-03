import React from 'react';
import { X, Award, GraduationCap, MapPin, Mail, Phone, ExternalLink, FileText, CheckCircle2, Sparkles, Terminal, Github, Linkedin, ShieldCheck, Globe } from 'lucide-react';
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

  const profileImage = data.home_profile_image || "https://res.cloudinary.com/dgomoujlo/image/upload/v1791035635/portfolio/profile/kaium_profile_portrait.jpg";

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

  const getDetail = (type: string, fallback: string) => {
    const item = data.contactDetails?.find((d) => d.type.toLowerCase().includes(type.toLowerCase()));
    return item ? item.value : fallback;
  };

  const email = getDetail('email', 'mdkaiumhasan2005@gmail.com');
  const phone = getDetail('contact number', '+880 1560-014339');
  const location = getDetail('location', 'Dhanmondi, Dhaka, Bangladesh');

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" style={{ maxWidth: '1020px' }} onClick={(e) => e.stopPropagation()}>
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
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Standard Premium Hero Profile Card */}
          <div
            className="glass-panel"
            style={{
              position: 'relative',
              padding: '28px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(15, 23, 42, 0.92) 35%, rgba(8, 12, 22, 0.98) 100%)',
              border: '1px solid rgba(0, 229, 255, 0.28)',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              overflow: 'hidden'
            }}
          >
            {/* Ambient Background Glow */}
            <div
              style={{
                position: 'absolute',
                top: '-60px',
                left: '-40px',
                width: '320px',
                height: '320px',
                background: 'radial-gradient(circle, rgba(0, 229, 255, 0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
                filter: 'blur(30px)'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-40px',
                right: '-40px',
                width: '260px',
                height: '260px',
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
                filter: 'blur(30px)'
              }}
            />

            {/* Content Container (Two-column layout on desktop) */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                gap: '28px',
                alignItems: 'flex-start',
                flexWrap: 'wrap'
              }}
            >
              {/* Left Column: Premium Cyber Avatar Frame */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                  flexShrink: 0,
                  margin: '0 auto'
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '160px',
                    height: '190px',
                    borderRadius: '16px',
                    padding: '4px',
                    background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.7) 0%, rgba(56, 189, 248, 0.2) 50%, rgba(168, 85, 247, 0.6) 100%)',
                    boxShadow: '0 10px 25px -5px rgba(0, 229, 255, 0.3), 0 0 15px rgba(0, 229, 255, 0.15)'
                  }}
                >
                  {/* Portrait Image */}
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundColor: '#0f172a'
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
                        display: 'block',
                        transition: 'transform 0.4s ease'
                      }}
                      onError={(e) => {
                        // Fallback to catbox or local placeholder if url errors
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
                      }}
                    />

                    {/* Gloss Overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, transparent 60%, rgba(10, 15, 29, 0.85) 100%)',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Mini Verified Beacon inside Avatar */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: 'rgba(10, 15, 29, 0.85)',
                        backdropFilter: 'blur(6px)',
                        padding: '3px 8px',
                        borderRadius: '20px',
                        border: '1px solid rgba(0, 229, 255, 0.4)'
                      }}
                    >
                      <ShieldCheck size={12} color="#00e5ff" />
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#e0f2fe', letterSpacing: '0.5px' }}>
                        VERIFIED
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Social Icons below Avatar */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a
                    href="https://github.com/mdkaiumhasan"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub Profile"
                    className="btn-cyber"
                    style={{
                      padding: '7px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      background: 'rgba(30, 41, 59, 0.6)'
                    }}
                  >
                    <Github size={14} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/md-kaium-hasan-bb6009372/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn Profile"
                    className="btn-cyber"
                    style={{
                      padding: '7px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      background: 'rgba(30, 41, 59, 0.6)'
                    }}
                  >
                    <Linkedin size={14} />
                  </a>
                  <a
                    href={`mailto:${email}`}
                    title="Email Directly"
                    className="btn-cyber"
                    style={{
                      padding: '7px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      background: 'rgba(30, 41, 59, 0.6)'
                    }}
                  >
                    <Mail size={14} />
                  </a>
                </div>
              </div>

              {/* Right Column: Narrative & Technical Details */}
              <div
                style={{
                  flex: '1 1 450px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                {/* Header Row: Badge & Availability */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      background: 'linear-gradient(90deg, rgba(0, 229, 255, 0.15) 0%, rgba(14, 165, 233, 0.05) 100%)',
                      border: '1px solid rgba(0, 229, 255, 0.35)',
                      padding: '4px 12px',
                      borderRadius: '20px'
                    }}
                  >
                    <Sparkles size={13} color="#00e5ff" />
                    <span style={{ fontSize: '11.5px', color: '#38bdf8', fontWeight: 600, letterSpacing: '0.3px' }}>
                      Enterprise Fullstack Developer & CCNA Network Engineer
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      background: data.available_for_work !== false ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      border: `1px solid ${data.available_for_work !== false ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                      padding: '4px 12px',
                      borderRadius: '20px'
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: data.available_for_work !== false ? '#10b981' : '#ef4444',
                        boxShadow: data.available_for_work !== false ? '0 0 10px #10b981' : '0 0 10px #ef4444'
                      }}
                    />
                    <span
                      style={{
                        fontSize: '11.5px',
                        color: data.available_for_work !== false ? '#6ee7b7' : '#fca5a5',
                        fontWeight: 600
                      }}
                    >
                      {data.available_for_work !== false ? 'Available for Remote & Relocation' : 'Currently Engaged'}
                    </span>
                  </div>
                </div>

                {/* Main Heading */}
                <div>
                  <h1
                    style={{
                      fontSize: '25px',
                      fontWeight: 800,
                      color: '#ffffff',
                      letterSpacing: '-0.5px',
                      lineHeight: 1.3,
                      margin: 0
                    }}
                  >
                    Engineering Resilient Software Platforms & High-Capacity Network Infrastructure
                  </h1>
                  <p
                    style={{
                      color: '#38bdf8',
                      fontSize: '13px',
                      fontWeight: 600,
                      marginTop: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span>MD. Kaium Hasan</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
                    <span style={{ color: '#cbd5e1' }}>Fullstack & Systems // CCNA Certified</span>
                  </p>
                </div>

                {/* Bio Narrative */}
                <p
                  style={{
                    fontSize: '13.5px',
                    lineHeight: '1.7',
                    color: '#cbd5e1',
                    margin: 0,
                    textAlign: 'justify'
                  }}
                >
                  {bioText}
                </p>

                {/* Quick Contact Chips */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    paddingTop: '8px',
                    fontSize: '12.5px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(56, 189, 248, 0.15)'
                    }}
                  >
                    <MapPin size={14} color="#00e5ff" />
                    <span style={{ color: '#e2e8f0' }}>{location}</span>
                  </div>

                  <a
                    href={`mailto:${email}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(56, 189, 248, 0.15)',
                      color: '#e2e8f0',
                      textDecoration: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <Mail size={14} color="#00e5ff" />
                    <span>{email}</span>
                  </a>

                  <a
                    href={`tel:${phone}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(56, 189, 248, 0.15)',
                      color: '#e2e8f0',
                      textDecoration: 'none'
                    }}
                  >
                    <Phone size={14} color="#00e5ff" />
                    <span>{phone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metric Stats Grid (Dynamic from Database) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px' }}>
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
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '12px'
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
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '6px' }}>
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
