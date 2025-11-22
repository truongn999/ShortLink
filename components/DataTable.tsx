import React, { useState, useMemo } from 'react';
import { Search, SortDesc } from 'lucide-react';
import Pagination from './Pagination';

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
  searchPlaceholder?: string;
  itemsPerPage?: number;
  enableSearch?: boolean;
  enablePagination?: boolean;
  renderHeaderActions?: () => React.ReactNode;
  onRowClick?: (item: T) => void;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  searchPlaceholder = 'Tìm kiếm...',
  itemsPerPage = 10,
  enableSearch = true,
  enablePagination = true,
  renderHeaderActions,
  onRowClick
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter Data
  const filteredData = useMemo(() => {
    if (!enableSearch || !searchQuery) return data;
    
    const query = searchQuery.toLowerCase();
    return data.filter(item => {
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(query)
      );
    });
  }, [data, searchQuery, enableSearch]);

  // Paginate Data
  const paginatedData = useMemo(() => {
    if (!enablePagination) return filteredData;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage, enablePagination]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
      {/* Header */}
      {(title || enableSearch || renderHeaderActions) && (
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {title && <h2 className="font-semibold text-neutral-900 dark:text-white">{title}</h2>}
          
          <div className="flex items-center gap-3">
            {enableSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.5} />
                <input 
                  type="text" 
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent w-full sm:w-64 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400" 
                />
              </div>
            )}
            
            {renderHeaderActions && renderHeaderActions()}
          </div>
        </div>
      )}
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className={`text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wide px-6 py-3 ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700 bg-white dark:bg-neutral-800">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700' : 'hover:bg-neutral-50 dark:hover:bg-neutral-700'}`}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      {col.cell ? col.cell(item) : (col.accessorKey ? item[col.accessorKey] : null)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-neutral-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {enablePagination && filteredData.length > 0 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showingText={`Hiển thị ${paginatedData.length} trong ${filteredData.length} mục`}
        />
      )}
    </div>
  );
}

export default DataTable;
