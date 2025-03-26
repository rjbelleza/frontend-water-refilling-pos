import React, { useState, useEffect, useMemo } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel, 
  getPaginationRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const RecentTransTable = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/recentTrans.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const jsonData = await response.json();
        
        const preparedData = jsonData.map((item, index) => ({
          ...item,
          id: index + 1
        }));
        
        setTableData(preparedData);
      } catch (error) {
        console.error('Error loading data:', error);
        setTableData([{
          id: 1,
          customer: "Sample Customer",
          totalAmount: 1000.00,
          dateTime: new Date().toISOString()
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleView = (rowData) => {
    console.log('Viewing:', rowData);
    alert(`Viewing: ${rowData.customer}\nAmount: ₱${rowData.totalAmount.toFixed(2)}`);
  };

  const columnHelper = createColumnHelper();

  const columns = useMemo(() => [
    columnHelper.accessor('id', {
      header: '#',
      cell: info => info.getValue(),
      size: 60
    }),
    columnHelper.accessor('customer', {
      header: 'Customer',
      cell: info => info.getValue(),
      size: 200
    }),
    columnHelper.accessor('totalAmount', {
      header: 'Amount',
      cell: info => `₱${info.getValue().toFixed(2)}`,
      size: 150
    }),
    columnHelper.accessor('dateTime', {
      header: 'Time',
      cell: info => new Date(info.getValue()).toLocaleString(),
      size: 200
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <button 
          onClick={() => handleView(row.original)}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm"
        >
          View Details
        </button>
      ),
      size: 150
    })
  ], []);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse text-gray-500 text-lg">
        Loading transactions...
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b px-6 py-4">
        <h2 className='text-xl font-semibold text-gray-800'>
          Recent Transactions (Today)
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                    style={{ width: header.getSize() }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      <span className="ml-2">
                        {header.column.getIsSorted() === 'asc' ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : null}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y">
            {table.getRowModel().rows.map(row => (
              <tr 
                key={row.id} 
                className="hover:bg-gray-50 transition-colors"
              >
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id} 
                    className="px-6 py-4 text-sm text-gray-700"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-t">
        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecentTransTable;
