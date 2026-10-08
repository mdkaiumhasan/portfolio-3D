import React, { useState, useRef, useMemo } from 'react';
import {
  BookOpenText,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  Upload,
  X,
  Image as ImageIcon,
  Filter,
  Search,
  ExternalLink,
  Linkedin,
  Tags,
  Link as LinkIcon
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
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newCatInput, setNewCatInput] = useState('');
  const [deleteCatName, setDeleteCatName] = useState<string | null>(null);

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

  // Active Categories
  const categories = useMemo(() => {
    const raw = (data.blog_categories && data.blog_categories.length > 0)
      ? data.blog_categories
      : ['Tutorial', 'Networking Guide', 'Network Architecture', 'Career & Certification'];
    return Array.from(new Set(raw));
  }, [data.blog_categories]);

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((item) => {
      const matchesCat =
        selectedFilter === 'All' ||
        (item.category || '').toLowerCase().trim() === selectedFilter.toLowerCase().trim();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.title || '').toLowerCase().includes(q) ||
        (item.shortDesc || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [posts, selectedFilter, searchQuery]);

  // Category Management Handlers
  const handleAddCategory = () => {
    const trimmed = newCatInput.trim();
    if (!trimmed) {
      onToast('Please enter a category name', 'warning');
      return;
    }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      onToast(`Category "${trimmed}" already exists`, 'warning');
      return;
    }

    onUpdate((prev) => ({
      ...prev,
      blog_categories: [...(prev.blog_categories || categories), trimmed]
    }));
    setNewCatInput('');
    onToast(`Added blog category "${trimmed}"`, 'success');
  };

  const handleRenameCategory = (oldName: string) => {
    const newName = prompt(`Enter new name for category "${oldName}":`, oldName);
    if (!newName || !newName.trim() || newName.trim() === oldName) return;
    const trimmed = newName.trim();

    onUpdate((prev) => {
      const updatedCats = (prev.blog_categories || categories).map((c) =>
        c === oldName ? trimmed : c
      );
      const updatedPosts = (prev.posts || []).map((p) =>
        p.category === oldName ? { ...p, category: trimmed } : p
      );
      return {
        ...prev,
        blog_categories: updatedCats,
        posts: updatedPosts
      };
    });

    if (selectedFilter === oldName) setSelectedFilter(trimmed);
    onToast(`Renamed category to "${trimmed}"`, 'success');
  };

  const handleConfirmDeleteCat = () => {
    if (!deleteCatName) return;
    if (categories.length <= 1) {
      onToast('You must keep at least one category', 'warning');
      setDeleteCatName(null);
      return;
    }

    const fallback = categories.find((c) => c !== deleteCatName) || 'Tutorial';

    onUpdate((prev) => {
      const updatedCats = (prev.blog_categories || categories).filter((c) => c !== deleteCatName);
      const updatedPosts = (prev.posts || []).map((p) =>
        p.category === deleteCatName ? { ...p, category: fallback } : p
      );
      return {
        ...prev,
        blog_categories: updatedCats,
        posts: updatedPosts
      };
    });

    if (selectedFilter === deleteCatName) setSelectedFilter('All');
    setDeleteCatName(null);
    onToast(`Removed category "${deleteCatName}"`, 'info');
  };

  // Article Edit Handlers
  const handleOpenAdd = () => {
    setEditingIndex(-1);
    setEditingDraft({
      title: '',
      category: selectedFilter !== 'All' ? selectedFilter : (categories[0] || 'Tutorial'),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      shortDesc: '',
      fullContent: '<p>Technical post overview and key highlights...</p>',
      imageUrl: 'https://res.cloudinary.com/dgomoujlo/image/upload/v1791035648/portfolio/blogs/vnt9j0szpfibfzqsayhl.jpg',
      link: 'https://www.linkedin.com/in/md-kaium-hasan-bb6009372/'
    });
  };

  const handleOpenEdit = (index: number) => {
    // Find absolute index in data.posts
    const targetItem = filteredPosts[index];
    const absIndex = posts.findIndex((p) => p === targetItem);
    setEditingIndex(absIndex !== -1 ? absIndex : index);
    setEditingDraft({ ...(targetItem || posts[index]) });
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
      const prompt = `Write an authoritative, educational technical blog article for a certified Network Engineer & Systems Developer's portfolio. Topic: "${geminiTopic}". Generate JSON with: title (string), category (string like Tutorial, Network Security, System Design), shortDescription (string), fullContentHtml (string with HTML tags like p, h2, h3, ul, li).`;

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

      const assignedCategory = parsed.category || categories[0] || 'Tutorial';

      const newArticle: BlogPostItem = {
        title: parsed.title || geminiTopic,
        category: assignedCategory,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        shortDesc: parsed.shortDescription || parsed.shortDesc || '',
        fullContent: parsed.fullContentHtml || parsed.fullContent || '<p>Content...</p>',
        imageUrl: 'https://res.cloudinary.com/dgomoujlo/image/upload/v1791035648/portfolio/blogs/vnt9j0szpfibfzqsayhl.jpg',
        link: 'https://www.linkedin.com/in/md-kaium-hasan-bb6009372/'
      };

      onUpdate((prev) => {
        const existingCats = prev.blog_categories || categories;
        const updatedCats = existingCats.includes(assignedCategory)
          ? existingCats
          : [...existingCats, assignedCategory];

        return {
          ...prev,
          blog_categories: updatedCats,
          posts: [...(prev.posts || []), newArticle]
        };
      });

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
            Manage published articles, categories, and direct LinkedIn publication links.
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

      {/* Category Management Card */}
      <div className="admin-card p-5 sm:p-6 space-y-4 border-slate-800/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tags className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Blog Categories & Publishing Tracks
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {categories.length} {categories.length === 1 ? 'Category' : 'Categories'} configured
          </span>
        </div>

        {/* Categories Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const count = posts.filter((p) => (p.category || '').toLowerCase().trim() === cat.toLowerCase().trim()).length;
            return (
              <div
                key={cat}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-rose-500/30 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-200 truncate">{cat}</span>
                  <span className="text-[10px] font-semibold text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 shrink-0">
                    {count}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleRenameCategory(cat)}
                    className="p-1 text-slate-400 hover:text-rose-300 hover:bg-slate-800 rounded transition-colors"
                    title="Rename Category"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteCatName(cat)}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Category Form */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <input
            type="text"
            value={newCatInput}
            onChange={(e) => setNewCatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            placeholder="Add new blog category (e.g. Cisco Packet Tracer, Automation, Cyber Security)..."
            className="admin-input flex-1 text-xs"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="admin-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-rose-400" />
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setSelectedFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === 'All'
                ? 'bg-rose-500 text-white font-bold shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All ({posts.length})
          </button>
          {categories.map((cat) => {
            const count = posts.filter((p) => (p.category || '').toLowerCase().trim() === cat.toLowerCase().trim()).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedFilter === cat
                    ? 'bg-rose-500 text-white font-bold shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title..."
            className="admin-input pl-8 py-1.5 text-xs w-full"
          />
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPosts.map((item, index) => {
          const absIndex = posts.findIndex((p) => p === item);
          const hasLinkedIn = item.link && item.link.toLowerCase().includes('linkedin');
          const targetUrl = item.link && item.link.trim().length > 0 ? item.link.trim() : 'https://www.linkedin.com/in/md-kaium-hasan-bb6009372/';

          return (
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

                {/* LinkedIn Badge */}
                <div className="absolute top-3 right-3">
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#0a66c2]/90 hover:bg-[#0a66c2] text-white flex items-center gap-1 shadow-md transition-colors"
                  >
                    <Linkedin className="w-3 h-3" />
                    <span>LinkedIn Link</span>
                    <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                  </a>
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

                  {/* Configured LinkedIn Link Info */}
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Linkedin className="w-3.5 h-3.5 text-[#0a66c2] shrink-0" />
                      <span className="text-[11px] font-mono text-slate-300 truncate">
                        {item.link || 'Using default LinkedIn profile'}
                      </span>
                    </div>
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-slate-400 hover:text-rose-300 transition-colors shrink-0"
                      title="Test Link in New Tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Clicking on card in 3D/2D opens this link directly
                  </span>
                  <div className="flex items-center gap-2">
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
                      onClick={() => setDeleteIndex(absIndex !== -1 ? absIndex : index)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPosts.length === 0 && (
        <div className="p-16 text-center rounded-2xl bg-slate-950/40 border border-slate-800/80 text-slate-500 text-sm">
          No blog posts found for "{selectedFilter}". Click "New Article" to publish one.
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
                  placeholder="e.g. Access Control Lists (ACL) – Complete Practical Guide"
                  className="admin-input font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={editingDraft.category || categories[0]}
                  onChange={(e) =>
                    setEditingDraft((prev) => (prev ? { ...prev, category: e.target.value } : null))
                  }
                  className="admin-input"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LinkedIn Post URL / Article Link Input (User Requirement) */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-[#0a66c2]/40 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sky-400">
                  <Linkedin className="w-4 h-4 text-[#0a66c2]" />
                  <span>LinkedIn Post URL / Article Link</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Redirects directly on click (No modal popup)
                </span>
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={editingDraft.link || ''}
                  onChange={(e) =>
                    setEditingDraft((prev) => (prev ? { ...prev, link: e.target.value } : null))
                  }
                  placeholder="https://www.linkedin.com/posts/md-kaium-hasan-..."
                  className="admin-input pl-9 font-mono text-xs w-full"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                When visitors click on this blog card in 3D or 2D, they will immediately be taken to this LinkedIn publication.
              </p>
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
                    placeholder="https://res.cloudinary.com/..."
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
                Short Excerpt / Summary
              </label>
              <textarea
                rows={3}
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
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>AI Blog Generator (Gemini Flash)</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsGeminiModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Enter any technical topic (e.g. "BGP Peering vs OSPF", "Zero Trust Network Architecture", "GPON vs EPON").
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Topic or Title:</label>
              <input
                type="text"
                value={geminiTopic}
                onChange={(e) => setGeminiTopic(e.target.value)}
                placeholder="e.g. Multi-Area OSPF Configuration & LSA Types"
                className="admin-input text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsGeminiModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isGeneratingWithAI}
                onClick={handleGenerateAI}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isGeneratingWithAI ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {deleteCatName !== null && (
        <ConfirmModal
          isOpen={true}
          title={`Delete Category "${deleteCatName}"?`}
          message={`Are you sure you want to delete this category? Any articles under "${deleteCatName}" will automatically be reassigned to "${categories.find((c) => c !== deleteCatName) || 'Tutorial'}".`}
          confirmText="Delete Category"
          confirmVariant="danger"
          onConfirm={handleConfirmDeleteCat}
          onCancel={() => setDeleteCatName(null)}
        />
      )}

      {/* Delete Article Modal */}
      {deleteIndex !== null && (
        <ConfirmModal
          isOpen={true}
          title="Delete Article"
          message={`Are you sure you want to delete "${posts[deleteIndex]?.title || 'this article'}"?`}
          confirmText="Delete Article"
          confirmVariant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteIndex(null)}
        />
      )}
    </div>
  );
};
