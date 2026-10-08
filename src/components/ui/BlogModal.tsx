import React, { useState, useMemo } from 'react';
import {
  X,
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { usePortfolioData, PostItem } from '../../hooks/usePortfolioData';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const BlogModal: React.FC = () => {
  const { setActivePanel, audioEnabled } = useGameStore();
  const { data } = usePortfolioData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const posts = data.posts || [];

  // Dynamic categories from data with standard fallbacks
  const categories = useMemo(() => {
    const raw = (data.blog_categories && data.blog_categories.length > 0)
      ? data.blog_categories
      : ['Tutorial', 'Networking Guide', 'Network Architecture', 'Career & Certification'];
    return ['All', ...Array.from(new Set(raw))];
  }, [data.blog_categories]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return posts;
    const sel = selectedCategory.toLowerCase().trim();
    return posts.filter((p) => {
      const cat = (p.category || '').toLowerCase().trim();
      return cat === sel || cat.includes(sel) || sel.includes(cat);
    });
  }, [posts, selectedCategory]);

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  const handleSelectCategory = (cat: string) => {
    if (audioEnabled) sound.playClick();
    setSelectedCategory(cat);
  };

  const handleOpenPostLink = (post: PostItem) => {
    if (audioEnabled) sound.playClick();
    const url = post.link && post.link.trim().length > 0
      ? post.link.trim()
      : 'https://www.linkedin.com/in/mdkaiumhasan';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getEstimatedReadTime = (content?: string, excerpt?: string) => {
    const text = (content || '') + ' ' + (excerpt || '');
    const words = text.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(2, Math.ceil(words / 140));
    return `${minutes} min read`;
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: '1040px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'radial-gradient(ellipse at top, #181122 0%, #0a0914 100%)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(244, 63, 94, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '18px 24px', borderBottom: '1px solid rgba(244, 63, 94, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#f43f5e',
                boxShadow: '0 0 12px #f43f5e',
                animation: 'pulse 2s infinite'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff', letterSpacing: '0.6px', margin: 0 }}>
                  CYBER CHRONICLES & TECHNICAL PUBLICATIONS
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(244, 63, 94, 0.18)',
                    color: '#f43f5e',
                    border: '1px solid rgba(244, 63, 94, 0.4)',
                    fontFamily: 'var(--font-hud)'
                  }}
                >
                  {posts.length} Publications
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
                Network Architecture, Routing Protocols & Industry Insights on LinkedIn
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Dynamic Category Filter Tabs */}
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(15, 23, 42, 0.5)',
            borderBottom: '1px solid rgba(244, 63, 94, 0.15)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto'
          }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.35) 0%, rgba(14, 165, 233, 0.25) 100%)'
                    : 'rgba(30, 41, 59, 0.5)',
                  border: `1px solid ${isSelected ? '#f43f5e' : 'rgba(148, 163, 184, 0.2)'}`,
                  color: isSelected ? '#ffffff' : '#94a3b8',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-hud)',
                  fontWeight: 700,
                  letterSpacing: '0.4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 12px rgba(244, 63, 94, 0.4)' : 'none'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Articles Grid - Directly opens LinkedIn / Article Link on click */}
        <div
          className="modal-body"
          style={{
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            overflowY: 'auto',
            flex: 1
          }}
        >
          {filteredPosts.map((post, idx) => {
            const isLinkedIn = (post.link || '').toLowerCase().includes('linkedin');

            return (
              <div
                key={idx}
                onClick={() => handleOpenPostLink(post)}
                className="glass-panel glass-panel-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  borderTop: '3px solid #f43f5e',
                  background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 14, 25, 0.98) 100%)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}
                title="Click to read full post on LinkedIn"
              >
                {/* Thumbnail Banner */}
                <div
                  style={{
                    height: '160px',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#0f172a'
                  }}
                >
                  <img
                    src={post.imageUrl || 'https://res.cloudinary.com/dgomoujlo/image/upload/v1791035648/portfolio/blogs/vnt9j0szpfibfzqsayhl.jpg'}
                    alt={post.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.3s ease'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/dgomoujlo/image/upload/v1791035648/portfolio/blogs/vnt9j0szpfibfzqsayhl.jpg';
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 40%, rgba(10, 14, 25, 0.9) 100%)'
                    }}
                  />

                  {/* Category Badge */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(10, 14, 25, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#f43f5e',
                      border: '1px solid rgba(244, 63, 94, 0.4)',
                      fontFamily: 'var(--font-hud)',
                      letterSpacing: '0.4px'
                    }}
                  >
                    {post.category || 'Tutorial'}
                  </span>

                  {/* LinkedIn Indicator Badge */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(10, 102, 194, 0.9)',
                      color: '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: 'var(--font-hud)',
                      letterSpacing: '0.3px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#ffffff">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z"/>
                    </svg>
                    LINKEDIN
                  </span>
                </div>

                {/* Card Content */}
                <div
                  style={{
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    {/* Date & Read time */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '11px',
                        color: '#94a3b8',
                        marginBottom: '8px',
                        fontFamily: 'var(--font-hud)'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} color="#f43f5e" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} color="#38bdf8" />
                        {getEstimatedReadTime(post.fullContent, post.shortDesc)}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#ffffff',
                        lineHeight: '1.4',
                        marginBottom: '8px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {post.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '13px',
                        color: '#94a3b8',
                        lineHeight: '1.5',
                        fontFamily: 'var(--font-body)',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        margin: 0
                      }}
                    >
                      {(post.shortDesc || '').replace(/<[^>]*>/g, '')}
                    </p>
                  </div>

                  {/* Direct Action Link */}
                  <div
                    style={{
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#f43f5e',
                      fontFamily: 'var(--font-hud)',
                      letterSpacing: '0.4px'
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      {isLinkedIn ? (
                        <>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="#0a66c2">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z"/>
                          </svg>
                          READ ON LINKEDIN
                        </>
                      ) : (
                        <>
                          <ExternalLink size={13} color="#f43f5e" />
                          OPEN ARTICLE
                        </>
                      )}
                    </span>
                    <ArrowRight size={14} color="#f43f5e" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(10, 14, 25, 0.85)',
            borderTop: '1px solid rgba(244, 63, 94, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={14} color="#f43f5e" />
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              All technical guides & posts are linked directly to official LinkedIn publications.
            </span>
          </div>

          <button
            onClick={handleClose}
            className="btn-cyber"
            style={{
              padding: '6px 18px',
              fontSize: '12px',
              fontFamily: 'var(--font-hud)',
              fontWeight: 700,
              borderColor: '#f43f5e'
            }}
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
