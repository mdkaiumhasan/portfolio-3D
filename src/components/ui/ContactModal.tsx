import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Send, Github, Linkedin, Globe, CheckCircle2, MessageSquare } from 'lucide-react';
import { profileData } from '../../data/profile';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const ContactModal: React.FC = () => {
  const { setActivePanel, audioEnabled } = useGameStore();
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    if (audioEnabled) sound.playChime();
    setIsSubmitted(true);

    // Also trigger mailto so message can actually be sent
    const mailtoUrl = `mailto:${profileData.email}?subject=${encodeURIComponent(
      formState.subject || 'Portfolio Inquiry from ' + formState.name
    )}&body=${encodeURIComponent(
      `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`
    )}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" style={{ maxWidth: '880px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#06b6d4',
                boxShadow: '0 0 10px #06b6d4'
              }}
            />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff' }}>
                TRANSMISSION TOWER // CONTACT
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Direct Uplink to MD. Kaium Hasan
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {/* Direct Contact Channels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                className="glass-panel"
                style={{
                  padding: '20px',
                  background: 'rgba(15, 23, 42, 0.7)',
                  borderLeft: '4px solid #06b6d4',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                  Direct Transmission Channels
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <a
                    href={`mailto:${profileData.email}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(30, 41, 59, 0.4)',
                      border: '1px solid rgba(148, 163, 184, 0.15)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Mail size={18} color="#06b6d4" />
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Email Dispatch</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{profileData.email}</div>
                    </div>
                  </a>

                  <a
                    href={`tel:${profileData.phone}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(30, 41, 59, 0.4)',
                      border: '1px solid rgba(148, 163, 184, 0.15)'
                    }}
                  >
                    <Phone size={18} color="#06b6d4" />
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Mobile / WhatsApp</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{profileData.phone}</div>
                    </div>
                  </a>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(30, 41, 59, 0.4)',
                      border: '1px solid rgba(148, 163, 184, 0.15)'
                    }}
                  >
                    <MapPin size={18} color="#06b6d4" />
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Physical Station</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{profileData.location}</div>
                    </div>
                  </div>
                </div>

                {/* Social Profiles */}
                <div style={{ paddingTop: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>
                    Global Networks:
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a
                      href={profileData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cyber"
                      style={{ padding: '8px 14px', fontSize: '12px' }}
                    >
                      <Github size={15} />
                      GitHub
                    </a>
                    <a
                      href={profileData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cyber"
                      style={{ padding: '8px 14px', fontSize: '12px' }}
                    >
                      <Linkedin size={15} />
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Message Form */}
            <div
              className="glass-panel"
              style={{
                padding: '20px',
                background: 'rgba(15, 23, 42, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={17} color="#06b6d4" />
                Dispatch Direct Frequency
              </h3>

              {isSubmitted ? (
                <div
                  style={{
                    padding: '28px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'center',
                    background: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    borderRadius: '12px'
                  }}
                >
                  <CheckCircle2 size={40} color="#06b6d4" />
                  <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                    Transmission Initiated!
                  </h4>
                  <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
                    Thank you, {formState.name}. Your message draft has been dispatched to Kaium's inbox at {profileData.email}.
                  </p>
                  <button
                    className="btn-cyber"
                    onClick={() => setIsSubmitted(false)}
                    style={{ marginTop: '8px' }}
                  >
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Recruiter / Tech Lead / Collaborator"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(30, 41, 59, 0.7)',
                        border: '1px solid rgba(148, 163, 184, 0.25)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: 'var(--font-body)'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                      EMAIL FREQUENCY
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(30, 41, 59, 0.7)',
                        border: '1px solid rgba(148, 163, 184, 0.25)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: 'var(--font-body)'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                      SUBJECT / PURPOSE
                    </label>
                    <input
                      type="text"
                      placeholder="Opportunity / Project Consultation / Collaboration"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(30, 41, 59, 0.7)',
                        border: '1px solid rgba(148, 163, 184, 0.25)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: 'var(--font-body)'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                      TRANSMISSION MESSAGE
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Let's build something remarkable together..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(30, 41, 59, 0.7)',
                        border: '1px solid rgba(148, 163, 184, 0.25)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: 'var(--font-body)',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-cyber btn-cyber-primary"
                    style={{ marginTop: '6px', justifyContent: 'center', padding: '10px' }}
                  >
                    <Send size={15} />
                    Transmit Signal
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
