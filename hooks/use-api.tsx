import { ApiError } from "@/lib/api/api-client";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseApiOptions {
  immediate?: boolean;
  dependencies?: any[];
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    lastFetch: null
  })

  const abortControllerRef = useRef<AbortController | null>(null);
  const { immediate = true, dependencies = [], onSuccess, onError } = options;

  const execute = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiFunction();

      // Check if request was abort
      if (abortControllerRef.current?.signal.aborted) return;

      setState({
        data,
        loading: false,
        error: null,
        lastFetch: new Date()
      })

      onSuccess?.(data)
    } catch (error) {
      // Check if request was abort
      if (abortControllerRef.current?.signal.aborted) return;

      const errorMsg = error instanceof ApiError ? error.message : "An unexpected error occurred";

      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMsg
      }))

      onError?.(error as ApiError);
    }
  }, [apiFunction, onSuccess, onError]);

  const refetch = useCallback(async() => {
    await execute();
  }, [execute]);

  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  }, dependencies);

  return {
    ...state,
    refetch
  }
}

export function useAsyncOperation<T>(): {
  execute: (operation: () => Promise<T>) => Promise<T | null>,
  loading: boolean,
  error: string | null
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (operation: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (error) {
      const errorMsg = error instanceof ApiError ? error.message : 'An unexpected error occurred';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [])

  return {
    execute,
    loading,
    error
  }
}

export function usePagination<T>(
  fetchFunction: (offSet: number, limit: number) => Promise<{ items: T[], total: number, hasMore: boolean }>,
  limit: number = 20
): {
  items: T[],
  total: number,
  hasMore: boolean,
  loading: boolean,
  error: string | null,
  loadMore: () => void,
  reset: () => void,
  refresh: () => void
} {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasmore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async() => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(items.length, limit);

      setItems((prev) => [...prev, ...result.items]);
      setTotal(result.total);
      setHasmore(result.hasMore);
    } catch (error) {
      const errorMsg = error instanceof ApiError ? error.message : 'Failed to load more items';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, items.length, limit, loading, hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setTotal(0);
    setHasmore(true);
    setError(null);
  }, []);

  const refresh = useCallback(async() => {
    reset();
    await loadMore()
  }, [reset, loadMore]);

  return {
    items,
    total,
    hasMore,
    loading,
    error,
    loadMore,
    reset,
    refresh
  }
}