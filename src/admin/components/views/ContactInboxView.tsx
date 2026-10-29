import React, { useState } from 'react';
import {
  Mail,
  Share2,
  Plus,
  Trash2,
  ExternalLink,
  Phone,
  Inbox,
  RefreshCw,
  CheckCheck,
  MailOpen,
  Reply,
  Clock
} from 'lucide-react';
import {
  PortfolioData,
  ContactDetailItem,
  SocialLinkItem,
  InboxMessageItem
} from '../../types';
import {
  updateInboxMessageStatus,
  deleteInboxMessage
} from '../../api';
import { ConfirmModal } from '../ConfirmModal';

interface ContactInboxViewProps {
  data: PortfolioData;
  messages?: InboxMessageItem[];
  isInboxLoading?: boolean;
  onRefreshInbox?: () => void;
  onMessagesChange?: React.Dispatch<React.SetStateAction<InboxMessageItem[]>>;
  onUpdate: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const ContactInboxView: React.FC<ContactInboxViewProps> = ({
  data,
  messages = [],
  isInboxLoading = false,
  onRefreshInbox,
  onMessagesChange,
  onUpdate,
  onToast
}) => {
  const [deleteDetailIdx, setDeleteDetailIdx] = useState<number | null>(null);
  const [deleteSocialIdx, setDeleteSocialIdx] = useState<number | null>(null);
  const [deleteMsgId, setDeleteMsgId] = useState<string | null>(null);
  const [inboxFilter, setInboxFilter] = useState<'all' | 'unread'>('all');

  const contactDetails = data.contactDetails || [];
  const socialLinks = data.socialLinks || [];
  const unreadCount = messages.filter((m) => !m.read).length;
  const filteredMessages = inboxFilter === 'unread' ? messages.filter((m) => !m.read) : messages;

  // Toggle Read/Unread
  const handleToggleRead = async (msg: InboxMessageItem) => {
    const nextRead = !msg.read;
    onMessagesChange?.((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, read: nextRead } : m))
    );
    try {
      await updateInboxMessageStatus({ id: msg.id, read: nextRead });
    } catch (err: any) {
      onToast(err.message || 'Failed to update message status', 'error');
      onRefreshInbox?.();
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    onMessagesChange?.((prev) => prev.map((m) => ({ ...m, read: true })));
    try {
      await updateInboxMessageStatus({ markAllRead: true });
      onToast('All inbox messages marked as read', 'success');
    } catch (err: any) {
      onToast(err.message || 'Failed to mark messages as read', 'error');
      onRefreshInbox?.();
    }
  };

  const handleConfirmDeleteMsg = async () => {
    if (!deleteMsgId) return;
    const targetId = deleteMsgId;
    setDeleteMsgId(null);
    onMessagesChange?.((prev) => prev.filter((m) => m.id !== targetId));
    try {
      await deleteInboxMessage({ id: targetId });
      onToast('Message deleted from inbox', 'info');
    } catch (err: any) {
      onToast(err.message || 'Failed to delete message', 'error');
      onRefreshInbox?.();
    }
  };

  const handleClearReadMessages = async () => {
    const hasRead = messages.some((m) => m.read);
    if (!hasRead) return;
    onMessagesChange?.((prev) => prev.filter((m) => !m.read));
    try {
      await deleteInboxMessage({ clearRead: true });
      onToast('Cleared all read messages', 'info');
    } catch (err: any) {
      onToast(err.message || 'Failed to clear read messages', 'error');
      onRefreshInbox?.();
    }
  };

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

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Direct Messages Inbox Card (2D + 3D Unified Submissions) */}
      <div className="admin-card p-6 sm:p-7 space-y-5 border-cyan-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <Inbox className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-slate-100">Direct Messages Inbox</h2>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Messages submitted from both the 3D Comm-Link terminal and 2D Classic contact form.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-950/80 border border-slate-800 p-1">
              <button
                type="button"
                onClick={() => setInboxFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  inboxFilter === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({messages.length})
              </button>
              <button
                type="button"
                onClick={() => setInboxFilter('unread')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  inboxFilter === 'unread'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Mark all unread messages as read"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mark All Read</span>
              </button>
            )}

            {messages.some((m) => m.read) && (
              <button
                type="button"
                onClick={handleClearReadMessages}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-rose-500/15 text-slate-300 hover:text-rose-300 border border-slate-700/60 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Read</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onRefreshInbox?.()}
              disabled={isInboxLoading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Inbox"
            >
              <RefreshCw className={`w-4 h-4 ${isInboxLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {filteredMessages.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-slate-950/50 border border-slate-800/80">
            <MailOpen className="w-8 h-8 text-slate-600 mx-auto mb-2.5" />
            <div className="text-sm font-semibold text-slate-300">
              {inboxFilter === 'unread' ? 'No unread messages' : 'Your portfolio inbox is empty'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Visitor inquiries from both 2D and 3D contact forms will appear here automatically.
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredMessages.map((msg) => {
              const replyHref = `mailto:${encodeURIComponent(msg.fromEmail)}?subject=${encodeURIComponent(
                `Re: ${msg.subject || 'Portfolio Inquiry'}`
              )}`;

              return (
                <div
                  key={msg.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                    msg.read
                      ? 'bg-slate-950/50 border-slate-800/80'
                      : 'bg-cyan-950/15 border-cyan-500/35 shadow-sm shadow-cyan-950/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {!msg.read && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 animate-pulse" />
                        )}
                        <span className="text-sm font-bold text-slate-100">{msg.fromName}</span>
                        <a
                          href={`mailto:${msg.fromEmail}`}
                          className="text-xs font-mono text-cyan-400 hover:underline truncate"
                        >
                          &lt;{msg.fromEmail}&gt;
                        </a>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            msg.source === '2d'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                          }`}
                        >
                          {msg.source === '2d' ? '2D Classic' : '3D World'}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-200">
                        Subject: <span className="text-slate-300">{msg.subject}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mr-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(msg.date)}
                      </span>
                      <a
                        href={replyHref}
                        onClick={() => {
                          if (!msg.read) handleToggleRead(msg);
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition-all inline-flex items-center gap-1"
                        title="Reply via Email"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleToggleRead(msg)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      >
                        {msg.read ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteMsgId(msg.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/70">
                    {msg.body}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contact Information & Copy Card */}
      <div className="admin-card p-6 sm:p-7 space-y-5">
        <div className="pb-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            <span>Contact Section & Direct Outreach</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Details shown in the 3D Comm-Link modal and 2D Classic contact section.
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
              CV Link (Contact Section — 2D & 3D)
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
              All rows dynamically sync to both 2D Classic and 3D Comm-Link.
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
              All platforms (GitHub, LinkedIn, Twitter/X, Facebook, Instagram, YouTube, Medium, Website) render dynamically in both 2D & 3D.
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
                  placeholder="e.g. github, linkedin, facebook"
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
        isOpen={deleteMsgId !== null}
        title="Delete Inbox Message"
        message="Are you sure you want to permanently delete this inquiry from MongoDB?"
        confirmText="Delete Message"
        confirmVariant="danger"
        onConfirm={handleConfirmDeleteMsg}
        onCancel={() => setDeleteMsgId(null)}
      />

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
