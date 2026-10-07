import React, { useState, useRef } from 'react';
import {
  UserCheck,
  Upload,
  Link as LinkIcon,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { PortfolioData } from '../../types';
import { uploadImageToCloudinary } from '../../api';

interface HeroAboutViewProps {
  data: PortfolioData;
  onUpdate: (updater: (prev: PortfolioData) => PortfolioData) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const HeroAboutView: React.FC<HeroAboutViewProps> = ({ data, onUpdate, onToast }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleHeadingAccentWrap = () => {
    const current = data.home_heading || '';
    if (!current.includes('{{ACCENT}}')) {
      onUpdate((prev) => ({
        ...prev,
        home_heading: current.replace(/MD\. Kaium Hasan/i, '{{ACCENT}}MD. Kaium Hasan{{/ACCENT}}')
      }));
      onToast('Wrapped name in {{ACCENT}} highlight tag', 'info');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      onUpdate((prev) => ({
        ...prev,
        home_profile_image: uploadedUrl
      }));
      onToast('Profile image uploaded to Cloudinary successfully!', 'success');
    } catch (err: any) {
      onToast(err.message || 'Image upload failed', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Render preview of heading
  const previewHeading = (data.home_heading || '')
    .replace(/{{ACCENT}}(.*?){\/ACCENT}/g, '<span class="text-emerald-400 font-extrabold">$1</span>')
    .replace(/<span class="text-accent">(.*?)<\/span>/g, '<span class="text-emerald-400 font-extrabold">$1</span>');

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      {/* Home Hero Section */}
      <div className="admin-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Hero Headline & Tagline</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configures the main intro greeting displayed on both 3D HUD & 2D Classic portfolio.
            </p>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Live Headline Preview
          </div>
          <div
            className="text-lg sm:text-xl font-bold text-slate-200"
            dangerouslySetInnerHTML={{ __html: previewHeading || 'No headline set' }}
          />
          <div className="text-xs text-slate-400 italic">
            {data.home_subheading || 'No subheading set'}
          </div>
        </div>

        {/* Headline Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Hero Heading
            </label>
            <button
              type="button"
              onClick={handleHeadingAccentWrap}
              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              Wrap Name in {'{{ACCENT}}'}
            </button>
          </div>
          <input
            type="text"
            value={data.home_heading || ''}
            onChange={(e) =>
              onUpdate((prev) => ({ ...prev, home_heading: e.target.value }))
            }
            placeholder="Hi, I'm {{ACCENT}}MD. Kaium Hasan{{/ACCENT}}. A Network Engineer."
            className="admin-input font-medium"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            Tip: Use <code className="text-emerald-400 font-mono">{'{{ACCENT}}Text{{/ACCENT}}'}</code> to highlight words in neon emerald.
          </span>
        </div>

        {/* Subheading Textarea */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Subheading / Elevator Pitch
          </label>
          <textarea
            rows={3}
            value={data.home_subheading || ''}
            onChange={(e) =>
              onUpdate((prev) => ({ ...prev, home_subheading: e.target.value }))
            }
            placeholder="Describe your engineering role and passions..."
            className="admin-textarea leading-relaxed"
          />
          <div className="flex justify-end mt-1">
            <span className="text-[11px] text-slate-500">
              {(data.home_subheading || '').length} characters
            </span>
          </div>
        </div>

        {/* CV Link & Profile Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* CV Link */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              CV / Resume Download Link (Hero Section)
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.home_cv_link || ''}
                onChange={(e) =>
                  onUpdate((prev) => ({ ...prev, home_cv_link: e.target.value }))
                }
                placeholder="https://..."
                className="admin-input pr-10 font-mono text-xs"
              />
              {data.home_cv_link && data.home_cv_link !== '#' && (
                <a
                  href={data.home_cv_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-emerald-400"
                  title="Open Resume Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Profile Portrait Photo
            </label>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                {data.home_profile_image ? (
                  <img
                    src={data.home_profile_image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-600" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={data.home_profile_image || ''}
                  onChange={(e) =>
                    onUpdate((prev) => ({ ...prev, home_profile_image: e.target.value }))
                  }
                  placeholder="Image URL or Cloudinary Link"
                  className="admin-input text-xs font-mono"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <span className="w-3 h-3 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Upload Photo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Me Bio Section */}
      <div className="admin-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              <span>About Me Bio & Details</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              The detailed commercial experience narrative displayed in the About Modal.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Section Heading
          </label>
          <input
            type="text"
            value={data.about_info_heading || ''}
            onChange={(e) =>
              onUpdate((prev) => ({ ...prev, about_info_heading: e.target.value }))
            }
            placeholder="INFORMATION ABOUT ME"
            className="admin-input font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Biography & Professional Experience Text
          </label>
          <textarea
            rows={5}
            value={data.about_info_text || ''}
            onChange={(e) =>
              onUpdate((prev) => ({ ...prev, about_info_text: e.target.value }))
            }
            placeholder="Detail your engineering background, network design expertise..."
            className="admin-textarea leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            CV Download Link (About Section)
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.about_cv_link || ''}
              onChange={(e) =>
                onUpdate((prev) => ({ ...prev, about_cv_link: e.target.value }))
              }
              placeholder="https://..."
              className="admin-input pr-10 font-mono text-xs"
            />
            {data.about_cv_link && data.about_cv_link !== '#' && (
              <a
                href={data.about_cv_link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-cyan-400"
                title="Open Resume Link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
