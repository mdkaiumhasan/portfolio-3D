import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  Award,
  Cpu,
  FolderGit2,
  Network,
  BookOpenText,
  Trophy,
  Mail,
  ExternalLink,
  LogOut,
  Terminal,
  ChevronRight,
  Box,
  Compass
} from 'lucide-react';
import { AdminSection, PortfolioData } from '../types';

interface SidebarProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  data: PortfolioData;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  data,
  isOpenMobile,
  onCloseMobile,
  onLogout
}) => {
  const navItems = [
    {
      id: 'dashboard' as AdminSection,
      label: 'Control Hub',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'hero-about' as AdminSection,
      label: 'Home & Bio',
      icon: UserCheck,
      badge: null
    },
    {
      id: 'certifications' as AdminSection,
      label: 'Certifications',
      icon: Award,
      badge: data.stats?.length || 0
    },
    {
      id: 'skills' as AdminSection,
      label: 'Skills Matrix',
      icon: Cpu,
      badge: data.skills?.length || 0
    },
    {
      id: 'projects' as AdminSection,
      label: 'Projects & Categories',
      icon: FolderGit2,
      badge: data.projects?.length || 0
    },
    {
      id: 'timeline' as AdminSection,
      label: 'Timeline & NOC',
      icon: Network,
      badge: data.experiences?.length || 0
    },
    {
      id: 'blogs' as AdminSection,
      label: 'Blog Articles',
      icon: BookOpenText,
      badge: data.posts?.length || 0
    },
    {
      id: 'activities' as AdminSection,
      label: 'Activities & Robotics',
      icon: Trophy,
      badge: data.activities?.length || 0
    },
    {
      id: 'contact-inbox' as AdminSection,
      label: 'Contact & Messages',
      icon: Mail,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-[#090d16] border-r border-slate-800/90 flex flex-col z-50 transition-transform duration-300 ease-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-extrabold text-slate-100 tracking-tight truncate">
              MD. KAIUM HASAN
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-live" />
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                Admin Console
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Management Sections
          </div>

          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950/30 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.badge !== null && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-emerald-500/25 text-emerald-300'
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
              </button>
            );
          })}

          {/* Quick links to live portfolio */}
          <div className="pt-5 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Live Portfolios
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-cyan-300 hover:bg-slate-800/40 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Box className="w-4 h-4 text-cyan-400" />
              <span>Cyber 3D Portfolio</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-cyan-400" />
          </a>

          <a
            href="/classic.html"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-emerald-300 hover:bg-slate-800/40 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Classic 2D View</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-emerald-400" />
          </a>
        </div>

        {/* User Card & Sign out */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                KH
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-200 truncate">Kaium Hasan</div>
                <div className="text-[10px] text-emerald-400 font-medium">Super Admin</div>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
