import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Heart,
  Share2,
  Bookmark,
  Check,
  Twitter,
  Mail,
  Copy,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Eye,
  ChevronLeft,
  ChevronRight,
  Send,
  User as UserIcon,
  Tag,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Sliders,
  Type,
  Sun,
  Moon,
  Coffee,
  Printer,
  ListOrdered,
  ThumbsUp,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { BlogPost, Product, StorefrontView } from '../types';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface BlogDetailPageProps {
  blogSlugOrId?: string;
  onNavigate: (view: StorefrontView, categoryId?: string, productId?: string, blogSlug?: string) => void;
  onQuickView?: (product: Product) => void;
}

type ReadingTheme = 'light' | 'sepia' | 'dark';
type FontSize = 'normal' | 'medium' | 'large';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({
  blogSlugOrId,
  onNavigate,
  onQuickView
}) => {
  const { blogs, products, likeBlogPost, addBlogComment, incrementBlogViews, formatPrice } = useStore();
  const { addItem, setIsCartOpen } = useCart();
  const { currentUser } = useAuth();

  const [hasLiked, setHasLiked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeTocId, setActiveTocId] = useState<string>('');

  // Reader Preferences
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>('light');
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [showTocDrawer, setShowTocDrawer] = useState(false);

  // Audio Narration State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioRate, setAudioRate] = useState<number>(1);
  const [audioProgress, setAudioProgress] = useState(0);

  // Bookmarks
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Comment state
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState(currentUser?.name || '');
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [commentLikes, setCommentLikes] = useState<Record<string, number>>({});

  // Find active post
  const post = useMemo(() => {
    if (!blogSlugOrId) return blogs[0];
    return blogs.find((b) => b.slug === blogSlugOrId || b.id === blogSlugOrId) || blogs[0];
  }, [blogs, blogSlugOrId]);

  // Sync bookmark state from localStorage
  useEffect(() => {
    if (!post?.id) return;
    try {
      const saved = localStorage.getItem('aura_journal_bookmarks');
      const list: string[] = saved ? JSON.parse(saved) : [];
      setIsBookmarked(list.includes(post.id));
    } catch {
      setIsBookmarked(false);
    }
  }, [post?.id]);

  const toggleBookmark = () => {
    if (!post?.id) return;
    try {
      const saved = localStorage.getItem('aura_journal_bookmarks');
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (list.includes(post.id)) {
        list = list.filter((id) => id !== post.id);
        setIsBookmarked(false);
      } else {
        list.push(post.id);
        setIsBookmarked(true);
      }
      localStorage.setItem('aura_journal_bookmarks', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  // Increment view count on mount
  useEffect(() => {
    if (post?.id) {
      incrementBlogViews(post.id);
    }
  }, [post?.id]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Reading progress scroll listener & active TOC observer
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadingProgress(progress);
      }

      // Check current visible heading for TOC
      const headings = document.querySelectorAll('h2[id], h3[id]');
      let currentId = '';
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 140) {
          currentId = heading.id;
        }
      });
      if (currentId) setActiveTocId(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Extract Table of Contents from content
  const tableOfContents: TocItem[] = useMemo(() => {
    if (!post?.content) return [];
    const lines = post.content.split('\n');
    const toc: TocItem[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ')) {
        const text = trimmed.replace('## ', '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        toc.push({ id, text, level: 2 });
      } else if (trimmed.startsWith('### ')) {
        const text = trimmed.replace('### ', '').trim();
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        toc.push({ id, text, level: 3 });
      }
    });

    return toc;
  }, [post?.content]);

  // Related products
  const relatedProducts = useMemo(() => {
    if (!post?.relatedProductIds || post.relatedProductIds.length === 0) return [];
    return products.filter((p) => post.relatedProductIds?.includes(p.id));
  }, [post, products]);

  // Next and Previous posts
  const { prevPost, nextPost } = useMemo(() => {
    const published = blogs.filter((b) => b.status === 'published');
    const currentIndex = published.findIndex((b) => b.id === post?.id);
    const prev = currentIndex > 0 ? published[currentIndex - 1] : null;
    const next = currentIndex < published.length - 1 ? published[currentIndex + 1] : null;
    return { prevPost: prev, nextPost: next };
  }, [blogs, post]);

  const handleLike = () => {
    if (post && !hasLiked) {
      likeBlogPost(post.id);
      setHasLiked(true);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Audio Speech Narration
  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech audio is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Prepare clean text without markdown symbols
    const cleanContent = post.content
      .replace(/##/g, '')
      .replace(/###/g, '')
      .replace(/>/g, 'Quote:')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '');

    const speechText = `${post.title}. An essay by ${post.author.name}, ${post.author.role}. ${post.excerpt}. ${cleanContent}`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = audioRate;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setAudioProgress(100);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentText.trim()) return;

    addBlogComment(post.id, {
      userName: authorName.trim() || 'Valued Reader',
      comment: commentText.trim(),
      userAvatar: currentUser?.avatar
    });

    setCommentText('');
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 4000);
  };

  const handleLikeComment = (commentId: string) => {
    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || 0) + 1
    }));
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1, {});
    setIsCartOpen(true);
  };

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setShowTocDrawer(false);
    }
  };

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-zinc-900">Article not found</h2>
        <p className="text-xs text-zinc-500">The requested editorial post does not exist or has been archived.</p>
        <button
          onClick={() => onNavigate('blog')}
          className="px-5 py-2.5 bg-zinc-950 text-white text-xs font-semibold rounded-xl"
        >
          Return to Journal
        </button>
      </div>
    );
  }

  // Theme Styling Classes
  const themeClasses = {
    light: 'bg-white text-zinc-900',
    sepia: 'bg-[#fbf7ee] text-[#332a1e]',
    dark: 'bg-[#121214] text-zinc-100'
  }[readingTheme];

  const contentTextSize = {
    normal: 'text-base leading-relaxed',
    medium: 'text-lg leading-loose',
    large: 'text-xl leading-loose'
  }[fontSize];

  // Render markdown helper
  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('## ')) {
        const title = trimmed.replace('## ', '');
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return (
          <h2
            key={index}
            id={id}
            className={`text-2xl sm:text-3xl font-serif font-bold mt-12 mb-4 tracking-tight leading-snug pt-4 border-t ${
              readingTheme === 'dark' ? 'border-zinc-800 text-white' : readingTheme === 'sepia' ? 'border-[#e8dfc9] text-[#2c2217]' : 'border-zinc-100 text-zinc-950'
            }`}
          >
            {title}
          </h2>
        );
      }

      if (trimmed.startsWith('### ')) {
        const title = trimmed.replace('### ', '');
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return (
          <h3
            key={index}
            id={id}
            className={`text-lg sm:text-xl font-serif font-semibold mt-8 mb-3 tracking-tight ${
              readingTheme === 'dark' ? 'text-zinc-200' : readingTheme === 'sepia' ? 'text-[#3e3223]' : 'text-zinc-900'
            }`}
          >
            {title}
          </h3>
        );
      }

      if (trimmed.startsWith('> ')) {
        const quoteText = trimmed.replace('> ', '');
        return (
          <div
            key={index}
            className={`my-8 p-6 rounded-2xl border-l-4 border-amber-500 relative group ${
              readingTheme === 'dark'
                ? 'bg-zinc-900/80 text-zinc-200'
                : readingTheme === 'sepia'
                ? 'bg-[#f4ebd6] text-[#3d3121]'
                : 'bg-zinc-50 text-zinc-800'
            }`}
          >
            <blockquote className="italic text-base sm:text-lg font-serif leading-relaxed">
              "{quoteText}"
            </blockquote>

            <div className="mt-3 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`"${quoteText}" — AURA Journal (${post.title})`);
                  alert('Quote copied to clipboard.');
                }}
                className="text-[11px] font-semibold text-amber-600 hover:text-amber-800 flex items-center gap-1"
              >
                <Copy className="w-3 h-3" /> Copy Quote
              </button>
            </div>
          </div>
        );
      }

      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        return (
          <li
            key={index}
            className={`ml-6 list-disc my-2 pl-1 ${contentTextSize} ${
              readingTheme === 'dark' ? 'text-zinc-300' : readingTheme === 'sepia' ? 'text-[#473b2d]' : 'text-zinc-700'
            }`}
          >
            {trimmed.substring(2)}
          </li>
        );
      }

      if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ')) {
        return (
          <li
            key={index}
            className={`ml-6 list-decimal my-2 pl-1 ${contentTextSize} ${
              readingTheme === 'dark' ? 'text-zinc-300' : readingTheme === 'sepia' ? 'text-[#473b2d]' : 'text-zinc-700'
            }`}
          >
            {trimmed.substring(3)}
          </li>
        );
      }

      if (trimmed.startsWith('```')) {
        return null;
      }

      if (trimmed.length === 0) {
        return <div key={index} className="h-4" />;
      }

      // Format bold/italic within standard paragraphs
      const parts = trimmed.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      return (
        <p
          key={index}
          className={`mb-5 font-serif sm:font-sans ${contentTextSize} ${
            readingTheme === 'dark' ? 'text-zinc-300' : readingTheme === 'sepia' ? 'text-[#473b2d]' : 'text-zinc-700'
          }`}
        >
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong
                  key={pIdx}
                  className={`font-semibold ${
                    readingTheme === 'dark' ? 'text-white' : readingTheme === 'sepia' ? 'text-[#241a10]' : 'text-zinc-950'
                  }`}
                >
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return <em key={pIdx} className="italic">{part.slice(1, -1)}</em>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-300 ${themeClasses}`}>
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-transparent z-50">
        <div
          className="h-full bg-amber-400 shadow-sm transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Floating Reader Control Bar (Sticky Dock) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-950/90 text-white backdrop-blur-md px-4 py-2.5 rounded-full shadow-2xl border border-zinc-800 flex items-center gap-3 sm:gap-4 max-w-[95vw]">
        {/* Audio Narration Trigger */}
        <button
          onClick={handleToggleAudio}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            isPlayingAudio
              ? 'bg-amber-400 text-zinc-950 animate-pulse shadow-md'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pause Narration</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Listen ({post.readTime})</span>
            </>
          )}
        </button>

        <div className="h-4 w-px bg-zinc-800" />

        {/* Font size control */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFontSize(fontSize === 'normal' ? 'medium' : fontSize === 'medium' ? 'large' : 'normal')}
            title="Adjust text size"
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-300 text-xs font-bold"
          >
            <span className="font-serif">Aa</span>
          </button>
        </div>

        {/* Theme mode switcher */}
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setReadingTheme(readingTheme === 'light' ? 'sepia' : readingTheme === 'sepia' ? 'dark' : 'light')
            }
            title="Reading atmosphere"
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-300"
          >
            {readingTheme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : readingTheme === 'sepia' ? (
              <Coffee className="w-4 h-4 text-amber-200" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>
        </div>

        {/* Table of contents popover on mobile */}
        {tableOfContents.length > 0 && (
          <button
            onClick={() => setShowTocDrawer(!showTocDrawer)}
            title="Index / Table of Contents"
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-300 lg:hidden"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        )}

        {/* Bookmark */}
        <button
          onClick={toggleBookmark}
          title={isBookmarked ? 'Saved in reading list' : 'Bookmark story'}
          className={`p-1.5 rounded-full transition-colors ${
            isBookmarked ? 'text-amber-400' : 'hover:bg-zinc-800 text-zinc-300'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
        </button>

        {/* Like */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 p-1.5 rounded-full transition-all ${
            hasLiked ? 'text-rose-400 scale-110' : 'hover:bg-zinc-800 text-zinc-300'
          }`}
        >
          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-400' : ''}`} />
          <span className="text-[11px] font-mono">{post.likes + (hasLiked ? 1 : 0)}</span>
        </button>

        <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          title="Copy dispatch link"
          className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-300 hidden sm:inline-flex"
        >
          {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>

        {/* Print */}
        <button
          onClick={handlePrint}
          title="Print / Archival PDF"
          className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-300 hidden md:inline-flex"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>

      {/* Top Header & Breadcrumbs */}
      <div className={`py-4 px-4 sm:px-6 lg:px-8 border-b ${
        readingTheme === 'dark' ? 'bg-zinc-950 border-zinc-800' : readingTheme === 'sepia' ? 'bg-[#f4ebd6] border-[#e8dfc9]' : 'bg-zinc-50 border-zinc-200/80'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('blog')}
            className={`inline-flex items-center gap-2 text-xs font-semibold transition-colors ${
              readingTheme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Journal</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span onClick={() => onNavigate('home')} className="hover:underline cursor-pointer">
              Atelier
            </span>
            <span>/</span>
            <span onClick={() => onNavigate('blog')} className="hover:underline cursor-pointer">
              Journal
            </span>
            <span>/</span>
            <span className="font-medium truncate max-w-[140px] sm:max-w-xs">
              {post.category}
            </span>
          </div>
        </div>
      </div>

      {/* Article Lead Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-amber-400/20 border border-amber-400/50 text-amber-900 dark:text-amber-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className="text-zinc-300">•</span>
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              {post.readTime}
            </span>
            {post.views && (
              <>
                <span className="text-zinc-300">•</span>
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-zinc-400" />
                  {post.views.toLocaleString()} reads
                </span>
              </>
            )}
          </div>

          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight leading-[1.15] ${
            readingTheme === 'dark' ? 'text-white' : readingTheme === 'sepia' ? 'text-[#271d11]' : 'text-zinc-950'
          }`}>
            {post.title}
          </h1>

          <p className={`text-base sm:text-xl font-light leading-relaxed ${
            readingTheme === 'dark' ? 'text-zinc-300' : readingTheme === 'sepia' ? 'text-[#4b3e2e]' : 'text-zinc-600'
          }`}>
            {post.excerpt}
          </p>
        </div>

        {/* Author Dossier & Social Share Controls */}
        <div className={`py-5 border-y flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          readingTheme === 'dark' ? 'border-zinc-800' : readingTheme === 'sepia' ? 'border-[#e8dfc9]' : 'border-zinc-200'
        }`}>
          <div className="flex items-center gap-3.5">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover border border-zinc-300 shadow-xs"
            />
            <div>
              <p className={`text-sm font-bold ${readingTheme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>
                {post.author.name}
              </p>
              <p className="text-xs text-zinc-400">{post.author.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Clap / Like button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                hasLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-600 scale-105'
                  : 'border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{post.likes + (hasLiked ? 1 : 0)} Applaud</span>
            </button>

            {/* Share to X */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Share on X"
            >
              <Twitter className="w-4 h-4" />
            </a>

            {/* Share by email */}
            <a
              href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Read this story from AURA Atelier: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
              className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Share via Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Cinematic Hero Cover Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="relative rounded-3xl overflow-hidden shadow-xl bg-zinc-900 max-h-[520px]">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover max-h-[520px]"
          />
        </div>
      </div>

      {/* Main Reading Canvas with Table of Contents Sidebar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Desktop Sticky Table of Contents */}
          {tableOfContents.length > 0 && (
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20 space-y-4 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                  <ListOrdered className="w-4 h-4 text-amber-500" />
                  <span>Monograph Index</span>
                </div>

                <nav className="space-y-1.5">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToHeading(item.id)}
                      className={`block text-left text-xs transition-all w-full truncate py-1 ${
                        item.level === 3 ? 'pl-3 text-[11px]' : 'font-medium'
                      } ${
                        activeTocId === item.id
                          ? 'text-amber-600 dark:text-amber-400 font-bold translate-x-1'
                          : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Core Essay Content */}
          <main className={tableOfContents.length > 0 ? 'lg:col-span-9 max-w-3xl' : 'lg:col-span-12 max-w-3xl mx-auto'}>
            <article className="prose prose-zinc max-w-none">
              {renderMarkdownContent(post.content)}
            </article>

            {/* Tags Footnote */}
            <div className={`mt-14 pt-6 border-t flex flex-wrap items-center gap-2 ${
              readingTheme === 'dark' ? 'border-zinc-800' : readingTheme === 'sepia' ? 'border-[#e8dfc9]' : 'border-zinc-200'
            }`}>
              <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1 mr-2">
                <Tag className="w-3.5 h-3.5" /> Filed under:
              </span>
              {post.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onNavigate('blog')}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    readingTheme === 'dark'
                      ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      : readingTheme === 'sepia'
                      ? 'bg-[#ede3cc] text-[#4b3e2e] hover:bg-[#e4d8bd]'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>

            {/* Featured Artifacts & Objects Shelf */}
            {relatedProducts.length > 0 && (
              <section className={`my-16 p-6 sm:p-8 rounded-3xl border space-y-6 ${
                readingTheme === 'dark'
                  ? 'bg-zinc-900/90 border-zinc-800'
                  : readingTheme === 'sepia'
                  ? 'bg-[#f4ebd6] border-[#e8dfc9]'
                  : 'bg-zinc-50 border-zinc-200/80'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5" /> Atelier Artifacts
                    </div>
                    <h3 className="text-xl font-serif font-bold mt-1">
                      Objects Featured in this Monograph
                    </h3>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">
                    {relatedProducts.length} items
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`rounded-2xl p-4 border shadow-xs flex items-center gap-4 group ${
                        readingTheme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-200/70'
                      }`}
                    >
                      <div
                        onClick={() => {
                          if (onQuickView) onQuickView(product);
                          else onNavigate('product-detail', undefined, product.id);
                        }}
                        className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0 cursor-pointer"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                          {product.brand}
                        </p>
                        <h4
                          onClick={() => onNavigate('product-detail', undefined, product.id)}
                          className="text-xs font-bold truncate hover:text-amber-700 cursor-pointer"
                        >
                          {product.name}
                        </h4>
                        <p className="text-xs font-semibold mt-1">
                          {formatPrice(product.price)}
                        </p>

                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="px-3 py-1 bg-zinc-950 hover:bg-zinc-850 text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                          <button
                            onClick={() => onNavigate('product-detail', undefined, product.id)}
                            className="text-[11px] underline font-medium text-zinc-500 hover:text-zinc-900"
                          >
                            Specs
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Author Bio Card */}
            <section className="my-12 p-6 sm:p-8 bg-zinc-950 text-white rounded-3xl flex flex-col sm:flex-row items-center gap-6 shadow-lg border border-zinc-800">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-zinc-700 flex-shrink-0 shadow-md"
              />
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-base font-bold text-white font-serif">{post.author.name}</h4>
                  <span className="text-[11px] bg-zinc-800 text-amber-400 px-2.5 py-0.5 rounded-full font-mono">
                    {post.author.role}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  Senior contributing curator at AURA Atelier. Specializing in sustainable metallurgy, architectural ergonomics, and reductive industrial forms.
                </p>
              </div>
            </section>

            {/* Reader Dialogue & Discussion Section */}
            <section className={`mt-16 pt-10 border-t space-y-8 ${
              readingTheme === 'dark' ? 'border-zinc-800' : readingTheme === 'sepia' ? 'border-[#e8dfc9]' : 'border-zinc-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  <h3 className="text-xl font-serif font-bold">
                    Atelier Dialogue & Comments
                  </h3>
                  <span className="text-xs text-zinc-400 font-mono">
                    ({post.comments?.length || 0})
                  </span>
                </div>
              </div>

              {/* Comment Submission Form */}
              <form
                onSubmit={handleCommentSubmit}
                className={`p-5 rounded-2xl border space-y-3.5 ${
                  readingTheme === 'dark'
                    ? 'bg-zinc-900/80 border-zinc-800'
                    : readingTheme === 'sepia'
                    ? 'bg-[#f4ebd6] border-[#e8dfc9]'
                    : 'bg-zinc-50 border-zinc-200/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-bold">
                    {currentUser?.name ? currentUser.name[0] : <UserIcon className="w-4 h-4 text-zinc-300" />}
                  </div>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Your Name or Monogram"
                    className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 flex-1"
                  />
                </div>

                <textarea
                  required
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Contribute your perspective or thoughts to this essay..."
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
                />

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-zinc-400">
                    Thoughts are moderated according to atelier community standards.
                  </p>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <span>Publish Thought</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>

                {commentSubmitted && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl text-center">
                    Your contribution has been added to the discourse.
                  </div>
                )}
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {!post.comments || post.comments.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic text-center py-6">
                    Be the first reader to initiate a discussion on this essay.
                  </p>
                ) : (
                  post.comments.map((c) => (
                    <div
                      key={c.id}
                      className={`p-4.5 rounded-2xl border space-y-2.5 shadow-2xs ${
                        readingTheme === 'dark' ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200/70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex items-center justify-center font-bold text-xs">
                            {c.userAvatar ? (
                              <img src={c.userAvatar} alt={c.userName} className="w-full h-full object-cover" />
                            ) : (
                              c.userName.slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <span className="text-xs font-bold">{c.userName}</span>
                        </div>

                        <span className="text-[11px] text-zinc-400">
                          {new Date(c.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed pl-9 text-zinc-600 dark:text-zinc-300">
                        {c.comment}
                      </p>

                      <div className="pl-9 pt-1 flex items-center gap-3">
                        <button
                          onClick={() => handleLikeComment(c.id)}
                          className="text-[11px] text-zinc-400 hover:text-amber-600 flex items-center gap-1"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful ({commentLikes[c.id] || 0})</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Previous & Next Article Navigation Cards */}
            <section className={`mt-16 pt-8 border-t grid grid-cols-1 sm:grid-cols-2 gap-4 ${
              readingTheme === 'dark' ? 'border-zinc-800' : readingTheme === 'sepia' ? 'border-[#e8dfc9]' : 'border-zinc-200'
            }`}>
              {prevPost ? (
                <div
                  onClick={() => onNavigate('blog-detail', undefined, undefined, prevPost.slug || prevPost.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-colors text-left group ${
                    readingTheme === 'dark'
                      ? 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800'
                      : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200/80'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1 group-hover:text-amber-600">
                    <ChevronLeft className="w-3 h-3" /> Previous Story
                  </span>
                  <h5 className="text-xs font-bold mt-1 line-clamp-1 group-hover:text-amber-700">
                    {prevPost.title}
                  </h5>
                </div>
              ) : (
                <div />
              )}

              {nextPost ? (
                <div
                  onClick={() => onNavigate('blog-detail', undefined, undefined, nextPost.slug || nextPost.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-colors text-right group ${
                    readingTheme === 'dark'
                      ? 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800'
                      : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200/80'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-end gap-1 group-hover:text-amber-600">
                    Next Story <ChevronRight className="w-3 h-3" />
                  </span>
                  <h5 className="text-xs font-bold mt-1 line-clamp-1 group-hover:text-amber-700">
                    {nextPost.title}
                  </h5>
                </div>
              ) : (
                <div />
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};
