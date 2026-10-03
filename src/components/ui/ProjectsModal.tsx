import React, { useState } from 'react';
import { X, ExternalLink, Github, Terminal, CheckCircle2, Filter, Sparkles } from 'lucide-react';
import { projectsData, Project } from '../../data/projects';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const ProjectsModal: React.FC = () => {
  const { setActivePanel, audioEnabled } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories = ['All', 'Enterprise Fullstack', 'Mobile & Realtime', 'AI & Protocol', 'Robotics & Hardware'];

  const filteredProjects = selectedCategory === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === selectedCategory);

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  const handleSelectCategory = (cat: string) => {
    if (audioEnabled) sound.playClick();
    setSelectedCategory(cat);
  };

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
                backgroundColor: '#ff007f',
                boxShadow: '0 0 10px #ff007f'
              }}
            />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff' }}>
                SOFTWARE ENGINEERING LAB
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Production Architectures, High-Concurrency Backends & Mobile Applications
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Category Tabs */}
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
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleSelectCategory(cat)}
              style={{
                background: selectedCategory === cat ? 'linear-gradient(135deg, rgba(255, 0, 127, 0.3) 0%, rgba(14, 165, 233, 0.25) 100%)' : 'rgba(30, 41, 59, 0.5)',
                border: `1px solid ${selectedCategory === cat ? '#ff007f' : 'rgba(148, 163, 184, 0.2)'}`,
                color: selectedCategory === cat ? '#ffffff' : '#94a3b8',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: selectedCategory === cat ? '0 0 12px rgba(255, 0, 127, 0.35)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects List */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                borderLeft: `4px solid ${project.color}`,
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 14, 25, 0.95) 100%)'
              }}
            >
              {/* Title & Metadata Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>
                      {project.title}
                    </h3>
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
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {project.year}
                    </span>
                  </div>
                  <p style={{ color: '#38bdf8', fontSize: '13px', fontWeight: 500, marginTop: '2px' }}>
                    {project.subtitle}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cyber"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      <Github size={14} />
                      GitHub
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cyber btn-cyber-primary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#cbd5e1' }}>
                {project.description}
              </p>

              {/* Engineering Highlights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#94a3b8', fontWeight: 600 }}>
                  Key Engineering Deliverables:
                </span>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {project.bulletPoints.map((point, pIdx) => (
                    <li key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                      <CheckCircle2 size={15} color={project.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metrics & Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                {project.metrics.map((metric, mIdx) => (
                  <span
                    key={mIdx}
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#7dd3fc'
                    }}
                  >
                    ★ {metric}
                  </span>
                ))}
              </div>

              {/* Tech Stack Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '4px' }}>
                {project.techStack.map((tech, tIdx) => (
                  <span key={tIdx} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
