import React, { useState, useRef } from 'react';
import {
  FolderGit2,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Github,
  Search,
  Filter,
  LayoutGrid,
  List,
  Upload,
  X,
  Sparkles,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { PortfolioData, ProjectItem } from '../../types';
import { ConfirmModal } from '../ConfirmModal';
import { uploadImageToCloudinary } from '../../api';

interface ProjectsViewProps {
  data: PortfolioData;
  onUpdate: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ data, onUpdate, onToast }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [newCatInput, setNewCatInput] = useState<string>('');
  const [deleteCatName, setDeleteCatName] = useState<string | null>(null);
  const [deleteProjectIndex, setDeleteProjectIndex] = useState<number | null>(null);

  // Project Editor Modal State
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // -1 for new project
  const [editingDraft, setEditingDraft] = useState<ProjectItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = data.project_categories || [
    'Networking & Security',
    'Mobile & Realtime',
    'Robotics & Hardware',
    'AI & Machine Learning'
  ];

  const projects = data.projects || [];

  // Filter projects
  const filteredProjects = projects.filter((item) => {
    const matchesCategory = selectedFilter === 'All' || item.category === selectedFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.technology || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.role || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Add Category
  const handleAddCategory = () => {
    const trimmed = newCatInput.trim();
    if (!trimmed) {
      onToast('Please enter category name', 'warning');
      return;
    }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      onToast(`Category "${trimmed}" already exists`, 'warning');
      return;
    }

    onUpdate((prev) => ({
      ...prev,
      project_categories: [...(prev.project_categories || []), trimmed]
    }));
    setNewCatInput('');
    onToast(`Added project category "${trimmed}"`, 'success');
  };

  // Rename Category
  const handleRenameCategory = (oldName: string) => {
    const newName = prompt(`Enter new name for category "${oldName}":`, oldName);
    if (!newName || !newName.trim() || newName.trim() === oldName) return;
    const trimmed = newName.trim();

    onUpdate((prev) => {
      const updatedCats = (prev.project_categories || []).map((c) =>
        c === oldName ? trimmed : c
      );
      const updatedProjects = (prev.projects || []).map((p) =>
        p.category === oldName ? { ...p, category: trimmed } : p
      );
      return {
        ...prev,
        project_categories: updatedCats,
        projects: updatedProjects
      };
    });

    if (selectedFilter === oldName) setSelectedFilter(trimmed);
    onToast(`Renamed category to "${trimmed}"`, 'success');
  };

  // Delete Category
  const handleConfirmDeleteCat = () => {
    if (!deleteCatName) return;
    if (categories.length <= 1) {
      onToast('You must keep at least one category', 'warning');
      setDeleteCatName(null);
      return;
    }

    const fallback = categories.find((c) => c !== deleteCatName) || 'General';

    onUpdate((prev) => {
      const updatedCats = (prev.project_categories || []).filter((c) => c !== deleteCatName);
      const updatedProjects = (prev.projects || []).map((p) =>
        p.category === deleteCatName ? { ...p, category: fallback } : p
      );
      return {
        ...prev,
        project_categories: updatedCats,
        projects: updatedProjects
      };
    });

    if (selectedFilter === deleteCatName) setSelectedFilter('All');
    setDeleteCatName(null);
    onToast(`Removed category "${deleteCatName}"`, 'info');
  };

  // Open Editor Modal for New Project
  const handleOpenAddProject = () => {
    setEditingIndex(-1);
    setEditingDraft({
      title: '',
      category: selectedFilter !== 'All' ? selectedFilter : categories[0] || 'Networking & Security',
      role: 'Lead Engineer',
      technology: 'Cisco, OSPF, VLAN',
      imageUrl: '',
      live: 'https://',
      github: 'https://github.com/mdkaiumhasan',
      shortDesc: '',
      fullDetails: ''
    });
  };

  // Open Editor Modal for Existing Project
  const handleOpenEditProject = (index: number) => {
    setEditingIndex(index);
    setEditingDraft({ ...projects[index] });
  };

  // Save Modal Draft
  const handleSaveDraft = () => {
    if (!editingDraft) return;
    if (!editingDraft.title?.trim()) {
      onToast('Project title is required', 'warning');
      return;
    }

    onUpdate((prev) => {
      const updated = [...(prev.projects || [])];
      if (editingIndex === -1) {
        updated.push(editingDraft);
      } else if (editingIndex !== null) {
        updated[editingIndex] = editingDraft;
      }
      return { ...prev, projects: updated };
    });

    onToast(
      editingIndex === -1 ? 'Project added to showcase' : 'Project updated successfully',
      'success'
    );
    setEditingIndex(null);
    setEditingDraft(null);
  };

  // Handle Image Upload inside Modal
  const handleModalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setEditingDraft((prev) => (prev ? { ...prev, imageUrl: url } : null));
      onToast('Image uploaded to Cloudinary', 'success');
    } catch (err: any) {
      onToast(err.message || 'Image upload failed', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Confirm Delete Project
  const handleConfirmDeleteProject = () => {
    if (deleteProjectIndex === null) return;
    onUpdate((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((_, idx) => idx !== deleteProjectIndex)
    }));
    setDeleteProjectIndex(null);
    onToast('Project removed', 'info');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl">
      {/* Category Manager Bar */}
      <div className="admin-card p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Project Sections & Categories</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Filters interactive projects on the 3D row selector and 2D portfolio dropdown.
            </p>
          </div>

          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold self-start sm:self-auto">
            {categories.length} Categories Active
          </div>
        </div>

        {/* Categories Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const count = projects.filter((p) => p.category === cat).length;
            return (
              <div
                key={cat}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-200 truncate">{cat}</span>
                  <span className="text-[10px] font-semibold text-slate-500 px-1.5 py-0.5 rounded bg-slate-800 shrink-0">
                    {count}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleRenameCategory(cat)}
                    className="p-1 text-slate-400 hover:text-emerald-300 hover:bg-slate-800 rounded transition-colors"
                    title="Rename"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteCatName(cat)}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Category Form */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <input
            type="text"
            value={newCatInput}
            onChange={(e) => setNewCatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            placeholder="Type new section name (e.g. Cloud Architecture, Cyber Security)..."
            className="admin-input flex-1 text-xs"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Section</span>
          </button>
        </div>
      </div>

      {/* Projects Search, Filter & Layout Control Bar */}
      <div className="admin-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Section:
          </span>
          <button
            type="button"
            onClick={() => setSelectedFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedFilter === 'All'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All ({projects.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat} ({projects.filter((p) => p.category === cat).length})
            </button>
          ))}
        </div>

        {/* Right Tools: Search, View Mode Toggle, Add Project Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="admin-input pl-8 py-1.5 text-xs"
            />
          </div>

          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenAddProject}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Projects Display: Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((item) => {
            const realIndex = projects.indexOf(item);
            return (
              <div
                key={realIndex}
                className="admin-card overflow-hidden flex flex-col border-slate-800/90 hover:border-emerald-500/40 transition-all group"
              >
                {/* Image Banner */}
                <div className="relative h-44 bg-slate-950 border-b border-slate-800/80 overflow-hidden">
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
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-1">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-[10px]">No image assigned</span>
                    </div>
                  )}

                  {/* Category Pill Over Image */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/90 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                      {item.role || 'Contributor'}
                    </div>
                    <h4 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                      {item.title || 'Untitled Project'}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                      {item.shortDesc || 'No summary provided.'}
                    </p>
                  </div>

                  {/* Tech stack badges */}
                  {item.technology && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.technology.split(',').slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                      {item.technology.split(',').length > 3 && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400">
                          +{item.technology.split(',').length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.live && item.live !== '#' && (
                        <a
                          href={item.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                          title="View Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {item.github && item.github !== '#' && (
                        <a
                          href={item.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                          title="View GitHub Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditProject(realIndex)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteProjectIndex(realIndex)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete Project"
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
      )}

      {/* Projects Display: Table View */}
      {viewMode === 'table' && (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Section / Category</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Tech Stack</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProjects.map((item) => {
                  const realIndex = projects.indexOf(item);
                  return (
                    <tr key={realIndex} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <span className="truncate max-w-[200px]">{item.title}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[11px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{item.role || '—'}</td>
                      <td className="py-3.5 px-4 text-slate-400 truncate max-w-[200px]">
                        {item.technology || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditProject(realIndex)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteProjectIndex(realIndex)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="p-16 text-center rounded-2xl bg-slate-950/40 border border-slate-800/80 text-slate-500 text-sm">
          No projects found in this section.
        </div>
      )}

      {/* Project Drawer / Modal Editor */}
      {editingDraft !== null && (
        <div className="fixed inset-0 z-[9980] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-emerald-400" />
                  <span>
                    {editingIndex === -1 ? 'Add New Project' : `Edit Project: ${editingDraft.title || 'Untitled'}`}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set project specifications, media imagery, live demos, and technical writeups.
                </p>
              </div>

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

            {/* General Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={editingDraft.title || ''}
                  onChange={(e) =>
                    setEditingDraft((prev) => (prev ? { ...prev, title: e.target.value } : null))
                  }
                  placeholder="e.g. Enterprise Trading Floor Network"
                  className="admin-input font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Section / Category *
                </label>
                <select
                  value={editingDraft.category || categories[0]}
                  onChange={(e) =>
                    setEditingDraft((prev) => (prev ? { ...prev, category: e.target.value } : null))
                  }
                  className="admin-select font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Engineering Role
                </label>
                <input
                  type="text"
                  value={editingDraft.role || ''}
                  onChange={(e) =>
                    setEditingDraft((prev) => (prev ? { ...prev, role: e.target.value } : null))
                  }
                  placeholder="e.g. Network Architect & Administrator"
                  className="admin-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Technology Stack (Comma separated)
                </label>
                <input
                  type="text"
                  value={editingDraft.technology || ''}
                  onChange={(e) =>
                    setEditingDraft((prev) =>
                      prev ? { ...prev, technology: e.target.value } : null
                    )
                  }
                  placeholder="e.g. Cisco IOS, OSPF, VLAN, 802.1Q"
                  className="admin-input"
                />
              </div>
            </div>

            {/* Media & Image Upload */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Project Showcase Image
              </label>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-32 h-20 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                  {editingDraft.imageUrl ? (
                    <img
                      src={editingDraft.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
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
                    placeholder="https://... or upload below"
                    className="admin-input text-xs font-mono"
                  />

                  <div className="flex items-center gap-3">
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
                          <span>Uploading to Cloudinary...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Upload File to Cloudinary</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Live Demo URL
                </label>
                <input
                  type="text"
                  value={editingDraft.live || ''}
                  onChange={(e) =>
                    setEditingDraft((prev) => (prev ? { ...prev, live: e.target.value } : null))
                  }
                  placeholder="https://..."
                  className="admin-input font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  GitHub Repository URL
                </label>
                <input
                  type="text"
                  value={editingDraft.github || ''}
                  onChange={(e) =>
                    setEditingDraft((prev) => (prev ? { ...prev, github: e.target.value } : null))
                  }
                  placeholder="https://github.com/..."
                  className="admin-input font-mono text-xs"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Short Summary (Used in cards & previews)
                </label>
                <textarea
                  rows={2}
                  value={editingDraft.shortDesc || ''}
                  onChange={(e) =>
                    setEditingDraft((prev) =>
                      prev ? { ...prev, shortDesc: e.target.value } : null
                    )
                  }
                  placeholder="Brief summary of network architecture, throughput, resilience..."
                  className="admin-textarea text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Technical Details (HTML Allowed for lists, headers, specs)
                </label>
                <textarea
                  rows={5}
                  value={editingDraft.fullDetails || ''}
                  onChange={(e) =>
                    setEditingDraft((prev) =>
                      prev ? { ...prev, fullDetails: e.target.value } : null
                    )
                  }
                  placeholder="<h3>Specification Overview</h3><p>Details...</p><ul><li>600 hosts...</li></ul>"
                  className="admin-textarea font-mono text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setEditingIndex(null);
                  setEditingDraft(null);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                {editingIndex === -1 ? 'Add Project to Showcase' : 'Update Project Card'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Project Modal */}
      <ConfirmModal
        isOpen={deleteProjectIndex !== null}
        title="Delete Project"
        message={`Are you sure you want to delete project "${
          projects[deleteProjectIndex ?? 0]?.title || 'Untitled'
        }"?`}
        confirmText="Delete Project"
        confirmVariant="danger"
        onConfirm={handleConfirmDeleteProject}
        onCancel={() => setDeleteProjectIndex(null)}
      />

      {/* Delete Category Modal */}
      <ConfirmModal
        isOpen={deleteCatName !== null}
        title="Delete Category"
        message={`Delete category "${deleteCatName}"? All projects in this category will be reassigned to another active category.`}
        confirmText="Delete Category"
        confirmVariant="danger"
        onConfirm={handleConfirmDeleteCat}
        onCancel={() => setDeleteCatName(null)}
      />
    </div>
  );
};
