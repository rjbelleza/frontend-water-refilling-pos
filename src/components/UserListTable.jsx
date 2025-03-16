import React, { useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

const UserListPage = () => {
  // Sample user data
  const [userData, setUserData] = useState([
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
  ]);

  // State for the search term (now searching by ID)
  const [searchTerm, setSearchTerm] = useState('');

  // State for the role filter
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'Admin', 'Staff'

  // State for the new user form
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'Staff',
    salary: 0, // Changed from totalSpend to salary
  });

  // Handle input changes for the new user form
  const handleNewUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  // Add a new user to the table
  const addNewUser = () => {
    if (!newUser.fullName || !newUser.email || !newUser.phone || !newUser.role) {
      alert('Please fill out all required fields.');
      return;
    }

    const newUserData = {
      id: userData.length + 1, // Auto-generate ID
      ...newUser,
      registrationDate: new Date().toISOString().split('T')[0], // Set registration date to today
      totalSpend: parseFloat(newUser.salary) || 0, // Map salary to totalSpend
    };

    setUserData([...userData, newUserData]);

    // Reset the form
    setNewUser({
      fullName: '',
      email: '',
      phone: '',
      role: 'Staff',
      salary: 0, // Reset salary field
    });
  };

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
        header: 'Total Spend', // Header remains unchanged
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

  // Filter data based on search term (ID) and role filter
  const filteredData = useMemo(() => {
    return userData.filter((user) => {
      const matchesSearchTerm = user.id.toString().includes(searchTerm); // Search by ID
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearchTerm && matchesRole;
    });
  }, [userData, searchTerm, roleFilter]); // Add dependencies here

  // Use React Table
  const table = useReactTable({
    columns,
    data: filteredData, // Use filtered data
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Register New User Section */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Register New User</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] ml-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={newUser.fullName}
              onChange={handleNewUserInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] ml-2">Email</label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleNewUserInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] ml-2">Phone</label>
            <input
              type="text"
              name="phone"
              value={newUser.phone}
              onChange={handleNewUserInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] ml-2">Role</label>
            <select
              name="role"
              value={newUser.role}
              onChange={handleNewUserInputChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] ml-2">Salary</label>
            <input
              type="number"
              name="salary"
              value={newUser.salary}
              onChange={handleNewUserInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <button
          onClick={addNewUser}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add User
        </button>
      </div>

      {/* Search Bar (now searches by ID) and Role Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 mt-15">
        <input
          type="text"
          placeholder="Search by ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-1/3"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-1/4"
        >
          <option value="all">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Staff">Staff</option>
        </select>
      </div>

      {/* Table */}
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
