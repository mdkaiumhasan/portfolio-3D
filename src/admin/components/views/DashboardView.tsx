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
  Mail,
  Briefcase
} from 'lucide-react';
import { AdminSection, PortfolioData } from '../../types';

interface DashboardViewProps {
  data: PortfolioData;
  inboxCount?: number;
  unreadInboxCount?: number;
  onNavigate: (section: AdminSection) => void;
  onUpdate: (updater: (prev: PortfolioData) => PortfolioData) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  inboxCount = 0,
  unreadInboxCount = 0,
  onNavigate,
  onUpdate
}) => {
  const toggleUnderConstruction = (
    key:
      | 'portfolio__showConstructionMessage'
      | 'timeline__showConstructionMessage'
      | 'blogs__showConstructionMessage'
  ) => {
    onUpdate((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleAvailableForWork = () => {
    onUpdate((prev) => ({
      ...prev,
      available_for_work: prev.available_for_work === false
    }));
  };

  const isAvailable = data.available_for_work !== false;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800/80 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-live" />
              Unified 2D + 3D Control Hub
            </div>
            {unreadInboxCount > 0 && (
              <button
                type="button"
                onClick={() => onNavigate('contact-inbox')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-500/25 transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                {unreadInboxCount} Unread {unreadInboxCount === 1 ? 'Message' : 'Messages'}
              </button>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Welcome, Kaium Hasan.
          </h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Every update saved here synchronizes immediately across both the 3D Cyberpunk Street World and the 2D Classic Portfolio.
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
            <button
              onClick={() => onNavigate('contact-inbox')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Direct Inbox ({inboxCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
            {data.project_categories?.length || 0} Active Categories
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
          <div className="text-xs font-semibold text-slate-400 mt-1">NOC & Experience</div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-purple-400/90 font-medium">
            Synced to 2D & 3D NOC
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
            Gemini Server Studio
          </div>
        </div>

        {/* Contact Inbox Card */}
        <div
          onClick={() => onNavigate('contact-inbox')}
          className="admin-card admin-card-interactive p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Mail className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
          </div>
          <div className="text-2xl font-black text-slate-100">{inboxCount}</div>
          <div className="text-xs font-semibold text-slate-400 mt-1">Direct Messages</div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-amber-400/90 font-medium">
            {unreadInboxCount > 0 ? `${unreadInboxCount} unread waiting` : 'All caught up'}
          </div>
        </div>
      </div>

      {/* Two Column Section: System Integrations & Visibility Toggles */}
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
                  <div className="text-[11px] text-slate-400">Collections: portfolio_content & contact_messages</div>
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
                  <div className="text-[11px] text-slate-400">Auto-optimization & WebP transformation (2D + 3D)</div>
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
                  <div className="text-xs font-bold text-slate-200">Server-Side Gemini AI Studio</div>
                  <div className="text-[11px] text-slate-400">Authenticated server endpoint (/api/generate-blog)</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-400 text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse-live" />
                Secured
              </span>
            </div>
          </div>
        </div>

        {/* Section Availability & Toggles */}
        <div className="admin-card p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ToggleRight className="w-5 h-5 text-cyan-400" />
            <span>Global Status & Section Visibility (2D + 3D)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Control work availability badges and "Under Construction" maintenance banners simultaneously across both 2D and 3D views.
          </p>

          <div className="space-y-3 pt-2">
            {/* Available for Work Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/25">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isAvailable
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">Available for Work Status</div>
                  <div className="text-[11px] text-slate-400">
                    {isAvailable
                      ? 'Showing "Available for Work" in 2D & 3D'
                      : 'Showing "Currently Engaged" in 2D & 3D'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleAvailableForWork}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  isAvailable ? 'text-emerald-400' : 'text-rose-400'
                }`}
                title="Toggle Work Availability"
              >
                {isAvailable ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>

            {/* Portfolio Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div>
                <div className="text-xs font-bold text-slate-200">Projects Under Construction Banner</div>
                <div className="text-[11px] text-slate-400">
                  {data.portfolio__showConstructionMessage
                    ? 'Maintenance notice shown in 2D & 3D Projects'
                    : 'Section is live and clean'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleUnderConstruction('portfolio__showConstructionMessage')}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  data.portfolio__showConstructionMessage ? 'text-amber-400' : 'text-slate-600'
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
                  {data.timeline__showConstructionMessage
                    ? 'Maintenance notice shown in 2D & 3D NOC'
                    : 'Section is live and clean'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleUnderConstruction('timeline__showConstructionMessage')}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  data.timeline__showConstructionMessage ? 'text-amber-400' : 'text-slate-600'
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
                  {data.blogs__showConstructionMessage
                    ? 'Maintenance notice shown in 2D & 3D Blogs'
                    : 'Section is live and clean'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleUnderConstruction('blogs__showConstructionMessage')}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  data.blogs__showConstructionMessage ? 'text-amber-400' : 'text-slate-600'
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
