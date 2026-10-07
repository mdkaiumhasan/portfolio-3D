import React, { useState, useEffect, useCallback } from 'react';
import {
  PortfolioData,
  AdminSection,
  ToastMessage
} from './types';
import {
  getAdminToken,
  removeAdminToken,
  fetchPortfolio,
  savePortfolio,
  fallbackPortfolioData
} from './api';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FloatingSaveBar } from './components/FloatingSaveBar';
import { ToastContainer } from './components/ToastContainer';
import { LoginModal } from './components/LoginModal';
import { ConfirmModal } from './components/ConfirmModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { HeroAboutView } from './components/views/HeroAboutView';
import { CertificationsView } from './components/views/CertificationsView';
import { SkillsView } from './components/views/SkillsView';
import { ProjectsView } from './components/views/ProjectsView';
import { TimelineView } from './components/views/TimelineView';
import { BlogsView } from './components/views/BlogsView';
import { ActivitiesView } from './components/views/ActivitiesView';
import { ContactInboxView } from './components/views/ContactInboxView';

import './styles/admin.css';

export const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getAdminToken());
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [data, setData] = useState<PortfolioData>(fallbackPortfolioData);
  const [originalData, setOriginalData] = useState<PortfolioData>(fallbackPortfolioData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState<boolean>(false);

  // Toast Helpers
  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Load Data on Startup
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetched = await fetchPortfolio();
      setData(fetched);
      setOriginalData(fetched);
      setHasUnsavedChanges(false);
    } catch (err: any) {
      addToast(`Error loading data: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  // Handle Updates to Data
  const handleDataUpdate = useCallback((updater: (prev: PortfolioData) => PortfolioData) => {
    setData((prev) => {
      const updated = updater(prev);
      setHasUnsavedChanges(true);
      return updated;
    });
  }, []);

  // Save All Changes to MongoDB
  const handleSaveAll = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const result = await savePortfolio(data);
      setOriginalData(data);
      setHasUnsavedChanges(false);
      addToast(result.message || 'All changes synced with MongoDB successfully!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to save changes to database', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [data, isSaving, addToast]);

  // Discard Unsaved Changes
  const handleDiscard = useCallback(() => {
    setData(originalData);
    setHasUnsavedChanges(false);
    setIsDiscardConfirmOpen(false);
    addToast('Unsaved changes discarded', 'info');
  }, [originalData, addToast]);

  // Global Keyboard Shortcut: Ctrl+S / Cmd+S to Save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveAll]);

  // Logout Handler
  const handleLogout = useCallback(() => {
    removeAdminToken();
    setIsAuthenticated(false);
    addToast('Signed out of executive console', 'info');
  }, [addToast]);

  if (!isAuthenticated) {
    return <LoginModal onSuccess={() => setIsAuthenticated(true)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070a12] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-xl shadow-emerald-500/20 mb-4 animate-pulse">
          <span className="w-6 h-6 border-3 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
        </div>
        <div className="text-sm font-bold text-slate-200">
          Connecting to MongoDB Cloud...
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Loading portfolio schema & media collections
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Sidebar Navigation */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={(sec) => setActiveSection(sec)}
        data={data}
        isOpenMobile={isOpenMobile}
        onCloseMobile={() => setIsOpenMobile(false)}
        onLogout={handleLogout}
      />

      {/* Main Workspace Frame */}
      <div className="md:ml-72 min-h-screen flex flex-col transition-all">
        {/* Top Navbar Header */}
        <Header
          activeSection={activeSection}
          onOpenMobileSidebar={() => setIsOpenMobile(true)}
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
          onSaveAll={handleSaveAll}
        />

        {/* View Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full pb-28">
          {activeSection === 'dashboard' && (
            <DashboardView
              data={data}
              onNavigate={(sec) => setActiveSection(sec)}
              onUpdate={handleDataUpdate}
            />
          )}

          {activeSection === 'hero-about' && (
            <HeroAboutView
              data={data}
              onUpdate={handleDataUpdate}
              onToast={addToast}
            />
          )}

          {activeSection === 'certifications' && (
            <CertificationsView
              data={data}
              onUpdate={handleDataUpdate}
              onToast={addToast}
            />
          )}

          {activeSection === 'skills' && (
            <SkillsView
              data={data}
              onUpdate={handleDataUpdate}
              onToast={addToast}
            />
          )}

          {activeSection === 'projects' && (
            <ProjectsView
              data={data}
              onUpdate={handleDataUpdate}
              onToast={addToast}
            />
          )}

          {activeSection === 'timeline' && (
            <TimelineView
              data={data}
              onUpdate={handleDataUpdate}
              onToast={addToast}
            />
          )}

          {activeSection === 'blogs' && (
            <BlogsView
              data={data}
              onUpdate={handleDataUpdate}
              onToast={addToast}
            />
          )}

          {activeSection === 'activities' && (
            <ActivitiesView
              data={data}
              onUpdate={handleDataUpdate}
              onToast={addToast}
            />
          )}

          {activeSection === 'contact-inbox' && (
            <ContactInboxView
              data={data}
              onUpdate={handleDataUpdate}
              onToast={addToast}
            />
          )}
        </main>
      </div>

      {/* Floating Bottom Bar when Changes are Unsaved */}
      <FloatingSaveBar
        isVisible={hasUnsavedChanges}
        isSaving={isSaving}
        onSave={handleSaveAll}
        onDiscard={() => setIsDiscardConfirmOpen(true)}
      />

      {/* Discard Confirmation Dialog */}
      <ConfirmModal
        isOpen={isDiscardConfirmOpen}
        title="Discard Unsaved Changes?"
        message="Are you sure you want to discard your edits? All modifications made since the last save will be reverted."
        confirmText="Yes, Discard Changes"
        confirmVariant="warning"
        onConfirm={handleDiscard}
        onCancel={() => setIsDiscardConfirmOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default AdminApp;
