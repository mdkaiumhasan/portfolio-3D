import React from 'react';
import {
  Menu,
  CloudUpload,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Database,
  CloudLightning,
  Sparkles
} from 'lucide-react';
import { AdminSection } from '../types';

interface HeaderProps {
  activeSection: AdminSection;
  onOpenMobileSidebar: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onSaveAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onOpenMobileSidebar,
  hasUnsavedChanges,
  isSaving,
  onSaveAll
}) => {
  const sectionLabels: Record<AdminSection, string> = {
    dashboard: 'Control Hub & Overview',
    'hero-about': 'Hero Headline & Bio',
    certifications: 'Certifications & Stats',
    skills: 'Skills Matrix & Categories',
    projects: 'Projects & Work Showcase',
    timeline: 'Experience & NOC Operations',
    blogs: 'Blog Posts & Articles',
    activities: 'Extracurricular Activities',
    'contact-inbox': 'Contact Info & Inbox'
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#090d16]/90 border-b border-slate-800/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 md:ml-72 transition-all">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-1 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 md:hidden transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span className="text-slate-500 hidden sm:inline">Admin</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />
          <span className="text-slate-100 font-bold tracking-tight flex items-center gap-1.5">
            {sectionLabels[activeSection]}
          </span>
        </div>
      </div>

      {/* Right: Cloud status pill + Live link + Save All Changes button */}
      <div className="flex items-center gap-3">
        {/* System Health Indicators */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-950/60 border border-slate-800/80 px-3 py-1.5 rounded-full text-[11px] font-semibold text-slate-400">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>MongoDB</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-live" />
          <span className="text-slate-700">|</span>
          <CloudLightning className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cloudinary</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-live" />
        </div>

        {/* Live Site Link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition-all"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>

        {/* Primary Save All Button */}
        <button
          type="button"
          onClick={onSaveAll}
          disabled={isSaving}
          className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
            hasUnsavedChanges
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-900/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
          }`}
        >
          {isSaving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              {hasUnsavedChanges ? (
                <>
                  <CloudUpload className="w-3.5 h-3.5 text-slate-950" />
                  <span>Save All Changes</span>
                  <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse shrink-0" />
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>All Saved</span>
                </>
              )}
            </>
          )}

          {/* Keyboard shortcut hint */}
          <span
            className={`hidden md:inline text-[9px] px-1.5 py-0.5 rounded font-mono ${
              hasUnsavedChanges
                ? 'bg-slate-950/20 text-slate-900'
                : 'bg-slate-900 text-slate-400'
            }`}
          >
            Ctrl+S
          </span>
        </button>
      </div>
    </header>
  );
};
