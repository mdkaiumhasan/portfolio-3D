import React, { useState, useRef } from 'react';
import { Trophy, Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { PortfolioData, ActivityItem } from '../../types';
import { ConfirmModal } from '../ConfirmModal';
import { uploadImageToCloudinary } from '../../api';

interface ActivitiesViewProps {
  data: PortfolioData;
  onUpdate: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({ data, onUpdate, onToast }) => {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeUploadIndexRef = useRef<number | null>(null);

  const activities = data.activities || [];

  const handleAdd = () => {
    const newItem: ActivityItem = {
      title: 'New Activity / Achievement',
      description: 'Describe the initiative, robotics exhibition, or competition...',
      imageUrl: 'https://res.cloudinary.com/dgomoujlo/image/upload/v1791035636/portfolio/activities/wh65cwweq8aswishk7cv.webp'
    };
    onUpdate((prev) => ({
      ...prev,
      activities: [...(prev.activities || []), newItem]
    }));
    onToast('Added new activity item', 'success');
  };

  const handleChange = (index: number, field: keyof ActivityItem, value: string) => {
    onUpdate((prev) => {
      const updated = [...(prev.activities || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, activities: updated };
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
      onToast('Activity photo uploaded to Cloudinary', 'success');
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
      activities: (prev.activities || []).filter((_, idx) => idx !== deleteIndex)
    }));
    setDeleteIndex(null);
    onToast('Activity removed', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div className="admin-card p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span>Extracurricular Activities & Robotics Exhibitions</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Showcases district exhibitions, robotics hardware projects, and leadership milestones.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-yellow-500 hover:bg-yellow-400 text-slate-950 transition-all shadow-md shadow-yellow-500/20 flex items-center gap-2 shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Activity</span>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {activities.map((item, index) => (
          <div
            key={index}
            className="admin-card p-5 space-y-4 border-slate-800 hover:border-yellow-500/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
                Activity #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => setDeleteIndex(index)}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                title="Delete Activity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Activity Title
              </label>
              <input
                type="text"
                value={item.title || ''}
                onChange={(e) => handleChange(index, 'title', e.target.value)}
                placeholder="e.g. District Science Exhibition - 2024"
                className="admin-input font-bold text-slate-100"
              />
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Photo / Document Image
              </label>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-600" />
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={item.imageUrl || ''}
                    onChange={(e) => handleChange(index, 'imageUrl', e.target.value)}
                    placeholder="Image URL"
                    className="admin-input text-xs font-mono"
                  />
                  <button
                    type="button"
                    disabled={uploadingIndex === index}
                    onClick={() => triggerUploadForIndex(index)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {uploadingIndex === index ? (
                      <span className="w-3 h-3 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-3 h-3 text-yellow-400" />
                    )}
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={item.description || ''}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                placeholder="Detail what was demonstrated or achieved..."
                className="admin-textarea text-xs leading-relaxed"
              />
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete Activity"
        message={`Are you sure you want to delete activity "${
          activities[deleteIndex ?? 0]?.title || 'Untitled'
        }"?`}
        confirmText="Delete Activity"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  );
};
