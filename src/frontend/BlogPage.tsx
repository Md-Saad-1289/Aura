import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Clock,
  Heart,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Tag as TagIcon,
  Filter,
  Eye,
  Calendar,
  CheckCircle2,
  Send,
  Bookmark,
  BookmarkCheck,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Compass,
  ArrowUpRight,
  Share2,
  Check,
  RotateCcw,
  Sparkle
} from 'lucide-react';
import { BlogPost, StorefrontView } from '../types';
import { useStore } from '../context/StoreContext';

interface BlogPageProps {
  onNavigate: (view: StorefrontView, categoryId?: string, productId?: string, blogSlug?: string) => void;
  onSelectArticle?: (slugOrId: string) => void;
}

type ViewLayout = 'grid' | 'broadside' | 'archive';
type ReadTimeFilter = 'all' | 'quick' | 'medium' | 'deep';
type SortOption = 'latest' | 'popular' | 'liked' | 'readTime';

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, onSelectArticle }) => {
  const { blogs, likeBlogPost } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedReadTime, setSelectedReadTime] = useState<ReadTimeFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [viewLayout, setViewLayout] = useState<ViewLayout>('grid');
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);

  // Active hero lead slide
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Bookmarks state with localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_journal_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Audio preview player state for quick listening from feed
  const [playingAudioPostId, setPlayingAudioPostId] = useState<string | null>(null);
  const [speechSynthesisActive, setSpeechSynthesisActive] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterFrequency, setNewsletterFrequency] = useState<'weekly' | 'monthly'>('weekly');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Copied share link toast
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_journal_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedIds]);

  // Clean up speech synthesis when unmounting or changing tracks
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyPostLink = (post: BlogPost, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname}?view=blog-detail&article=${post.slug || post.id}`;
      navigator.clipboard.writeText(url);
      setCopiedPostId(post.id);
      setTimeout(() => setCopiedPostId(null), 2500);
    }
  };

  const publishedBlogs = useMemo(() => {
    return blogs.filter((b) => b.status === 'published');
  }, [blogs]);

  // Featured Lead Stories (up to 3)
  const featuredPosts = useMemo(() => {
    const featured = publishedBlogs.filter((b) => b.featured);
    return featured.length > 0 ? featured : publishedBlogs.slice(0, 3);
  }, [publishedBlogs]);

  // Categories list
  const categories = useMemo(() => {
    const cats = new Set<string>();
    publishedBlogs.forEach((b) => {
      if (b.category) cats.add(b.category);
    });
    return ['All', ...Array.from(cats)];
  }, [publishedBlogs]);

  // All Tags with counts
  const tagCounts = useMemo(() => {
    const map = new Map<string, number>();
    publishedBlogs.forEach((b) => {
      b.tags?.forEach((t) => {
        map.set(t, (map.get(t) || 0) + 1);
      });
    });
    return Array.from(map.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [publishedBlogs]);

  // Helper to parse read time minutes as integer
  const getReadTimeMinutes = (readTimeStr: string): number => {
    const match = readTimeStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 5;
  };

  // Filter & Sort Logic
  const filteredAndSortedBlogs = useMemo(() => {
    let result = publishedBlogs.filter((post) => {
      // Saved filter
      if (showSavedOnly && !bookmarkedIds.includes(post.id)) {
        return false;
      }

      // Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.author.name.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q)) ||
        post.category.toLowerCase().includes(q);

      // Category
      const matchesCategory =
        selectedCategory === 'All' || post.category === selectedCategory;

      // Tag
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);

      // Reading Time Filter
      const minutes = getReadTimeMinutes(post.readTime);
      let matchesReadTime = true;
      if (selectedReadTime === 'quick') matchesReadTime = minutes <= 4;
      else if (selectedReadTime === 'medium') matchesReadTime = minutes > 4 && minutes <= 8;
      else if (selectedReadTime === 'deep') matchesReadTime = minutes > 8;

      return matchesSearch && matchesCategory && matchesTag && matchesReadTime;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortOption === 'latest') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      if (sortOption === 'popular') {
        return (b.views || 0) - (a.views || 0);
      }
      if (sortOption === 'liked') {
        return (b.likes || 0) - (a.likes || 0);
      }
      if (sortOption === 'readTime') {
        return getReadTimeMinutes(a.readTime) - getReadTimeMinutes(b.readTime);
      }
      return 0;
    });

    return result;
  }, [
    publishedBlogs,
    searchQuery,
    selectedCategory,
    selectedTag,
    selectedReadTime,
    sortOption,
    showSavedOnly,
    bookmarkedIds
  ]);

  const handleReadPost = (post: BlogPost) => {
    if (onSelectArticle) {
      onSelectArticle(post.slug || post.id);
    }
    onNavigate('blog-detail', undefined, undefined, post.slug || post.id);
  };

  const handleToggleAudio = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Audio speech narration is not supported on this browser.');
      return;
    }

    if (playingAudioPostId === post.id && speechSynthesisActive) {
      window.speechSynthesis.cancel();
      setSpeechSynthesisActive(false);
      setPlayingAudioPostId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${post.title}. By ${post.author.name}. ${post.excerpt}`);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeechSynthesisActive(false);
      setPlayingAudioPostId(null);
    };

    utterance.onerror = () => {
      setSpeechSynthesisActive(false);
      setPlayingAudioPostId(null);
    };

    window.speechSynthesis.speak(utterance);
    setSpeechSynthesisActive(true);
    setPlayingAudioPostId(post.id);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const currentHeroPost = featuredPosts[activeHeroIndex] || featuredPosts[0];

  return (
    <div className="bg-zinc-50/60 min-h-screen pb-28">
      {/* Top Ambient Audio Bar when playing */}
      {playingAudioPostId && (
        <div className="sticky top-0 z-40 bg-zinc-950 text-white border-b border-zinc-800 px-4 py-2.5 shadow-md flex items-center justify-between transition-all">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-4 bg-amber-400 animate-pulse rounded-full" />
              <span className="w-1.5 h-6 bg-amber-400 animate-pulse delay-75 rounded-full" />
              <span className="w-1.5 h-3 bg-amber-400 animate-pulse delay-150 rounded-full" />
            </div>
            <div className="text-xs truncate max-w-xs sm:max-w-md">
              <span className="text-amber-400 font-semibold uppercase tracking-wider text-[10px] mr-2">
                Listening to Dispatch
              </span>
              <span className="text-zinc-200 font-serif font-medium">
                {blogs.find((b) => b.id === playingAudioPostId)?.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const nextRate = speechRate === 1 ? 1.25 : speechRate === 1.25 ? 1.5 : 1;
                setSpeechRate(nextRate);
                if (playingAudioPostId) {
                  const p = blogs.find((b) => b.id === playingAudioPostId);
                  if (p) handleToggleAudio(p, {} as any);
                }
              }}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:text-white"
            >
              {speechRate}x
            </button>
            <button
              onClick={() => {
                window.speechSynthesis?.cancel();
                setSpeechSynthesisActive(false);
                setPlayingAudioPostId(null);
              }}
              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 rounded-lg"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {/* Atmospheric Header & Dispatch Banner */}
      <header className="bg-zinc-950 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 relative overflow-hidden">
        {/* Subtle geometric grid background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="relative max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-amber-400 text-xs font-medium tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AURA Living Monograph & Atelier Journal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1]">
                Stories in Material & Form
              </h1>

              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl font-light">
                Dispatches exploring architectural geometry, slow metallurgical craftsmanship, provenance documentation, and the timeless philosophy of reductive design.
              </p>
            </div>

            {/* Quick Metrics & Search Bar */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 w-full lg:w-96">
              <div className="flex items-center justify-between sm:justify-end gap-4 text-xs text-zinc-400 pb-1 w-full">
                <div className="flex items-center gap-1.5 font-mono">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>{publishedBlogs.length} Published Dispatches</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Bookmark className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{bookmarkedIds.length} Saved in Reading List</span>
                </div>
              </div>

              <div className="relative w-full">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, authors, materials..."
                  className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-2xl pl-10 pr-10 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs font-semibold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Lead Carousel / Dispatch Showcase (Only when not actively searching) */}
      {!searchQuery && !selectedTag && selectedCategory === 'All' && !showSavedOnly && currentHeroPost && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <section className="bg-white rounded-3xl overflow-hidden border border-zinc-200/90 shadow-xl relative transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Cover visual with overlay */}
              <div
                className="lg:col-span-7 relative h-80 sm:h-96 lg:h-[480px] overflow-hidden group cursor-pointer bg-zinc-900"
                onClick={() => handleReadPost(currentHeroPost)}
              >
                <img
                  src={currentHeroPost.coverImage}
                  alt={currentHeroPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950/70 via-zinc-950/20 to-transparent" />

                <div className="absolute top-5 left-5 flex items-center gap-2">
                  <span className="bg-amber-400 text-zinc-950 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    Lead Editorial
                  </span>
                  <span className="bg-zinc-950/80 backdrop-blur-xs text-zinc-200 text-[10px] font-medium px-2.5 py-1 rounded-full">
                    {currentHeroPost.category}
                  </span>
                </div>

                {/* Audio quick listen trigger on hero */}
                <button
                  onClick={(e) => handleToggleAudio(currentHeroPost, e)}
                  className="absolute bottom-5 left-5 inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 hover:bg-white text-zinc-900 text-xs font-semibold rounded-full shadow-lg backdrop-blur-xs transition-transform hover:scale-105"
                >
                  {playingAudioPostId === currentHeroPost.id ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-zinc-700" />
                      <span>Listen ({currentHeroPost.readTime})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Story Content & Dispatch Metadata */}
              <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Switcher tabs for lead stories */}
                  {featuredPosts.length > 1 && (
                    <div className="flex items-center gap-2 pb-2">
                      {featuredPosts.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveHeroIndex(idx)}
                          className={`h-1.5 rounded-full transition-all ${
                            activeHeroIndex === idx
                              ? 'w-8 bg-zinc-950'
                              : 'w-2 bg-zinc-200 hover:bg-zinc-300'
                          }`}
                          title={`Switch to lead dispatch ${idx + 1}`}
                        />
                      ))}
                      <span className="text-[11px] font-mono text-zinc-400 ml-2">
                        0{activeHeroIndex + 1} / 0{featuredPosts.length}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider">
                    <span>{currentHeroPost.category}</span>
                    <span className="text-zinc-300">•</span>
                    <span className="text-zinc-500 normal-case font-normal flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {currentHeroPost.readTime}
                    </span>
                  </div>

                  <h2
                    onClick={() => handleReadPost(currentHeroPost)}
                    className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 hover:text-amber-800 transition-colors leading-[1.2] cursor-pointer"
                  >
                    {currentHeroPost.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed line-clamp-3">
                    {currentHeroPost.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentHeroPost.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className="text-[11px] bg-zinc-100 hover:bg-zinc-200 text-zinc-600 px-2.5 py-0.5 rounded-full cursor-pointer transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentHeroPost.author.avatar}
                      alt={currentHeroPost.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200 shadow-2xs"
                    />
                    <div>
                      <p className="text-xs font-bold text-zinc-950">{currentHeroPost.author.name}</p>
                      <p className="text-[11px] text-zinc-500">{currentHeroPost.author.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleBookmark(currentHeroPost.id, e)}
                      title={bookmarkedIds.includes(currentHeroPost.id) ? 'Saved in reading list' : 'Bookmark story'}
                      className={`p-2.5 rounded-xl border transition-colors ${
                        bookmarkedIds.includes(currentHeroPost.id)
                          ? 'bg-amber-50 border-amber-300 text-amber-800'
                          : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(currentHeroPost.id) ? 'fill-amber-600 text-amber-600' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleReadPost(currentHeroPost)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold rounded-xl transition-transform hover:scale-105"
                    >
                      <span>Read Essay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Main Filter, Category & Reading Controls Dock */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-6">
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-zinc-200/80 space-y-4">
          {/* Row 1: Category Pills & Reading List Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedTag(null);
                    setShowSavedOnly(false);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat && !selectedTag && !showSavedOnly
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'bg-zinc-100/90 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-950'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Saved stories filter button */}
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                showSavedOnly
                  ? 'bg-amber-400 text-zinc-950 shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-zinc-950' : ''}`} />
              <span>Saved Stories ({bookmarkedIds.length})</span>
            </button>
          </div>

          {/* Row 2: Deep Filters (Read Time, Sorting, Layout) */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex flex-wrap items-center gap-3">
              {/* Read Time Filter */}
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Duration:</span>
                {(['all', 'quick', 'medium', 'deep'] as ReadTimeFilter[]).map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => setSelectedReadTime(filterKey)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedReadTime === filterKey
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-50 border border-zinc-200/80 text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    {filterKey === 'all'
                      ? 'All'
                      : filterKey === 'quick'
                      ? '< 4 min'
                      : filterKey === 'medium'
                      ? '5-8 min'
                      : '8+ min'}
                  </button>
                ))}
              </div>

              {/* Tag indicator if active */}
              {selectedTag && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                  <span>Topic: #{selectedTag}</span>
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="text-amber-950 font-bold hover:text-rose-600 ml-1"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Right: Sort & Layout toggles */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-zinc-400 text-[11px] hidden sm:inline">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                >
                  <option value="latest">Latest Dispatches</option>
                  <option value="popular">Most Read</option>
                  <option value="liked">Most Applauded</option>
                  <option value="readTime">Shortest Read Time</option>
                </select>
              </div>

              {/* View Layout Switcher */}
              <div className="flex items-center border border-zinc-200 rounded-xl p-0.5 bg-zinc-50">
                <button
                  onClick={() => setViewLayout('grid')}
                  title="Magazine Grid"
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewLayout === 'grid' ? 'bg-white shadow-2xs text-zinc-950' : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewLayout('broadside')}
                  title="Broadside List"
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewLayout === 'broadside' ? 'bg-white shadow-2xs text-zinc-950' : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stories Listing Header */}
        <div className="flex items-center justify-between pt-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-zinc-950 flex items-center gap-2">
              <span>{showSavedOnly ? 'Your Saved Reading List' : selectedCategory === 'All' ? 'Curated Essays & Dispatches' : selectedCategory}</span>
              <span className="text-xs font-sans font-normal text-zinc-400">
                ({filteredAndSortedBlogs.length} {filteredAndSortedBlogs.length === 1 ? 'story' : 'stories'})
              </span>
            </h3>
            {showSavedOnly && (
              <p className="text-xs text-zinc-500 mt-0.5">
                Essays bookmarked for slow, contemplative offline or evening reading.
              </p>
            )}
          </div>

          {/* Quick topic tags pill rack */}
          {!showSavedOnly && (
            <div className="hidden lg:flex items-center gap-1.5">
              <span className="text-xs text-zinc-400 mr-1 flex items-center gap-1">
                <TagIcon className="w-3 h-3" /> Popular:
              </span>
              {tagCounts.slice(0, 5).map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full transition-colors ${
                    selectedTag === tag
                      ? 'bg-zinc-950 text-white'
                      : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  #{tag} <span className="opacity-60 text-[9px]">({count})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* No stories fallback state */}
        {filteredAndSortedBlogs.length === 0 ? (
          <div className="bg-white rounded-3xl p-14 text-center border border-zinc-200/80 space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
              <BookOpen className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-zinc-900 font-serif">No stories match your criteria</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {showSavedOnly
                ? "You haven't bookmarked any essays yet. Click the bookmark ribbon on any story card to build your private reading list."
                : "We couldn't find any articles matching your search or active filters. Try searching for different keywords or resetting filters."}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedTag(null);
                setSelectedReadTime('all');
                setShowSavedOnly(false);
              }}
              className="px-5 py-2.5 bg-zinc-950 text-white text-xs font-semibold rounded-xl hover:bg-zinc-800"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Dynamic Layout Rendering */
          <>
            {/* GRID VIEW */}
            {viewLayout === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedBlogs.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-3xl overflow-hidden border border-zinc-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col group relative"
                  >
                    {/* Card Cover Image */}
                    <div
                      onClick={() => handleReadPost(post)}
                      className="relative h-56 overflow-hidden cursor-pointer bg-zinc-100"
                    >
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-xs text-zinc-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                        {post.category}
                      </div>

                      <div className="absolute bottom-3.5 right-3.5 bg-zinc-950/80 backdrop-blur-xs text-zinc-200 text-[10px] font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" /> {post.readTime}
                      </div>

                      {/* Bookmark Button */}
                      <button
                        onClick={(e) => toggleBookmark(post.id, e)}
                        title={bookmarkedIds.includes(post.id) ? 'Remove bookmark' : 'Bookmark story'}
                        className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all ${
                          bookmarkedIds.includes(post.id)
                            ? 'bg-amber-400 text-zinc-950 shadow-md'
                            : 'bg-zinc-950/50 text-white hover:bg-zinc-950/80'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(post.id) ? 'fill-zinc-950' : ''}`} />
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          {post.views && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" /> {post.views} reads
                            </span>
                          )}
                        </div>

                        <h3
                          onClick={() => handleReadPost(post)}
                          className="text-lg font-serif font-bold text-zinc-950 group-hover:text-amber-800 transition-colors leading-snug line-clamp-2 cursor-pointer"
                        >
                          {post.title}
                        </h3>

                        <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-7 h-7 rounded-full object-cover border border-zinc-200"
                          />
                          <div className="text-left">
                            <p className="text-[11px] font-bold text-zinc-900 leading-tight">{post.author.name}</p>
                            <p className="text-[10px] text-zinc-400">{post.author.role}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-zinc-400 text-xs">
                          {/* Audio narration button */}
                          <button
                            onClick={(e) => handleToggleAudio(post, e)}
                            title="Listen to summary"
                            className="hover:text-zinc-900 transition-colors"
                          >
                            <Volume2 className={`w-3.5 h-3.5 ${playingAudioPostId === post.id ? 'text-amber-600 animate-pulse' : ''}`} />
                          </button>

                          <span className="flex items-center gap-1 hover:text-rose-500 transition-colors">
                            <Heart className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-mono">{post.likes || 0}</span>
                          </span>

                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-mono">{post.comments?.length || 0}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* BROADSIDE LIST VIEW */}
            {viewLayout === 'broadside' && (
              <div className="space-y-6">
                {filteredAndSortedBlogs.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-3xl overflow-hidden border border-zinc-200/80 p-6 sm:p-8 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 sm:gap-8 group"
                  >
                    <div
                      onClick={() => handleReadPost(post)}
                      className="w-full md:w-72 lg:w-80 h-52 sm:h-60 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer relative bg-zinc-100"
                    >
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-zinc-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                        {post.category}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3 text-xs text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {post.readTime}
                          </span>
                          {post.views && (
                            <>
                              <span>•</span>
                              <span>{post.views} reads</span>
                            </>
                          )}
                        </div>

                        <h3
                          onClick={() => handleReadPost(post)}
                          className="text-xl sm:text-2xl font-serif font-bold text-zinc-950 group-hover:text-amber-800 transition-colors leading-snug cursor-pointer"
                        >
                          {post.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {post.tags.map((t) => (
                            <span
                              key={t}
                              onClick={() => setSelectedTag(t)}
                              className="text-[11px] bg-zinc-100 text-zinc-600 hover:bg-zinc-200 px-2.5 py-0.5 rounded-full cursor-pointer"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-8 h-8 rounded-full object-cover border border-zinc-200"
                          />
                          <div>
                            <p className="text-xs font-bold text-zinc-900">{post.author.name}</p>
                            <p className="text-[10px] text-zinc-400">{post.author.role}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => toggleBookmark(post.id, e)}
                            className={`p-2 rounded-xl border transition-colors ${
                              bookmarkedIds.includes(post.id)
                                ? 'bg-amber-50 border-amber-300 text-amber-800'
                                : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                            }`}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(post.id) ? 'fill-amber-600' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleReadPost(post)}
                            className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                          >
                            <span>Read Story</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {/* Editorial Marginalia & Curator Spotlight */}
        <section className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white border border-zinc-200/80 rounded-3xl p-8 sm:p-10 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Curator's Marginalia</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 leading-tight">
              On the Longevity of Material Integrity
            </h3>

            <blockquote className="italic text-zinc-700 font-serif text-base border-l-2 border-amber-400 pl-4 py-1 leading-relaxed">
              "We believe modern obsolescence is an architectural failure, not an inevitable economic reality. When raw Damascus titanium, vegetable-tanned Tuscan hides, and optical-grade borosilicate are shaped with mathematical restraint, they transcend seasons and gain patina with time."
            </blockquote>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 text-xs">
              <span className="text-zinc-500 font-medium">— Elena Rostova, Senior Material Architect</span>
              <button
                onClick={() => onNavigate('about')}
                className="text-zinc-900 font-bold hover:text-amber-800 underline inline-flex items-center gap-1"
              >
                Read Our Atelier Manifesto <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-zinc-900 text-white rounded-3xl p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-widest">
                Material Spotlight
              </span>
              <h4 className="text-lg font-serif font-bold text-white">
                Forged Damascus Titanium
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Folded over 64 times under hydraulic atmospheric vacuum. Zero corrosion index and unparalleled thermal memory.
              </p>
            </div>

            <button
              onClick={() => onNavigate('shop')}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition-colors text-center"
            >
              Explore Damascus Collection
            </button>
          </div>
        </section>

        {/* Newsletter Editorial Archive CTA */}
        <section className="mt-16 bg-zinc-950 text-white rounded-3xl p-8 sm:p-12 border border-zinc-800 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-amber-400 shadow-inner">
              <BookOpen className="w-6 h-6" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              The Atelier Gazette & Living Monograph
            </h3>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed font-light">
              Receive seasonal essays, architectural product release dossiers, and private workshop invitations directly in your dispatch inbox.
            </p>

            {newsletterSubscribed ? (
              <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you. You have been added to the private subscriber registry ({newsletterFrequency} edition).</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3 max-w-md mx-auto pt-2">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full bg-zinc-900 border border-zinc-700/90 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-400 shadow-inner"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md whitespace-nowrap"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-400 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="freq"
                      checked={newsletterFrequency === 'weekly'}
                      onChange={() => setNewsletterFrequency('weekly')}
                      className="text-amber-400 focus:ring-0"
                    />
                    <span>Weekly Dispatch</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="freq"
                      checked={newsletterFrequency === 'monthly'}
                      onChange={() => setNewsletterFrequency('monthly')}
                      className="text-amber-400 focus:ring-0"
                    />
                    <span>Monthly Monograph</span>
                  </label>
                </div>
              </form>
            )}

            <p className="text-[10px] text-zinc-500 pt-2">
              Zero marketing noise. Published once fortnightly. Unsubscribe anytime with one click.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
