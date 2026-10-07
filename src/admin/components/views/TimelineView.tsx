import React, { useState, useRef } from 'react';
import {
  Network,
  Plus,
  Trash2,
  Calendar,
  Briefcase,
  Upload,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Image as ImageIcon
} from 'lucide-react';
import { PortfolioData, ExperienceItem } from '../../types';
import { ConfirmModal } from '../ConfirmModal';
import { uploadImageToCloudinary } from '../../api';

interface TimelineViewProps {
  data: PortfolioData;
  onUpdate: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ data, onUpdate, onToast }) => {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUploadIndexRef = useRef<number | null>(null);

  const experiences = data.experiences || [];

  const handleAdd = () => {
    const newItem: ExperienceItem = {
      title: 'Network Operations Engineer',
      date: 'Jan 2026 – Present',
      description: 'Describe core routing, switching, ISP queues, or server administration duties...',
      imageUrl: '/data/fullstack_dev_logo.svg'
    };
    onUpdate((prev) => ({
      ...prev,
      experiences: [...(prev.experiences || []), newItem]
    }));
    onToast('Added new experience milestone', 'success');
  };

  const handleChange = (index: number, field: keyof ExperienceItem, value: string) => {
    onUpdate((prev) => {
      const updated = [...(prev.experiences || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experiences: updated };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetIdx = activeUploadIndexRef.current;
    if (!file || targetIdx === null) return;

    setUploadingIndex(targetIdx);
    try {
      const url = await uploadImageToCloudinary(file);
      handleChange(targetIdx, 'imageUrl', url);
      onToast('Company badge uploaded to Cloudinary', 'success');
    } catch (err: any) {
      onToast(err.message || 'Image upload failed', 'error');
    } finally {
      setUploadingIndex(null);
      activeUploadIndexRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerUploadForIndex = (index: number) => {
    activeUploadIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const handleConfirmDelete = () => {
    if (deleteIndex === null) return;
    onUpdate((prev) => ({
      ...prev,
      experiences: (prev.experiences || []).filter((_, idx) => idx !== deleteIndex)
    }));
    setDeleteIndex(null);
    onToast('Experience milestone removed', 'info');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Top Header Card */}
      <div className="admin-card p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-400" />
            <span>Career Timeline & NOC Operations</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronizes with both the 2D Portfolio Timeline and the 3D Cyber NOC Interactive Workstation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-500 hover:bg-purple-400 text-slate-950 transition-all shadow-md shadow-purple-500/20 flex items-center gap-2 shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience Role</span>
        </button>
      </div>

      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Timeline Items List with Vertical Line */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-cyan-500 before:to-emerald-500">
        {experiences.map((item, index) => (
          <div key={index} className="relative group">
            {/* Timeline Glowing Node */}
            <div className="absolute -left-6 sm:-left-8 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-950 border-2 border-purple-400 shadow-md shadow-purple-500/40 group-hover:scale-125 transition-transform" />

            {/* Experience Card */}
            <div className="admin-card p-6 space-y-4 border-slate-800 hover:border-purple-500/30 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    Milestone #{index + 1}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteIndex(index)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
                  title="Delete Milestone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Date Range Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                    placeholder="e.g. Network Support Engineer – FNF Online (ISP)"
                    className="admin-input font-bold text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Date Range & Tenancy
                  </label>
                  <input
                    type="text"
                    value={item.date || ''}
                    onChange={(e) => handleChange(index, 'date', e.target.value)}
                    placeholder="e.g. Jan 2026 – Present"
                    className="admin-input font-semibold text-purple-300"
                  />
                </div>
              </div>

              {/* Company Logo / Badge Media */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Company Badge / Logo Image
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt="Badge"
                        className="w-full h-full object-cover rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-600" />
                    )}
                  </div>

                  <input
                    type="text"
                    value={item.imageUrl || ''}
                    onChange={(e) => handleChange(index, 'imageUrl', e.target.value)}
                    placeholder="Image URL or upload"
                    className="admin-input text-xs font-mono flex-1"
                  />

                  <button
                    type="button"
                    disabled={uploadingIndex === index}
                    onClick={() => triggerUploadForIndex(index)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {uploadingIndex === index ? (
                      <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-purple-400" />
                    )}
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Responsibilities & Technical Scope (HTML Allowed)
                </label>
                <textarea
                  rows={3}
                  value={item.description || ''}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  placeholder="Detail your network responsibilities, MikroTik/Cisco configs, etc."
                  className="admin-textarea text-xs leading-relaxed font-sans"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete Experience Role"
        message={`Are you sure you want to delete "${
          experiences[deleteIndex ?? 0]?.title || 'Untitled'
        }"?`}
        confirmText="Delete Role"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  );
};
