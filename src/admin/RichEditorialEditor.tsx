import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  CheckSquare,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Code,
  Minus,
  Sparkles,
  Maximize2,
  Minimize2,
  Columns,
  Eye,
  PenTool,
  RotateCcw,
  RotateCw,
  Copy,
  Check,
  Type,
  Sun,
  Moon,
  Coffee,
  HelpCircle,
  FileText,
  Clock,
  BookOpen,
  ShoppingBag,
  Info,
  Sliders,
  Sparkle,
  Wand2
} from 'lucide-react';
import { Product } from '../types';

interface RichEditorialEditorProps {
  value: string;
  onChange: (value: string) => void;
  title?: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  authorName?: string;
  products?: Product[];
  onInsertProductReference?: (product: Product) => void;
}

type EditorMode = 'split' | 'write' | 'preview';
type EditorFont = 'serif' | 'sans' | 'mono';
type EditorTheme = 'light' | 'parchment' | 'dark';

export const RichEditorialEditor: React.FC<RichEditorialEditorProps> = ({
  value,
  onChange,
  title = '',
  excerpt = '',
  coverImage = '',
  category = '',
  authorName = '',
  products = []
}) => {
  const [mode, setMode] = useState<EditorMode>('split');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [font, setFont] = useState<EditorFont>('serif');
  const [theme, setTheme] = useState<EditorTheme>('light');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [copiedQuote, setCopiedQuote] = useState(false);
  const [showProductEmbedModal, setShowProductEmbedModal] = useState(false);
  const [showSnippetMenu, setShowSnippetMenu] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Autosave simulation timestamp
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Calculate live statistics
  const stats = useMemo(() => {
    const text = value.trim();
    if (!text) {
      return { words: 0, chars: 0, readTime: '1 min', paragraphs: 0, sentences: 0 };
    }
    const words = text.split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const minutes = Math.max(1, Math.ceil(words / 190));
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    return {
      words,
      chars,
      readTime: `${minutes} min read`,
      paragraphs,
      sentences
    };
  }, [value]);

  // Insert formatting helper at cursor or wrap selection
  const insertFormatting = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const replacement = selectedText ? `${before}${selectedText}${after}` : `${before}${defaultText}${after}`;

    const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      const cursorTarget = selectedText
        ? start + before.length + selectedText.length + after.length
        : start + before.length;
      textarea.setSelectionRange(cursorTarget, cursorTarget + defaultText.length);
    }, 10);
  };

  // Keyboard shortcut handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      insertFormatting('**', '**', 'bold text');
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      insertFormatting('*', '*', 'italic text');
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      insertFormatting('[', '](https://)', 'link text');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2);
      }, 10);
    }
  };

  // Preset Editorial Snippets
  const insertSnippet = (type: 'manifesto' | 'material-spec' | 'callout' | 'interview' | 'table') => {
    let snippet = '';
    switch (type) {
      case 'manifesto':
        snippet = `\n\n> "In our atelier, true luxury is not the accumulation of ornament, but the ruthless elimination of the superfluous until only raw material integrity and geometry remain."\n> — Elena Rostova, Senior Material Architect\n\n`;
        break;
      case 'material-spec':
        snippet = `\n\n### Material Provenance & Technical Dossier\n\n| Specification | Origin & Treatment | Standard |\n| :--- | :--- | :--- |\n| **Base Alloy** | Grade 5 Damascus Titanium | ISO 5832-3 |\n| **Finish** | Micro-peened Matte Satin | Zero-reflection |\n| **Thermal Drift** | < 0.002% per 100°C | Cryogenic Grade |\n| **Provenance** | Kyoto Precision Forge | 100% Recyclable |\n\n`;
        break;
      case 'callout':
        snippet = `\n\n> **Curator's Note on Longevity:**\n> Each piece is designed for generational inheritance. Avoid harsh chemical solvents; a gentle wipe with an untreated microfiber cloth will preserve the subtle patina developed through daily tactile handling.\n\n`;
        break;
      case 'interview':
        snippet = `\n\n### Dialogue with the Master Craftsman\n\n**Q: What is the most delicate phase of shaping cold-forged titanium?**\n\n*Master Kenzo Takahashi:* "The moment the hydraulic press reaches 400 tons. If the grain boundary cools by even two degrees too quickly, the micro-crystalline structure fractures. Patience is everything."\n\n`;
        break;
      case 'table':
        snippet = `\n\n| Dimension / Metric | Atelier Prototype | Production Final |\n| :--- | :--- | :--- |\n| **Weight** | 142 grams | 128 grams |\n| **Tolerance** | ±0.05 mm | ±0.01 mm |\n| **Assembly Hours** | 18 hours | 24 hours |\n\n`;
        break;
    }
    insertFormatting(snippet, '', '');
    setShowSnippetMenu(false);
  };

  // Embed store product reference into text
  const handleEmbedProduct = (p: Product) => {
    const productEmbed = `\n\n> 🛍️ **Atelier Artifact Featured:** [${p.name} ($${p.price})](/product/${p.id})\n> *${p.description.slice(0, 100)}...*\n\n`;
    insertFormatting(productEmbed, '', '');
    setShowProductEmbedModal(false);
  };

  // Theme styles
  const themeStyles = {
    light: {
      container: 'bg-white text-zinc-900',
      toolbar: 'bg-zinc-50 border-zinc-200 text-zinc-700',
      textarea: 'bg-white text-zinc-900 border-zinc-200 placeholder-zinc-400 focus:bg-zinc-50/50',
      preview: 'bg-zinc-50/70 border-zinc-200 text-zinc-800',
      footer: 'bg-zinc-50 border-zinc-200 text-zinc-500'
    },
    parchment: {
      container: 'bg-[#fcf9f2] text-[#2c2419]',
      toolbar: 'bg-[#f4ebd9] border-[#e8dac0] text-[#423523]',
      textarea: 'bg-[#fcf9f2] text-[#2c2419] border-[#e8dac0] placeholder-[#a69680] focus:bg-[#faf5eb]',
      preview: 'bg-[#f6eee0] border-[#e8dac0] text-[#332a1c]',
      footer: 'bg-[#f4ebd9] border-[#e8dac0] text-[#63533e]'
    },
    dark: {
      container: 'bg-zinc-950 text-zinc-100',
      toolbar: 'bg-zinc-900 border-zinc-800 text-zinc-300',
      textarea: 'bg-zinc-950 text-zinc-100 border-zinc-800 placeholder-zinc-600 focus:bg-zinc-900/40',
      preview: 'bg-zinc-900/60 border-zinc-800 text-zinc-200',
      footer: 'bg-zinc-900 border-zinc-800 text-zinc-400'
    }
  }[theme];

  const fontClass = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono'
  }[font];

  // Helper to render markdown preview nicely
  const renderPreviewContent = (content: string) => {
    if (!content.trim()) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-zinc-400 italic py-16 space-y-2">
          <BookOpen className="w-8 h-8 opacity-40" />
          <p className="text-xs">Live rendered editorial story will appear here as you type...</p>
        </div>
      );
    }

    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl sm:text-2xl font-serif font-bold text-zinc-950 dark:text-white mt-8 mb-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base sm:text-lg font-serif font-bold text-zinc-900 dark:text-zinc-200 mt-6 mb-2">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-zinc-800 dark:text-zinc-300 mt-4 mb-1">
            {trimmed.replace('#### ', '')}
          </h4>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="my-4 p-4 rounded-xl border-l-4 border-amber-400 bg-amber-50/50 dark:bg-zinc-900/80 italic text-sm text-zinc-800 dark:text-zinc-300 font-serif leading-relaxed">
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        return (
          <li key={idx} className="ml-5 list-disc text-xs sm:text-sm my-1 text-zinc-700 dark:text-zinc-300">
            {trimmed.substring(2)}
          </li>
        );
      }
      if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ')) {
        return (
          <li key={idx} className="ml-5 list-decimal text-xs sm:text-sm my-1 text-zinc-700 dark:text-zinc-300">
            {trimmed.substring(3)}
          </li>
        );
      }
      if (trimmed.startsWith('---')) {
        return <hr key={idx} className="my-6 border-zinc-200 dark:border-zinc-800" />;
      }
      if (trimmed.length === 0) {
        return <div key={idx} className="h-3" />;
      }

      // Paragraph formatting
      return (
        <p key={idx} className="text-xs sm:text-sm leading-relaxed mb-3 text-zinc-700 dark:text-zinc-300">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div
      className={`rounded-2xl border flex flex-col transition-all overflow-hidden shadow-xs ${themeStyles.container} ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'w-full'
      }`}
    >
      {/* Top Controls Toolbar */}
      <div className={`p-2.5 border-b flex flex-wrap items-center justify-between gap-2 select-none ${themeStyles.toolbar}`}>
        {/* Left Formatting Tools */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings */}
          <div className="flex items-center bg-white/60 dark:bg-zinc-800/60 rounded-lg p-0.5 border border-zinc-200/60 dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => insertFormatting('\n## ', '', 'Section Heading')}
              title="Heading 2 (##)"
              className="px-2 py-1 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 rounded text-xs font-bold font-serif"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n### ', '', 'Subheading')}
              title="Heading 3 (###)"
              className="px-2 py-1 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 rounded text-xs font-semibold font-serif"
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n#### ', '', 'Minor Heading')}
              title="Heading 4 (####)"
              className="px-1.5 py-1 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 rounded text-[11px] font-medium"
            >
              H4
            </button>
          </div>

          <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-0.5" />

          {/* Inline Styles */}
          <div className="flex items-center bg-white/60 dark:bg-zinc-800/60 rounded-lg p-0.5 border border-zinc-200/60 dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => insertFormatting('**', '**', 'bold text')}
              title="Bold (Ctrl+B)"
              className="p-1.5 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 rounded"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*', '*', 'italic text')}
              title="Italic (Ctrl+I)"
              className="p-1.5 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 rounded"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('~~', '~~', 'strikethrough text')}
              title="Strikethrough"
              className="p-1.5 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 rounded"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-0.5" />

          {/* Blocks & Lists */}
          <div className="flex items-center bg-white/60 dark:bg-zinc-800/60 rounded-lg p-0.5 border border-zinc-200/60 dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => insertFormatting('\n> "', '"\n', 'Notable quote from the atelier.')}
              title="Pull Quote (>)"
              className="p-1.5 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 rounded"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n* ', '', 'Bullet point')}
              title="Bullet List (*)"
              className="p-1.5 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 rounded"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n1. ', '', 'Numbered item')}
              title="Numbered List (1.)"
              className="p-1.5 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 rounded"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n- [ ] ', '', 'Checklist task')}
              title="Task Checklist"
              className="p-1.5 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 rounded"
            >
              <CheckSquare className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('\n---\n')}
              title="Divider Line (---)"
              className="p-1.5 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 rounded"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 mx-0.5" />

          {/* Inserts: Link, Image, Table, Store Artifact */}
          <div className="flex items-center bg-white/60 dark:bg-zinc-800/60 rounded-lg p-0.5 border border-zinc-200/60 dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => insertFormatting('[', '](https://example.com)', 'Link Title')}
              title="Insert Link"
              className="p-1.5 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 rounded"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('![', '](https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200)', 'Image Description')}
              title="Insert Image"
              className="p-1.5 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 rounded"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('table')}
              title="Insert Markdown Table"
              className="p-1.5 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 rounded"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>

            {/* Artifact Embed Button */}
            {products.length > 0 && (
              <button
                type="button"
                onClick={() => setShowProductEmbedModal(true)}
                title="Embed Store Product Artifact"
                className="px-2 py-1 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded text-xs font-semibold flex items-center gap-1"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Artifact</span>
              </button>
            )}
          </div>

          {/* Editorial Snippets Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSnippetMenu(!showSnippetMenu)}
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
            >
              <Wand2 className="w-3 h-3" />
              <span>Snippets</span>
            </button>

            {showSnippetMenu && (
              <div className="absolute left-0 top-full mt-1.5 w-60 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-1.5 z-30 space-y-1">
                <button
                  type="button"
                  onClick={() => insertSnippet('manifesto')}
                  className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-200 font-medium"
                >
                  ✨ Atelier Manifesto Quote
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('material-spec')}
                  className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-200 font-medium"
                >
                  📐 Material Spec Sheet Table
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('callout')}
                  className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-200 font-medium"
                >
                  💡 Curator Care Callout Box
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet('interview')}
                  className="w-full text-left px-2.5 py-1.5 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-200 font-medium"
                >
                  🎙️ Artisan Dialogue Interview
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Editor Modes, Font, Theme & Fullscreen Controls */}
        <div className="flex items-center gap-2">
          {/* Typography Selector */}
          <div className="flex items-center bg-white/60 dark:bg-zinc-800/60 rounded-lg p-0.5 border border-zinc-200/60 dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => setFont(font === 'serif' ? 'sans' : font === 'sans' ? 'mono' : 'serif')}
              title={`Editor Font: ${font.toUpperCase()} (Click to toggle)`}
              className="px-2 py-1 text-xs font-bold hover:bg-zinc-200/70 dark:hover:bg-zinc-700 rounded flex items-center gap-1"
            >
              <Type className="w-3 h-3" />
              <span className="capitalize">{font}</span>
            </button>
          </div>

          {/* Theme switcher */}
          <div className="flex items-center bg-white/60 dark:bg-zinc-800/60 rounded-lg p-0.5 border border-zinc-200/60 dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'parchment' : theme === 'parchment' ? 'dark' : 'light')}
              title={`Theme: ${theme}`}
              className="p-1.5 hover:bg-zinc-200/70 dark:hover:bg-zinc-700 rounded"
            >
              {theme === 'light' ? (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              ) : theme === 'parchment' ? (
                <Coffee className="w-3.5 h-3.5 text-amber-700" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
              )}
            </button>
          </div>

          {/* View Modes (Split / Write / Preview) */}
          <div className="flex items-center bg-zinc-200/80 dark:bg-zinc-800 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode('write')}
              title="Editor Canvas Only"
              className={`p-1.5 rounded transition-all ${
                mode === 'write' ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setMode('split')}
              title="Synchronized Split View"
              className={`p-1.5 rounded transition-all ${
                mode === 'split' ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              title="Live Rendered View"
              className={`p-1.5 rounded transition-all ${
                mode === 'preview' ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white shadow-2xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zen Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Zen Mode (Esc)' : 'Zen Fullscreen Writing Studio'}
            className="p-1.5 bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className={`flex-1 grid ${mode === 'split' ? 'grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-zinc-800' : 'grid-cols-1'} ${
        isFullscreen ? 'h-[calc(100vh-85px)]' : 'min-h-[420px] max-h-[560px]'
      } overflow-hidden`}>
        {/* Editor Area (Shown in 'write' and 'split' modes) */}
        {mode !== 'preview' && (
          <div className="h-full flex flex-col p-4 overflow-hidden relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Begin composing your editorial monography or craft dispatch here... Use Markdown for titles, bold, quotes, and tables."
              className={`w-full h-full p-4 resize-none border rounded-xl focus:outline-none leading-relaxed transition-all ${fontClass} text-sm ${themeStyles.textarea}`}
              spellCheck={true}
            />
          </div>
        )}

        {/* Live Preview Area (Shown in 'preview' and 'split' modes) */}
        {mode !== 'write' && (
          <div className={`h-full overflow-y-auto p-6 sm:p-8 space-y-4 ${themeStyles.preview}`}>
            {/* Header simulated preview */}
            {(title || excerpt) && (
              <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800 space-y-2">
                {category && (
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                    {category}
                  </span>
                )}
                {title && (
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-zinc-950 dark:text-white leading-snug">
                    {title}
                  </h1>
                )}
                {excerpt && (
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 italic">
                    {excerpt}
                  </p>
                )}
                {authorName && (
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-400">
                    <span>By {authorName}</span>
                    <span>•</span>
                    <span>{stats.readTime}</span>
                  </div>
                )}
              </div>
            )}

            {/* Rendered markdown body */}
            <div className="prose prose-zinc max-w-none">
              {renderPreviewContent(value)}
            </div>
          </div>
        )}
      </div>

      {/* Live Editorial Metrics & Status Footer Bar */}
      <div className={`px-4 py-2 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${themeStyles.footer}`}>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-200">
            <FileText className="w-3 h-3 text-amber-500" />
            {stats.words.toLocaleString()} words
          </span>
          <span className="text-zinc-400 hidden sm:inline">
            {stats.chars.toLocaleString()} characters
          </span>
          <span className="flex items-center gap-1 text-zinc-500">
            <Clock className="w-3 h-3 text-zinc-400" />
            {stats.readTime}
          </span>
          <span className="text-zinc-400 hidden md:inline">
            {stats.paragraphs} paragraphs • {stats.sentences} sentences
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Auto-saved ({lastSavedTime})
          </span>

          <span className="text-zinc-400 hidden sm:inline">
            Press <kbd className="px-1 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded font-mono text-[10px]">Ctrl+B</kbd> Bold, <kbd className="px-1 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded font-mono text-[10px]">Ctrl+I</kbd> Italic
          </span>
        </div>
      </div>

      {/* Artifact Embed Modal */}
      {showProductEmbedModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-serif font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-500" />
                <span>Embed Atelier Artifact Reference</span>
              </h4>
              <button
                onClick={() => setShowProductEmbedModal(false)}
                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Select an item from the atelier catalog to insert a curated product card callout into your story.
            </p>

            <div className="max-h-60 overflow-y-auto space-y-2 p-1">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleEmbedProduct(p)}
                  className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-zinc-800/60 flex items-center gap-3 cursor-pointer transition-all group"
                >
                  <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white truncate group-hover:text-amber-700 dark:group-hover:text-amber-400">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-mono">${p.price}</p>
                  </div>
                  <span className="text-[11px] text-amber-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Embed →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
