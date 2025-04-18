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
import { Search, Eye, X, CirclePlus, Printer } from 'lucide-react';

const SalesTable = () => {
  // Data state
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const navigate = useNavigate();

  const handleViewModal = (row) => {
    setSelectedRow(row.original);
    setViewModal(true);
  }

  const handleModalClose = (e) => {
    e.preventDefault();
    setViewModal(false);
  }

  // Fetch data from recentTrans.json
  useEffect(() => {
    fetch('/data/recentTrans.json')
      .then(response => response.json())
      .then(jsonData => setData(jsonData))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Define columns
  const columns = useMemo(
    () => [
      {
        id: 'rowNumber',
        header: '#',
        cell: ({ row }) => row.index + 1,
        size: 50,
        accessorFn: (row, index) => index + 1,
      },
      {
        accessorKey: 'customer',
        header: 'Customer',
        cell: info => info.getValue(),
        size: 290,
      },
      {
        accessorKey: 'totalAmount',
        header: 'Total Amount',
        cell: info => `₱${info.getValue().toFixed(2)}`,
        size: 290,
      },
      {
        accessorKey: 'dateTime',
        header: 'Date & Time',
        cell: info => format(parseISO(info.getValue()), "yyyy-MM-dd, hh:mm:ss a"),
        size: 290,
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <button 
            onClick={() => handleViewModal(row)}
            className="text-white bg-blue-600 hover:bg-blue-500 cursor-pointer rounded-sm px-3 py-2">
            <Eye className='text-white' size={15} />
          </button>
        ),
        size: 20,
      },
    ],
    []
  );

  // Filter data based on search term and date
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = searchDate ? isSameDay(parseISO(item.dateTime), new Date(searchDate)) : true;
      return matchesSearch && matchesDate;
    });
  }, [data, searchTerm, searchDate]);

  // Initialize the table
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination,
    },
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
      <div className="flex flex-col w-full sm:flex-row gap-2">
        <div className='flex justify-between w-full gap-20 border border-gray-300 p-3 pl-5 rounded-2xl mb-4'>
          <div className='text-[23px] font-medium text-sky-800 w-[200px]'>Sales List</div>
            <div className='flex justify-end gap-3 w-full'>
              <div className='flex items-center'>
                <Search className='mr-[-30px] text-gray-600' />
                <input
                    type="text"
                    id="search"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-[37px] w-[170px] text-[13px] mr-3 py-1 pl-9 border border-gray-400 rounded-md shadow-sm"
                />
              </div>
              <div className='flex items-center gap-2 h-[37px]'>
                  <label className='text-[13px] text-gray-500'>Filter by date:</label>
                  <input
                      type="date"
                      id="date"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="h-[35px] px-5 bg-blue-500 text-white text-[13px] rounded-md outline-none"
                  />
              </div>
              <div className='flex justify-end ml-2'>
                <button 
                    onClick={() => navigate('/new-sales')}
                    className='flex items-center gap-2 h-[35px] bg-blue-800 text-white text-[13px] font-medium px-5 rounded-md cursor-pointer hover:bg-blue-700'
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
              Sales Detail
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
                <p className='text-[17px] font-bold text-blue-900'>{selectedRow.customer || ''}</p>
              </div>
              <div className='space-y-2'>
                <p className='text-[14px] font-medium text-blue-600'>Date & Time</p>
                <p className='text-[17px] font-bold text-blue-900'>{format(parseISO(selectedRow.dateTime), "yyyy-MM-dd, hh:mm a")}</p>
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
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>Total Cost (₱)</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    [
                      {product: "Product name", price: 0, quantity: 0, total: 0},
                      {product: "Product name", price: 0, quantity: 0, total: 0},
                      {product: "Product name", price: 0, quantity: 0, total: 0},
                      {product: "Product name", price: 0, quantity: 0, total: 0},
                      {product: "Product name", price: 0, quantity: 0, total: 0},

                  ].map((data, index) => (
                      <tr key={index} className='text-[13px]'>
                        <td className='px-3 py-2 border-b border-gray-200'>{data.product}</td>
                        <td className='px-3 py-2 border-b border-gray-200'>{data.price.toFixed(2)}</td>
                        <td className='px-3 py-2 border-b border-gray-200'>{data.quantity}</td>
                        <td className='px-3 py-2 border-b border-gray-200'>{data.total.toFixed(2)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className='flex justify-end w-full py-4'>
                <div className='w-1/2 border border-gray-300 text-[14px] rounded-md'>
                  <div className='flex justify-between p-3'>
                    <p>Discount</p>
                    <p>₱20.00</p>
                  </div>
                  <div className='flex justify-between p-3'>
                    <p>Total Amount</p>
                    <p>₱{selectedRow.totalAmount.toFixed(2)}</p>
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
              Showing <span className="font-medium">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  filteredData.length
                )}
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
