import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Trash2,
  Edit2,
  Filter,
  Search,
  CheckCircle2,
  Sliders,
  FolderPlus
} from 'lucide-react';
import { PortfolioData, SkillItem } from '../../types';
import { ConfirmModal } from '../ConfirmModal';

interface SkillsViewProps {
  data: PortfolioData;
  onUpdate: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({ data, onUpdate, onToast }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newCatInput, setNewCatInput] = useState<string>('');
  const [deleteSkillIndex, setDeleteSkillIndex] = useState<number | null>(null);
  const [deleteCatName, setDeleteCatName] = useState<string | null>(null);

  const categories = data.skill_categories || [
    'Network Engineering',
    'Security & Systems',
    'Programming & Software'
  ];

  const skills = data.skills || [];

  // Filter skills
  const filteredSkills = skills.filter((item) => {
    const matchesCategory = selectedFilter === 'All' || item.category === selectedFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      (item.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Add Category
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
      skill_categories: [...(prev.skill_categories || []), trimmed]
    }));
    setNewCatInput('');
    onToast(`Added skill category "${trimmed}"`, 'success');
  };

  // Rename Category
  const handleRenameCategory = (oldName: string) => {
    const newName = prompt(`Enter new name for category "${oldName}":`, oldName);
    if (!newName || !newName.trim() || newName.trim() === oldName) return;
    const trimmed = newName.trim();

    onUpdate((prev) => {
      const updatedCats = (prev.skill_categories || []).map((c) =>
        c === oldName ? trimmed : c
      );
      const updatedSkills = (prev.skills || []).map((s) =>
        s.category === oldName ? { ...s, category: trimmed } : s
      );
      return {
        ...prev,
        skill_categories: updatedCats,
        skills: updatedSkills
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
      const updatedCats = (prev.skill_categories || []).filter((c) => c !== deleteCatName);
      const updatedSkills = (prev.skills || []).map((s) =>
        s.category === deleteCatName ? { ...s, category: fallback } : s
      );
      return {
        ...prev,
        skill_categories: updatedCats,
        skills: updatedSkills
      };
    });

    if (selectedFilter === deleteCatName) setSelectedFilter('All');
    setDeleteCatName(null);
    onToast(`Removed category "${deleteCatName}"`, 'info');
  };

  // Add Skill
  const handleAddSkill = () => {
    const defaultCat =
      selectedFilter !== 'All' ? selectedFilter : categories[0] || 'Network Engineering';
    const newSkill: SkillItem = {
      name: 'NEW SKILL',
      percent: 85,
      category: defaultCat
    };

    onUpdate((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), newSkill]
    }));
    onToast('Added new skill', 'success');
  };

  // Update Skill
  const handleUpdateSkill = (realIndex: number, field: keyof SkillItem, value: any) => {
    onUpdate((prev) => {
      const updated = [...(prev.skills || [])];
      updated[realIndex] = { ...updated[realIndex], [field]: value };
      return { ...prev, skills: updated };
    });
  };

  // Delete Skill
  const handleConfirmDeleteSkill = () => {
    if (deleteSkillIndex === null) return;
    onUpdate((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((_, idx) => idx !== deleteSkillIndex)
    }));
    setDeleteSkillIndex(null);
    onToast('Skill removed', 'info');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Category Manager Card */}
      <div className="admin-card p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-cyan-400" />
              <span>Skill Matrix Categories</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Categories group skills on the 3D terminal nodes and 2D matrix. Renaming a category automatically updates all assigned skills.
            </p>
          </div>

          <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold self-start sm:self-auto">
            {categories.length} Categories Active
          </div>
        </div>

        {/* Category Chips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const count = skills.filter((s) => s.category === cat).length;
            return (
              <div
                key={cat}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-200 truncate">{cat}</span>
                  <span className="text-[10px] font-semibold text-slate-500 px-1.5 py-0.5 rounded bg-slate-800 shrink-0">
                    {count}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleRenameCategory(cat)}
                    className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
                    title="Rename Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
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
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <input
            type="text"
            value={newCatInput}
            onChange={(e) => setNewCatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            placeholder="Type new skill domain (e.g. Cloud & DevOps, Security Automation)..."
            className="admin-input flex-1 text-xs"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Skills List Section */}
      <div className="space-y-4">
        {/* Filter and Search Bar */}
        <div className="admin-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5" />
              Filter:
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
              All ({skills.length})
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
                {cat} ({skills.filter((s) => s.category === cat).length})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skill..."
                className="admin-input pl-8 py-1.5 text-xs"
              />
            </div>
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Skill</span>
            </button>
          </div>
        </div>

        {/* Skill Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSkills.map((item) => {
            const realIndex = skills.indexOf(item);
            return (
              <div
                key={realIndex}
                className="admin-card p-5 space-y-4 border-slate-800/90 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {item.category}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeleteSkillIndex(realIndex)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Delete Skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      value={item.name || ''}
                      onChange={(e) => handleUpdateSkill(realIndex, 'name', e.target.value)}
                      placeholder="e.g. ROUTING, PYTHON"
                      className="admin-input font-bold uppercase text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Category
                    </label>
                    <select
                      value={item.category || categories[0]}
                      onChange={(e) => handleUpdateSkill(realIndex, 'category', e.target.value)}
                      className="admin-select text-xs font-semibold"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Proficiency Slider & Bar */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">Proficiency Level</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {item.percent || 0}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={item.percent || 0}
                    onChange={(e) =>
                      handleUpdateSkill(realIndex, 'percent', parseInt(e.target.value) || 0)
                    }
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                  />

                  {/* Progress bar visual preview */}
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-200"
                      style={{ width: `${item.percent || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSkills.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-slate-950/40 border border-slate-800/80 text-slate-500 text-sm">
            No skills match your filter.
          </div>
        )}
      </div>

      {/* Delete Skill Modal */}
      <ConfirmModal
        isOpen={deleteSkillIndex !== null}
        title="Delete Skill"
        message={`Are you sure you want to remove skill "${
          skills[deleteSkillIndex ?? 0]?.name || 'Untitled'
        }"?`}
        confirmText="Delete Skill"
        confirmVariant="danger"
        onConfirm={handleConfirmDeleteSkill}
        onCancel={() => setDeleteSkillIndex(null)}
      />

      {/* Delete Category Modal */}
      <ConfirmModal
        isOpen={deleteCatName !== null}
        title="Delete Category"
        message={`Delete category "${deleteCatName}"? All skills inside will be reassigned to another active category.`}
        confirmText="Delete Category"
        confirmVariant="danger"
        onConfirm={handleConfirmDeleteCat}
        onCancel={() => setDeleteCatName(null)}
      />
    </div>
  );
};
