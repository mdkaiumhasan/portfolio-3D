import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Send,
  CheckCircle2,
  MessageSquare,
  Download,
  ExternalLink,
  Loader2,
  GraduationCap,
  Info
} from 'lucide-react';
import { usePortfolioData, extractAuthorName } from '../../hooks/usePortfolioData';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';
import { resolveCvLink } from '../../utils/sanitize';

export const ContactModal: React.FC = () => {
  const setActivePanel = useGameStore((s) => s.setActivePanel);
  const audioEnabled = useGameStore((s) => s.audioEnabled);
  const { data } = usePortfolioData();

  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitNote, setSubmitNote] = useState<string>('');

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  const contactItems =
    data.contactDetails && data.contactDetails.length > 0
      ? data.contactDetails
      : [
          { type: 'Email', value: 'mdkaiumhasan2005@gmail.com' },
          { type: 'Contact Number', value: '+880 1560-014339' },
          { type: 'Location', value: 'Dhanmondi 27, Dhaka, Bangladesh' },
          { type: 'Languages', value: 'Bangla, English, Hindi' },
        ];

  const primaryEmail =
    contactItems.find((d) => d.type.toLowerCase().includes('email') || d.value.includes('@'))?.value ||
    'mdkaiumhasan2005@gmail.com';

  const socialItems =
    data.socialLinks && data.socialLinks.length > 0
      ? data.socialLinks
      : [
          { platform: 'GitHub', url: 'https://github.com/mdkaiumhasan' },
          { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/md-kaium-hasan-bb6009372/' },
          { platform: 'Twitter', url: 'https://x.com/mdkaium2005?s=11' },
        ];

  const cvUrl = resolveCvLink(data.contact_cv_link, data.about_cv_link, data.home_cv_link);
  const authorName = extractAuthorName(data.home_heading);

  const getContactIconAndColor = (type: string, value: string) => {
    const t = type.toLowerCase();
    if (t.includes('email') || value.includes('@')) {
      return { icon: <Mail size={16} />, bg: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', href: `mailto:${value.trim()}` };
    }
    if (t.includes('phone') || t.includes('contact') || t.includes('whatsapp') || t.includes('mobile')) {
      return { icon: <Phone size={16} />, bg: 'rgba(57, 255, 20, 0.15)', color: '#39ff14', href: `tel:${value.replace(/\s+/g, '')}` };
    }
    if (t.includes('location') || t.includes('address') || t.includes('city')) {
      return { icon: <MapPin size={16} />, bg: 'rgba(255, 183, 3, 0.15)', color: '#ffb703', href: undefined };
    }
    if (t.includes('edu') || t.includes('university') || t.includes('degree')) {
      return { icon: <GraduationCap size={16} />, bg: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', href: undefined };
    }
    if (t.includes('lang') || t.includes('web')) {
      return { icon: <Globe size={16} />, bg: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', href: value.startsWith('http') ? value : undefined };
    }
    return { icon: <Info size={16} />, bg: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', href: value.startsWith('http') ? value : undefined };
  };

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return <Github size={14} />;
    if (p.includes('linkedin')) return <Linkedin size={14} />;
    return <ExternalLink size={13} />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (audioEnabled) sound.playClick();

    setIsSubmitting(true);
    setSubmitNote('');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name.trim(),
          email: formState.email.trim(),
          subject: formState.subject.trim() || `Message from ${formState.name.trim()} via 3D Portfolio`,
          message: formState.message.trim(),
          source: '3d',
        }),
      });

      if (!response.ok) {
        throw new Error('Server inbox unavailable');
      }

      setSubmitNote(`Delivered directly to ${authorName}'s Admin Console Inbox.`);
      setIsSubmitted(true);
    } catch {
      // Graceful fallback to direct mail client if offline or DB unavailable
      const mailtoSubject = encodeURIComponent(formState.subject || `Message from ${formState.name} via 3D Portfolio`);
      const mailtoBody = encodeURIComponent(`From: ${formState.name} (${formState.email})\n\n${formState.message}`);
      window.open(`mailto:${primaryEmail}?subject=${mailtoSubject}&body=${mailtoBody}`, '_blank');
      setSubmitNote(`Prepared for dispatch via your email client directly to ${primaryEmail}.`);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" style={{ maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#06b6d4',
                boxShadow: '0 0 10px #06b6d4',
                flexShrink: 0
              }}
            />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff' }}>
                DIRECT TRANSMISSION COMM-LINK
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Initialize direct communication with {authorName}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
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
                      boxShadow: data.available_for_work !== false ? '0 0 8px #39ff14' : '0 0 8px #ff007f',
                      flexShrink: 0
                    }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: data.available_for_work !== false ? '#4ade80' : '#fda4af' }}>
                    {data.available_for_work !== false ? 'STATUS: AVAILABLE FOR FULL-TIME & CONTRACT ROLES' : 'STATUS: CURRENTLY ENGAGED'}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
                  {data.contact_info_heading || "Let's Build Resilient Systems"}
                </h3>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#cbd5e1' }}>
                  {data.contact_info_text || "Whether you have an enterprise software architecture challenge, high-concurrency mobile application, or ISP/campus network infrastructure project, I am ready to collaborate."}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
                  {contactItems.map((item, idx) => {
                    const meta = getContactIconAndColor(item.type, item.value);
                    return (
                      <div key={`${item.type}-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ padding: '8px', borderRadius: '8px', background: meta.bg, color: meta.color, flexShrink: 0 }}>
                          {meta.icon}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>{item.type}</div>
                          {meta.href ? (
                            <a
                              href={meta.href}
                              target={meta.href.startsWith('http') ? '_blank' : undefined}
                              rel={meta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                              style={{ fontSize: '13px', fontWeight: 600, color: '#38bdf8', textDecoration: 'none', wordBreak: 'break-word' }}
                            >
                              {item.value}
                            </a>
                          ) : (
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', wordBreak: 'break-word' }}>
                              {item.value}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Social Profiles & Direct CV Download */}
                <div style={{ paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {socialItems.length > 0 && (
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>
                        Verified Profiles:
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {socialItems.map((social, idx) => (
                          <a
                            key={`${social.platform}-${idx}`}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-cyber"
                            style={{ padding: '7px 12px', fontSize: '12px' }}
                          >
                            {getSocialIcon(social.platform)}
                            {social.platform}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ paddingTop: '4px', borderTop: '1px solid rgba(148, 163, 184, 0.14)' }}>
                    <a
                      href={cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-cyber btn-cyber-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '9px 14px', fontSize: '12.5px' }}
                    >
                      <Download size={14} />
                      Download Curriculum Vitae (PDF)
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
                    Transmission Delivered
                  </h4>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                    Thank you, {formState.name}. {submitNote}
                  </p>
                  <button
                    className="btn-cyber"
                    onClick={() => {
                      setFormState({ name: '', email: '', subject: '', message: '' });
                      setIsSubmitted(false);
                    }}
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
                      maxLength={120}
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
                      maxLength={160}
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
                      maxLength={200}
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
                      maxLength={4000}
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
                    disabled={isSubmitting}
                    className="btn-cyber btn-cyber-primary"
                    style={{ marginTop: '6px', justifyContent: 'center', padding: '10px', opacity: isSubmitting ? 0.75 : 1 }}
                  >
                    {isSubmitting ? <Loader2 size={15} className="spin" /> : <Send size={15} />}
                    {isSubmitting ? 'Transmitting...' : 'Transmit Signal'}
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
