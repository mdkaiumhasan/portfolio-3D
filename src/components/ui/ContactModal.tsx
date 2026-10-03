import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Send, Github, Linkedin, Globe, CheckCircle2 } from 'lucide-react';
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

  const recipientEmail = "mdkaiumhasan2005@gmail.com";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    if (audioEnabled) sound.playChime();
    setIsSubmitted(true);

    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(
      formState.subject || 'Portfolio Inquiry from ' + formState.name
    )}&body=${encodeURIComponent(
      `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`
    )}`;
    window.open(mailtoUrl, '_blank');
  };

  const contactDetails = data.contactDetails || [
    { type: 'Location', value: 'Dhanmondi 27, Dhaka' },
    { type: 'Email', value: recipientEmail },
    { type: 'Contact Number', value: '+880 1560-014339' },
    { type: 'Languages', value: 'Bangla, English, Hindi' }
  ];

  const socialLinks = data.socialLinks || [
    { platform: 'github', url: 'https://github.com/mdkaiumhasan' },
    { platform: 'Linkedin', url: 'https://www.linkedin.com/in/md-kaium-hasan-bb6009372/' },
    { platform: 'twitter', url: 'https://x.com/mdkaium2005?s=11' },
    { platform: 'facebook', url: 'https://www.facebook.com/share/16NRG5WKLP/?mibextid=wwXIfr' }
  ];

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: '880px',
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
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#f8f9fa', letterSpacing: '0.5px' }}>
                TRANSMISSION TOWER // CONTACT
              </h2>
              <p style={{ fontSize: '12px', color: '#adb5bd' }}>
                Direct Uplink to MD. Kaium Hasan ({recipientEmail})
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div
          className="modal-body"
          style={{
            padding: '24px',
            overflowY: 'auto',
            backgroundColor: '#212529',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {/* Left Column: Contact details & Socials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#2b3035', padding: '18px', borderRadius: '12px', border: '1px solid #343a40' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8f9fa', margin: '0 0 6px 0' }}>
                {data.contact_info_heading || 'CONTACT ME HERE'}
              </h3>
              <p style={{ fontSize: '13px', color: '#adb5bd', lineHeight: 1.5, margin: 0 }}>
                {data.contact_info_text || 'For Network consultancy, fullstack engineering or architecture collaborations, please reach out directly.'}
              </p>
            </div>

            {/* Details list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {contactDetails.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#2b3035',
                    border: '1px solid #495057',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  <span style={{ fontSize: '11px', color: '#28a745', fontWeight: 700, textTransform: 'uppercase' }}>
                    {item.type}
                  </span>
                  <span style={{ fontSize: '13.5px', color: '#f8f9fa', fontWeight: 600 }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#2b3035',
                    color: '#f8f9fa',
                    border: '1px solid #495057',
                    fontSize: '12px',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  <Globe size={13} color="#28a745" />
                  {link.platform}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div style={{ backgroundColor: '#2b3035', padding: '22px', borderRadius: '12px', border: '1px solid #495057' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f8f9fa', margin: '0 0 16px 0' }}>
              Send Direct Message
            </h3>

            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <CheckCircle2 size={44} color="#28a745" />
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#f8f9fa', margin: 0 }}>Message Ready!</h4>
                <p style={{ fontSize: '13px', color: '#adb5bd', margin: 0 }}>
                  Your email client has been opened. If it didn't open, mail directly to <strong style={{ color: '#28a745' }}>{recipientEmail}</strong>.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    backgroundColor: '#343a40',
                    color: '#f8f9fa',
                    border: '1px solid #495057',
                    cursor: 'pointer'
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#adb5bd', display: 'block', marginBottom: '4px' }}>
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: '#212529',
                      border: '1px solid #495057',
                      borderRadius: '8px',
                      color: '#f8f9fa',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#adb5bd', display: 'block', marginBottom: '4px' }}>
                    YOUR EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: '#212529',
                      border: '1px solid #495057',
                      borderRadius: '8px',
                      color: '#f8f9fa',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#adb5bd', display: 'block', marginBottom: '4px' }}>
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: '#212529',
                      border: '1px solid #495057',
                      borderRadius: '8px',
                      color: '#f8f9fa',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Inquiry topic"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#adb5bd', display: 'block', marginBottom: '4px' }}>
                    MESSAGE
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: '#212529',
                      border: '1px solid #495057',
                      borderRadius: '8px',
                      color: '#f8f9fa',
                      fontSize: '13px',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '11px',
                    borderRadius: '8px',
                    backgroundColor: '#28a745',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    marginTop: '6px'
                  }}
                >
                  <Send size={15} />
                  Transmit Email
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
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
            Permanent Dark Theme • Station: Transmission Tower
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
