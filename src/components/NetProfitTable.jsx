import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import { Calendar, X } from 'lucide-react';
import api from '../api/axios';
import Snackbar from './Snackbar';
import LoadingAnimation from './LoadingAnimation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AlertPopUp from './AlertPopUp';


const NetProfitTable = () => {
  // Data state
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [totalProfit, setTotalProfit] = useState('');
  const [yearDate, setYearDate] = useState(null);

  const handleYearSubmit = async (e) => {
    e.preventDefault();
    setSelectedYear(yearDate ? format(yearDate, 'yyyy') : '');
    setShowYearPicker(false);
  }

  const clearYearFilter = () => {
    setSelectedYear('');
    setYearDate(null);
  }

  const fetchYearlyReport = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (selectedYear) params.year = selectedYear;

      const response = await api.get('/profit', { params });
      
      setTotalProfit(Number(response.data?.net_profit));
      setData(response.data.data || []);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to fetch data');
      setResponseStatus('error');
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYearlyReport();
  }, [selectedYear]);

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
        cell: info => `${Number(info.getValue()).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        size: 290,
      },
      {
        accessorKey: 'total_expenses',
        header: 'Expenses (₱)',
        cell: info => `${Number(info.getValue()).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        size: 290,
      },
      {
        accessorKey: 'net_profit',
        header: 'Net Profit (₱)',
        cell: info => `${Number(info.getValue()).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        size: 290,
      },
    ],
    []
  );

  // Initialize the table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
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

      <AlertPopUp />

      {/* Search Controls */}
      <div className="flex flex-col w-full sm:flex-row">
        <div className='flex justify-between w-full py-3 rounded-2xl'>
          {/* Year Filter Display */}
          {selectedYear && (
            <div className="flex items-center w-full gap-2 px-5 py-2 rounded-md">
              <Calendar size={16} className="text-primary" />
              <span className="text-sm text-primary text-[15px]">
                Filtered by: {selectedYear}
              </span>
            </div>
          )}
          <div className='flex justify-end w-full'>
             <button 
                onClick={() => setShowYearPicker(true)}
                className='flex items-center gap-2 h-[35px] bg-primary text-white text-[13px] font-medium  px-3 py-5 md:px-5 rounded-md cursor-pointer hover:bg-primary-100'>
                  <Calendar className='h-[30px] md:h-[13px]' />
                  <p className='hidden md:block'>
                    Change Date Range
                  </p>
              </button>
            {selectedYear && (
              <button 
                onClick={clearYearFilter}
                className='flex items-center gap-2 h-full bg-gray-500 text-white text-[13px] font-medium px-3 md:px-5 rounded-md cursor-pointer hover:bg-gray-600 ml-2'>
                  <X className='h-[25px] md:h-[13px]' />
                  <p className='hidden md:block'>
                    Clear Filter
                  </p>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Year Picker Modal */}
      {showYearPicker && (
        <div 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} 
          className="fixed inset-0 flex items-center justify-center z-1000"
        >
          <form
              onSubmit={handleYearSubmit}
              className="w-fit flex flex-col items-center bg-white pb-5 rounded-sm shadow-lg"
          >
            <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-5 p-5">
              Select Year
              <span className="text-gray-800 hover:text-gray-600 font-normal">
                <button
                  type='button'
                  onClick={() => setShowYearPicker(false)}
                  className="cursor-pointer"
                >
                  <X size={20} />
                </button>
              </span>
            </p>
            <div className='px-5 py-3 mb-5 w-full'>
              <div className='space-y-2'>
                <DatePicker
                  selected={yearDate}
                  onChange={(date) => setYearDate(date)}
                  showYearPicker
                  dateFormat="yyyy"
                  yearItemNumber={12}
                  className='w-full border border-primary rounded-sm px-3 py-2'
                  placeholderText="Select a year"
                  required
                />
              </div>
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
      <div className='flex justify-between px-5 items-center font-medium text-gray-700 text-[14px] h-[50px] w-full bg-gray-200 rounded-bl-sm rounded-br-sm'>
        <p>
          Total Profit: 
        </p>
        <p>
          ₱ {totalProfit.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};

export default NetProfitTable;
