import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Share2,
  Copy,
  Check,
  Tag,
  Bookmark
} from 'lucide-react';
import { usePortfolioData, PostItem } from '../../hooks/usePortfolioData';
import { useGameStore } from '../../store/gameStore';
import { sound } from '../../systems/audio';

export const BlogModal: React.FC = () => {
  const { setActivePanel, audioEnabled } = useGameStore();
  const { data } = usePortfolioData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<PostItem | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const posts = data.posts || [];

  // Derive categories
  const categories = ['All', 'Networking Guide', 'Career & Certification', 'Network Architecture', 'Tutorial'];

  const filteredPosts = selectedCategory === 'All'
    ? posts
    : posts.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        const sel = selectedCategory.toLowerCase();
        return cat.includes(sel) || sel.includes(cat);
      });

  const handleClose = () => {
    if (audioEnabled) sound.playClick();
    setActivePanel(null);
  };

  const handleSelectCategory = (cat: string) => {
    if (audioEnabled) sound.playClick();
    setSelectedCategory(cat);
  };

  const handleOpenArticle = (post: PostItem) => {
    if (audioEnabled) sound.playClick();
    setActiveArticle(post);
  };

  const handleBackToList = () => {
    if (audioEnabled) sound.playClick();
    setActiveArticle(null);
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
        style={{ maxWidth: '1020px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#f43f5e',
                boxShadow: '0 0 12px #f43f5e'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff', letterSpacing: '0.5px' }}>
                  CYBER CHRONICLES
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
                  {posts.length} Tech Articles & Guides
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Network Architecture, Routing Protocols & Systems Engineering Insights
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* View 1: Detailed Single Article View */}
        {activeArticle ? (
          <div
            className="modal-body"
            style={{
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            {/* Top Navigation & Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <button
                onClick={handleBackToList}
                className="btn-cyber"
                style={{
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-hud)',
                  borderColor: '#f43f5e',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowLeft size={14} color="#f43f5e" />
                Back to Chronicles
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} color="#f43f5e" />
                  {activeArticle.date}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} color="#38bdf8" />
                  {getEstimatedReadTime(activeArticle.fullContent, activeArticle.shortDesc)}
                </span>
              </div>
            </div>

            {/* Article Hero Banner */}
            <div
              className="glass-panel"
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                background: 'linear-gradient(180deg, rgba(244, 63, 94, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
                padding: '24px'
              }}
            >
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    background: 'rgba(244, 63, 94, 0.2)',
                    color: '#f43f5e',
                    border: '1px solid rgba(244, 63, 94, 0.5)',
                    fontWeight: 700,
                    fontFamily: 'var(--font-hud)',
                    letterSpacing: '0.5px'
                  }}
                >
                  {activeArticle.category}
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: '1.3',
                  marginBottom: '14px'
                }}
              >
                {activeArticle.title}
              </h1>

              {/* Author badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <img
                  src="https://res.cloudinary.com/dgomoujlo/image/upload/v1791035635/portfolio/profile/kaium_profile_portrait.jpg"
                  alt="MD. Kaium Hasan"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '2px solid #f43f5e',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
                    MD. Kaium Hasan
                  </div>
                  <div style={{ fontSize: '11px', color: '#38bdf8', fontFamily: 'var(--font-hud)' }}>
                    Network Engineer // CCNA Certified
                  </div>
                </div>
              </div>
            </div>

            {/* Article Image (if available) */}
            {activeArticle.imageUrl && (
              <div
                style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  maxHeight: '340px'
                }}
              >
                <img
                  src={activeArticle.imageUrl}
                  alt={activeArticle.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </div>
            )}

            {/* Article Content Render */}
            <div
              className="article-rich-body"
              style={{
                color: '#e2e8f0',
                fontSize: '15px',
                lineHeight: '1.75',
                fontFamily: 'var(--font-body)'
              }}
              dangerouslySetInnerHTML={{
                __html: activeArticle.fullContent || `<p>${activeArticle.shortDesc}</p>`
              }}
            />

            {/* Bottom Actions */}
            <div
              style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <button
                onClick={handleBackToList}
                className="btn-cyber"
                style={{ padding: '8px 16px', fontSize: '12px', borderColor: '#f43f5e' }}
              >
                <ArrowLeft size={14} color="#f43f5e" />
                Return to Articles
              </button>

              <a
                href="https://www.mdkaiumhasan.site"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cyber btn-cyber-primary"
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                <ExternalLink size={14} />
                Visit 2D Publication
              </a>
            </div>
          </div>
        ) : (
          /* View 2: Articles Grid with Category Filter */
          <>
            {/* Category Filter Tabs */}
            <div
              style={{
                padding: '12px 24px',
                background: 'rgba(15, 23, 42, 0.4)',
                borderBottom: '1px solid rgba(244, 63, 94, 0.2)',
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
                    background: selectedCategory === cat
                      ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.35) 0%, rgba(14, 165, 233, 0.25) 100%)'
                      : 'rgba(30, 41, 59, 0.5)',
                    border: `1px solid ${selectedCategory === cat ? '#f43f5e' : 'rgba(148, 163, 184, 0.2)'}`,
                    color: selectedCategory === cat ? '#ffffff' : '#94a3b8',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontFamily: 'var(--font-hud)',
                    fontWeight: 700,
                    letterSpacing: '0.4px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedCategory === cat ? '0 0 12px rgba(244, 63, 94, 0.4)' : 'none'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Articles Grid */}
            <div
              className="modal-body"
              style={{
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '20px'
              }}
            >
              {filteredPosts.map((post, idx) => (
                <div
                  key={idx}
                  onClick={() => handleOpenArticle(post)}
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
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
                  }}
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
                      {post.category}
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
                          overflow: 'hidden'
                        }}
                      >
                        {post.shortDesc.replace(/<[^>]*>/g, '')}
                      </p>
                    </div>

                    {/* Action Link */}
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
                      <span>READ ARTICLE</span>
                      <ArrowRight size={14} color="#f43f5e" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Embedded CSS for Rich Blog Articles */}
      <style>{`
        .article-rich-body h1, .article-rich-body h2, .article-rich-body h3 {
          font-family: var(--font-heading);
          color: #ffffff;
          margin-top: 1.4em;
          margin-bottom: 0.6em;
          letter-spacing: 0.3px;
        }
        .article-rich-body h1 {
          font-size: 22px;
          border-bottom: 1px solid rgba(244, 63, 94, 0.3);
          padding-bottom: 8px;
        }
        .article-rich-body h2 {
          font-size: 19px;
          color: #f43f5e;
        }
        .article-rich-body h3 {
          font-size: 17px;
          color: #38bdf8;
        }
        .article-rich-body p {
          margin-bottom: 1em;
          color: #cbd5e1;
        }
        .article-rich-body ul, .article-rich-body ol {
          margin-bottom: 1.2em;
          padding-left: 24px;
        }
        .article-rich-body li {
          margin-bottom: 0.4em;
          color: #cbd5e1;
        }
        .article-rich-body pre {
          background: rgba(10, 15, 30, 0.95) !important;
          border: 1px solid rgba(56, 189, 248, 0.25);
          border-left: 3px solid #38bdf8;
          border-radius: 8px;
          padding: 14px 18px;
          overflow-x: auto;
          font-family: 'Consolas', 'Courier New', monospace;
          font-size: 13.5px;
          color: #38bdf8;
          line-height: 1.55;
          margin: 1.2em 0;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
        }
        .article-rich-body code {
          background: rgba(244, 63, 94, 0.15);
          color: #f43f5e;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 13px;
          font-family: 'Consolas', 'Courier New', monospace;
          border: 1px solid rgba(244, 63, 94, 0.3);
        }
        .article-rich-body pre code {
          background: transparent;
          color: inherit;
          padding: 0;
          border: none;
        }
        .article-rich-body img {
          max-width: 100%;
          border-radius: 8px;
          margin: 16px auto;
          display: block;
          border: 1px solid rgba(244, 63, 94, 0.3);
        }
        .article-rich-body blockquote {
          border-left: 3px solid #f43f5e;
          padding-left: 14px;
          color: #94a3b8;
          font-style: italic;
          margin: 16px 0;
        }
      `}</style>
    </div>
  );
};
