'use client'
import { useState, useEffect, useCallback, useTransition, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X, RotateCcw } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';

// Types
export interface ProblemFilterType {
  difficulty?: keyof typeof PROBLEM_COMPLEXITY;
  tags?: string[];
  sort?: 'desc' | 'asc';
  search?: string;
}

interface ProblemFilterProps {
  /** Available tags for filtering */
  availableTags?: string[];
  /** Custom class name */
  className?: string;
  /** Callback when filters change (optional) */
  onFiltersChange?: (filters: ProblemFilterType) => void;
  /** Show loading indicator */
  loading?: boolean;
}

// Constants
export const PROBLEM_COMPLEXITY = {
  EASY: { label: 'Easy', color: 'bg-blue-100 text-blue-800' },
  MEDIUM: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  HARD: { label: 'Hard', color: 'bg-orange-100 text-orange-800' },
} as const;

const SORT_OPTIONS = [
  { value: 'desc', label: 'Newest' },
  { value: 'asc', label: 'Oldest' }
];

export default function ProblemFilter({
  availableTags = [],
  className,
  onFiltersChange,
  loading = false,
}: ProblemFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for search input (manual search)
  const [searchInput, setSearchInput] = useState('');

  // Parse current filters from URL
  const currentFilters = useMemo((): ProblemFilterType => {
    const difficulty = searchParams.get('difficulty') as keyof typeof PROBLEM_COMPLEXITY | null;
    const tagsParam = searchParams.get('tags');
    const tags = tagsParam ? tagsParam.split(',').filter(Boolean) : [];
    const sort = (searchParams.get('sort') as ProblemFilterType['sort']) || 'desc';
    const search = searchParams.get('search');

    return {
      difficulty: difficulty && PROBLEM_COMPLEXITY[difficulty] ? difficulty : undefined,
      tags: tags.length > 0 ? tags : undefined,
      sort,
      search: search || undefined,
    };
  }, [searchParams]);

  // Sync search input with URL search param
  useEffect(() => {
    setSearchInput(currentFilters.search || '');
  }, [currentFilters.search]);

  // Notify parent when filters change
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(currentFilters);
    }
  }, [currentFilters, onFiltersChange]);

  // Create URL with new parameters
  const createUrl = useCallback((updates: Partial<ProblemFilterType>) => {
    const params = new URLSearchParams(searchParams);
    const newFilters = { ...currentFilters, ...updates };

    // Update URL parameters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        (key === 'status' && value === 'all')) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else {
        params.set(key, String(value));
      }
    });

    // Reset page when filters change
    params.delete('page');

    const queryString = params.toString();
    return `${pathname}${queryString ? `?${queryString}` : ''}`;
  }, [searchParams, pathname, currentFilters]);

  // Update URL with new filters
  const updateUrl = useCallback((updates: Partial<ProblemFilterType>) => {
    if (isPending) return;

    const url = createUrl(updates);

    startTransition(() => {
      router.push(url, { scroll: false });
    });
  }, [createUrl, router, isPending]);

  // Handle individual filter updates
  const updateFilter = useCallback((key: keyof ProblemFilterType, value: any) => {
    updateUrl({ [key]: value });
  }, [updateUrl]);

  // Handle manual search
  const handleSearch = useCallback(() => {
    if (searchInput.trim() === currentFilters.search?.trim()) return;
    updateFilter('search', searchInput.trim() || undefined);
  }, [searchInput, currentFilters.search, updateFilter]);

  // Handle Enter key press in search input
  const handleSearchKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  // Clear search input
  const clearSearch = useCallback(() => {
    setSearchInput('');
    if (currentFilters.search) {
      updateFilter('search', undefined);
    }
  }, [currentFilters.search, updateFilter]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchInput('');
    const params = new URLSearchParams();

    // Keep non-filter params if any
    const preserveParams = ['page']; // Add other params you want to preserve
    preserveParams.forEach(param => {
      const value = searchParams.get(param);
      if (value && param !== 'page') { // Don't preserve page
        params.set(param, value);
      }
    });

    const url = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;

    startTransition(() => {
      router.push(url, { scroll: false });
    });
  }, [router, pathname, searchParams]);

  // Toggle tag selection
  const toggleTag = useCallback((tag: string) => {
    const currentTags = currentFilters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];

    updateFilter('tags', newTags.length > 0 ? newTags : undefined);
  }, [currentFilters.tags, updateFilter]);

  // Count active filters
  const activeCount = useMemo(() => {
    let count = 0;
    if (currentFilters.difficulty) count++;
    if (currentFilters.tags?.length) count++;
    if (currentFilters.search) count++;
    return count;
  }, [currentFilters]);

  // Remove individual filter
  const removeFilter = useCallback((filterKey: keyof ProblemFilterType, value?: string) => {
    switch (filterKey) {
      case 'tags':
        if (value) {
          toggleTag(value);
        } else {
          updateFilter('tags', undefined);
        }
        break;
      case 'search':
        setSearchInput('');
        updateFilter('search', undefined);
        break;
      default:
        updateFilter(filterKey, undefined);
    }
  }, [updateFilter, toggleTag]);

  // Check if search has changed from current filter
  const hasSearchChanged = useMemo(() => {
    return searchInput.trim() !== (currentFilters.search || '').trim();
  }, [searchInput, currentFilters.search]);

  return (
    <div className={cn("space-y-4 p-4 bg-card border rounded-lg", className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search problems..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          className="pl-9 pr-20"
          disabled={loading || isPending}
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchInput && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={clearSearch}
              disabled={loading || isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-6 w-6 p-0",
              hasSearchChanged
                ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                : "text-muted-foreground hover:bg-muted"
            )}
            onClick={handleSearch}
            disabled={loading || isPending || !hasSearchChanged}
            title={hasSearchChanged ? "Click to search" : "Search"}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3">
        {/* Sort */}
        <Select
          value={currentFilters.sort}
          onValueChange={(value) => updateFilter('sort', value)}
          disabled={loading || isPending}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Difficulty */}
        <Select
          value={currentFilters.difficulty || ''}
          onValueChange={(value) => updateFilter('difficulty', value || undefined)}
          disabled={loading || isPending}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PROBLEM_COMPLEXITY).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          disabled={loading || isPending || activeCount === 0}
          className="ml-auto"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
              {activeCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Tags */}
      {availableTags.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Tags:</h4>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <Button
                key={tag}
                variant={currentFilters.tags?.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTag(tag)}
                className="h-7 text-xs"
                disabled={loading || isPending}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {currentFilters.difficulty && (
            <Badge className={cn("text-xs", PROBLEM_COMPLEXITY[currentFilters.difficulty].color)}>
              {PROBLEM_COMPLEXITY[currentFilters.difficulty].label}
              <X
                className="h-3 w-3 ml-1 cursor-pointer hover:bg-black/10 rounded"
                onClick={() => removeFilter('difficulty')}
              />
            </Badge>
          )}

          {currentFilters.tags?.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
              <X
                className="h-3 w-3 ml-1 cursor-pointer hover:bg-black/10 rounded"
                onClick={() => removeFilter('tags', tag)}
              />
            </Badge>
          ))}

          {currentFilters.search && (
            <Badge variant="secondary" className="text-xs">
              "{currentFilters.search}"
              <X
                className="h-3 w-3 ml-1 cursor-pointer hover:bg-black/10 rounded"
                onClick={() => removeFilter('search')}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Loading/Pending indicator */}
      {(loading || isPending) && (
        <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
          Updating filters...
        </div>
      )}
    </div>
  );
}