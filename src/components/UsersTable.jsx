import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { X, Pencil, CirclePlus, Search, Trash } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import api from '../api/axios';
import LoadingAnimation from './LoadingAnimation';
import Snackbar from './Snackbar';
import AlertPopUp from './AlertPopUp';


const UsersTable = () => {
  // Data state
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [selectedRow, setSelectedRow] = useState(null);
  const [addUserModal, setAddUserModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [message, setMessage ] = useState('');
  const [responseStatus, setResponseStatus ] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newUser, setNewUser] = useState({
    fname: '',
    lname: '', 
    username: '',
    password: '',
    password_confirmation: '',
    role: ''
  });

  const [newDetails, setNewDetails] = useState({
    fname: '',
    lname: '', 
    username: '',
    password: '',
    password_confirmation: '',
    role: ''
  });

  const handleUpdateClick = (row) => {
    setSelectedRow(row.original);
    setNewDetails({
      fname: row.original.fname,
      lname: row.original.lname,
      username: row.original.username,
      role: row.original.role,
      password: row.original.passsword,
      password_confirmation: ''
    });
    setShowUpdateModal(true);
  };

   const handleSaveChanges = async (e) => {
      e.preventDefault();    
      try {
          if (!selectedRow || !selectedRow.id) {
              return;
          }
  
          const response = await api.put(`/user/update/${selectedRow.id}`, newDetails);
          setMessage(response.data?.message);
          setResponseStatus(response.data?.status);
          setShowUpdateModal(false);
          setShowSnackbar(true);
          setRefreshKey(prev => prev + 1);
      } catch (error) {
          setMessage(error.response?.data?.message);
          setResponseStatus(error.response?.data?.status);
          setShowUpdateModal(false);
          setShowSnackbar(true);
      }
    };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    
    setNewUser(prev => ({
      ...prev, 
      [name]: value
    }));
  };

  const handleNewDetailsChange = (e) => {
    const { name, value } = e.target;
    
    setNewDetails(prev => ({
      ...prev, 
      [name]: value
    }));
  };

  const addUser = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/user/add', newUser);
      setMessage(res.data?.message);
      setResponseStatus(res.data?.status);
      setNewUser({
        fname: '',
        lname: '', 
        username: '',
        password: '',
        password_confirmation: '',
        role: ''
      });
      setAddUserModal(false);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setResponseStatus('error');
      setMessage(err.response?.data?.message);
    } finally {
      setShowSnackbar(true);
    }
  }

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleDeleteClick = (row) => {
    setSelectedRow(row.original);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/user/${selectedRow.id}/disable`);
      setRefreshKey(prev => prev + 1);
      setMessage('User deleted successfully');
      setResponseStatus('success');
      setShowSnackbar(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error deleting user');
      setResponseStatus('error');
    } finally {
      setShowDeleteModal(false);
      setShowSnackbar(true);
    }
  };

  useEffect(() => {
    // Fetch Users data from server
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    }
    fetchUsers();
  }, [refreshKey]);

  // Define columns
  const columns = useMemo(
    () => [
      {
        id: 'rowNumber',
        header: '#',
        cell: ({ row }) => row.index + 1,
        size: 100,
        accessorFn: (row, index) => index + 1,
      },
      {
        accessorKey: 'fname',
        header: 'First Name',
        cell: info => info.getValue(),
        size: 200,
      },
      {
        accessorKey: 'lname',
        header: 'Last Name',
        cell: info => info.getValue(),
        size: 200,
      },
      {
        accessorKey: 'username',
        header: 'Username',
        cell: info => info.getValue(),
        size: 200,
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: info => capitalize(info.getValue()),
        size: 150,
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: info => format(parseISO(info.getValue()), "MMM dd, yyyy, hh:mm a"),
        size: 250,
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
             <div className='flex space-x-1'>
                 <button 
                     onClick={() => handleUpdateClick(row)}
                     className="text-white bg-primary hover:bg-primary-100 cursor-pointer rounded-sm px-2 py-2"
                 >
                     <Pencil size={15} />
                 </button>
                  <button 
                     onClick={() => handleDeleteClick(row)}
                     className="text-white bg-red-400 hover:bg-red-300 cursor-pointer rounded-sm px-2 py-2"
                 >
                     <Trash size={15} />
                 </button>
             </div>
        ),
        size: 20,
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

      {showSnackbar && (
        <Snackbar 
          message={message && message}
          type={responseStatus}
          onClose={() => setShowSnackbar(false)}
        />
      )}

      {!showSnackbar && (
        <AlertPopUp 
          refresh={refreshKey} 
        />
      )}

      <div className='flex justify-between w-full'>
        <div className='flex justify-end w-full py-3'>
            <div className='flex gap-3'>
              <div className='flex items-center h-[35px]'>
                  <Search className='mr-[-30px] text-gray-600' />
                  <input 
                      type='text' 
                      placeholder='Search' 
                      className='text-[13px] h-[35px] border border-gray-400 pl-9 pr-2 py-1 rounded-sm' 
                  />
              </div>
              <button 
                  onClick={() => setAddUserModal(true)}
                  className='flex items-center gap-2 h-[35px] bg-primary text-white text-[13px] font-medium px-2 md:px-5 rounded cursor-pointer hover:bg-primary-100'>
                  <CirclePlus className='h-[25px] md:h-[13px]' />
                  <p className='hidden md:block'>
                    Add User
                  </p>
              </button>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showUpdateModal && selectedRow && (
      <div 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} 
        className={`fixed inset-0 flex items-center justify-center z-1000 transition-opacity pt-80 pb-5 md:pt-0 md:pb-0 duration-300 scrollbar-thin overflow-y-auto
            ${showUpdateModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <form onSubmit={handleSaveChanges} className={`w-[90%] md:w-[500px] bg-white pb-5 rounded-sm shadow-lg transform transition-transform duration-300
            ${showUpdateModal ? 'scale-100' : 'scale-95'}`
        }>
            <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-8 p-5">
                Edit User
                <span className="text-gray-800 hover:text-gray-600 font-normal">
                    <button
                      type='button'
                      onClick={() =>setShowUpdateModal(false)}
                      className="cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                </span>
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 w-full p-5'>
              <div>
                <label htmlFor='fname' className='text-[14px] font-medium text-blue-800'>First Name <span className='text-red-500'>*</span></label>
                <input 
                    id='fname'
                    type='text' 
                    required
                    name='fname'
                    value={newDetails.fname || ''}
                    onChange={handleNewDetailsChange}
                    className='w-full text-[15px] border border-gray-400 px-3 py-2 rounded-sm outline-gray-500 mb-5 mt-2'                      
                />
              </div>      
              <div>          
                <label htmlFor='lname' className='text-[14px] font-medium text-blue-800'>Last Name <span className='text-red-500'>*</span></label>
                <input 
                    id='lname'
                    type='text' 
                    name='lname'
                    value={newDetails.lname || ''}
                    onChange={handleNewDetailsChange}
                    className='w-full text-[15px] border border-gray-400 px-3 py-2 rounded-sm outline-gray-500 mb-5 mt-2'
                />
              </div>
              <div>
                <label htmlFor='username' className='text-[14px] font-medium text-blue-800'>Username <span className='text-red-500'>*</span></label>
                <input 
                    id='username'
                    type='text' 
                    required
                    name='username'
                    value={newDetails.username}
                    onChange={handleNewDetailsChange}
                    className='w-full text-[15px] border border-gray-400 px-3 py-2 rounded-sm outline-gray-500 mb-5 mt-2'
                />
              </div>
              <div>
                <label htmlFor='role' className='text-[14px] font-medium text-blue-800'>Role <span className='text-red-500'>*</span></label>
                <select 
                    id='role'
                    required
                    name='role'
                    value={newDetails.role || ''}
                    onChange={handleNewDetailsChange}
                    className='w-full text-[15px] border border-gray-400 px-3 py-2 rounded-sm outline-gray-500 mb-5 mt-2'
                >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                </select>
              </div>
              <div>
                <label htmlFor='password' className='text-[14px] font-medium text-blue-800'>New Password <span className='text-red-500'>*</span></label>
                <input 
                    id='password'
                    type='password' 
                    name='password'
                    value={newDetails.password || ''}
                    onChange={handleNewDetailsChange}
                    className='w-full text-[15px] border border-gray-400 px-3 py-2 rounded-sm outline-gray-500 mb-5 mt-2'
                />
              </div> 
              <div>
                <label htmlFor='confirm_password' className='text-[14px] font-medium text-blue-800'>Confirm Password <span className='text-red-500'>*</span></label>
                <input 
                    id='confirm_password'
                    type='password' 
                    name='password_confirmation'
                    value={newDetails.password_confirmation || ''}
                    onChange={handleNewDetailsChange}
                    className='w-full text-[15px] border border-gray-400 px-3 py-2 rounded-sm outline-gray-500 mb-5 mt-2'
                />
              </div>
            </div>
            <div className='flex justify-center w-full px-5 mt-5 space-x-2'>
                <button
                  type='submit'
                  className='bg-primary text-white font-medium w-3/4 px-3 py-3 text-[15px] rounded-sm cursor-pointer hover:bg-primary-100'
                  >
                    SUBMIT
                </button>
            </div>
        </form>
      </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedRow && (
        <div
          className="fixed inset-0 flex items-center justify-center z-1000"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        >
          <form
            onSubmit={handleDeleteUser} 
            className="w-[90%] md:w-[400px] bg-white pb-5 rounded-sm shadow-lg">
            <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-8 p-5">
              Delete User
              <span className="text-gray-800 hover:text-gray-600 font-normal">
                <button
                  type='button'
                  onClick={() => setShowDeleteModal(false)}
                  className="cursor-pointer"
                >
                  <X size={20} />
                </button>
              </span>
            </p>
            <div className='w-full px-5 space-y-7 mb-15'>
              <p className='text-center'>Are you sure you want to delete this user?</p>
              <div className='w-full text-center'>
                <p className='text-[20px] text-blue-700 font-bold mb-3'>"{`${selectedRow.fname} ${selectedRow.lname} - ${capitalize(selectedRow.role)}`}"</p>
              </div>
            </div>
            <div className='flex w-full text-[12px] space-x-2 px-5'>
              <button
                type='submit' 
                className='text-white text-[15px] font-medium w-full bg-primary px-4 py-2 rounded-sm cursor-pointer hover:bg-primary-100'>
                CONFIRM
              </button>
            </div>
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
                  {loading ? <LoadingAnimation /> : error ? 'Error fetching data!' : 'No records found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4 px-1">
        <div className="flex-1 flex justify-center sm:hidden">
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

      {/* Add user modal */}
      <div 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} 
            className={`fixed inset-0 flex items-center justify-center z-999 transition-opacity duration-300 scrollbar-thin overflow-y-auto
                ${addUserModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <form onSubmit={addUser} className={`w-[90%] md:w-[500px] bg-white pb-5 rounded-sm shadow-lg transform transition-transform duration-300
                ${addUserModal ? 'scale-100' : 'scale-95'}`
            }>
                 <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-8 p-5">
                    Add User
                    <span className="text-gray-800 hover:text-gray-600 font-normal">
                      <button
                        type='button'
                        onClick={() => setAddUserModal(false)}
                        className="cursor-pointer"
                      >
                        <X size={20} />
                      </button>
                    </span>
                  </p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5 w-full p-5'>
                    <div>
                      <label htmlFor='fname' className='text-[15px] font-medium text-blue-800'>First Name <span className='text-red-500'>*</span></label>
                      <input 
                          id='fname'
                          type='text' 
                          name="fname"
                          value={newUser.fname}
                          onChange={handleNewUserChange}
                          required
                          className='w-full text-[15px] border border-gray-400 px-3 py-2 rounded-sm outline-gray-500'                      
                      />
                    </div>
                    <div>
                      <label htmlFor='lname' className='text-[15px] font-medium text-blue-800'>Last Name <span className='text-red-500'>*</span></label>
                      <input 
                          id='lname'
                          type='text' 
                          name="lname"
                          value={newUser.lname}
                          onChange={handleNewUserChange}
                          required
                          className='w-full text-[15px] border border-gray-400 px-3 py-2 rounded-sm outline-gray-500'
                      />
                    </div>
                    <div>
                      <label htmlFor='username' className='text-[15px] font-medium text-blue-800'>Username <span className='text-red-500'>*</span></label>
                      <input 
                          id='username'
                          type='text' 
                          name="username"
                          value={newUser.username}
                          onChange={handleNewUserChange}
                          required
                          className='w-full text-[15px] border border-gray-400 px-3 py-2 rounded-sm outline-gray-500'
                      />
                    </div>
                    <div>
                      <label htmlFor='role' className='text-[15px] font-medium text-blue-800'>Role <span className='text-red-500'>*</span></label>
                      <select 
                          id='role'
                          name="role"
                          value={newUser.role}
                          onChange={handleNewUserChange}
                          required
                          className='w-full text-[15px] border border-gray-400 px-3 py-2 rounded-sm outline-gray-500'
                      >
                          <option>-- Select Role --</option>
                          <option value="admin">Admin</option>
                          <option value="staff">Staff</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor='password' className='text-[15px] font-medium text-blue-800'>Password <span className='text-red-500'>*</span></label>
                      <input 
                          id='password'
                          type='password' 
                          name="password"
                          value={newUser.password}
                          onChange={handleNewUserChange}
                          required
                          className='w-full text-[15px] border border-gray-400 px-3 py-2 rounded-sm outline-gray-500'
                      />
                    </div>
                    <div>
                      <label htmlFor='confirm_password' className='text-[15px] font-medium text-blue-800'>Confirm Password <span className='text-red-500'>*</span></label>
                      <input 
                          id='confirm_password'
                          type='password' 
                          name="password_confirmation"
                          value={newUser.password_confirmation}
                          onChange={handleNewUserChange}
                          required
                          className='w-full text-[15px] border border-gray-400 px-3 py-2 rounded-sm outline-gray-500'
                      />
                    </div>
                </div>
                <div className='flex justify-center w-full px-5 mt-5'>
                  <button
                    type='submit'
                    className='bg-primary w-3/4 text-white px-3 py-3 text-[15px] rounded-sm cursor-pointer font-medium hover:bg-primary-100'
                  >
                    CONFIRM
                  </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default UsersTable;
