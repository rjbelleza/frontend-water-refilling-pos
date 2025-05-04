import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { format, parseISO, isSameDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Calendar, Eye, X, CirclePlus, Printer } from 'lucide-react';
import api from '../api/axios';
import LoadingAnimation from './LoadingAnimation';

const SalesTable = () => {
  // Data state
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [searchDate, setSearchDate] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageCount = Math.ceil(totalRecords / pagination.pageSize);

  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchSaleProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get('/sales', {
          params: {
            page: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
          },
        });
  
        setData(res.data.data); // paginated sale product rows
        setTotalRecords(res.data.total);
      } catch (err) {
        console.error('Failed to fetch sale products', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSaleProducts();
  }, [pagination.pageIndex, pagination.pageSize]);
  
  

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
        accessorKey: 'customer',
        header: 'Customer',
        cell: info => capitalize(info.getValue()),
        size: 290,
      },
      {
        accessorKey: 'subtotal',
        header: 'Subtotal (₱)',
        cell: info => info.getValue(),
        size: 190,
      },
      {
        accessorKey: 'discount',
        header: 'Discount (₱)',
        cell: info => '- ' + info.getValue(),
        size: 190,
      },
      {
        accessorFn: row => (Number(row.subtotal) - Number(row.discount)).toFixed(2),
        header: 'Total Amount (₱)',
        cell: info => `${info.getValue()}`,
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
      return searchDate ? isSameDay(parseISO(item.dateTime), new Date(searchDate)) : true;
    });
  }, [data, searchDate]);  

  // Initialize the table
  const table = useReactTable({
    data: filteredData,
    columns,
    pageCount: pageCount,
    state: {
      sorting,
      pagination,
    },
    manualPagination: true,
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
      {/* Search Controls */}
      <div className="flex flex-col w-full sm:flex-row">
        <div className='flex justify-between w-full p-3 pl-5 rounded-2xl'>
            <div className='flex justify-end w-full'>
              <button 
                className='flex items-center gap-2 h-[35px] bg-primary text-white text-[13px] font-medium px-5 rounded-md cursor-pointer hover:bg-primary-100'>
                  <Calendar size={13} />
                  Change Date Range
              </button>
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
          className="fixed inset-0 flex items-center justify-center z-1000"
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
            <div className='flex gap-20 w-full px-5 mb-7'>
              <div className='space-y-2'>
                <p className='text-[14px] font-medium text-blue-600'>Customer</p>
                <p className='text-[17px] font-bold text-blue-900'>{capitalize(selectedRow.customer || '')}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-[14px] font-medium text-blue-600'>Date & Time</p>
                <p className='text-[17px] font-bold text-blue-900'>{format(parseISO(selectedRow.created_at), "yyyy-MM-dd, hh:mm a")}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-[14px] font-medium text-blue-600'>Cashier</p>
                <p className='text-[17px] font-bold text-blue-900'>{`${selectedRow.user.fname} ${selectedRow.user.lname} - ${capitalize(selectedRow.user.role)}`}</p>
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
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>Unit</th>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>Total Price (₱)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRow.sale_products.map((product) => (
                    <tr className='text-[13px]' key={product.id}>
                    <td className='px-3 py-2 border-b border-gray-200'>{product.product.name}</td>
                    <td className='px-3 py-2 border-b border-gray-200'>{product.product.price}</td>
                    <td className='px-3 py-2 border-b border-gray-200'>{product.quantity}</td>
                    <td className='px-3 py-2 border-b border-gray-200'>{product.product.unit}</td>
                    <td className='px-3 py-2 border-b border-gray-200'>{product.total_price}</td>
                </tr>
                  ))}
                </tbody>
              </table>
              <div className='flex justify-end w-full py-4'>
                <div className='w-1/2 border border-gray-300 text-[14px] rounded-md'>
                  <div className='flex justify-between p-3'>
                    <p>Subtotal</p>
                    <p>₱{selectedRow.subtotal}</p>
                  </div>
                  <div className='flex justify-between p-3'>
                    <p>Discount</p>
                    <p>- ₱{selectedRow.discount}</p>
                  </div>
                  <div className='flex justify-between p-3'>
                    <p>Total Amount</p>
                    <p>₱{(Number(selectedRow.subtotal) - Number(selectedRow.discount)).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex justify-end w-full px-5'>
              <button className='flex items-center gap-1 text-[14px] text-white bg-blue-900 rounded-md px-4 py-2'>
                <Printer size={14} />
                Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tablei */}
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
                {(pagination.pageIndex * pagination.pageSize + 1) + (table.getFilteredRowModel().rows.length - 1)}
              </span>{' '}
              of <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> results
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
