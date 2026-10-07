import React, { useState, useMemo } from 'react';
import { 
  X, 
  Briefcase, 
  Calendar, 
  Network, 
  Terminal, 
  GraduationCap, 
  Server, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  Cpu,
  Wifi,
  ShieldCheck,
  Maximize2,
  LucideIcon
} from 'lucide-react';
import { usePortfolioData, ExperienceItem } from '../../hooks/usePortfolioData';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

interface ExperienceMeta {
  category: string;
  categoryKey: 'all' | 'isp' | 'software' | 'cisco' | 'academic';
  color: string;
  icon: LucideIcon;
  domain: string;
  statusText: string;
  statusType: 'active' | 'lab' | 'academic' | 'milestone';
  tags: string[];
}

export const ExperienceModal: React.FC = () => {
  const { setActivePanel, audioEnabled } = useGameStore();
  const { data } = usePortfolioData();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [enlargedImage, setEnlargedImage] = useState<{ url: string; title: string } | null>(null);

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  const handleFilterClick = (filterKey: string) => {
    if (audioEnabled) sound.playClick();
    setSelectedFilter(filterKey);
  };

  const dynamicExperiences = useMemo(() => {
    return (data.experiences || []).filter(
      (e: ExperienceItem) => e && e.title && e.title.trim().length > 0
    );
  }, [data.experiences]);

  // Helper to extract metadata, domain, color, tags, and category for each role
  const getExperienceMeta = (exp: ExperienceItem): ExperienceMeta => {
    const text = `${exp.title} ${exp.description || ''}`.toLowerCase();

    // 1. Diploma & Academic Credentials
    if (text.includes('diploma') || text.includes('polytechnic') || text.includes('cst') || text.includes('computer science')) {
      return {
        category: 'Academic Credentials',
        categoryKey: 'academic',
        color: '#a855f7',
        icon: GraduationCap,
        domain: 'Mymensingh Polytechnic Institute • CST',
        statusText: 'DEGREE COMPLETED',
        statusType: 'academic',
        tags: ['Computer Science', 'Hardware & LFR', 'Operating Systems', 'Network Architectures']
      };
    }

    // 2. Cisco Enterprise & CCNA Labs
    if (text.includes('ccna') || text.includes('cisco') || text.includes('200-301')) {
      return {
        category: 'Cisco Labs & Infrastructure',
        categoryKey: 'cisco',
        color: '#ffb703',
        icon: Server,
        domain: 'Cisco Enterprise & Multi-Area Infrastructure',
        statusText: 'LAB VERIFIED',
        statusType: 'lab',
        tags: ['Multi-Area OSPF', '802.1Q VLANs', 'STP Loop Guard', 'Stateful ACLs', 'Linux Servers']
      };
    }

    // 3. Independent Fullstack & Systems Developer
    if (text.includes('fullstack') || text.includes('software') || text.includes('easymess') || text.includes('android') || text.includes('developer')) {
      return {
        category: 'Software & Systems',
        categoryKey: 'software',
        color: '#39ff14',
        icon: Terminal,
        domain: 'Independent Fullstack & Android Systems',
        statusText: 'ACTIVE ENGINEERING',
        statusType: 'active',
        tags: ['React.js', 'Node.js', 'Android / Kotlin', 'Firebase', 'Realtime Systems']
      };
    }

    // 4. ISP & Network Operations
    if (text.includes('fnf') || text.includes('isp') || text.includes('gpon') || text.includes('pppoe') || text.includes('mikrotik')) {
      return {
        category: 'ISP & Network Operations',
        categoryKey: 'isp',
        color: '#00e5ff',
        icon: Wifi,
        domain: 'FNF Online • ISP Operations & Field Engineering',
        statusText: 'ACTIVE POSTING',
        statusType: 'active',
        tags: ['MikroTik RouterOS', 'GPON OLT', 'PPPoE Queues', 'Bandwidth QoS', 'Fiber Distribution']
      };
    }

    return {
      category: 'Professional Milestone',
      categoryKey: 'isp',
      color: '#38bdf8',
      icon: Briefcase,
      domain: 'Technical Engineering Milestone',
      statusText: 'VERIFIED',
      statusType: 'milestone',
      tags: ['Engineering', 'Infrastructure', 'Systems']
    };
  };

  // Filter items
  const filteredExperiences = useMemo(() => {
    if (selectedFilter === 'all') return dynamicExperiences;
    return dynamicExperiences.filter(exp => {
      const meta = getExperienceMeta(exp);
      return meta.categoryKey === selectedFilter;
    });
  }, [dynamicExperiences, selectedFilter]);

  const filterTabs = [
    { key: 'all', label: 'All Operations', count: dynamicExperiences.length, icon: Layers },
    { key: 'isp', label: 'ISP & Networking', count: dynamicExperiences.filter(e => getExperienceMeta(e).categoryKey === 'isp').length, icon: Wifi },
    { key: 'software', label: 'Software & Systems', count: dynamicExperiences.filter(e => getExperienceMeta(e).categoryKey === 'software').length, icon: Terminal },
    { key: 'cisco', label: 'Cisco Labs', count: dynamicExperiences.filter(e => getExperienceMeta(e).categoryKey === 'cisco').length, icon: Server },
    { key: 'academic', label: 'Academic', count: dynamicExperiences.filter(e => getExperienceMeta(e).categoryKey === 'academic').length, icon: GraduationCap },
  ];

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '1060px', 
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'radial-gradient(ellipse at top, #111b2b 0%, #090e17 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(6, 182, 212, 0.15)'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="modal-header" style={{ padding: '18px 24px', borderBottom: '1px solid rgba(56, 189, 248, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: '#00e5ff',
                boxShadow: '0 0 12px #00e5ff',
                animation: 'pulse 2s infinite'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff', letterSpacing: '0.6px', margin: 0 }}>
                  NETWORK OPERATIONS CENTER (NOC) & EXPERIENCE TIMELINE
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: 'rgba(0, 229, 255, 0.12)',
                    border: '1px solid rgba(0, 229, 255, 0.35)',
                    color: '#00e5ff',
                    letterSpacing: '0.4px',
                    fontFamily: 'var(--font-hud)'
                  }}
                >
                  LIVE NOC CONSOLE
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
                Operational Infrastructure Engagements, Field Engineering & Verified Technical Milestones
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Executive Metrics Overview Bar */}
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(15, 23, 42, 0.6)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {/* Quick Metrics Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34d399',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-hud)'
              }}
            >
              <ShieldCheck size={14} />
              STATUS: ACTIVE OPERATIONS
            </span>
            <span
              style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                color: '#38bdf8',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Network size={14} />
              PRIMARY: FNF ONLINE (ISP)
            </span>
            <span
              style={{
                background: 'rgba(255, 183, 3, 0.1)',
                border: '1px solid rgba(255, 183, 3, 0.25)',
                color: '#fcd34d',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Server size={14} />
              CCNA 200-301 LAB ARCHITECTURE
            </span>
          </div>

          {/* Total Badge */}
          <span
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-hud)',
              fontWeight: 600
            }}
          >
            TOTAL TRACKED: <strong style={{ color: '#ffffff' }}>{dynamicExperiences.length} MILESTONES</strong>
          </span>
        </div>

        {/* Filter Navigation Tabs */}
        <div
          style={{
            padding: '10px 24px',
            background: 'rgba(10, 14, 25, 0.5)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}
        >
          {filterTabs.map(tab => {
            const isSelected = selectedFilter === tab.key;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => handleFilterClick(tab.key)}
                style={{
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(14, 165, 233, 0.2) 100%)' 
                    : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '1px solid #00e5ff' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#ffffff' : '#94a3b8',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 10px rgba(0, 229, 255, 0.3)' : 'none'
                }}
              >
                <TabIcon size={14} color={isSelected ? '#00e5ff' : '#94a3b8'} />
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: '10px',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(0, 229, 255, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                    color: isSelected ? '#ffffff' : '#cbd5e1'
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Body: 2-Column Responsive Professional Grid */}
        <div 
          className="modal-body" 
          style={{ 
            padding: '24px', 
            overflowY: 'auto',
            flex: 1
          }}
        >
          {filteredExperiences.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
                gap: '18px'
              }}
            >
              {filteredExperiences.map((exp: ExperienceItem, idx: number) => {
                const meta = getExperienceMeta(exp);
                const IconComponent = meta.icon;
                const hasValidImage = exp.imageUrl && exp.imageUrl.trim().length > 0;

                return (
                  <div
                    key={`exp-card-${idx}`}
                    className="glass-panel glass-panel-hover"
                    style={{
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 14, 25, 0.95) 100%)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      borderRadius: '12px',
                      position: 'relative',
                      transition: 'all 0.25s ease',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
                    }}
                  >
                    {/* Top Row: Image Avatar, Title, Organization & Date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                        {/* Role Logo / Image Avatar (User Request: Show image instead of icon) */}
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '10px',
                            background: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            overflow: 'hidden',
                            boxShadow: '0 0 12px rgba(6, 182, 212, 0.15)',
                            cursor: hasValidImage ? 'pointer' : 'default'
                          }}
                          onClick={() => {
                            if (hasValidImage) {
                              setEnlargedImage({ url: exp.imageUrl || '', title: exp.title });
                            }
                          }}
                          title={hasValidImage ? "Click to inspect image" : undefined}
                        >
                          {hasValidImage ? (
                            <img
                              src={exp.imageUrl}
                              alt={exp.title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                padding: '3px',
                                display: 'block'
                              }}
                            />
                          ) : (
                            <IconComponent size={22} color={meta.color} />
                          )}
                        </div>

                        {/* Title and Domain */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3
                            style={{
                              fontSize: '16px',
                              fontWeight: 700,
                              color: '#ffffff',
                              letterSpacing: '0.3px',
                              margin: 0,
                              lineHeight: 1.35
                            }}
                          >
                            {exp.title}
                          </h3>
                          <div
                            style={{
                              fontSize: '12px',
                              color: meta.color,
                              fontWeight: 600,
                              marginTop: '3px',
                              letterSpacing: '0.2px'
                            }}
                          >
                            {meta.domain}
                          </div>
                        </div>
                      </div>

                      {/* Date & Status Badges */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px', flexShrink: 0 }}>
                        {exp.date && (
                          <span
                            style={{
                              fontSize: '11px',
                              padding: '3px 9px',
                              borderRadius: '12px',
                              background: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              color: '#e2e8f0',
                              fontWeight: 700,
                              fontFamily: 'var(--font-hud)',
                              letterSpacing: '0.3px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <Calendar size={12} color="#94a3b8" />
                            {exp.date}
                          </span>
                        )}

                        {/* Live Status Pill */}
                        <span
                          style={{
                            fontSize: '9.5px',
                            padding: '2px 7px',
                            borderRadius: '10px',
                            background: meta.statusType === 'active' 
                              ? 'rgba(16, 185, 129, 0.2)' 
                              : (meta.statusType === 'lab' ? 'rgba(255, 183, 3, 0.2)' : 'rgba(168, 85, 247, 0.2)'),
                            border: `1px solid ${meta.color}66`,
                            color: meta.color,
                            fontWeight: 800,
                            letterSpacing: '0.4px',
                            fontFamily: 'var(--font-hud)',
                            textTransform: 'uppercase'
                          }}
                        >
                          ● {meta.statusText}
                        </span>
                      </div>
                    </div>

                    {/* Infrastructure & Tech Tags Row */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {meta.tags.map((tag, tIdx) => (
                        <span
                          key={`tag-${idx}-${tIdx}`}
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 600,
                            padding: '2px 7px',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.09)',
                            color: '#94a3b8'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Description Text */}
                    {exp.description && (
                      <div
                        style={{
                          fontSize: '13.5px',
                          lineHeight: '1.6',
                          color: '#cbd5e1',
                          background: 'rgba(0, 0, 0, 0.2)',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.04)'
                        }}
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: 'rgba(15, 23, 42, 0.4)',
                borderRadius: '12px',
                border: '1px dashed rgba(148, 163, 184, 0.2)'
              }}
            >
              <p style={{ fontSize: '15px', color: '#ffffff', fontWeight: 600 }}>
                No operations found for this category
              </p>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                Select "All Operations" or update records in the Admin Panel.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Footer Information Bar */}
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(10, 14, 25, 0.8)',
            borderTop: '1px solid rgba(56, 189, 248, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={14} color="#00e5ff" />
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              All experience records are managed live via the MongoDB Admin Console.
            </span>
          </div>

          <button
            onClick={handleClose}
            className="btn-cyber"
            style={{
              padding: '6px 18px',
              fontSize: '12px',
              fontFamily: 'var(--font-hud)',
              fontWeight: 700
            }}
          >
            DISMISS CONSOLE
          </button>
        </div>
      </div>

      {/* Enlarged Image Lightbox */}
      {enlargedImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setEnlargedImage(null)}
        >
          <div
            style={{
              maxWidth: '850px',
              width: '100%',
              background: '#0f172a',
              borderRadius: '12px',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h4 style={{ margin: 0, fontSize: '15px', color: '#ffffff', fontWeight: 600 }}>
                {enlargedImage.title}
              </h4>
              <button
                onClick={() => setEnlargedImage(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
              <img
                src={enlargedImage.url}
                alt={enlargedImage.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  borderRadius: '6px'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
