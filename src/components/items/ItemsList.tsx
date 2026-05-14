'use client';

import { useState, useMemo } from 'react';
import { ItemCard } from './ItemCard';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ITEM_CATEGORIES } from '@/lib/items/types';
import type { Item, ItemCategory } from '@/lib/items/types';
import { cn } from '@/lib/utils';

type StatusFilter = 'all' | 'active' | 'lost';
type SortBy = 'newest' | 'oldest' | 'most-scanned' | 'most-reported';

interface ItemsListProps {
  items: Item[];
  labels: {
    searchPlaceholder: string;
    filterStatus: string;
    filterCategory: string;
    sortBy: string;
    statusAll: string;
    statusActive: string;
    statusLost: string;
    sortNewest: string;
    sortOldest: string;
    sortMostScanned: string;
    sortMostReported: string;
    noResults: string;
    showing: string;
    of: string;
    items: string;
    clear: string;
  };
}

/**
 * Items list with built-in search, filter, and sort.
 * All filtering done client-side untuk instant UX.
 * (Akan migrate ke server-side kalau items > 100)
 */
export function ItemsList({ items, labels }: ItemsListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortBy>('newest');

  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.recovery_code.toLowerCase().includes(q) ||
          (item.custom_message?.toLowerCase().includes(q) ?? false)
      );
    }

    // Status filter
    if (statusFilter === 'active') {
      result = result.filter((i) => !i.is_lost);
    } else if (statusFilter === 'lost') {
      result = result.filter((i) => i.is_lost);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((i) => i.category === categoryFilter);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'oldest':
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case 'most-scanned':
        result.sort((a, b) => b.scan_count - a.scan_count);
        break;
      case 'most-reported':
        result.sort((a, b) => b.report_count - a.report_count);
        break;
    }

    return result;
  }, [items, search, statusFilter, categoryFilter, sortBy]);

  const hasActiveFilter =
    search !== '' || statusFilter !== 'all' || categoryFilter !== 'all' || sortBy !== 'newest';

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setSortBy('newest');
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <Input
        type="search"
        placeholder={labels.searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        leftIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        }
      />

      {/* Filter pills row */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Status filter */}
        <div className="flex gap-1.5 bg-white rounded-pill p-1 border-2 border-mimoo-purple-100">
          {(['all', 'active', 'lost'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              aria-pressed={statusFilter === status}
              className={cn(
                'px-3 py-1 text-xs font-semibold rounded-pill transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400',
                statusFilter === status
                  ? 'bg-mimoo-purple-500 text-white'
                  : 'text-mimoo-ink-500 hover:bg-mimoo-purple-50'
              )}
            >
              {status === 'all' && labels.statusAll}
              {status === 'active' && `✓ ${labels.statusActive}`}
              {status === 'lost' && `⚠️ ${labels.statusLost}`}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="px-3 py-2 text-xs font-semibold bg-white rounded-pill border-2 border-mimoo-purple-100 text-mimoo-ink-700 focus:outline-none focus:border-mimoo-purple-400"
          aria-label={labels.sortBy}
        >
          <option value="newest">📅 {labels.sortNewest}</option>
          <option value="oldest">📅 {labels.sortOldest}</option>
          <option value="most-scanned">👀 {labels.sortMostScanned}</option>
          <option value="most-reported">📬 {labels.sortMostReported}</option>
        </select>

        {hasActiveFilter && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-3 py-1 text-xs font-medium text-mimoo-pink-400 hover:bg-mimoo-pink-50 rounded-pill transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-pink-400"
          >
            ✕ {labels.clear}
          </button>
        )}
      </div>

      {/* Category emoji chips - horizontal scroll on mobile */}
      <div className="overflow-x-auto pb-2 -mx-1">
        <div className="flex gap-2 px-1">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            aria-pressed={categoryFilter === 'all'}
            className={cn(
              'shrink-0 px-3 py-1.5 text-xs font-semibold rounded-pill transition-all whitespace-nowrap',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400',
              categoryFilter === 'all'
                ? 'bg-mimoo-purple-500 text-white'
                : 'bg-white text-mimoo-ink-500 border-2 border-mimoo-purple-100 hover:bg-mimoo-purple-50'
            )}
          >
            ✨ {labels.filterCategory}
          </button>
          {ITEM_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(categoryFilter === cat.id ? 'all' : cat.id)}
              aria-pressed={categoryFilter === cat.id}
              className={cn(
                'shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-pill transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-mimoo-purple-400',
                categoryFilter === cat.id
                  ? 'bg-mimoo-purple-500 text-white'
                  : 'bg-white text-mimoo-ink-700 border-2 border-mimoo-purple-100 hover:bg-mimoo-purple-50'
              )}
            >
              <span aria-hidden="true">{cat.emoji}</span>
              <span>{cat.labelId}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between text-sm text-mimoo-ink-500">
        <span>
          {labels.showing} <strong>{filteredItems.length}</strong> {labels.of}{' '}
          <strong>{items.length}</strong> {labels.items}
        </span>
      </div>

      {/* Items grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-cozy-lg border-2 border-dashed border-mimoo-purple-100">
          <div className="text-5xl mb-3" aria-hidden="true">
            🔍
          </div>
          <p className="text-mimoo-ink-500">{labels.noResults}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
