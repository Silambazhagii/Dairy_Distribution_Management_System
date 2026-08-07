import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { paginate, sortBy, filterBySearch } from '../../utils';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import type { TableColumn, StringKeyOf } from '../../types';

const PER_PAGE_OPTIONS = [10, 20, 50, 100] as const;

type SortDir = 'asc' | 'desc';

interface DataTableProps<T extends object> {
  columns: TableColumn<T>[];
  data?: T[];
  loading?: boolean;
  searchKeys?: StringKeyOf<T>[];
  searchPlaceholder?: string;
  actions?: (row: T) => React.ReactNode;
  emptyMessage?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  stickyHeader?: boolean;
  initialPerPage?: number;
  exportFilename?: string;
  toolbar?: React.ReactNode;
}

interface SortIconProps {
  colKey: string | undefined;
  sortKey: string | null;
  sortDir: SortDir;
}

function SortIcon({ colKey, sortKey, sortDir }: SortIconProps) {
  if (sortKey !== colKey) return <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />;
  return sortDir === 'asc'
    ? <ChevronUp   className="w-3.5 h-3.5 text-blue-600" />
    : <ChevronDown className="w-3.5 h-3.5 text-blue-600" />;
}

export default function DataTable<T extends object>({
  columns,
  data = [],
  loading = false,
  searchKeys = [],
  searchPlaceholder = 'Search…',
  actions,
  emptyMessage = 'No records found',
  emptyDescription,
  onRowClick,
  stickyHeader = true,
  initialPerPage = 20,
  exportFilename,
  toolbar,
}: DataTableProps<T>) {
  const [search, setSearch]     = useState('');
  const [sortKey, setSortKey]   = useState<StringKeyOf<T> | null>(null);
  const [sortDir, setSortDir]   = useState<SortDir>('asc');
  const [page, setPage]         = useState(1);
  const [perPage, setPerPage]   = useState(initialPerPage);

  const filtered   = useMemo(() => filterBySearch(data, search, searchKeys), [data, search, searchKeys]);
  const sorted     = useMemo(() => sortKey ? sortBy(filtered, sortKey, sortDir) : filtered, [filtered, sortKey, sortDir]);
  const paginated  = useMemo(() => paginate(sorted, page, perPage), [sorted, page, perPage]);
  const totalPages = Math.ceil(sorted.length / perPage);

  const handleSort = (key: StringKeyOf<T> | undefined) => {
    if (!key) return;
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleExport = () => {
    const rows = sorted.map((row) =>
      columns.map((col) => (col.accessor ? row[col.accessor] : '')).join(',')
    );
    const header = columns.map((c) => c.header).join(',');
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${exportFilename || 'export'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card flex flex-col overflow-hidden animate-slide-up">
      {/* Toolbar */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap bg-slate-50/50">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          {searchKeys.length > 0 && (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder={searchPlaceholder}
                className="form-input form-input-icon-left text-xs py-1.5"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {toolbar}
          {exportFilename && (
            <button onClick={handleExport} className="btn-secondary btn-sm gap-1.5 font-medium">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          )}
          <span className="text-xs text-slate-500 font-medium">
            {sorted.length} {sorted.length === 1 ? 'record' : 'records'}
          </span>
        </div>
      </div>

      {/* Table Area */}
      <div className="erp-table-wrap min-h-[300px] flex flex-col justify-between">
        {loading ? (
          <div className="p-12"><LoadingState /></div>
        ) : paginated.length === 0 ? (
          <div className="p-12"><EmptyState message={emptyMessage} description={emptyDescription} /></div>
        ) : (
          <table className="erp-table striped">
            <thead className={stickyHeader ? 'sticky top-0 z-10' : ''}>
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={col.key ?? (col.accessor ? String(col.accessor) : undefined) ?? col.header ?? idx}
                    style={col.width ? { width: col.width } : {}}
                    className={`${col.sortable ? 'cursor-pointer select-none' : ''} ${col.align === 'right' ? 'text-right' : ''}`}
                    onClick={() => col.sortable && col.accessor && handleSort(col.accessor)}
                  >
                    <div className={`flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end' : ''}`}>
                      <span>{col.header}</span>
                      {col.sortable && (
                        <SortIcon
                          colKey={col.accessor}
                          sortKey={sortKey}
                          sortDir={sortDir}
                        />
                      )}
                    </div>
                  </th>
                ))}
                {actions && <th className="text-right w-16">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.map((row, rowIdx) => (
                <tr
                  key={'id' in row && row.id != null ? String(row.id) : rowIdx}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? 'cursor-pointer' : ''}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key ?? (col.accessor ? String(col.accessor) : undefined) ?? col.header ?? colIdx}
                      className={col.align === 'right' ? 'td-num' : ''}
                    >
                      {col.render ? col.render(row) : (col.accessor !== undefined ? String(row[col.accessor] ?? '') : '')}
                    </td>
                  ))}
                  {actions && (
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">{actions(row)}</div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {!loading && sorted.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Rows:</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="form-input py-1 px-2 text-xs w-16 bg-white"
            >
              {PER_PAGE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium font-mono">
            {(page - 1) * perPage + 1}–{Math.min(page * perPage, sorted.length)} of {sorted.length}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary btn-icon-sm disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p: number;
              if (totalPages <= 5) p = i + 1;
              else if (page <= 3) p = i + 1;
              else if (page >= totalPages - 2) p = totalPages - 4 + i;
              else p = page - 2 + i;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-md text-xs font-semibold focus-ring transition-colors ${
                    p === page
                      ? 'bg-blue-600 text-white shadow-blue-sm'
                      : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-secondary btn-icon-sm disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
