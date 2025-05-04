import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { CirclePlus, X, Calendar } from 'lucide-react';
import { format, parseISO, isSameDay } from 'date-fns';
import api from '../api/axios';
import Snackbar from './Snackbar';
import LoadingAnimation from './LoadingAnimation';

const ExpensesTable = () => {
  // Data state
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] =useState({description: '', amount: ''});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);


  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev, [name]: name === 'amount' ? (value === '' ? null : Number(value)) : value
    }));
  };


  const handleAddExpense = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/expense', newExpense);
      setMessage(response.data?.message);
      setResponseStatus(response.data?.status);
      setShowModal(false);
      setNewExpense({description: '', amount: ''});
      setRefreshKey(prev => prev + 1);
      setShowSnackbar(true);
    } catch (error) {
      setMessage(error.response?.data?.message);
      setResponseStatus(error.response?.data?.status);
      setShowModal(false);
      setShowSnackbar(true);
    }
  };


  const fetchExpenses = async () => {
    try {
      const response = await api.get('/expenses', {
        params: {
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
        },
      });
      setData(response.data?.data);
      setLoading(false);
    } catch (error) {
      setMessage(error.response?.data?.data?.message);
      setResponseStatus(error.response?.data?.data?.status);
      setShowSnackbar(true);
    }
  };


  useEffect(() => {
    fetchExpenses();
  }, [refreshKey]);


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
        accessorKey: 'created_at',
        header: 'Date Paid',
        cell: info => format(parseISO(info.getValue()), "MMM dd, yyyy"),
        size: 160,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: info => info.getValue(),
        size: 190,
      },
      {
        accessorKey: 'amount',
        header: 'Amount (₱)',
        cell: info => `${info.getValue().toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        size: 160,
      },
      {
        id: 'name',
        accessorFn: row => `${row.user.fname} ${row.user.lname} - ${capitalize(row.user.role)}`,
        header: 'Recorded By',
        cell: info => info.getValue(),
        size: 160,
      },
    ],
    []
  );

  // Initialize the table
  const table = useReactTable({
    data: data,
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

      <div className='flex justify-between w-full'>

        {showSnackbar && (
          <Snackbar 
            message={message && message}
            type={responseStatus}
            onClose={() => setShowSnackbar(false)}
          />
        )}

        <div className='flex justify-end w-full mb-3'>
            <div className='flex gap-3'>
              <button 
                  className='flex items-center gap-2 h-[35px] bg-primary text-white text-[13px] font-medium px-5 rounded-md cursor-pointer hover:bg-primary-100'>
                  <Calendar size={13} />
                  Change Date Range
              </button>
              <button 
                  onClick={() => setShowModal(true)}
                  className='flex items-center gap-2 h-[35px] bg-primary text-white text-[13px] font-medium px-5 rounded-md cursor-pointer hover:bg-primary-100'>
                  <CirclePlus size={13} />
                  Add Expense
              </button>
          </div>
        </div>
      </div>

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
              Showing <span className="font-medium">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  data.length
                )}
              </span>{' '}
              of <span className="font-medium">{data.length}</span> results
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

      {/* Add expense modal */}
      <div 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} 
            className={`fixed inset-0 flex items-center justify-center z-1000 transition-opacity duration-300
                ${showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div className={`min-w-[500px] bg-white pb-5 rounded-sm shadow-lg transform transition-transform duration-300
                ${showModal ? 'scale-100' : 'scale-95'}`
            }>
                 <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-8 p-5">
                    Add Expense
                    <span className="text-gray-800 hover:text-gray-600 font-normal">
                      <button
                        onClick={() => setShowModal(false)}
                        className="cursor-pointer"
                      >
                        <X size={20} />
                      </button>
                    </span>
                  </p>
                <form onSubmit={handleAddExpense} className='flex flex-col gap-2 w-full px-5'>
                    <label htmlFor='description' className='text-[14px] font-medium text-blue-800'>Description <span className='text-red-500'>*</span></label>
                    <input 
                        id='description'
                        type='text' 
                        name='description'
                        value={newExpense.description}
                        onChange={handleChangeInput}
                        required
                        className='w-full text-[14px] border border-gray-400 px-3 py-1 rounded-sm outline-gray-500 mb-5'                      
                    />
                    <label htmlFor='amount' className='text-[14px] font-medium text-blue-800'>Amount <span className='text-red-500'>*</span></label>
                    <input 
                        id='amount'
                        type='number' 
                        name='amount'
                        value={newExpense.amount}
                        onChange={handleChangeInput}
                        required
                        className='w-full text-[14px] border border-gray-400 px-3 py-1 rounded-sm outline-gray-500'                      
                        min={0}
                    />
                    <div className='flex justify-end w-full px-5 mt-5'>
                      <button
                        type='submit'
                        className='bg-blue-900 text-white px-3 py-2 text-[13px] rounded-sm cursor-pointer hover:bg-blue-800'
                      >
                        Submit
                      </button>
                    </div>
                  </form>
            </div>
        </div>
    </div>
  );
};

export default ExpensesTable;
