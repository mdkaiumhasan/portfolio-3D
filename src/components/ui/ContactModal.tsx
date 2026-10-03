import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Globe, Github, Linkedin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const ContactModal: React.FC = () => {
  const { setActivePanel, audioEnabled } = useGameStore();
  const { data } = usePortfolioData();
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  // Dynamic contact details fallback
  const getDetail = (type: string, fallback: string) => {
    const item = data.contactDetails?.find((d) => d.type.toLowerCase().includes(type.toLowerCase()));
    return item ? item.value : fallback;
  };

  const email = getDetail('email', 'mdkaiumhasan2005@gmail.com');
  const phone = getDetail('contact number', '+880 1560-014339');
  const location = getDetail('location', 'Dhanmondi 27, Dhaka, Bangladesh');
  const languages = getDetail('languages', 'Bangla, English, Hindi');

  const getSocialUrl = (platform: string, fallback: string) => {
    const item = data.socialLinks?.find((s) => s.platform.toLowerCase().includes(platform.toLowerCase()));
    return item ? item.url : fallback;
  };

  const githubUrl = getSocialUrl('github', 'https://github.com/mdkaiumhasan');
  const linkedinUrl = getSocialUrl('linkedin', 'https://www.linkedin.com/in/md-kaium-hasan-bb6009372/');
  const twitterUrl = getSocialUrl('twitter', 'https://x.com/mdkaium2005?s=11');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (audioEnabled) sound.playClick();

    // Trigger direct mailto
    const mailtoSubject = encodeURIComponent(formState.subject || `Message from ${formState.name} via 3D Portfolio`);
    const mailtoBody = encodeURIComponent(`From: ${formState.name} (${formState.email})\n\n${formState.message}`);
    window.open(`mailto:${email}?subject=${mailtoSubject}&body=${mailtoBody}`, '_blank');

    setIsSubmitted(true);
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
                DIRECT TRANSMISSION COMM-LINK
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Initialize encrypted communication with Md. Kaium Hasan
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Contact Details Column */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: data.available_for_work !== false ? '#39ff14' : '#ff007f',
                      boxShadow: data.available_for_work !== false ? '0 0 8px #39ff14' : '0 0 8px #ff007f'
                    }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: data.available_for_work !== false ? '#4ade80' : '#fda4af' }}>
                    {data.available_for_work !== false ? 'STATUS: AVAILABLE FOR FULL-TIME & CONTRACT ROLES' : 'STATUS: CURRENTLY ENGAGED'}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                  Let's Build Resilient Systems
                </h3>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#cbd5e1' }}>
                  Whether you have an enterprise software architecture challenge, high-concurrency mobile application, or ISP/campus network infrastructure project, I am ready to collaborate.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
                      <Mail size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Direct Inbox</div>
                      <a href={`mailto:${email}`} style={{ fontSize: '13px', fontWeight: 600, color: '#38bdf8', textDecoration: 'none' }}>
                        {email}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(57, 255, 20, 0.15)', color: '#39ff14' }}>
                      <Phone size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Phone / WhatsApp</div>
                      <a href={`tel:${phone}`} style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', textDecoration: 'none' }}>
                        {phone}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255, 183, 3, 0.15)', color: '#ffb703' }}>
                      <MapPin size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Base Location</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                        {location}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
                      <Globe size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Languages</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
                        {languages}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Profiles */}
                <div style={{ paddingTop: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>
                    Verified Profiles:
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cyber"
                      style={{ padding: '7px 12px', fontSize: '12px' }}
                    >
                      <Github size={14} />
                      GitHub
                    </a>
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cyber"
                      style={{ padding: '7px 12px', fontSize: '12px' }}
                    >
                      <Linkedin size={14} />
                      LinkedIn
                    </a>
                    <a
                      href={twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cyber"
                      style={{ padding: '7px 12px', fontSize: '12px' }}
                    >
                      Twitter
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Transmission Form */}
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
                    Transmission Initiated
                  </h4>
                  <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
                    Thank you, {formState.name}. Your message has been prepared for dispatch directly to {email}.
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
