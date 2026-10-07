import React from 'react';
import {
  FolderGit2,
  Cpu,
  Network,
  BookOpenText,
  Database,
  CloudLightning,
  ShieldCheck,
  ArrowUpRight,
  Plus,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ExternalLink
} from 'lucide-react';
import { AdminSection, PortfolioData } from '../../types';

interface DashboardViewProps {
  data: PortfolioData;
  onNavigate: (section: AdminSection) => void;
  onUpdate: (updater: (prev: PortfolioData) => PortfolioData) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ data, onNavigate, onUpdate }) => {
  const toggleUnderConstruction = (key: 'portfolio__showConstructionMessage' | 'timeline__showConstructionMessage' | 'blogs__showConstructionMessage') => {
    onUpdate((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800/80 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-live" />
            Super Administrator Session Active
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Welcome, Kaium Hasan.
          </h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Manage your high-performance 3D interactive portfolio, 2D classic view, project showcases, network engineering credentials, and blog publications in real time.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('projects')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add / Manage Projects</span>
            </button>
            <button
              onClick={() => onNavigate('skills')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Manage Skills Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects Card */}
        <div
          onClick={() => onNavigate('projects')}
          className="admin-card admin-card-interactive p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="text-2xl font-black text-slate-100">{data.projects?.length || 0}</div>
          <div className="text-xs font-semibold text-slate-400 mt-1">Showcase Projects</div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-cyan-400/90 font-medium">
            {data.project_categories?.length || 0} Active Sections
          </div>
        </div>

        {/* Skills Card */}
        <div
          onClick={() => onNavigate('skills')}
          className="admin-card admin-card-interactive p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="text-2xl font-black text-slate-100">{data.skills?.length || 0}</div>
          <div className="text-xs font-semibold text-slate-400 mt-1">Technical Skills</div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400/90 font-medium">
            {data.skill_categories?.length || 0} Domain Categories
          </div>
        </div>

        {/* Timeline & NOC Card */}
        <div
          onClick={() => onNavigate('timeline')}
          className="admin-card admin-card-interactive p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Network className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors" />
          </div>
          <div className="text-2xl font-black text-slate-100">{data.experiences?.length || 0}</div>
          <div className="text-xs font-semibold text-slate-400 mt-1">NOC & Experience Milestones</div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-purple-400/90 font-medium">
            Synchronized with 3D NOC Station
          </div>
        </div>

        {/* Blog Articles Card */}
        <div
          onClick={() => onNavigate('blogs')}
          className="admin-card admin-card-interactive p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <BookOpenText className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-rose-400 transition-colors" />
          </div>
          <div className="text-2xl font-black text-slate-100">{data.posts?.length || 0}</div>
          <div className="text-xs font-semibold text-slate-400 mt-1">Published Articles</div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-rose-400/90 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Gemini AI Studio Ready
          </div>
        </div>
      </div>

      {/* Two Column Section: System Integrations & Under Construction Toggles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Integrations Health Card */}
        <div className="admin-card p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Infrastructure Health & Services</span>
          </h3>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">MongoDB Atlas Database</div>
                  <div className="text-[11px] text-slate-400">Main collection: portfolio_content</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-live" />
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <CloudLightning className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Cloudinary Asset Delivery</div>
                  <div className="text-[11px] text-slate-400">Auto-optimization & WebP transformation</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-live" />
                Ready
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Google Gemini AI Engine</div>
                  <div className="text-[11px] text-slate-400">Autonomous tech article generation</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-400 text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse-live" />
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Section Availability & Toggles */}
        <div className="admin-card p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ToggleRight className="w-5 h-5 text-cyan-400" />
            <span>Under Construction Modals & Visibility</span>
          </h3>
          <p className="text-xs text-slate-400">
            Control whether visitors see the "Under Construction" banner on individual portfolio tabs.
          </p>

          <div className="space-y-3 pt-2">
            {/* Portfolio Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div>
                <div className="text-xs font-bold text-slate-200">Projects Section Banner</div>
                <div className="text-[11px] text-slate-400">
                  {data.portfolio__showConstructionMessage ? 'Banner currently displayed' : 'Section is live and clean'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleUnderConstruction('portfolio__showConstructionMessage')}
                className={`p-1.5 rounded-xl transition-all ${
                  data.portfolio__showConstructionMessage ? 'text-emerald-400' : 'text-slate-600'
                }`}
              >
                {data.portfolio__showConstructionMessage ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Timeline Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div>
                <div className="text-xs font-bold text-slate-200">Timeline & NOC Banner</div>
                <div className="text-[11px] text-slate-400">
                  {data.timeline__showConstructionMessage ? 'Banner currently displayed' : 'Section is live and clean'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleUnderConstruction('timeline__showConstructionMessage')}
                className={`p-1.5 rounded-xl transition-all ${
                  data.timeline__showConstructionMessage ? 'text-emerald-400' : 'text-slate-600'
                }`}
              >
                {data.timeline__showConstructionMessage ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Blogs Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div>
                <div className="text-xs font-bold text-slate-200">Blog Posts Banner</div>
                <div className="text-[11px] text-slate-400">
                  {data.blogs__showConstructionMessage ? 'Banner currently displayed' : 'Section is live and clean'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleUnderConstruction('blogs__showConstructionMessage')}
                className={`p-1.5 rounded-xl transition-all ${
                  data.blogs__showConstructionMessage ? 'text-emerald-400' : 'text-slate-600'
                }`}
              >
                {data.blogs__showConstructionMessage ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
