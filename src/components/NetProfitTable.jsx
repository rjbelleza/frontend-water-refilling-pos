import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import { Calendar, X } from 'lucide-react';
import api from '../api/axios';
import Snackbar from './Snackbar';
import LoadingAnimation from './LoadingAnimation';

const NetProfitTable = () => {
  // Data state
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [searchDate, setSearchDate] = useState('');
  const [showDateRange, setShowDateRange] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [paginationData, setPaginationData] = useState({
    total: 0,
    last_page: 1,
  });

  const fetchMonthlyReport = async () => {
    try {
      setLoading(true);
      const response = await api.get('/profit', {
        params: {
          page: pagination.pageIndex + 1,
          per_page: pagination.pageSize,
        }
      });
      
      setData(response.data.data || []);
      setPaginationData({
        total: response.data.total,
        last_page: response.data.last_page,
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to fetch data');
      setResponseStatus('error');
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyReport();
  }, [pagination.pageIndex, pagination.pageSize]);

  // Define columns
  const columns = useMemo(
    () => [
      {
        id: 'rowNumber',
        header: '#',
        cell: ({ row }) => row.index + 1,
        size: 50,
      },
      {
        accessorKey: 'month',
        header: 'Date',
        cell: info => {
          try {
            // Format as "May 2025" if month is in "YYYY-MM" format
            const [year, month] = info.getValue().split('-');
            const date = new Date(year, month - 1);
            return format(date, "MMM yyyy");
          } catch {
            return info.getValue();
          }
        },
        size: 290,
      },
      {
        accessorKey: 'total_sales',
        header: 'Sales (₱)',
        cell: info => `${info.getValue().toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        size: 290,
      },
      {
        accessorKey: 'total_expenses',
        header: 'Expenses (₱)',
        cell: info => `${info.getValue().toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        size: 290,
      },
      {
        accessorKey: 'net_profit',
        header: 'Net Profit (₱)',
        cell: info => `${info.getValue().toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        size: 290,
      },
    ],
    []
  );

  // Initialize the table
  const table = useReactTable({
    data,
    columns,
    pageCount: paginationData.last_page,
    state: {
      sorting,
      pagination,
    },
    manualPagination: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      {showSnackbar && (
        <Snackbar 
          message={message}
          type={responseStatus}
          onClose={() => setShowSnackbar(false)}
        />
      )}

      {/* Search Controls */}
      <div className="flex flex-col w-full sm:flex-row gap-2">
        <div className='flex justify-between w-full gap-20 mb-3'>
          <div className='flex justify-end gap-3 w-full'>
            <button 
              onClick={() => setShowDateRange(true)}
              className='flex items-center gap-2 h-[35px] bg-primary text-white text-[13px] font-medium px-5 rounded-md cursor-pointer hover:bg-primary-100'>
                <Calendar size={13} />
                Change Date Range
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Modal */}
      {showDateRange && (
        <div 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} 
        className={`fixed inset-0 flex items-center justify-center z-1000 transition-opacity duration-300
            ${showDateRange ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <form
              className={`min-w-[400px] max-w-[400px] flex flex-col items-center bg-white pb-5 rounded-sm shadow-lg transform transition-transform duration-300
              ${showDateRange ? 'scale-100' : 'scale-95'}`
          }>
            <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-5 p-5">
              Date Range
              <span className="text-gray-800 hover:text-gray-600 font-normal">
                <button
                  type='button'
                  onClick={() => setShowDateRange(false)}
                  className="cursor-pointer"
                >
                  <X size={20} />
                </button>
              </span>
            </p>
            <div className='p-5 space-y-5 mb-5'>
            <label htmlFor='start_date' className='text-[14px] font-medium'>Start Date</label>
            <input 
              id='start_date'
              name='start_date'
              type='date'
              className='w-full border border-primary rounded-sm px-3 py-1'
            />
            <label htmlFor='end_date' className='text-[14px] font-medium'>End Date</label>
            <input 
              id='end_date'
              name='end_date'
              type='date'
              className='w-full border border-primary rounded-sm px-3 py-1'
            />
            </div>
            <button 
            type='submit'
            className='w-[90%] font-medium bg-primary py-2 text-white rounded-sm cursor-pointer hover:bg-primary-100'>
              CONFIRM
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="min-h-[500px] max-h-full overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead className="bg-gray-200 sticky top-0">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-gray-200"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center'
                            : 'flex items-center',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <span className="ml-2">↑</span>,
                          desc: <span className="ml-2">↓</span>,
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                  <LoadingAnimation />
                </td>
              </tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td 
                      key={cell.id} 
                      className="px-4 py-3 text-sm text-gray-600 font-medium border border-gray-200"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4 px-1">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => table.previousPage()} 
            disabled={!table.getCanPreviousPage()}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()} 
            disabled={!table.getCanNextPage()}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">
                {pagination.pageIndex * pagination.pageSize + 1}
              </span> to{' '}
              <span className="font-medium">
                {Math.min(
                  (pagination.pageIndex + 1) * pagination.pageSize,
                  paginationData.total
                )}
              </span>{' '}
              of <span className="font-medium">{paginationData.total}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">First</span>
                &laquo;
              </button>
              <button
                onClick={() => table.previousPage()} 
                disabled={!table.getCanPreviousPage()}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()} 
                disabled={!table.getCanNextPage()}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Last</span>
                &raquo;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetProfitTable;
