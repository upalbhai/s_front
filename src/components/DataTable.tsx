'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, RefreshCw, ChevronLeft, ChevronRight, Filter as FilterIcon, XIcon } from 'lucide-react';

export interface ColumnDef<T> {
  header: React.ReactNode | string;
  id?: string;
  accessorKey?: keyof T;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading: boolean;
  totalItems: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
  onLimitChange?: (limit: number) => void;
  onRefetch: () => void;
  refetchIntervalSeconds?: number;
  placeholderText?: string;
  emptyStateText?: string;
  emptyStateIcon?: string | React.ReactNode;
  hidePagination?: boolean;
  onRowClick?: (row: T) => void;
  filters?: React.ReactNode;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  totalItems,
  page,
  limit,
  onPageChange,
  onLimitChange,
  searchQuery,
  onSearchChange,
  onRefetch,
  refetchIntervalSeconds = 15,
  placeholderText = 'Search...',
  emptyStateText = 'No items found',
  emptyStateIcon = '👥',
  hidePagination = false,
  onRowClick,
  filters,
  onClearFilters,
  hasActiveFilters = false,
}: DataTableProps<T>) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [countdown, setCountdown] = useState(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync external searchQuery value to local input state
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Timer logic for countdown cooldown
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle search changes with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      onSearchChange(val);
      onPageChange(1);
    }, 400);
  };

  const handleManualRefetch = () => {
    onRefetch();
    setCountdown(refetchIntervalSeconds);
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return (
    <div className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 p-4 md:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20">
        <div className="flex flex-row items-center gap-2 md:gap-4 flex-1">
          {/* Main Search Input */}
          <div className="relative flex-1 min-w-[120px] sm:min-w-[200px] flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-full focus-within:ring-2 focus-within:ring-slate-200/50 dark:focus-within:ring-slate-800/50 transition-all px-4 py-2">
            <Search className="text-slate-400 w-4 h-4 mr-2" />
            <input
              className="bg-transparent border-none outline-none text-sm w-full text-foreground font-medium placeholder:text-slate-400"
              placeholder={placeholderText}
              value={localSearch}
              onChange={handleSearchChange}
            />
          </div>

          {/* Dynamic Extra Filters (Desktop Inline) */}
          {filters && (
            <div className="hidden lg:flex flex-wrap items-center gap-2">
              {filters}
              {onClearFilters && hasActiveFilters && (
                <button
                  onClick={onClearFilters}
                  className="h-9 px-3 text-xs font-bold text-slate-500 hover:text-foreground cursor-pointer transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Action Buttons (Right Aligned) */}
          <div className="flex items-center gap-2 justify-end shrink-0 ml-auto">
            {/* Mobile Filter Trigger */}
            {filters && (
              <div className="lg:hidden relative">
                <button 
                  onClick={() => setMobileFilterOpen(true)}
                  className="h-9 w-9 flex items-center justify-center border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <FilterIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  {hasActiveFilters && (
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>
                  )}
                </button>
                {/* Simplified Mobile Drawer overlay */}
                {mobileFilterOpen && (
                  <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-background rounded-t-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300">
                      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                        <h2 className="text-base font-bold">Filters</h2>
                        <button onClick={() => setMobileFilterOpen(false)} className="p-2 -mr-2 text-slate-500 hover:text-foreground">
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-4 flex flex-col gap-4 overflow-y-auto">
                        {filters}
                      </div>
                      <div className="p-4 border-t border-border mt-auto flex gap-2">
                        {onClearFilters && hasActiveFilters && (
                          <button onClick={() => { onClearFilters(); setMobileFilterOpen(false); }} className="flex-1 py-2 font-bold border border-border rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                            Clear
                          </button>
                        )}
                        <button onClick={() => setMobileFilterOpen(false)} className="flex-1 py-2 font-bold bg-foreground text-background rounded-xl active:scale-95 transition-all">
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Refetch Trigger */}
            <button
              onClick={handleManualRefetch}
              disabled={isLoading || countdown > 0}
              className={`flex items-center justify-center h-10 px-3 md:px-4 gap-2 font-bold text-xs uppercase tracking-widest rounded-full border transition-all active:scale-95 shadow-sm ${
                countdown > 0
                  ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 cursor-not-allowed'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500 hover:text-sky-500 hover:border-sky-500/50'
              }`}
              title={countdown > 0 ? `Wait ${countdown}s` : 'Refresh list'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{countdown > 0 ? `Refetch (${countdown}s)` : 'Refetch'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800">
              {(Array.isArray(columns) ? columns : []).map((col, idx) => (
                <th key={col?.id || idx.toString()} className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {col?.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {isLoading ? (
              <tr>
                <td colSpan={(Array.isArray(columns) ? columns : []).length} className="text-center py-16 text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <span className="text-sm font-bold">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : (Array.isArray(data) ? data : []).length === 0 ? (
              <tr>
                <td colSpan={(Array.isArray(columns) ? columns : []).length} className="text-center py-16 text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    {typeof emptyStateIcon === 'string' ? (
                      <span className="text-4xl">{emptyStateIcon}</span>
                    ) : (
                      emptyStateIcon
                    )}
                    <span className="text-sm font-bold">{emptyStateText}</span>
                  </div>
                </td>
              </tr>
            ) : (
              (Array.isArray(data) ? data : []).map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {(Array.isArray(columns) ? columns : []).map((col, colIdx) => {
                    const cellKey = col?.id || colIdx.toString();
                    return (
                      <td key={cellKey} className="text-foreground py-2 md:py-3.5 px-6">
                        {col?.render
                          ? col.render(row)
                          : col?.accessorKey
                          ? (row[col.accessorKey] as React.ReactNode)
                          : null}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!hidePagination && (
        <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 gap-4 text-xs font-bold text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              Showing <span className="text-foreground">{(Array.isArray(data) ? data : []).length}</span> of{' '}
              <span className="text-foreground">{totalItems}</span> entries
            </div>
            {onLimitChange && (
              <div className="flex items-center gap-1.5">
                <span>Page size:</span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={limit}
                  onChange={(e) => {
                    const val = Math.min(100, Math.max(1, parseInt(e.target.value) || 1));
                    onLimitChange(val);
                    onPageChange(1);
                  }}
                  className="w-14 px-2 py-1.5 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-foreground outline-none focus:border-sky-500 transition"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Go to page:</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={page}
                onChange={(e) => {
                  const val = Math.min(totalPages, Math.max(1, parseInt(e.target.value) || 1));
                  onPageChange(val);
                }}
                className="w-14 px-2 py-1.5 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-foreground outline-none focus:border-sky-500 transition"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1 || isLoading}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-3 py-1 text-slate-500 select-none">
                <span className="text-foreground">{page}</span> / <span className="text-foreground">{totalPages}</span>
              </div>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages || isLoading}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border-l border-slate-200 dark:border-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
