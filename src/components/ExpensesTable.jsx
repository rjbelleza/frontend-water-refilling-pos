import React from 'react';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';

const ExpensesTable = ({ expenses, onAddExpense }) => {
  const columns = React.useMemo(
    () => [
      { header: 'Date', accessorKey: 'date' },
      { header: 'Category', accessorKey: 'category' },
      { header: 'Amount (₱)', accessorKey: 'amount', cell: (info) => `₱${info.getValue().toLocaleString()}` },
      { header: 'Description', accessorKey: 'description' },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: expenses,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Expenses</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const newExpense = {
            date: formData.get('date'),
            category: formData.get('category'),
            amount: parseFloat(formData.get('amount')),
            description: formData.get('description'),
          };
          onAddExpense(newExpense);
          e.target.reset();
        }}
        className="mb-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="date" name="date" required className="p-2 border rounded" />
          <input type="text" name="category" placeholder="Category" required className="p-2 border rounded" />
          <input type="number" name="amount" placeholder="Amount" required className="p-2 border rounded" />
          <input type="text" name="description" placeholder="Description" className="p-2 border rounded" />
        </div>
        <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">
          Add Expense
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-3 border border-gray-200 text-left">
                    {header.column.columnDef.header}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 border border-gray-200">
                    {cell.renderValue()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpensesTable;
