import React, { useState } from 'react';
import {
  Mail,
  Share2,
  Plus,
  Trash2,
  ExternalLink,
  MessageSquare,
  MapPin,
  Phone,
  Globe,
  Languages
} from 'lucide-react';
import { PortfolioData, ContactDetailItem, SocialLinkItem } from '../../types';
import { ConfirmModal } from '../ConfirmModal';

interface ContactInboxViewProps {
  data: PortfolioData;
  onUpdate: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const ContactInboxView: React.FC<ContactInboxViewProps> = ({
  data,
  onUpdate,
  onToast
}) => {
  const [deleteDetailIdx, setDeleteDetailIdx] = useState<number | null>(null);
  const [deleteSocialIdx, setDeleteSocialIdx] = useState<number | null>(null);

  const contactDetails = data.contactDetails || [];
  const socialLinks = data.socialLinks || [];

  // Add Contact Detail
  const handleAddDetail = () => {
    const newItem: ContactDetailItem = {
      type: 'Location',
      value: 'Dhaka, Bangladesh'
    };
    onUpdate((prev) => ({
      ...prev,
      contactDetails: [...(prev.contactDetails || []), newItem]
    }));
    onToast('Added contact detail row', 'success');
  };

  const handleUpdateDetail = (index: number, field: keyof ContactDetailItem, value: string) => {
    onUpdate((prev) => {
      const updated = [...(prev.contactDetails || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, contactDetails: updated };
    });
  };

  const handleConfirmDeleteDetail = () => {
    if (deleteDetailIdx === null) return;
    onUpdate((prev) => ({
      ...prev,
      contactDetails: (prev.contactDetails || []).filter((_, i) => i !== deleteDetailIdx)
    }));
    setDeleteDetailIdx(null);
    onToast('Contact detail removed', 'info');
  };

  // Add Social Link
  const handleAddSocial = () => {
    const newItem: SocialLinkItem = {
      platform: 'github',
      url: 'https://github.com/'
    };
    onUpdate((prev) => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), newItem]
    }));
    onToast('Added social link row', 'success');
  };

  const handleUpdateSocial = (index: number, field: keyof SocialLinkItem, value: string) => {
    onUpdate((prev) => {
      const updated = [...(prev.socialLinks || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, socialLinks: updated };
    });
  };

  const handleConfirmDeleteSocial = () => {
    if (deleteSocialIdx === null) return;
    onUpdate((prev) => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).filter((_, i) => i !== deleteSocialIdx)
    }));
    setDeleteSocialIdx(null);
    onToast('Social link removed', 'info');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Contact Information & Copy Card */}
      <div className="admin-card p-6 sm:p-7 space-y-5">
        <div className="pb-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            <span>Contact Section & Direct Outreach</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Details shown in the contact modal, cyber terminal, and 2D classic page.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Contact Info Heading
            </label>
            <input
              type="text"
              value={data.contact_info_heading || ''}
              onChange={(e) =>
                onUpdate((prev) => ({ ...prev, contact_info_heading: e.target.value }))
              }
              placeholder="CONTACT ME HERE"
              className="admin-input font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              CV Link (Contact Section)
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.contact_cv_link || ''}
                onChange={(e) =>
                  onUpdate((prev) => ({ ...prev, contact_cv_link: e.target.value }))
                }
                placeholder="https://..."
                className="admin-input font-mono text-xs pr-10"
              />
              {data.contact_cv_link && data.contact_cv_link !== '#' && (
                <a
                  href={data.contact_cv_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-cyan-400"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Consultancy & Contact Narrative
          </label>
          <textarea
            rows={2}
            value={data.contact_info_text || ''}
            onChange={(e) =>
              onUpdate((prev) => ({ ...prev, contact_info_text: e.target.value }))
            }
            placeholder="For Network consultancy services, please get in touch..."
            className="admin-textarea text-xs leading-relaxed"
          />
        </div>
      </div>

      {/* Contact Details List */}
      <div className="admin-card p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Contact Channels & Location</span>
            </h3>
            <p className="text-xs text-slate-400">
              Public contact channels (Location, Email, Phone, Languages).
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddDetail}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Channel</span>
          </button>
        </div>

        <div className="space-y-3">
          {contactDetails.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80"
            >
              <div className="w-full sm:w-48">
                <input
                  type="text"
                  value={item.type || ''}
                  onChange={(e) => handleUpdateDetail(index, 'type', e.target.value)}
                  placeholder="e.g. Email, Location"
                  className="admin-input text-xs font-bold text-emerald-300"
                />
              </div>

              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={item.value || ''}
                  onChange={(e) => handleUpdateDetail(index, 'value', e.target.value)}
                  placeholder="e.g. mdkaiumhasan2005@gmail.com"
                  className="admin-input text-xs font-medium"
                />
              </div>

              <button
                type="button"
                onClick={() => setDeleteDetailIdx(index)}
                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer self-end sm:self-auto"
                title="Delete channel"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links List */}
      <div className="admin-card p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-400" />
              <span>Social Media & Professional Profiles</span>
            </h3>
            <p className="text-xs text-slate-400">
              Profiles linked across the navigation and modals (GitHub, LinkedIn, Facebook, Twitter).
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddSocial}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-500 hover:bg-purple-400 text-slate-950 transition-all shadow-md shadow-purple-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Social Profile</span>
          </button>
        </div>

        <div className="space-y-3">
          {socialLinks.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80"
            >
              <div className="w-full sm:w-48">
                <input
                  type="text"
                  value={item.platform || ''}
                  onChange={(e) => handleUpdateSocial(index, 'platform', e.target.value)}
                  placeholder="e.g. github, linkedin"
                  className="admin-input text-xs font-bold uppercase text-purple-300"
                />
              </div>

              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={item.url || ''}
                  onChange={(e) => handleUpdateSocial(index, 'url', e.target.value)}
                  placeholder="https://..."
                  className="admin-input text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-1 self-end sm:self-auto">
                {item.url && item.url !== '#' && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-purple-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Open link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setDeleteSocialIdx(index)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete social link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteDetailIdx !== null}
        title="Delete Contact Channel"
        message={`Remove ${contactDetails[deleteDetailIdx ?? 0]?.type || 'channel'}?`}
        confirmText="Remove Channel"
        confirmVariant="danger"
        onConfirm={handleConfirmDeleteDetail}
        onCancel={() => setDeleteDetailIdx(null)}
      />

      <ConfirmModal
        isOpen={deleteSocialIdx !== null}
        title="Delete Social Profile"
        message={`Remove ${socialLinks[deleteSocialIdx ?? 0]?.platform || 'profile'} link?`}
        confirmText="Remove Link"
        confirmVariant="danger"
        onConfirm={handleConfirmDeleteSocial}
        onCancel={() => setDeleteSocialIdx(null)}
      />
    </div>
  );
};
