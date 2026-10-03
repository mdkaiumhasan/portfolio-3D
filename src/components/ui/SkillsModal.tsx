import React, { useState } from 'react';
import { X, Cpu, Server, Smartphone, Network, Cloud, Sparkles, Check } from 'lucide-react';
import { skillGroups } from '../../data/skills';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const SkillsModal: React.FC = () => {
  const { setActivePanel, audioEnabled } = useGameStore();
  const [activeTab, setActiveTab] = useState<string>(skillGroups[0].id);

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout': return <Cpu size={16} />;
      case 'Server': return <Server size={16} />;
      case 'Smartphone': return <Smartphone size={16} />;
      case 'Network': return <Network size={16} />;
      case 'Cloud': return <Cloud size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" style={{ maxWidth: '920px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#39ff14',
                boxShadow: '0 0 10px #39ff14'
              }}
            />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff' }}>
                TECHNICAL SKILLS MATRIX
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Comprehensive Proficiency Breakdown Across Software & Network Infrastructure
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Tab Selector */}
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(15, 23, 42, 0.4)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto'
          }}
        >
          {skillGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => {
                if (audioEnabled) sound.playClick();
                setActiveTab(group.id);
              }}
              style={{
                background: activeTab === group.id ? 'linear-gradient(135deg, rgba(57, 255, 20, 0.25) 0%, rgba(14, 165, 233, 0.2) 100%)' : 'rgba(30, 41, 59, 0.5)',
                border: `1px solid ${activeTab === group.id ? '#39ff14' : 'rgba(148, 163, 184, 0.2)'}`,
                color: activeTab === group.id ? '#ffffff' : '#94a3b8',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === group.id ? '0 0 12px rgba(57, 255, 20, 0.3)' : 'none'
              }}
            >
              {getIcon(group.icon)}
              {group.category}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="modal-body">
          {skillGroups.map((group) => {
            if (group.id !== activeTab) return null;
            return (
              <div key={group.id} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Category Intro */}
                <div
                  className="glass-panel"
                  style={{
                    padding: '16px 20px',
                    borderLeft: '4px solid #39ff14',
                    background: 'rgba(15, 23, 42, 0.6)'
                  }}
                >
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                    {group.category}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                    {group.description}
                  </p>
                </div>

                {/* Skills Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                  {group.skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="glass-panel glass-panel-hover"
                      style={{
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'rgba(15, 23, 42, 0.7)'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>
                          {skill.name}
                        </span>
                        {skill.tag && (
                          <span style={{ fontSize: '11px', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                            {skill.tag}
                          </span>
                        )}
                      </div>

                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '12px',
                          background: skill.level === 'Expert'
                            ? 'rgba(57, 255, 20, 0.15)'
                            : skill.level === 'Advanced'
                            ? 'rgba(56, 189, 248, 0.15)'
                            : 'rgba(251, 191, 36, 0.15)',
                          color: skill.level === 'Expert'
                            ? '#4ade80'
                            : skill.level === 'Advanced'
                            ? '#38bdf8'
                            : '#fbbf24',
                          border: `1px solid ${
                            skill.level === 'Expert'
                              ? 'rgba(74, 222, 128, 0.3)'
                              : skill.level === 'Advanced'
                              ? 'rgba(56, 189, 248, 0.3)'
                              : 'rgba(251, 191, 36, 0.3)'
                          }`
                        }}
                      >
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
