import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { format, parseISO, isSameDay, isWithinInterval } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Calendar, Eye, X, CirclePlus, Printer } from 'lucide-react';
import api from '../api/axios';
import LoadingAnimation from './LoadingAnimation';
import Snackbar from './Snackbar';

const SalesTable = () => {
  // Data state
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [searchDate, setSearchDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState('');
  const [dateRangeError, setDateRangeError] = useState('');

  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  const handleViewModal = (row) => {
    setSelectedRow(row.original);
    setViewModal(true);
  }

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleModalClose = (e) => {
    e.preventDefault();
    setViewModal(false);
  }

  const handleDateRangeSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const startDateValue = formData.get('start_date');
    const endDateValue = formData.get('end_date');
    
    // Validate date range
    if (startDateValue && endDateValue && new Date(endDateValue) < new Date(startDateValue)) {
      setDateRangeError('End date cannot be earlier than start date');
      return;
    }
    
    // Clear any previous errors
    setDateRangeError('');
    
    setStartDate(startDateValue);
    setEndDate(endDateValue);
    setShowDateRange(false);
    
    // Reset pagination to first page when applying date filter
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }

 useEffect(() => {
  const fetchSaleProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      };
      
      // Add date parameters if they exist
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const res = await api.get('/sales', { params });

      setData(res.data.data);
      setTotalRecords(res.data.total);
    } catch (err) {
      setMessage(err.response?.data?.message);
      setResponseStatus(err.response?.data?.status);
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  fetchSaleProducts();
}, [pagination.pageIndex, pagination.pageSize, startDate, endDate]); // Add date dependencies
  
  

  // Define columns
  const columns = useMemo(
    () => [
      {
        id: 'rowNumber',
        header: '#',
        cell: ({ row }) => pagination.pageIndex * pagination.pageSize + row.index + 1,
        size: 50,
      }
      ,
      {
        accessorKey: 'created_at',
        header: 'Date & Time',
        cell: info => format(parseISO(info.getValue()), "MMM dd yyyy, hh:mm:ss a"),
        size: 290,
      },
      {
        accessorKey: 'customer.name',
        header: 'Customer',
        cell: info => info.getValue(),
        size: 290,
      },
      {
        accessorKey: 'subtotal',
        header: 'Subtotal (₱)',
        cell: info => `${Number(info.getValue()).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        size: 190,
      },
      {
        accessorKey: 'discount',
        header: 'Discount (₱)',
        cell: info => ` ${Number(info.getValue()).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        size: 190,
      },
      {
        accessorFn: row => Number(row.subtotal) - Number(row.discount),
        header: 'Total Amount (₱)',
        cell: info => 
          Number(info.getValue()).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }),
        size: 190,
      },
      {
        id: 'actions',
        header: 'View',
        cell: ({ row }) => (
          <button 
            onClick={() => handleViewModal(row)}
            className="text-white bg-primary hover:bg-primary-100 cursor-pointer rounded-sm px-2 py-2">
            <Eye className='text-white' size={17} />
          </button>
        ),
        size: 20,
      },
    ],
    [pagination.pageIndex, pagination.pageSize]
  );

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const itemDate = parseISO(item.created_at);
      
      // If both start and end dates are provided, filter by date range
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        // Set end date to end of day to include the entire end date
        end.setHours(23, 59, 59, 999);
        return isWithinInterval(itemDate, { start, end });
      }
      
      // If only start date is provided, show records from that date onwards
      if (startDate && !endDate) {
        const start = new Date(startDate);
        return itemDate >= start;
      }
      
      // If only end date is provided, show records up to that date
      if (!startDate && endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return itemDate <= end;
      }
      
      // If single search date is provided (legacy support)
      if (searchDate) {
        return isSameDay(itemDate, new Date(searchDate));
      }
      
      // If no date filters, show all
      return true;
    });
  }, [data, searchDate, startDate, endDate]);  

  // Initialize the table
  const table = useReactTable({
    data: filteredData,
    columns,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
    state: {
      sorting,
      pagination,
    },
    manualPagination: false, // Changed to false since we're filtering client-side
    manualSorting: true,
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
            message={message && message}
            type={responseStatus}
            onClose={() => setShowSnackbar(false)}
          />
        )}

      {/* Search Controls */}
      <div className="flex flex-col w-full sm:flex-row">
        <div className='flex justify-between w-full py-3 rounded-2xl'>
          {/* Date Filter Display */}
          {(startDate || endDate) && (
            <div className="flex items-center w-full gap-2 px-5 py-2 rounded-md">
              <Calendar size={16} className="text-primary" />
              <span className="text-sm text-primary text-[15px]">
                Filtered by: {startDate && format(new Date(startDate), 'MMM dd, yyyy')} 
                {startDate && endDate && ' - '} 
                {endDate && format(new Date(endDate), 'MMM dd, yyyy')}
              </span>
            </div>
          )}
            <div className='flex justify-end w-full'>
              <button 
                onClick={() => setShowDateRange(true)}
                className='flex items-center gap-2 h-[35px] bg-primary text-white text-[13px] font-medium px-5 rounded-md cursor-pointer hover:bg-primary-100'>
                  <Calendar size={13} />
                  Change Date Range
              </button>
              {(startDate || endDate) && (
                <button 
                  onClick={clearDateFilter}
                  className='flex items-center gap-2 h-[35px] bg-gray-500 text-white text-[13px] font-medium px-5 rounded-md cursor-pointer hover:bg-gray-600 ml-2'>
                    <X size={13} />
                    Clear Filter
                </button>
              )}
              <div className='flex justify-end ml-2'>
                <button 
                    onClick={() => navigate('/new-sales')}
                    className='flex items-center gap-2 h-[35px] bg-primary text-white text-[13px] font-medium px-5 rounded-md cursor-pointer hover:bg-primary-100'
                >
                  <CirclePlus size={15} />
                  New Sale Entry
                </button>
              </div>
            </div>
        </div>
      </div>

      {/* View Modal */}
      {viewModal && selectedRow && (
        <div
          className="fixed inset-0 flex items-center justify-center z-1000 scrollbar-thin overflow-y-auto pt-40 pb-10"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        >
          <div className="min-w-[800px] bg-white pb-5 rounded-sm shadow-lg">
            <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-8 p-5">
              Sale Detail
              <span className="text-gray-800 hover:text-gray-600 font-normal">
                <button
                  onClick={() => setViewModal(false)}
                  className="cursor-pointer"
                >
                  <X size={20} />
                </button>
              </span>
            </p>
            <div className='flex gap-20 w-full px-5 mb-10'>
              <div className='space-y-2'>
                <p className='text-[14px] font-medium text-blue-600'>Customer</p>
                <p className='text-[17px] font-bold text-primary'>{capitalize(selectedRow.customer.name || '')}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-[14px] font-medium text-blue-600'>Date & Time</p>
                <p className='text-[17px] font-bold text-primary'>{format(parseISO(selectedRow.created_at), "MMM dd, yyyy 'at' hh:mm a")}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-[14px] font-medium text-blue-600'>Cashier</p>
                <p className='text-[17px] font-bold text-primary'>{`${selectedRow.user.fname} ${selectedRow.user.lname} - ${capitalize(selectedRow.user.role)}`}</p>
              </div>
            </div>
            <div className='w-full px-5'>
              <p className='text-[14px] font-medium text-blue-600 mb-2'>Order Summary</p>
              <table className='w-full border-collapse'>
                <thead className='rounded-md'>
                  <tr className='text-[13px] text-left rounded-md'>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>Product</th>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>Price (₱)</th>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>Quantity</th>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>Total Price (₱)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRow.sale_products.map((product) => (
                    <tr className='text-[13px]' key={product.id}>
                    <td className='px-3 py-2 border-b border-gray-200'>{product.product.name}</td>
                    <td className='px-3 py-2 border-b border-gray-200'>{Number(product.product.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className='px-3 py-2 border-b border-gray-200'>{Number(product.quantity).toLocaleString('en-PH')}</td>
                    <td className='px-3 py-2 border-b border-gray-200'>{Number(product.total_price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
                  ))}
                </tbody>
              </table>
              <div className='flex justify-end w-full py-4'>
                <div className='w-1/2 border border-gray-300 text-[14px] rounded-md'>
                  <div className='flex justify-between p-3'>
                    <p>Subtotal</p>
                    <p>₱{Number(selectedRow.subtotal).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className='flex justify-between p-3'>
                    <p>Discount</p>
                    <p>₱{Number(selectedRow.discount).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className='flex justify-between p-3'>
                    <p>Total Amount</p>
                    <p>₱{(Number(selectedRow.subtotal) - Number(selectedRow.discount)).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className='flex justify-between p-3'>
                    <p>Amount Paid</p>
                    <p>₱{Number(selectedRow.amount_paid).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                  <div className='flex justify-between p-3'>
                    <p>Change</p>
                    <p>₱{(Number(selectedRow.amount_paid) - (Number(selectedRow.subtotal) - Number(selectedRow.discount))).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Range Modal */}
      {showDateRange && (
      <div 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} 
        className={`fixed inset-0 flex items-center justify-center z-1000 transition-opacity duration-300
            ${showDateRange ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <form
            onSubmit={handleDateRangeSubmit}
            className={`min-w-[400px] max-w-[400px] flex flex-col items-center bg-white pb-5 rounded-sm shadow-lg transform transition-transform duration-300
            ${showDateRange ? 'scale-100' : 'scale-95'}`}
        >
          <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-5 p-5">
          Date Range
          <span className="text-gray-800 hover:text-gray-600 font-normal">
            <button
              type='button'
              onClick={() => {
                setShowDateRange(false);
                setDateRangeError(''); // Clear error when closing
              }}
              className="cursor-pointer"
            >
              <X size={20} />
            </button>
          </span>
        </p>
        <div className='p-5 space-y-5 mb-5 w-full'>
          <div className='space-y-2'>
            <label htmlFor='start_date' className='text-[14px] font-medium block'>Start Date</label>
            <input 
              id='start_date'
              name='start_date'
              type='date'
              defaultValue={startDate}
              className='w-full border border-primary rounded-sm px-3 py-1'
            />
          </div>
          <div className='space-y-2'>
            <label htmlFor='end_date' className='text-[14px] font-medium block'>End Date</label>
            <input 
              id='end_date'
              name='end_date'
              type='date'
              defaultValue={endDate}
              className='w-full border border-primary rounded-sm px-3 py-1'
            />
          </div>
          {/* Error message */}
          {dateRangeError && (
            <div className="text-red-500 text-sm mt-2">
              {dateRangeError}
            </div>
          )}
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
                    style={{
                      width: header.getSize(),
                    }}
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
            {table.getRowModel().rows.length > 0 ? (
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
                  {loading ? <LoadingAnimation /> : 'No records found'}
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
              Showing <span className="font-medium">{pagination.pageIndex * pagination.pageSize + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min((pagination.pageIndex + 1) * pagination.pageSize, filteredData.length)}
              </span>{' '}
              of <span className="font-medium">{filteredData.length}</span> results
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

export default SalesTable;
