import React, { useState, useRef } from 'react';
import {
  BookOpenText,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  Calendar,
  Upload,
  X,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { PortfolioData, BlogPostItem } from '../../types';
import { ConfirmModal } from '../ConfirmModal';
import { uploadImageToCloudinary } from '../../api';

interface BlogsViewProps {
  data: PortfolioData;
  onUpdate: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const BlogsView: React.FC<BlogsViewProps> = ({ data, onUpdate, onToast }) => {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // -1 for new
  const [editingDraft, setEditingDraft] = useState<BlogPostItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gemini AI Generator Modal State
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);
  const [geminiTopic, setGeminiTopic] = useState('');
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);

  const posts = data.posts || [];

  const handleOpenAdd = () => {
    setEditingIndex(-1);
    setEditingDraft({
      title: '',
      category: 'Tutorial',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      shortDesc: '',
      fullContent: '<p>Write your technical blog post content here...</p>',
      imageUrl: 'https://res.cloudinary.com/dgomoujlo/image/upload/v1791035648/portfolio/blogs/vnt9j0szpfibfzqsayhl.jpg'
    });
  };

  const handleOpenEdit = (index: number) => {
    setEditingIndex(index);
    setEditingDraft({ ...posts[index] });
  };

  const handleSaveDraft = () => {
    if (!editingDraft) return;
    if (!editingDraft.title?.trim()) {
      onToast('Article title is required', 'warning');
      return;
    }

    onUpdate((prev) => {
      const updated = [...(prev.posts || [])];
      if (editingIndex === -1) {
        updated.push(editingDraft);
      } else if (editingIndex !== null) {
        updated[editingIndex] = editingDraft;
      }
      return { ...prev, posts: updated };
    });

    onToast(editingIndex === -1 ? 'Article published' : 'Article updated', 'success');
    setEditingIndex(null);
    setEditingDraft(null);
  };

  const handleModalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setEditingDraft((prev) => (prev ? { ...prev, imageUrl: url } : null));
      onToast('Featured image uploaded to Cloudinary', 'success');
    } catch (err: any) {
      onToast(err.message || 'Image upload failed', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirmDelete = () => {
    if (deleteIndex === null) return;
    onUpdate((prev) => ({
      ...prev,
      posts: (prev.posts || []).filter((_, idx) => idx !== deleteIndex)
    }));
    setDeleteIndex(null);
    onToast('Article deleted', 'info');
  };

  // Generate with Gemini AI
  const handleGenerateAI = async () => {
    if (!geminiTopic.trim()) {
      onToast('Please enter a topic for the blog article', 'warning');
      return;
    }

    setIsGeneratingWithAI(true);
    try {
      const prompt = `Write an authoritative, educational technical blog article for a certified Network Engineer & Systems Developer's portfolio. Topic: "${geminiTopic}". Generate JSON with: title (string), category (string like Tutorial, Network Security, System Design), shortDescription (string), fullContentHtml (string with HTML tags like p, h2, h3, ul, li, pre, code).`;

      const GEMINI_API_KEY = "AIzaSyCz4AOJl9UbVE4Zb1-W9Nw_7Hi3FkC9eEc";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Gemini generation request error (status ${res.status})`);
      }

      const resData = await res.json();
      const rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) throw new Error('No content returned from AI');

      const parsed = JSON.parse(rawText);

      const newArticle: BlogPostItem = {
        title: parsed.title || geminiTopic,
        category: parsed.category || 'Tutorial',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        shortDesc: parsed.shortDescription || parsed.shortDesc || '',
        fullContent: parsed.fullContentHtml || parsed.fullContent || '<p>Content...</p>',
        imageUrl: 'https://res.cloudinary.com/dgomoujlo/image/upload/v1791035648/portfolio/blogs/vnt9j0szpfibfzqsayhl.jpg'
      };

      onUpdate((prev) => ({
        ...prev,
        posts: [...(prev.posts || []), newArticle]
      }));

      setIsGeminiModalOpen(false);
      setGeminiTopic('');
      onToast(`✨ Blog article generated: "${newArticle.title}"`, 'success');
    } catch (err: any) {
      console.error('Gemini error:', err);
      onToast(`AI generation failed: ${err.message}`, 'error');
    } finally {
      setIsGeneratingWithAI(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Top Header Card */}
      <div className="admin-card p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BookOpenText className="w-5 h-5 text-rose-400" />
            <span>Blog Articles & Technical Publications</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, edit, or autonomously generate educational guides and tutorials.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsGeminiModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white transition-all shadow-md shadow-purple-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>✨ Generate with AI</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-400 text-white transition-all shadow-md shadow-rose-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {posts.map((item, index) => (
          <div
            key={index}
            className="admin-card overflow-hidden flex flex-col border-slate-800/90 hover:border-rose-500/30 transition-all group"
          >
            {/* Banner preview */}
            <div className="relative h-40 bg-slate-950 overflow-hidden border-b border-slate-800">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}

              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/90 text-rose-300 border border-rose-500/30 backdrop-blur-md">
                  {item.category || 'Article'}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-950/80 text-slate-300">
                  {item.date || 'Recent'}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-base font-bold text-slate-100 group-hover:text-rose-300 transition-colors line-clamp-1">
                  {item.title || 'Untitled Post'}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {item.shortDesc || 'No excerpt provided.'}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(index)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-rose-400" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteIndex(index)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="p-16 text-center rounded-2xl bg-slate-950/40 border border-slate-800/80 text-slate-500 text-sm">
          No blog posts published yet. Click "Generate with AI" or "New Article" to start.
        </div>
      )}

      {/* Edit Blog Modal */}
      {editingDraft !== null && (
        <div className="fixed inset-0 z-[9980] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <BookOpenText className="w-5 h-5 text-rose-400" />
                <span>{editingIndex === -1 ? 'Write New Article' : 'Edit Article'}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingIndex(null);
                  setEditingDraft(null);
                }}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={editingDraft.title || ''}
                  onChange={(e) =>
                    setEditingDraft((prev) => (prev ? { ...prev, title: e.target.value } : null))
                  }
                  placeholder="e.g. Access Control Lists (ACL) – Complete Guide"
                  className="admin-input font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  value={editingDraft.category || ''}
                  onChange={(e) =>
                    setEditingDraft((prev) => (prev ? { ...prev, category: e.target.value } : null))
                  }
                  placeholder="e.g. Tutorial, Security"
                  className="admin-input"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Featured Cover Image
              </label>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-28 h-18 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                  {editingDraft.imageUrl ? (
                    <img
                      src={editingDraft.imageUrl}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-600" />
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <input
                    type="text"
                    value={editingDraft.imageUrl || ''}
                    onChange={(e) =>
                      setEditingDraft((prev) =>
                        prev ? { ...prev, imageUrl: e.target.value } : null
                      )
                    }
                    placeholder="https://..."
                    className="admin-input text-xs font-mono"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleModalImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <span className="w-3 h-3 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-rose-400" />
                        <span>Upload Cover Image</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Short Excerpt
              </label>
              <textarea
                rows={2}
                value={editingDraft.shortDesc || ''}
                onChange={(e) =>
                  setEditingDraft((prev) =>
                    prev ? { ...prev, shortDesc: e.target.value } : null
                  )
                }
                placeholder="Brief summary shown on blog preview cards..."
                className="admin-textarea text-xs leading-relaxed"
              />
            </div>

            {/* Full HTML Content */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Article Content (HTML Allowed)
              </label>
              <textarea
                rows={8}
                value={editingDraft.fullContent || ''}
                onChange={(e) =>
                  setEditingDraft((prev) =>
                    prev ? { ...prev, fullContent: e.target.value } : null
                  )
                }
                placeholder="<p>Write your detailed technical content...</p>"
                className="admin-textarea font-mono text-xs leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setEditingIndex(null);
                  setEditingDraft(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-md shadow-rose-900/30"
              >
                Save Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gemini AI Generator Modal */}
      {isGeminiModalOpen && (
        <div className="fixed inset-0 z-[9985] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-purple-950/50 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Generate Article with Gemini AI</span>
              </h3>
              <button
                type="button"
                disabled={isGeneratingWithAI}
                onClick={() => setIsGeminiModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Describe the engineering topic you want to publish. Gemini AI will generate a structured, production-ready tutorial complete with headings, technical walkthroughs, and code blocks.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Topic & Technical Scope
              </label>
              <textarea
                rows={4}
                value={geminiTopic}
                onChange={(e) => setGeminiTopic(e.target.value)}
                placeholder="e.g. Deep dive into MikroTik RouterOS BGP Peering with Route Filtering and Failover..."
                className="admin-textarea text-xs leading-relaxed"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                disabled={isGeneratingWithAI}
                onClick={() => setIsGeminiModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isGeneratingWithAI || !geminiTopic.trim()}
                onClick={handleGenerateAI}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-900/40 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingWithAI ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Generating with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Post Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${
          posts[deleteIndex ?? 0]?.title || 'Untitled'
        }"?`}
        confirmText="Delete Post"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  );
};
