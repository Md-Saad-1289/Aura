import React, { useState, useEffect, useMemo } from 'react';
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
  Tag
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

  // New Comment Form state
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState(currentUser?.name || '');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  // Find active post
  const post = useMemo(() => {
    if (!blogSlugOrId) return blogs[0];
    return blogs.find((b) => b.slug === blogSlugOrId || b.id === blogSlugOrId) || blogs[0];
  }, [blogs, blogSlugOrId]);

  // Increment view count on mount
  useEffect(() => {
    if (post?.id) {
      incrementBlogViews(post.id);
    }
  }, [post?.id]);

  // Reading progress scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadingProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleAddToCart = (product: Product) => {
    addItem(product, 1, {});
    setIsCartOpen(true);
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

  // Render markdown helper
  const renderMarkdownContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 mt-10 mb-4 tracking-tight leading-snug">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg sm:text-xl font-serif font-semibold text-zinc-900 mt-8 mb-3 tracking-tight">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={index} className="my-8 p-6 bg-zinc-50 border-l-2 border-amber-500 rounded-r-2xl text-zinc-700 italic text-base sm:text-lg font-serif leading-relaxed">
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      }

      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        return (
          <li key={index} className="ml-5 list-disc text-zinc-700 text-sm sm:text-base leading-relaxed my-1.5 pl-1">
            {trimmed.substring(2)}
          </li>
        );
      }

      if (trimmed.startsWith('```')) {
        return null;
      }

      if (trimmed.length === 0) {
        return <div key={index} className="h-4" />;
      }

      // Format bold markdown within standard paragraphs
      const parts = trimmed.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      return (
        <p key={index} className="text-zinc-700 text-sm sm:text-base leading-relaxed mb-4 text-justify sm:text-left">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-semibold text-zinc-950">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return <em key={pIdx} className="italic text-zinc-800">{part.slice(1, -1)}</em>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50">
        <div
          className="h-full bg-amber-400 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Top Navigation & Breadcrumbs */}
      <div className="bg-zinc-50 border-b border-zinc-200/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('blog')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Journal</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span
              onClick={() => onNavigate('home')}
              className="hover:text-zinc-700 cursor-pointer"
            >
              Home
            </span>
            <span>/</span>
            <span
              onClick={() => onNavigate('blog')}
              className="hover:text-zinc-700 cursor-pointer"
            >
              Journal
            </span>
            <span>/</span>
            <span className="text-zinc-800 font-medium truncate max-w-[150px] sm:max-w-xs">
              {post.category}
            </span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-amber-400/20 border border-amber-400/40 text-amber-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
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

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-zinc-950 tracking-tight leading-[1.15]">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 font-light leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Author Dossier & Social Share Controls */}
        <div className="py-5 border-y border-zinc-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover border border-zinc-200 shadow-xs"
            />
            <div>
              <p className="text-sm font-bold text-zinc-950">{post.author.name}</p>
              <p className="text-xs text-zinc-500">{post.author.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Clap / Like button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                hasLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-600 scale-105'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : 'text-zinc-500'}`} />
              <span>{post.likes + (hasLiked ? 1 : 0)}</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              title="Copy article link"
              className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 transition-colors relative"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copiedLink && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow-md">
                  Link copied!
                </span>
              )}
            </button>

            {/* Twitter Share */}
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 transition-colors"
              title="Share on X (Twitter)"
            >
              <Twitter className="w-4 h-4" />
            </a>

            {/* Email Share */}
            <a
              href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`Read this story from AURA Atelier: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
              className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 transition-colors"
              title="Share via Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Cinematic Hero Cover Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="relative rounded-3xl overflow-hidden shadow-md bg-zinc-100 max-h-[520px]">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover max-h-[520px]"
          />
        </div>
      </div>

      {/* Article Core Content Body */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <article className="prose prose-zinc max-w-none">
          {renderMarkdownContent(post.content)}
        </article>

        {/* Tags Footnote */}
        <div className="mt-12 pt-6 border-t border-zinc-200 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1 mr-2">
            <Tag className="w-3.5 h-3.5" /> Filed under:
          </span>
          {post.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onNavigate('blog')}
              className="text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3 py-1 rounded-full transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Featured Artifacts & Products Shelf */}
        {relatedProducts.length > 0 && (
          <section className="my-16 p-6 sm:p-8 bg-zinc-50 border border-zinc-200/80 rounded-3xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" /> Atelier Artifacts
                </div>
                <h3 className="text-xl font-serif font-bold text-zinc-950 mt-1">
                  Objects Featured in this Story
                </h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                {relatedProducts.length} items
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 border border-zinc-200/70 shadow-xs flex items-center gap-4 group"
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
                      className="text-xs font-bold text-zinc-950 truncate hover:text-amber-800 cursor-pointer"
                    >
                      {product.name}
                    </h4>
                    <p className="text-xs font-semibold text-zinc-900 mt-1">
                      {formatPrice(product.price)}
                    </p>

                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-3 py-1 bg-zinc-950 hover:bg-zinc-800 text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                      <button
                        onClick={() => onNavigate('product-detail', undefined, product.id)}
                        className="text-[11px] text-zinc-600 hover:text-zinc-950 underline font-medium"
                      >
                        View Specs
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Author Bio Section */}
        <section className="my-12 p-6 bg-zinc-900 text-white rounded-3xl flex flex-col sm:flex-row items-center gap-6">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-zinc-700 flex-shrink-0"
          />
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h4 className="text-base font-bold text-white font-serif">{post.author.name}</h4>
              <span className="text-[11px] bg-zinc-800 text-amber-400 px-2 py-0.5 rounded font-mono">
                {post.author.role}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Contributing architect and senior curator at AURA Atelier. Specializing in sustainable metallurgy, reductive industrial geometry, and artisanal provenance research.
            </p>
          </div>
        </section>

        {/* Reader Discussion / Comments Section */}
        <section className="mt-16 pt-10 border-t border-zinc-200 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-zinc-900" />
              <h3 className="text-xl font-serif font-bold text-zinc-950">
                Discussion & Dialogue
              </h3>
              <span className="text-xs text-zinc-400 font-mono">
                ({post.comments?.length || 0})
              </span>
            </div>
          </div>

          {/* Comment Submission Form */}
          <form onSubmit={handleCommentSubmit} className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-bold">
                {currentUser?.name ? currentUser.name[0] : <UserIcon className="w-4 h-4 text-zinc-300" />}
              </div>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your Name / Handle"
                className="bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500 flex-1"
              />
            </div>

            <textarea
              required
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Join the atelier dialogue or share your thoughts on this essay..."
              className="w-full bg-white border border-zinc-200 rounded-xl p-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-zinc-400">
                All thoughts are moderated in accordance with our atelier community standards.
              </p>
              <button
                type="submit"
                className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <span>Post Comment</span>
                <Send className="w-3 h-3" />
              </button>
            </div>

            {commentSubmitted && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl text-center">
                Your comment has been published to the article thread.
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
                  className="bg-white border border-zinc-150 rounded-2xl p-4.5 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-zinc-200 overflow-hidden flex items-center justify-center font-bold text-zinc-700 text-xs">
                        {c.userAvatar ? (
                          <img src={c.userAvatar} alt={c.userName} className="w-full h-full object-cover" />
                        ) : (
                          c.userName.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <span className="text-xs font-bold text-zinc-900">{c.userName}</span>
                    </div>

                    <span className="text-[11px] text-zinc-400">
                      {new Date(c.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-700 leading-relaxed pl-9">
                    {c.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Previous & Next Article Navigation */}
        <section className="mt-16 pt-8 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevPost ? (
            <div
              onClick={() => onNavigate('blog-detail', undefined, undefined, prevPost.slug || prevPost.id)}
              className="p-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 rounded-2xl cursor-pointer transition-colors text-left group"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1 group-hover:text-zinc-950">
                <ChevronLeft className="w-3 h-3" /> Previous Story
              </span>
              <h5 className="text-xs font-bold text-zinc-900 mt-1 line-clamp-1 group-hover:text-amber-800">
                {prevPost.title}
              </h5>
            </div>
          ) : (
            <div />
          )}

          {nextPost ? (
            <div
              onClick={() => onNavigate('blog-detail', undefined, undefined, nextPost.slug || nextPost.id)}
              className="p-4 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 rounded-2xl cursor-pointer transition-colors text-right group"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-end gap-1 group-hover:text-zinc-950">
                Next Story <ChevronRight className="w-3 h-3" />
              </span>
              <h5 className="text-xs font-bold text-zinc-900 mt-1 line-clamp-1 group-hover:text-amber-800">
                {nextPost.title}
              </h5>
            </div>
          ) : (
            <div />
          )}
        </section>
      </main>
    </div>
  );
};
