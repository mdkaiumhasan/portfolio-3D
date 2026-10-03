import React, { useState } from 'react';
import { X, Download, ExternalLink, FileText, CheckCircle2, Shield, Code } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const ResumeModal: React.FC = () => {
  const { setActivePanel, audioEnabled } = useGameStore();
  const { data } = usePortfolioData();
  const [activeTrack, setActiveTrack] = useState<'software' | 'network'>('software');

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  const cvLink = data.about_cv_link || data.home_cv_link || "https://files.catbox.moe/0juxap.pdf";

  const resumeTracks = {
    software: {
      title: 'Fullstack & Systems Engineer',
      badge: 'Software Track',
      color: '#a855f7',
      url: cvLink,
      fileName: 'Md_Kaium_Hasan_Software_Engineer_Resume.pdf',
      summary: data.about_info_text || "Fullstack developer with 2+ years of hands-on experience building production React, Next.js, and TypeScript applications across food-delivery, child-safety, and content-automation platforms. Comfortable owning features end-to-end — states, edge cases, and performance, not just the happy path — while pairing REST/GraphQL data layers with clean, accessible UI.",
      highlights: [
        'GravityEats: Multi-platform food delivery ecosystem with NestJS, Kotlin Android, Next.js 16, Kafka event streaming, and KEDA autoscaling.',
        'Parentra: Dual native Android apps & React dashboard with Go (Fiber) backend, sub-150ms WebRTC live video/audio streaming, and geofencing.',
        'Waypoint Challenge: Model Context Protocol (MCP) server in TypeScript with 17 tools and 100% IDEA legal compliance, invited to CEO interview.',
        'Cradle & Care: Headless maternal care e-commerce with Next.js 15, MedusaJS, Redis, and FEFO inventory batch row-level locks.'
      ]
    },
    network: {
      title: 'Network & Infrastructure Support Engineer',
      badge: 'CCNA & ISP Track',
      color: '#ffb703',
      url: cvLink,
      fileName: 'Md_Kaium_Hasan_Network_Engineer_Resume.pdf',
      summary: "Network Support Engineer with hands-on ISP field experience in MikroTik router, switch and OLT configuration, bandwidth management and network troubleshooting. Cisco CCNA (200-301) certified with additional training in Red Hat Linux server and Windows Server administration.",
      highlights: [
        'FNF Online (ISP): Managing MikroTik routers, switches, GPON OLTs, and bandwidth queue management for multi-tenant subscribers.',
        'Cisco CCNA (200-301): Multi-area OSPF routing, VLAN trunking (802.1Q), STP, EtherChannel, and ACL traffic segmentation.',
        'MikroTik RouterOS: MTCNA & MTCRE practices, PCQ dynamic queue trees, firewall mangle rules, and NAT/PAT.',
        'Red Hat Linux & Windows Server: Linux server administration, user access management, DNS/DHCP infrastructure, and security policies.'
      ]
    }
  };

  const current = resumeTracks[activeTrack];

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
                backgroundColor: current.color,
                boxShadow: `0 0 10px ${current.color}`
              }}
            />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff' }}>
                PROFESSIONAL DOSSIER & CURRICULUM VITAE
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Production-grade resume documentation for software development and network engineering
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Track Switcher */}
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(15, 23, 42, 0.4)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
            display: 'flex',
            gap: '10px'
          }}
        >
          <button
            onClick={() => {
              if (audioEnabled) sound.playClick();
              setActiveTrack('software');
            }}
            style={{
              background: activeTrack === 'software' ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(14, 165, 233, 0.2) 100%)' : 'rgba(30, 41, 59, 0.5)',
              border: `1px solid ${activeTrack === 'software' ? '#a855f7' : 'rgba(148, 163, 184, 0.2)'}`,
              color: activeTrack === 'software' ? '#ffffff' : '#94a3b8',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTrack === 'software' ? '0 0 12px rgba(168, 85, 247, 0.35)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Code size={15} />
            Software Development Track
          </button>

          <button
            onClick={() => {
              if (audioEnabled) sound.playClick();
              setActiveTrack('network');
            }}
            style={{
              background: activeTrack === 'network' ? 'linear-gradient(135deg, rgba(255, 183, 3, 0.3) 0%, rgba(14, 165, 233, 0.2) 100%)' : 'rgba(30, 41, 59, 0.5)',
              border: `1px solid ${activeTrack === 'network' ? '#ffb703' : 'rgba(148, 163, 184, 0.2)'}`,
              color: activeTrack === 'network' ? '#ffffff' : '#94a3b8',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTrack === 'network' ? '0 0 12px rgba(255, 183, 3, 0.35)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Shield size={15} />
            Network & CCNA Track
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Action Bar */}
          <div
            className="glass-panel"
            style={{
              padding: '16px 20px',
              background: 'rgba(15, 23, 42, 0.7)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              borderLeft: `4px solid ${current.color}`
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                  {current.title}
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: `${current.color}22`,
                    color: current.color,
                    border: `1px solid ${current.color}55`
                  }}
                >
                  {current.badge}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                Verified technical dossier with production credentials & contact data
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cyber"
                style={{ padding: '8px 16px' }}
              >
                <ExternalLink size={15} />
                Open in Tab
              </a>

              <a
                href={current.url}
                download={current.fileName}
                className="btn-cyber btn-cyber-primary"
                style={{
                  padding: '8px 18px',
                  background: activeTrack === 'software'
                    ? 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)'
                    : 'linear-gradient(135deg, #d97706 0%, #2563eb 100%)'
                }}
              >
                <Download size={15} />
                Download PDF
              </a>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="glass-panel" style={{ padding: '18px', background: 'rgba(15, 23, 42, 0.6)' }}>
            <h4 style={{ fontSize: '14px', color: current.color, fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
              Core Professional Summary
            </h4>
            <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#cbd5e1' }}>
              {current.summary}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '18px', background: 'rgba(15, 23, 42, 0.6)' }}>
            <h4 style={{ fontSize: '14px', color: current.color, fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>
              Highlighted Production Track Experience
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
              {current.highlights.map((h, idx) => (
                <li key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={15} color={current.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* PDF Viewer */}
          <div
            className="glass-panel"
            style={{
              height: '380px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid rgba(56, 189, 248, 0.2)'
            }}
          >
            <iframe
              src={`${current.url}#toolbar=0&navpanes=0`}
              title={current.title}
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
