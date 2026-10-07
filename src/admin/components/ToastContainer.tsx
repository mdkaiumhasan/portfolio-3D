import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let borderColor = 'border-emerald-500/40';
        let bgColor = 'bg-slate-900/95';
        let textColor = 'text-emerald-400';
        let Icon = CheckCircle2;

        if (toast.type === 'error') {
          borderColor = 'border-rose-500/40';
          textColor = 'text-rose-400';
          Icon = AlertCircle;
        } else if (toast.type === 'warning') {
          borderColor = 'border-amber-500/40';
          textColor = 'text-amber-400';
          Icon = AlertTriangle;
        } else if (toast.type === 'info') {
          borderColor = 'border-cyan-500/40';
          textColor = 'text-cyan-400';
          Icon = Info;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${borderColor} ${bgColor} backdrop-blur-md shadow-2xl shadow-black/60 transition-all transform animate-fade-in`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${textColor}`} />
            <div className="flex-1 text-sm text-slate-200 leading-snug">{toast.message}</div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
