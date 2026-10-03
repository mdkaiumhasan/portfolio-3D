import React, { useState } from 'react';
import {
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Terminal,
  Cpu,
  Radio,
  FileText,
  Send,
  Sparkles,
  CheckCircle2,
  Box,
  ChevronRight,
  GraduationCap,
  X,
  Award,
  Shield,
  Image as ImageIcon,
  Twitter,
  Instagram,
  Facebook
} from 'lucide-react';
import { Project } from '../../data/projects';
import { profileData } from '../../data/profile';
import { projectsData } from '../../data/projects';
import { skillGroups } from '../../data/skills';
import { experienceData } from '../../data/experience';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const Classic2DView: React.FC = () => {
  const { setMode, audioEnabled } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeResume, setActiveResume] = useState<'softwareDev' | 'networkEng'>('softwareDev');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['All', 'Enterprise Fullstack', 'Mobile & Realtime', 'AI & Protocol', 'Robotics & Hardware'];

  const filteredProjects = selectedCategory === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === selectedCategory);

  const currentResume = profileData.resumes[activeResume];

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#07090e',
        color: '#f1f5f9',
        overflowY: 'auto',
        userSelect: 'text',
        paddingBottom: '80px'
      }}
    >
      {/* Top Floating Bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(7, 9, 14, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
          padding: '14px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 10px #10b981'
            }}
          />
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
              {profileData.name}
            </div>
            <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600 }}>
              FULLSTACK & SYSTEMS // CCNA ENGINEER
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Social Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href={profileData.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={{ color: '#94a3b8', transition: 'color 0.2s', display: 'flex' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <Github size={18} />
            </a>
            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{ color: '#94a3b8', transition: 'color 0.2s', display: 'flex' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
            >
              <Linkedin size={18} />
            </a>
            {profileData.twitter && (
              <a
                href={profileData.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                style={{ color: '#94a3b8', transition: 'color 0.2s', display: 'flex' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                <Twitter size={18} />
              </a>
            )}
            {profileData.facebook && (
              <a
                href={profileData.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={{ color: '#94a3b8', transition: 'color 0.2s', display: 'flex' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                <Facebook size={18} />
              </a>
            )}
          </div>

          <button
            onClick={() => {
              if (audioEnabled) sound.playClick();
              setMode('3d');
            }}
            className="btn-cyber btn-cyber-primary"
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            <Box size={16} />
            Enter 3D Interactive World
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '60px' }}>
        {/* Hero Section */}
        <section
          className="glass-panel"
          style={{
            padding: '40px',
            borderLeft: '5px solid #00e5ff',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(13, 17, 27, 0.95) 100%)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', width: 'fit-content' }}>
              <Sparkles size={14} color="#38bdf8" />
              <span style={{ fontSize: '12px', color: '#7dd3fc', fontWeight: 600 }}>
                Enterprise Fullstack Developer & CCNA Network Engineer
              </span>
            </div>

            <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
              Engineering Resilient Software Platforms & High-Capacity Network Infrastructure
            </h1>

            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#cbd5e1', maxWidth: '900px' }}>
              {profileData.bio}
            </p>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '12px' }}>
              {profileData.stats.map((st, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '18px', background: 'rgba(15, 23, 42, 0.6)' }}>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>
                    {st.value}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                    {st.label}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {st.detail}
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', paddingTop: '10px' }}>
              <a href="#projects" className="btn-cyber btn-cyber-primary" style={{ padding: '10px 20px', textDecoration: 'none' }}>
                <Terminal size={16} />
                Explore Projects
              </a>
              <a href="#resumes" className="btn-cyber" style={{ padding: '10px 20px', textDecoration: 'none' }}>
                <FileText size={16} />
                Download Resumes
              </a>
              <a href={`mailto:${profileData.email}`} className="btn-cyber" style={{ padding: '10px 20px', textDecoration: 'none' }}>
                <Mail size={16} />
                Get in Touch
              </a>
            </div>
          </div>
        </section>

        {/* Enterprise Projects Section */}
        <section id="projects" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#ff007f', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                PRODUCTION SHOWCASE
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff' }}>
                Featured Engineering Systems
              </h2>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    background: selectedCategory === cat ? 'linear-gradient(135deg, rgba(255, 0, 127, 0.3) 0%, rgba(14, 165, 233, 0.25) 100%)' : 'rgba(30, 41, 59, 0.5)',
                    border: `1px solid ${selectedCategory === cat ? '#ff007f' : 'rgba(148, 163, 184, 0.2)'}`,
                    color: selectedCategory === cat ? '#ffffff' : '#94a3b8',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="glass-panel glass-panel-hover"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  borderTop: `4px solid ${project.color}`,
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(10, 14, 25, 0.95) 100%)'
                }}
              >
                <div>
                  {project.imageUrl && (
                    <div
                      style={{
                        width: '100%',
                        height: '160px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        marginBottom: '14px',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        background: '#0a0f1d',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        if (audioEnabled) sound.playClick();
                        setSelectedProject(project);
                      }}
                    >
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: `${project.color}22`,
                        color: project.color,
                        border: `1px solid ${project.color}66`,
                        fontWeight: 600
                      }}
                    >
                      {project.category}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{project.year}</span>
                  </div>

                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>
                    {project.title}
                  </h3>
                  <p style={{ color: '#38bdf8', fontSize: '13px', fontWeight: 500, marginTop: '2px' }}>
                    {project.subtitle}
                  </p>
                </div>

                <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#cbd5e1' }}>
                  {project.summary}
                </p>

                {/* Engineering Highlights */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {project.bulletPoints.slice(0, 3).map((bp, bpIdx) => (
                    <li key={bpIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#94a3b8' }}>
                      <CheckCircle2 size={15} color={project.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>

                {/* Metrics */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {project.metrics.map((m, mIdx) => (
                    <span
                      key={mIdx}
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#7dd3fc',
                        fontWeight: 600
                      }}
                    >
                      ★ {m}
                    </span>
                  ))}
                </div>

                {/* Tech Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '4px' }}>
                  {project.techStack.map((tech, tIdx) => (
                    <span key={tIdx} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      if (audioEnabled) sound.playClick();
                      setSelectedProject(project);
                    }}
                    className="btn-cyber btn-cyber-primary"
                    style={{ flex: 1, minWidth: '100px', justifyContent: 'center', padding: '8px', fontSize: '12px' }}
                  >
                    <FileText size={14} />
                    Overview
                  </button>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cyber"
                      style={{ flex: 1, minWidth: '90px', justifyContent: 'center', padding: '8px', fontSize: '12px', textDecoration: 'none' }}
                    >
                      <Github size={14} />
                      Code
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cyber"
                      style={{ flex: 1, minWidth: '90px', justifyContent: 'center', padding: '8px', fontSize: '12px', textDecoration: 'none' }}
                    >
                      <ExternalLink size={14} />
                      {project.live.endsWith('.apk') ? 'Download' : 'Live'}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#39ff14', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
              TECHNICAL ARSENAL
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff' }}>
              Skills & Engineering Disciplines
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {skillGroups.map((group) => (
              <div
                key={group.id}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  background: 'rgba(15, 23, 42, 0.65)'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                    {group.category}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    {group.description}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {group.skills.map((s, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: 'rgba(30, 41, 59, 0.4)'
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>
                        {s.name}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '8px',
                          background: s.level === 'Expert' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                          color: s.level === 'Expert' ? '#4ade80' : '#38bdf8'
                        }}
                      >
                        {s.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience & NOC Section */}
        <section id="experience" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#ffb703', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
              CAREER & INFRASTRUCTURE
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff' }}>
              Work History, ISP Field Engineering & Certifications
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {experienceData.map((item) => (
              <div
                key={item.id}
                className="glass-panel"
                style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  borderLeft: `4px solid ${item.type === 'Work Experience' ? '#ffb703' : item.type === 'Certification' ? '#38bdf8' : '#a855f7'}`,
                  background: 'rgba(15, 23, 42, 0.7)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>{item.role}</h3>
                    <p style={{ color: '#38bdf8', fontSize: '14px', fontWeight: 600 }}>{item.organization}</p>
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>{item.location}</p>
                  </div>
                  <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '12px', background: 'rgba(255, 183, 3, 0.15)', color: '#fcd34d', fontWeight: 600 }}>
                    {item.period}
                  </span>
                </div>

                <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#cbd5e1' }}>
                  {item.description}
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {item.highlights.map((h, hIdx) => (
                    <li key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#94a3b8' }}>
                      <CheckCircle2 size={14} color="#ffb703" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Resumes Vault Section */}
        <section
          id="resumes"
          className="glass-panel"
          style={{
            padding: '36px',
            borderLeft: '5px solid #a855f7',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(13, 17, 27, 0.95) 100%)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#a855f7', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                OFFICIAL CREDENTIALS
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#ffffff' }}>
                Download Verified Resumes
              </h2>
              <p style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '4px' }}>
                Access tailored resumes for either Software Engineering or Network Engineering positions.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {/* Software Dev Resume Card */}
              <div className="glass-panel" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.7)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                  Fullstack Developer Resume
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                  React, Next.js 16, TypeScript, Go/Fiber, Kotlin Android, Apache Kafka, KEDA Autoscaled Kubernetes.
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <a
                    href="/software developer Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cyber"
                    style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                  >
                    <ExternalLink size={15} />
                    View
                  </a>
                  <a
                    href="/software developer Resume.pdf"
                    download="MD_Kaium_Hasan_Software_Developer_Resume.pdf"
                    className="btn-cyber btn-cyber-primary"
                    style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                  >
                    <Download size={15} />
                    Download
                  </a>
                </div>
              </div>

              {/* Network Eng Resume Card */}
              <div className="glass-panel" style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.7)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                  Network Support Engineer Resume
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                  CCNA (200-301), MikroTik RouterOS, GPON OLT/ONU, Red Hat Linux Server, PPPoE ISP operations.
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <a
                    href="/Networking Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cyber"
                    style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                  >
                    <ExternalLink size={15} />
                    View
                  </a>
                  <a
                    href="/Networking Resume.pdf"
                    download="MD_Kaium_Hasan_Network_Engineer_Resume.pdf"
                    className="btn-cyber btn-cyber-primary"
                    style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                  >
                    <Download size={15} />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            textAlign: 'center',
            alignItems: 'center',
            padding: '40px 20px'
          }}
        >
          <div style={{ fontSize: '12px', color: '#00e5ff', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
            TRANSMISSION READY
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff' }}>
            Let's Collaborate on Your Next Breakthrough
          </h2>
          <p style={{ fontSize: '15px', color: '#94a3b8', maxWidth: '600px' }}>
            Available for high-impact software engineering roles, distributed systems design, or enterprise network architecture.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '12px' }}>
            <a
              href={`mailto:${profileData.email}`}
              className="btn-cyber btn-cyber-primary"
              style={{ padding: '12px 24px', fontSize: '14px', textDecoration: 'none' }}
            >
              <Mail size={16} />
              {profileData.email}
            </a>
            <a
              href={`tel:${profileData.phone}`}
              className="btn-cyber"
              style={{ padding: '12px 24px', fontSize: '14px', textDecoration: 'none' }}
            >
              <Phone size={16} />
              {profileData.phone}
            </a>
          </div>

          {/* Social Network Links */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
            <a
              href={profileData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyber"
              style={{ padding: '8px 16px', fontSize: '12px', textDecoration: 'none' }}
            >
              <Github size={15} /> GitHub
            </a>
            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyber"
              style={{ padding: '8px 16px', fontSize: '12px', textDecoration: 'none' }}
            >
              <Linkedin size={15} /> LinkedIn
            </a>
            {profileData.twitter && (
              <a
                href={profileData.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cyber"
                style={{ padding: '8px 16px', fontSize: '12px', textDecoration: 'none' }}
              >
                <Twitter size={15} /> Twitter / X
              </a>
            )}
            {profileData.facebook && (
              <a
                href={profileData.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cyber"
                style={{ padding: '8px 16px', fontSize: '12px', textDecoration: 'none' }}
              >
                <Facebook size={15} /> Facebook
              </a>
            )}
          </div>
        </section>
      </main>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProject(null)}
          style={{ zIndex: 1000 }}
        >
          <div
            className="modal-content"
            style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: selectedProject.color,
                    boxShadow: `0 0 10px ${selectedProject.color}`
                  }}
                />
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: '#ffffff' }}>
                    {selectedProject.title}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#38bdf8' }}>
                    {selectedProject.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="btn-cyber"
                style={{ padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Main Image Banner */}
              {selectedProject.imageUrl && (
                <div style={{ width: '100%', maxHeight: '360px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <img
                    src={selectedProject.imageUrl}
                    alt={selectedProject.title}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#0a0f1d' }}
                  />
                </div>
              )}

              {/* Gallery if present */}
              {selectedProject.gallery && selectedProject.gallery.length > 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Architecture & Topology Diagrams:</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                    {selectedProject.gallery.map((img, i) => (
                      <a key={i} href={img} target="_blank" rel="noopener noreferrer" style={{ display: 'block', height: '110px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <img src={img} alt={`Diagram ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 style={{ fontSize: '14px', color: '#ffffff', marginBottom: '6px', fontWeight: 700 }}>Overview</h4>
                <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#cbd5e1' }}>
                  {selectedProject.description}
                </p>
              </div>

              {/* Highlights */}
              <div>
                <h4 style={{ fontSize: '14px', color: '#ffffff', marginBottom: '8px', fontWeight: 700 }}>Key Architectural Highlights</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedProject.bulletPoints.map((bp, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#cbd5e1' }}>
                      <CheckCircle2 size={16} color={selectedProject.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metrics */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedProject.metrics.map((m, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#7dd3fc',
                      fontWeight: 600
                    }}
                  >
                    ★ {m}
                  </span>
                ))}
              </div>

              {/* Tech Stack */}
              <div>
                <h4 style={{ fontSize: '14px', color: '#ffffff', marginBottom: '8px', fontWeight: 700 }}>Technologies Used</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedProject.techStack.map((t, i) => (
                    <span key={i} className="tech-tag" style={{ fontSize: '12px', padding: '4px 10px' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div style={{ display: 'flex', gap: '12px', paddingTop: '10px' }}>
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cyber"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px', textDecoration: 'none' }}
                  >
                    <Github size={16} />
                    View Repository
                  </a>
                )}
                {selectedProject.live && (
                  <a
                    href={selectedProject.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cyber btn-cyber-primary"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px', textDecoration: 'none' }}
                  >
                    <ExternalLink size={16} />
                    {selectedProject.live.endsWith('.apk') ? 'Download APK' : 'Open Live Deployment'}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
