import React, { useState } from 'react';
import { X, Download, ExternalLink, FileText, CheckCircle2, Shield, Code2, Network } from 'lucide-react';
import { profileData } from '../../data/profile';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const ResumeModal: React.FC = () => {
  const { setActivePanel, audioEnabled } = useGameStore();
  const [activeResume, setActiveResume] = useState<'softwareDev' | 'networkEng'>('softwareDev');

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  const handleSwitch = (type: 'softwareDev' | 'networkEng') => {
    if (audioEnabled) sound.playClick();
    setActiveResume(type);
  };

  const resume = profileData.resumes[activeResume];

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" style={{ maxWidth: '960px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#a855f7',
                boxShadow: '0 0 10px #a855f7'
              }}
            />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff' }}>
                CREDENTIALS & RESUME VAULT
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Official Verified Resumes for MD. Kaium Hasan
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Dual Track Switcher Tabs */}
        <div
          style={{
            padding: '14px 24px',
            background: 'rgba(15, 23, 42, 0.5)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <button
            onClick={() => handleSwitch('softwareDev')}
            style={{
              flex: 1,
              minWidth: '220px',
              padding: '12px 18px',
              borderRadius: '10px',
              background: activeResume === 'softwareDev'
                ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(14, 165, 233, 0.25) 100%)'
                : 'rgba(30, 41, 59, 0.4)',
              border: `1.5px solid ${activeResume === 'softwareDev' ? '#a855f7' : 'rgba(148, 163, 184, 0.2)'}`,
              color: activeResume === 'softwareDev' ? '#ffffff' : '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'var(--font-heading)',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: activeResume === 'softwareDev' ? '0 0 15px rgba(168, 85, 247, 0.35)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Code2 size={18} color={activeResume === 'softwareDev' ? '#c084fc' : '#94a3b8'} />
            <div style={{ textAlign: 'left' }}>
              <div>Fullstack & Systems Developer</div>
              <div style={{ fontSize: '11px', color: activeResume === 'softwareDev' ? '#e9d5ff' : '#64748b', fontWeight: 400 }}>
                React, Next.js, Kotlin, Go, Kafka, KEDA
              </div>
            </div>
          </button>

          <button
            onClick={() => handleSwitch('networkEng')}
            style={{
              flex: 1,
              minWidth: '220px',
              padding: '12px 18px',
              borderRadius: '10px',
              background: activeResume === 'networkEng'
                ? 'linear-gradient(135deg, rgba(255, 183, 3, 0.3) 0%, rgba(14, 165, 233, 0.25) 100%)'
                : 'rgba(30, 41, 59, 0.4)',
              border: `1.5px solid ${activeResume === 'networkEng' ? '#ffb703' : 'rgba(148, 163, 184, 0.2)'}`,
              color: activeResume === 'networkEng' ? '#ffffff' : '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'var(--font-heading)',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: activeResume === 'networkEng' ? '0 0 15px rgba(255, 183, 3, 0.35)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Network size={18} color={activeResume === 'networkEng' ? '#fcd34d' : '#94a3b8'} />
            <div style={{ textAlign: 'left' }}>
              <div>Network Support Engineer</div>
              <div style={{ fontSize: '11px', color: activeResume === 'networkEng' ? '#fef3c7' : '#64748b', fontWeight: 400 }}>
                CCNA, MikroTik RouterOS, GPON OLT, Linux
              </div>
            </div>
          </button>
        </div>

        {/* Body Content */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Action Callout */}
          <div
            className="glass-panel"
            style={{
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
              borderLeft: `4px solid ${activeResume === 'softwareDev' ? '#a855f7' : '#ffb703'}`,
              background: 'rgba(15, 23, 42, 0.7)'
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                {resume.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '3px' }}>
                {resume.description}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={resume.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cyber"
                style={{ padding: '8px 16px' }}
              >
                <ExternalLink size={15} />
                Open in Tab
              </a>

              <a
                href={resume.url}
                download={resume.fileName}
                className="btn-cyber btn-cyber-primary"
                style={{ padding: '8px 18px', background: activeResume === 'softwareDev' ? 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)' : 'linear-gradient(135deg, #d97706 0%, #2563eb 100%)' }}
              >
                <Download size={15} />
                Download PDF
              </a>
            </div>
          </div>

          {/* Detailed Document Highlights Breakdown */}
          {activeResume === 'softwareDev' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '18px', background: 'rgba(15, 23, 42, 0.6)' }}>
                <h4 style={{ fontSize: '15px', color: '#38bdf8', fontWeight: 700, marginBottom: '8px' }}>
                  CORE PROFESSIONAL SUMMARY
                </h4>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#cbd5e1' }}>
                  FullStack developer with 2 years of hands-on experience building production React, Next.js, and TypeScript applications across food-delivery, child-safety, and content-automation platforms. Comfortable owning features end-to-end — states, edge cases, and performance, not just the happy path — while pairing REST/GraphQL data layers with clean, accessible UI. Daily user of AI-assisted tooling (Claude, Cursor, Antigravity, MCP) to build faster without cutting corners.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '18px', background: 'rgba(15, 23, 42, 0.6)' }}>
                <h4 style={{ fontSize: '15px', color: '#a855f7', fontWeight: 700, marginBottom: '8px' }}>
                  HIGHLIGHTED PRODUCTION PROJECTS IN RESUME
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <CheckCircle2 size={15} color="#a855f7" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#ffffff' }}>GravityEats:</strong> Enterprise food delivery ecosystem (NestJS, Kotlin Multi-Module, Next.js 16, Kafka, KEDA Kubernetes, TypeORM pessimistic locks).
                    </div>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <CheckCircle2 size={15} color="#a855f7" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#ffffff' }}>Parentra:</strong> Dual native Android apps & React dashboard with Go/Fiber, LiveKit WebRTC camera/audio, and Android Device Admin.
                    </div>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <CheckCircle2 size={15} color="#a855f7" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#ffffff' }}>Cradle & Care:</strong> Headless E-Commerce platform with Next.js 15, MedusaJS, Redis, Meilisearch (&lt;250ms), FEFO inventory row-level locks, 9.0/10 audit.
                    </div>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <CheckCircle2 size={15} color="#a855f7" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#ffffff' }}>Waypoint IEP MCP Server:</strong> Model Context Protocol server in TypeScript with 17 tools, selected from Hacker News challenge, direct CEO interview invite.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '18px', background: 'rgba(15, 23, 42, 0.6)' }}>
                <h4 style={{ fontSize: '15px', color: '#ffb703', fontWeight: 700, marginBottom: '8px' }}>
                  CORE PROFESSIONAL SUMMARY
                </h4>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#cbd5e1' }}>
                  Network Support Engineer with hands-on ISP field experience in MikroTik router, switch and OLT configuration, bandwidth management and network troubleshooting. CCNA (200-301) certified with additional training in Red Hat Linux server and Windows Server administration. Reliable, detail-oriented and committed to building stable, secure and efficient network infrastructure.
                </p>
              </div>

              <div className="glass-panel" style={{ padding: '18px', background: 'rgba(15, 23, 42, 0.6)' }}>
                <h4 style={{ fontSize: '15px', color: '#ffb703', fontWeight: 700, marginBottom: '8px' }}>
                  ISP OPERATIONS & CERTIFIED TECHNICAL SKILLS
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <CheckCircle2 size={15} color="#ffb703" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#ffffff' }}>FNF Online (ISP):</strong> Network Support Engineer (Jan 2026 – Present), managing MikroTik routers, switches, GPON OLTs, and PPPoE reseller queues.
                    </div>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <CheckCircle2 size={15} color="#ffb703" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#ffffff' }}>Cisco CCNA (200-301):</strong> Certified Network Associate covering OSPF, VLAN segmentation, STP, EtherChannel, ACL security, and IPv4/IPv6.
                    </div>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <CheckCircle2 size={15} color="#ffb703" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#ffffff' }}>MikroTik RouterOS:</strong> Router & Network Configuration, PCQ queue trees, firewall mangle rules, and bandwidth shaping.
                    </div>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <CheckCircle2 size={15} color="#ffb703" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ color: '#ffffff' }}>Red Hat Linux & Windows Server:</strong> System administration, SELinux policies, Active Directory Domain Services, and network security.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Embedded PDF Preview Frame */}
          <div
            className="glass-panel"
            style={{
              height: '420px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid rgba(56, 189, 248, 0.2)'
            }}
          >
            <iframe
              src={`${resume.url}#toolbar=0&navpanes=0`}
              title={resume.title}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: '#ffffff'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
