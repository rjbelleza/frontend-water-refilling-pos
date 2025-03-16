import React, { useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

const UserListPage = () => {
  // Sample user data
  const userData = [
    {
      id: 1,
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      registrationDate: '2023-01-15',
      role: 'Admin',
      totalSpend: 1500,
    },
    {
      id: 2,
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+9876543210',
      registrationDate: '2023-03-22',
      role: 'Staff',
      totalSpend: 4500,
    },
    {
      id: 3,
      fullName: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      phone: '+1122334455',
      registrationDate: '2023-05-10',
      role: 'Staff',
      totalSpend: 3000,
    },
  ];

  // Define columns for the table
  const columns = useMemo(
    () => [
      {
        header: 'User ID',
        accessorKey: 'id',
      },
      {
        header: 'Full Name',
        accessorKey: 'fullName',
      },
      {
        header: 'Email',
        accessorKey: 'email',
      },
      {
        header: 'Phone',
        accessorKey: 'phone',
      },
      {
        header: 'Registration Date',
        accessorKey: 'registrationDate',
      },
      {
        header: 'Role',
        accessorKey: 'role',
      },
      {
        header: 'Total Spend',
        accessorKey: 'totalSpend',
        cell: (info) => `$${info.getValue().toLocaleString()}`,
      },
      {
        header: 'Actions',
        cell: () => (
          <div className="flex space-x-2">
            <button className="text-blue-500 hover:text-blue-700">Edit</button>
            <button className="text-red-500 hover:text-red-700">Delete</button>
          </div>
        ),
      },
    ],
    []
  );

  // Use React Table
  const table = useReactTable({
    columns,
    data: userData,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-3 border border-gray-200 text-left"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
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
};

export default UserListPage;
