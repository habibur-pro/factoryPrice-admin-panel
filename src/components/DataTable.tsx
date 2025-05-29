import React from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchValue?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  isLoading?: boolean;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchValue,
  onSearch,
  searchPlaceholder = "Search...",
  filters,
  pagination,
  isLoading = false,
}: DataTableProps<T>) {
  const getValue = (item: T, key: string) => {
    return key.split(".").reduce((obj, k) => obj?.[k], item);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with search and filters */}
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row gap-4">
          {onSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue || ""}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
          {filters && <div className="flex gap-2">{filters}</div>}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                        <ChevronDown className="w-3 h-3 text-gray-400 -mt-1" />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td
                    key={column.key as string}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.render
                      ? column.render(
                          getValue(item, column.key as string),
                          item
                        )
                      : getValue(item, column.key as string)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-3 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage - 1)
                }
                disabled={pagination.currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage + 1)
                }
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No data found</p>
        </div>
      )}
    </div>
  );
}

export default DataTable;
