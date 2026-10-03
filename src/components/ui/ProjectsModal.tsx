import React, { useState } from 'react';
import { X, ExternalLink, Github, Layers, Code, CheckCircle, Info } from 'lucide-react';
import { usePortfolioData, ProjectItem } from '../../hooks/usePortfolioData';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const ProjectsModal: React.FC = () => {
  const { setActivePanel, audioEnabled } = useGameStore();
  const { data } = usePortfolioData();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const projects = data.projects || [];

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  const handleViewDetails = (proj: ProjectItem) => {
    if (audioEnabled) sound.playClick();
    setSelectedProject(proj);
  };

  const handleCloseDetails = () => {
    if (audioEnabled) sound.playClick();
    setSelectedProject(null);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: '1100px',
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
                  PROJECTS & ARCHITECTURE
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
                  {projects.length} Production Systems
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#adb5bd' }}>
                Fullstack platforms, high-concurrency microservices, native mobile apps & enterprise network topologies
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body: Projects Grid */}
        <div
          className="modal-body"
          style={{
            padding: '24px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
            backgroundColor: '#212529'
          }}
        >
          {projects.map((project, index) => {
            const techList = project.technology
              ? project.technology.split(',').map((t) => t.trim())
              : [];

            return (
              <div
                key={index}
                style={{
                  backgroundColor: '#2b3035',
                  border: '1px solid #495057',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.3)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
              >
                {/* Thumbnail Image */}
                <div
                  style={{
                    height: '175px',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#181b1e'
                  }}
                >
                  <img
                    src={project.imageUrl || 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80'}
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  {project.role && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: 'rgba(33, 37, 41, 0.88)',
                        backdropFilter: 'blur(6px)',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#28a745',
                        border: '1px solid rgba(40, 167, 69, 0.4)'
                      }}
                    >
                      {project.role}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8f9fa', margin: '0 0 4px 0' }}>
                      {project.title}
                    </h3>
                    <p style={{ fontSize: '13px', lineHeight: 1.55, color: '#adb5bd', margin: 0 }}>
                      {project.shortDesc}
                    </p>
                  </div>

                  {/* Tech stack pills */}
                  {techList.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {techList.slice(0, 4).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#343a40',
                            color: '#adb5bd',
                            border: '1px solid #495057'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                      {techList.length > 4 && (
                        <span style={{ fontSize: '11px', color: '#6c757d', alignSelf: 'center' }}>
                          +{techList.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                      paddingTop: '12px',
                      borderTop: '1px solid #343a40'
                    }}
                  >
                    <button
                      onClick={() => handleViewDetails(project)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        backgroundColor: 'transparent',
                        border: '1.5px solid #28a745',
                        color: '#28a745',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Info size={13} />
                      Full Details
                    </button>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="GitHub Repository"
                          style={{
                            padding: '6px',
                            borderRadius: '50%',
                            backgroundColor: '#343a40',
                            color: '#adb5bd',
                            border: '1px solid #495057',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none'
                          }}
                        >
                          <Github size={15} />
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Live Demo"
                          style={{
                            padding: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(40, 167, 69, 0.2)',
                            color: '#28a745',
                            border: '1px solid rgba(40, 167, 69, 0.4)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none'
                          }}
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </div>
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
            Permanent Dark Theme • Synchronized with Live Database
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

      {/* Full Details Modal Overlay (if a project is selected) */}
      {selectedProject && (
        <div
          className="modal-overlay"
          style={{ zIndex: 120, backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
          onClick={handleCloseDetails}
        >
          <div
            className="modal-content"
            style={{
              maxWidth: '750px',
              width: '90%',
              maxHeight: '80vh',
              backgroundColor: '#212529',
              color: '#f8f9fa',
              border: '1px solid #495057',
              borderRadius: '14px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-header"
              style={{
                background: '#2b3035',
                borderBottom: '1px solid #343a40',
                padding: '16px 22px'
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8f9fa', margin: 0 }}>
                  {selectedProject.title}
                </h3>
                {selectedProject.role && (
                  <p style={{ fontSize: '12.5px', color: '#28a745', fontWeight: 600, margin: '2px 0 0 0' }}>
                    {selectedProject.role}
                  </p>
                )}
              </div>
              <button className="modal-close-btn" onClick={handleCloseDetails} aria-label="Close details">
                <X size={18} />
              </button>
            </div>

            <div
              className="modal-body"
              style={{
                padding: '22px',
                overflowY: 'auto',
                backgroundColor: '#212529',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              {selectedProject.imageUrl && (
                <div style={{ maxHeight: '240px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#181b1e' }}>
                  <img
                    src={selectedProject.imageUrl}
                    alt={selectedProject.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}

              {selectedProject.technology && (
                <div style={{ backgroundColor: '#2b3035', padding: '12px 16px', borderRadius: '8px', border: '1px solid #343a40' }}>
                  <span style={{ fontSize: '11px', color: '#28a745', fontWeight: 700, textTransform: 'uppercase' }}>
                    Technology Stack:
                  </span>
                  <p style={{ fontSize: '13px', color: '#f8f9fa', margin: '4px 0 0 0', fontWeight: 500 }}>
                    {selectedProject.technology}
                  </p>
                </div>
              )}

              {/* HTML full details */}
              <div
                style={{
                  fontSize: '14px',
                  lineHeight: '1.7',
                  color: '#adb5bd'
                }}
                dangerouslySetInnerHTML={{
                  __html: selectedProject.fullDetails || `<p>${selectedProject.shortDesc || ''}</p>`
                }}
              />
            </div>

            <div
              style={{
                padding: '14px 22px',
                background: '#2b3035',
                borderTop: '1px solid #343a40',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', gap: '10px' }}>
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      borderRadius: '6px',
                      backgroundColor: '#343a40',
                      color: '#f8f9fa',
                      fontSize: '12px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      border: '1px solid #495057'
                    }}
                  >
                    <Github size={14} />
                    GitHub
                  </a>
                )}
                {selectedProject.live && (
                  <a
                    href={selectedProject.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      borderRadius: '6px',
                      backgroundColor: '#28a745',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                )}
              </div>

              <button
                onClick={handleCloseDetails}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  backgroundColor: '#343a40',
                  color: '#adb5bd',
                  border: '1px solid #495057',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
