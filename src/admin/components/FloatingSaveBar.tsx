import React from 'react';
import { AlertCircle, CloudUpload, RotateCcw } from 'lucide-react';

interface FloatingSaveBarProps {
  isVisible: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export const FloatingSaveBar: React.FC<FloatingSaveBarProps> = ({
  isVisible,
  isSaving,
  onSave,
  onDiscard
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up-floating max-w-xl w-[92%] sm:w-auto">
      <div className="bg-slate-900/95 border border-emerald-500/40 rounded-2xl px-5 py-3.5 backdrop-blur-xl shadow-2xl shadow-black/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-live shrink-0" />
          <div className="text-xs font-semibold text-slate-200">
            Unsaved changes detected. Remember to sync to MongoDB.
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            disabled={isSaving}
            onClick={onDiscard}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Discard</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={onSave}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4" />
                <span>Save All (Ctrl+S)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
