import React, { useState } from 'react';
import { X, Cpu, Server, Smartphone, Network, Cloud, Sparkles, Check } from 'lucide-react';
import { skillGroups } from '../../data/skills';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const SkillsModal: React.FC = () => {
  const { setActivePanel, audioEnabled } = useGameStore();
  const { data } = usePortfolioData();
  const [activeTab, setActiveTab] = useState<string>('database-skills');

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

  const dynamicSkills = data.skills || [];

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: '960px',
          width: '95%',
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
        {/* Header */}
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
                  TECH MATRIX & SKILLS
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(40, 167, 69, 0.18)',
                    color: '#28a745',
                    border: '1px solid rgba(40, 167, 69, 0.4)'
                  }}
                >
                  Live Skill Profiles
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#adb5bd' }}>
                Enterprise proficiency across Networking, Routing, Switching, Fullstack & Mobile
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
            background: '#2b3035',
            borderBottom: '1px solid #343a40',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto'
          }}
        >
          <button
            onClick={() => {
              if (audioEnabled) sound.playClick();
              setActiveTab('database-skills');
            }}
            style={{
              background: activeTab === 'database-skills' ? 'rgba(40, 167, 69, 0.2)' : 'transparent',
              border: `1px solid ${activeTab === 'database-skills' ? '#28a745' : '#495057'}`,
              color: activeTab === 'database-skills' ? '#ffffff' : '#adb5bd',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap'
            }}
          >
            <Network size={16} color="#28a745" />
            Core Proficiencies ({dynamicSkills.length})
          </button>

          {skillGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => {
                if (audioEnabled) sound.playClick();
                setActiveTab(group.id);
              }}
              style={{
                background: activeTab === group.id ? 'rgba(40, 167, 69, 0.2)' : 'transparent',
                border: `1px solid ${activeTab === group.id ? '#28a745' : '#495057'}`,
                color: activeTab === group.id ? '#ffffff' : '#adb5bd',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              {getIcon(group.icon)}
              {group.category}
            </button>
          ))}
        </div>

        {/* Body */}
        <div
          className="modal-body"
          style={{
            padding: '24px',
            overflowY: 'auto',
            backgroundColor: '#212529',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          {activeTab === 'database-skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#2b3035', padding: '16px 20px', borderRadius: '10px', border: '1px solid #343a40' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8f9fa', margin: '0 0 6px 0' }}>
                  Core Infrastructure & Network Operations
                </h3>
                <p style={{ fontSize: '13px', color: '#adb5bd', margin: 0 }}>
                  Quantified skill percentages managed and synchronized directly with the database.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {dynamicSkills.map((skill, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#2b3035',
                      border: '1px solid #495057',
                      borderRadius: '10px',
                      padding: '16px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#f8f9fa', letterSpacing: '0.4px' }}>
                        {skill.name}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#28a745' }}>
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
                          boxShadow: '0 0 10px rgba(40, 167, 69, 0.5)'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skillGroups.map((group) => {
            if (activeTab !== group.id) return null;
            return (
              <div key={group.id} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ backgroundColor: '#2b3035', padding: '16px 20px', borderRadius: '10px', border: '1px solid #343a40' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8f9fa', margin: '0 0 6px 0' }}>
                    {group.category}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#adb5bd', margin: 0 }}>
                    {group.description}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
                  {group.skills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        backgroundColor: '#2b3035',
                        border: '1px solid #495057',
                        borderRadius: '10px',
                        padding: '14px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#f8f9fa' }}>
                          {skill.name}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(40, 167, 69, 0.15)',
                            color: '#28a745'
                          }}
                        >
                          {skill.level}
                        </span>
                      </div>
                      {skill.tag && (
                        <p style={{ fontSize: '12px', color: '#adb5bd', margin: 0, lineHeight: 1.4 }}>
                          {skill.tag}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            background: 'linear-gradient(180deg, #212529 0%, #1a1d20 100%)',
            borderTop: '1px solid #343a40',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '12px', color: '#adb5bd' }}>
            Permanent Dark Theme • Station: Tech Matrix
          </span>

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
  );
};
