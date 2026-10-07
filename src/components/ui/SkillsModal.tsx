import React, { useState, useMemo } from 'react';
import {
  X,
  Cpu,
  Server,
  Network,
  Shield,
  Code,
  Sparkles,
  Database,
  Layers
} from 'lucide-react';
import { usePortfolioData, SkillItem } from '../../hooks/usePortfolioData';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

// Shared category resolver identical to 2D portfolio
export const getSkillCategory = (
  skill: { name?: string; category?: string },
  fallbackCategories?: string[]
): string => {
  if (skill && skill.category && skill.category.trim() !== '') {
    return skill.category.trim();
  }
  const name = ((skill && skill.name) || '').toUpperCase();
  if (
    name.includes('ROUTING') ||
    name.includes('SWITCHING') ||
    name.includes('CONFIGURE') ||
    name.includes('CISCO') ||
    name.includes('MIKROTIK') ||
    name.includes('NETWORK') ||
    name.includes('LAN') ||
    name.includes('WAN')
  ) {
    return 'Network Engineering';
  }
  if (
    name.includes('FIREWALL') ||
    name.includes('SECURITY') ||
    name.includes('VPN') ||
    name.includes('ACL')
  ) {
    return 'Security & Systems';
  }
  if (
    name.includes('C++') ||
    name.includes('PYTHON') ||
    name.includes('REACT') ||
    name.includes('JS') ||
    name.includes('NODE') ||
    name.includes('JAVA')
  ) {
    return 'Programming & Software';
  }
  return (fallbackCategories && fallbackCategories[0]) || 'Network Engineering';
};

export const SkillsModal: React.FC = () => {
  const { setActivePanel, audioEnabled } = useGameStore();
  const { data } = usePortfolioData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat === 'all') return <Layers size={16} />;
    if (cat.includes('network') || cat.includes('cisco') || cat.includes('isp') || cat.includes('routing')) {
      return <Network size={16} />;
    }
    if (cat.includes('security') || cat.includes('firewall') || cat.includes('system')) {
      return <Shield size={16} />;
    }
    if (cat.includes('program') || cat.includes('code') || cat.includes('software') || cat.includes('dev')) {
      return <Code size={16} />;
    }
    if (cat.includes('data') || cat.includes('cloud') || cat.includes('db')) {
      return <Database size={16} />;
    }
    if (cat.includes('server') || cat.includes('linux')) {
      return <Server size={16} />;
    }
    if (cat.includes('hardware') || cat.includes('robot')) {
      return <Cpu size={16} />;
    }
    return <Sparkles size={16} />;
  };

  const dynamicSkills: SkillItem[] = data.skills || [];

  // Derive unique categories dynamically matching 2D behavior exactly
  const categories = useMemo(() => {
    const defaultCats = ['Network Engineering', 'Security & Systems', 'Programming & Software'];
    const configuredCats =
      data.skill_categories && Array.isArray(data.skill_categories) && data.skill_categories.length > 0
        ? data.skill_categories
        : defaultCats;

    const set = new Set<string>();
    configuredCats.forEach((cat) => {
      if (cat && cat.trim() !== '') set.add(cat.trim());
    });
    dynamicSkills.forEach((s) => {
      const resolved = getSkillCategory(s, configuredCats);
      if (resolved && resolved.trim() !== '') set.add(resolved.trim());
    });
    return ['All', ...Array.from(set)];
  }, [dynamicSkills, data.skill_categories]);

  // Filter skills based on chosen category tab
  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'All') return dynamicSkills;
    return dynamicSkills.filter(
      (skill) => getSkillCategory(skill, data.skill_categories) === selectedCategory
    );
  }, [dynamicSkills, selectedCategory, data.skill_categories]);

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
                backgroundColor: '#39ff14',
                boxShadow: '0 0 10px #39ff14'
              }}
            />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff', letterSpacing: '0.5px' }}>
                TECHNICAL SKILLS MATRIX
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Real-Time Verified Competencies Synchronized with Database & Admin Console
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Dynamic Category Tabs */}
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(15, 23, 42, 0.5)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            alignItems: 'center'
          }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === 'All'
                ? dynamicSkills.length
                : dynamicSkills.filter(
                    (s) => getSkillCategory(s, data.skill_categories) === cat
                  ).length;

            return (
              <button
                key={cat}
                onClick={() => {
                  if (audioEnabled) sound.playClick();
                  setSelectedCategory(cat);
                }}
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(57, 255, 20, 0.25) 0%, rgba(14, 165, 233, 0.2) 100%)'
                    : 'rgba(30, 41, 59, 0.5)',
                  border: `1.5px solid ${isSelected ? '#39ff14' : 'rgba(148, 163, 184, 0.2)'}`,
                  color: isSelected ? '#ffffff' : '#94a3b8',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-hud)',
                  fontWeight: 700,
                  letterSpacing: '0.4px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 14px rgba(57, 255, 20, 0.35)' : 'none'
                }}
              >
                {getCategoryIcon(cat)}
                <span>{cat}</span>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(57, 255, 20, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    color: isSelected ? '#39ff14' : '#cbd5e1'
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Grid of Dynamic Skill Cards */}
          {filteredSkills.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {filteredSkills.map((skill, idx) => {
                return (
                  <div
                    key={`${skill.name}-${idx}`}
                    className="glass-panel glass-panel-hover"
                    style={{
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 14, 25, 0.95) 100%)',
                      border: '1px solid rgba(56, 189, 248, 0.15)',
                      borderRadius: '12px',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.4px' }}>
                        {skill.name}
                      </span>
                    </div>

                    {/* Progress Bar Container */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Proficiency Rating
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#39ff14', textShadow: '0 0 8px rgba(57, 255, 20, 0.5)' }}>
                          {skill.percent}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: '8px',
                          backgroundColor: 'rgba(148, 163, 184, 0.15)',
                          borderRadius: '999px',
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.max(0, Math.min(100, skill.percent))}%`,
                            background: 'linear-gradient(90deg, #10b981 0%, #39ff14 100%)',
                            boxShadow: '0 0 10px rgba(57, 255, 20, 0.65)',
                            borderRadius: '999px',
                            transition: 'width 1s ease-out'
                          }}
                        />
                      </div>
                    </div>
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
                No skills configured in category "{selectedCategory}"
              </p>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                You can assign skills to this category anytime from the Admin Panel.
              </p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="btn-cyber"
                style={{ marginTop: '16px', padding: '6px 16px', fontSize: '12px' }}
              >
                View All Skills
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
