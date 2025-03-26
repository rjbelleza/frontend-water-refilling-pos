import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';

type Payment = {
  number: string;
  customer: string;
  totalAmount: number;
  time: string;
};

export default function PaymentTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Sample data - replace with your actual data
  const data: Payment[] = [
    {
      number: 'INV-001',
      customer: 'John Doe',
      totalAmount: 1250.0,
      time: '2023-05-01 10:30',
    },
    {
      number: 'INV-002',
      customer: 'Jane Smith',
      totalAmount: 899.99,
      time: '2023-05-02 14:15',
    },
    {
      number: 'INV-003',
      customer: 'Acme Corp',
      totalAmount: 4200.5,
      time: '2023-05-03 09:45',
    },
  ];

  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        accessorKey: 'number',
        header: 'Number',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'customer',
        header: 'Customer',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'totalAmount',
        header: 'Total Amount',
        cell: (info) => `$${info.getValue().toFixed(2)}`,
      },
      {
        accessorKey: 'time',
        header: 'Time',
        cell: (info) => info.getValue(),
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <button
            onClick={() => {
              // Handle action here
              console.log('Action clicked for', row.original);
            }}
            className="text-blue-600 hover:text-blue-900"
          >
            View
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search all columns..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="p-2 border rounded w-full max-w-md"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' ↑',
                          desc: ' ↓',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
