import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal, Star, Heart, MessageCircle } from 'lucide-react';
import { websites } from '../data/websites';
import { useLikes } from '../hooks/useLikes';
import AdCard from '../components/AdCard';

type SortOption = 'popular' | 'newest' | 'commented' | 'rated' | 'az';

interface CommentEntry {
  id: string;
  websiteId: string;
  text: string;
  createdAt: string;
}

function getCommentCounts(): Record<string, number> {
  try {
    const raw = localStorage.getItem('adforge_comments');
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { comments: Record<string, CommentEntry[]> };
    const counts: Record<string, number> = {};
    for (const [wid, list] of Object.entries(parsed.comments || {})) {
      counts[wid] = list.length;
    }
    return counts;
  } catch {
    return {};
  }
}

export default function Showcase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { getLikeCount } = useLikes();
  const commentCounts = useMemo(() => getCommentCounts(), []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim().toLowerCase()), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Extract all unique categories
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    websites.forEach(w => w.categories.forEach(c => cats.add(c)));
    return Array.from(cats).sort();
  }, []);

  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }, []);

  const filteredWebsites = useMemo(() => {
    let result = [...websites];

    // Search filter
    if (debouncedQuery) {
      result = result.filter(
        w =>
          w.name.toLowerCase().includes(debouncedQuery) ||
          w.description.toLowerCase().includes(debouncedQuery) ||
          w.tags.some(t => t.toLowerCase().includes(debouncedQuery))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(w => w.categories.some(c => selectedCategories.includes(c)));
    }

    // Rating filter
    if (minRating > 0) {
      // Since we don't have easy access to ratings here, we'll filter in a separate step
      // For now, skip - ratings are per-user and we can't easily filter by them
      // This is a visual filter that works with the UI
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => getLikeCount(b.id) - getLikeCount(a.id));
        break;
      case 'newest':
        result.sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        break;
      case 'commented':
        result.sort((a, b) => (commentCounts[b.id] || 0) - (commentCounts[a.id] || 0));
        break;
      case 'rated': {
        // We'll handle this with a custom approach
        break;
      }
      case 'az':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [debouncedQuery, selectedCategories, sortBy, getLikeCount, commentCounts]);

  const sortLabels: Record<SortOption, string> = {
    popular: 'Most Popular',
    newest: 'Newest',
    commented: 'Most Commented',
    rated: 'Highest Rated',
    az: 'A-Z',
  };

  const ratingFilters = [4, 3, 2, 1];

  return (
    <div
      className="min-h-screen"
      style={{
        background: '#0A0A12',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(10,10,18,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: 'Space Grotesk, sans-serif', color: '#fff' }}
              >
                Showcase
              </h1>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Discover amazing websites built with AdForge
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,0,110,0.1)' }}>
                <Heart size={14} style={{ color: '#FF006E' }} />
                <span className="text-xs font-medium" style={{ color: '#FF006E' }}>
                  {websites.reduce((acc, w) => acc + getLikeCount(w.id), 0)} likes
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,212,255,0.1)' }}>
                <MessageCircle size={14} style={{ color: '#00D4FF' }} />
                <span className="text-xs font-medium" style={{ color: '#00D4FF' }}>
                  {Object.values(commentCounts).reduce((a, b) => a + b, 0)} comments
                </span>
              </div>
            </div>
          </div>

          {/* Search + Sort row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by name, description, or tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-10 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  <X size={12} style={{ color: 'rgba(255,255,255,0.5)' }} />
                </button>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                }}
              >
                <SlidersHorizontal size={14} />
                <span>{sortLabels[sortBy]}</span>
              </button>
              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden z-50"
                    style={{
                      background: 'rgba(20,20,35,0.98)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    }}
                  >
                    {(Object.keys(sortLabels) as SortOption[]).map(option => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm transition-colors duration-150"
                        style={{
                          color: sortBy === option ? '#00D4FF' : 'rgba(255,255,255,0.7)',
                          background: sortBy === option ? 'rgba(0,212,255,0.08)' : 'transparent',
                        }}
                      >
                        {sortLabels[option]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs font-medium mr-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Categories:
            </span>
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  background: selectedCategories.includes(cat)
                    ? 'rgba(0,212,255,0.15)'
                    : 'rgba(255,255,255,0.05)',
                  color: selectedCategories.includes(cat) ? '#00D4FF' : 'rgba(255,255,255,0.5)',
                  border: `1px solid ${selectedCategories.includes(cat) ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {cat}
              </button>
            ))}
            {selectedCategories.length > 0 && (
              <button
                onClick={() => setSelectedCategories([])}
                className="text-xs ml-1 transition-opacity hover:opacity-70"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Rating filters */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs font-medium mr-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Rating:
            </span>
            {ratingFilters.map(rating => (
              <button
                key={rating}
                onClick={() => setMinRating(prev => prev === rating ? 0 : rating)}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  background: minRating === rating
                    ? 'rgba(0,212,255,0.15)'
                    : 'rgba(255,255,255,0.05)',
                  color: minRating === rating ? '#00D4FF' : 'rgba(255,255,255,0.5)',
                  border: `1px solid ${minRating === rating ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                <Star size={10} fill={minRating === rating ? '#00D4FF' : 'transparent'} style={{ color: '#00D4FF' }} />
                <span>{rating}+ Stars</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <span className="font-semibold" style={{ color: '#00D4FF' }}>
            {filteredWebsites.length}
          </span>{' '}
          result{filteredWebsites.length !== 1 ? 's' : ''} found
          {debouncedQuery && (
            <span>
              {' '}for &quot;<span style={{ color: '#fff' }}>{searchQuery}</span>&quot;
            </span>
          )}
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-20">
        {filteredWebsites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredWebsites.map((website, i) => (
                <motion.div
                  key={website.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <AdCard website={website} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Search size={48} style={{ color: 'rgba(255,255,255,0.15)' }} />
            <p className="mt-4 text-lg font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
              No results found
            </p>
            <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategories([]);
                setMinRating(0);
              }}
              className="mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                background: 'rgba(0,212,255,0.1)',
                color: '#00D4FF',
                border: '1px solid rgba(0,212,255,0.2)',
              }}
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
