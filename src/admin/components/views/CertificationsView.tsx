import React, { useState } from 'react';
import { Award, Plus, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PortfolioData, StatItem } from '../../types';
import { ConfirmModal } from '../ConfirmModal';

interface CertificationsViewProps {
  data: PortfolioData;
  onUpdate: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const CertificationsView: React.FC<CertificationsViewProps> = ({
  data,
  onUpdate,
  onToast
}) => {
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const stats = data.stats || [];

  const handleAdd = () => {
    const newItem: StatItem = {
      heading: 'NEW CERTIFICATION',
      description: 'CERTIFICATION ISSUING BODY & TITLE'
    };
    onUpdate((prev) => ({
      ...prev,
      stats: [...(prev.stats || []), newItem]
    }));
    onToast('Added new certification card', 'success');
  };

  const handleChange = (index: number, field: keyof StatItem, value: string) => {
    onUpdate((prev) => {
      const updated = [...(prev.stats || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, stats: updated };
    });
  };

  const handleConfirmDelete = () => {
    if (deleteIndex === null) return;
    onUpdate((prev) => ({
      ...prev,
      stats: (prev.stats || []).filter((_, idx) => idx !== deleteIndex)
    }));
    setDeleteIndex(null);
    onToast('Certification removed', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header bar */}
      <div className="admin-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Certifications & Key Stat Boxes</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Industry networking credentials and system administration competencies highlighted across the 3D world and modals.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
        </button>
      </div>

      {/* Grid of Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="admin-card p-5 space-y-3 relative group border-slate-800 hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Badge #{index + 1}
              </span>

              <button
                type="button"
                onClick={() => setDeleteIndex(index)}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                title="Delete Certification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Heading / Acronym
              </label>
              <input
                type="text"
                value={item.heading || ''}
                onChange={(e) => handleChange(index, 'heading', e.target.value)}
                placeholder="e.g. CCNA, MTCNA, LINUX"
                className="admin-input font-bold tracking-wide uppercase text-amber-300"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Description / Full Title
              </label>
              <textarea
                rows={2}
                value={item.description || ''}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                placeholder="e.g. CISCO CERTIFIED NETWORK ASSOCIATE"
                className="admin-textarea text-xs leading-relaxed"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteIndex !== null}
        title="Delete Certification"
        message={`Are you sure you want to delete badge #${(deleteIndex ?? 0) + 1} (${
          stats[deleteIndex ?? 0]?.heading || 'Untitled'
        })? This cannot be undone once saved.`}
        confirmText="Delete Badge"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteIndex(null)}
      />
    </div>
  );
};
