import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  Check,
  Sparkles,
  User as UserIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  RefreshCw,
  Trash2
} from 'lucide-react';

export interface AvatarOption {
  id: string;
  url: string;
  name: string;
  category: 'portraits' | 'abstract' | 'minimalist';
}

export const PRESET_AVATARS: AvatarOption[] = [
  // Editorial & Executive Portraits
  {
    id: 'p1',
    name: 'Eleanor (Studio Light)',
    category: 'portraits',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'p2',
    name: 'Julian (Charcoal Tone)',
    category: 'portraits',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'p3',
    name: 'Sophia (Warm Studio)',
    category: 'portraits',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'p4',
    name: 'Marcus (Architectural)',
    category: 'portraits',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'p5',
    name: 'Aria (Editorial Chic)',
    category: 'portraits',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'p6',
    name: 'David (Minimal Grey)',
    category: 'portraits',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop'
  },

  // Abstract & Architectural Elements
  {
    id: 'a1',
    name: 'Obsidian Monolith',
    category: 'abstract',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'a2',
    name: 'Golden Prism',
    category: 'abstract',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'a3',
    name: 'Raw Concrete Flow',
    category: 'abstract',
    url: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'a4',
    name: 'Acoustic Waves Dark',
    category: 'abstract',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'a5',
    name: 'Titanium Iris',
    category: 'abstract',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'a6',
    name: 'Smoked Quartz',
    category: 'abstract',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=300&auto=format&fit=crop'
  },

  // Minimalist & Atelier Geometry
  {
    id: 'm1',
    name: 'Monogram Noir',
    category: 'minimalist',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'm2',
    name: 'Nordic Clean',
    category: 'minimalist',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'm3',
    name: 'Atelier Bronze',
    category: 'minimalist',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'm4',
    name: 'Architect Line',
    category: 'minimalist',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop'
  }
];

interface AvatarSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  userName?: string;
  onSave: (avatarUrl: string) => void;
}

export const AvatarSelectorModal: React.FC<AvatarSelectorModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  userName = 'User',
  onSave
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar || PRESET_AVATARS[0].url);
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'portraits' | 'abstract' | 'minimalist'>('all');
  const [customUrl, setCustomUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredPresets = categoryFilter === 'all'
    ? PRESET_AVATARS
    : PRESET_AVATARS.filter(p => p.category === categoryFilter);

  const handleFileChange = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP, GIF, SVG).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedAvatar(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleCustomUrlApply = () => {
    if (customUrl.trim()) {
      setSelectedAvatar(customUrl.trim());
      setCustomUrl('');
    }
  };

  const handleConfirm = () => {
    onSave(selectedAvatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-150 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-zinc-950">
                Choose Profile Photo
              </h2>
              <p className="text-xs text-zinc-500">
                Select from curated atelier avatars or upload from your device.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Preview Strip */}
        <div className="px-6 py-4 bg-zinc-950 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={selectedAvatar}
                alt="Active Preview"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md ring-4 ring-white/10"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/90 block">
                Selected Avatar Preview
              </span>
              <p className="text-xs font-serif font-bold text-zinc-100">{userName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedAvatar(PRESET_AVATARS[0].url)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Reset to default"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-200 px-6 pt-3 gap-2 bg-white">
          <button
            onClick={() => setActiveTab('presets')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'border-zinc-950 text-zinc-950'
                : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Presets</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-zinc-950 text-zinc-950'
                : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload from Device</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'url'
                ? 'border-zinc-950 text-zinc-950'
                : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Image URL</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: CURATED PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              {/* Filter Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'All Collections' },
                  { id: 'portraits', label: 'Studio Portraits' },
                  { id: 'abstract', label: 'Architectural / Noir' },
                  { id: 'minimalist', label: 'Monogram & Tone' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      categoryFilter === cat.id
                        ? 'bg-zinc-950 text-white shadow-2xs'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Grid of Presets */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-1">
                {filteredPresets.map((p) => {
                  const isSelected = selectedAvatar === p.url;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedAvatar(p.url)}
                      className={`group relative rounded-2xl overflow-hidden aspect-square border-2 transition-all text-left flex flex-col justify-end p-2 ${
                        isSelected
                          ? 'border-zinc-950 ring-3 ring-zinc-950/20 shadow-md scale-[1.02]'
                          : 'border-zinc-200 hover:border-zinc-400 hover:shadow-xs'
                      }`}
                    >
                      <img
                        src={p.url}
                        alt={p.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-zinc-950 text-white rounded-full flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}

                      <span className="relative z-10 text-[10px] font-bold text-white truncate drop-shadow-xs">
                        {p.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD FROM DEVICE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  dragActive
                    ? 'border-zinc-950 bg-zinc-100/80 scale-[1.01]'
                    : 'border-zinc-300 hover:border-zinc-500 bg-zinc-50/50 hover:bg-zinc-50'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-zinc-200 flex items-center justify-center text-zinc-700">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-serif font-bold text-zinc-950">
                    Click to select an image or drag & drop
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Supports high-resolution PNG, JPG, WEBP or SVG (Max 5MB)
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-zinc-950 text-white rounded-xl text-xs font-semibold hover:bg-zinc-850 shadow-xs"
                >
                  Browse Device Files
                </button>
              </div>

              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                  {uploadError}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: IMAGE URL */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                  Direct Image Link (HTTPS)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/your-avatar.jpg"
                    className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleCustomUrlApply}
                    className="px-4 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-semibold hover:bg-zinc-850"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1.5">
                  Paste any public direct image link from Unsplash, Gravatar, Imgur, etc.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-150 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply Profile Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
