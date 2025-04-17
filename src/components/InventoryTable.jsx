import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { X, SquarePen, Search, CirclePlus, Eye, Trash } from 'lucide-react';

const InventoryTable = () => {
  // Data state
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal,setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);


  const handleUpdateClick = (row) => {
    setSelectedRow(row.original);
    setShowUpdateModal(true);
  };


  const handleViewClick = (row) => {
    setSelectedRow(row.original);
    setShowViewModal(true);
  }


  const handleDeleteClick = (row) => {
    setSelectedRow(row.original);
    setShowDeleteModal(true);
  }


  const stockColorCode = (stock_quantity) => {
    if(stock_quantity <= 25) {
        return 'bg-red-500'
    } 
    else if(stock_quantity > 25 && stock_quantity <= 50) {
        return 'bg-yellow-500'
    }
    else {
        return 'bg-green-500'
    }
  }


  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  // Fetch data from recentTrans.json
  useEffect(() => {
    fetch('/data/products.json')
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
        accessorKey: 'name',
        header: 'Name',
        cell: info => info.getValue(),
        size: 290,
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: info => capitalize(info.getValue()),
        size: 160,
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: info => `₱${info.getValue().toFixed(2)}`,
        size: 260,
      },
      {
        accessorKey: 'stock_quantity',
        header: 'Stock qty.',
        cell: info => <p className={`${stockColorCode(info.getValue())} text-white py-1 px-3 w-[48px]`}>{info.getValue()}</p>,
        size: 260,
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex space-x-1'>
            <button 
              onClick={() => handleViewClick(row)}
              className="text-white bg-blue-700 hover:bg-blue-500 cursor-pointer rounded-sm px-2 py-2"
            >
              <Eye size={15} />
            </button>
            <button 
              onClick={() => handleUpdateClick(row)}
              className="text-white bg-blue-700 hover:bg-blue-500 cursor-pointer rounded-sm px-2 py-2"
            >
              <SquarePen size={15} />
            </button>
            <button 
              onClick={() => handleDeleteClick(row)}
              className="text-white bg-rose-500 hover:bg-rose-400 cursor-pointer rounded-sm px-2 py-2"
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

      <div className='flex justify-between w-full'>
        <div className='flex justify-between w-full gap-20 border border-gray-300 p-3 pl-5 rounded-2xl mb-4'>
          <div className='text-[23px] font-medium text-sky-800'>Products List</div>
            <div className='flex gap-3'>
                <div className='flex items-center h-[35px]'>
                    <Search className='mr-[-30px] text-gray-600' />
                    <input 
                        type='text' 
                        placeholder='Search' 
                        className='text-[13px] h-[35px] border border-gray-400 pl-9 pr-2 py-1 rounded-sm' 
                    />
                </div>
                <select className='h-[35px] border border-gray-400 rounded-sm px-2'>
                    <option>All</option>
                    <option>Container</option>
                    <option>Water</option>
                </select>
                <button 
                    onClick={() => setShowModal(true)}
                    className='flex items-center gap-2 h-[35px] bg-blue-800 text-white text-[13px] font-medium px-5 rounded-md cursor-pointer hover:bg-blue-700'>
                    <CirclePlus size={13} />
                    Add Product
                </button>
            </div>
          </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedRow && (
        <div
          className="fixed h-screen inset-0 flex items-center justify-center z-1000 overflow-y-auto pt-40 pb-5 scrollbar-thin"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="min-w-[800px] max-w-[800px] bg-white pb-5 rounded-sm shadow-lg">
            <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-8 p-5">
              Product Details
              <span className="text-gray-800 hover:text-gray-600 font-normal">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="cursor-pointer"
                >
                  <X size={20} />
                </button>
              </span>
            </p>
            <div className='grid grid-cols-2 gap-8 w-full px-5 mb-10'>
              <div className='flex flex-col w-full space-y-2'>
                <label for="productName" className='text-[14px] font-medium text-blue-800'>Product Name</label>
                <input 
                  id='productName'
                  value={selectedRow.name || ''}
                  className='w-full text-[13px] border border-gray-400 px-3 py-1 rounded-sm outline-none'
                  readOnly 
                />
              </div>
              <div className='flex flex-col w-full space-y-2'>
                <label for="category" className='text-[14px] font-medium text-blue-800'>Category</label>
                <input 
                  id='category'
                  value={selectedRow.category || ''}
                  className='w-full text-[13px] border border-gray-400 px-3 py-1 rounded-sm outline-none'
                  readOnly 
                />
              </div>
              <div className='flex flex-col w-full space-y-2'>
                <label for="price" className='text-[14px] font-medium text-blue-800'>Price (₱)</label>
                <input 
                  id='price'
                  value={selectedRow.price.toFixed(2) || 0}
                  className='w-full text-[13px] border border-gray-400 px-3 py-1 rounded-sm outline-none'
                  readOnly 
                />
              </div>
              <div className='flex flex-col w-full space-y-2'>
                <label for="added_by" className='text-[14px] font-medium text-blue-800'>Added By</label>
                <input 
                  id='added_by'
                  value={'Jack Frost - Admin'}
                  className='w-full text-[13px] border border-gray-400 px-3 py-1 rounded-sm outline-none'
                  readOnly 
                />
              </div>
              <div className='flex flex-col w-full space-y-2'>
                <label for="stock_quantity" className='text-[14px] font-medium text-blue-800'>Available Stock</label>
                <input 
                  id='stock_quantity'
                  value={selectedRow.stock_quantity || 0}
                  className='w-full text-[13px] border border-gray-400 px-3 py-1 rounded-sm outline-none'
                  readOnly 
                />
              </div>
              <div className='flex flex-col w-full space-y-2'>
                <label for="stock_quantity" className='text-[14px] font-medium text-blue-800'>Stock Status</label>
                <input 
                  id='stock_quantity'
                  value={selectedRow.stock_quantity <= 25 ? 'Low Stock' : 'In stock'}
                  className={`w-full text-white ${selectedRow.stock_quantity <= 25 ? 'bg-red-500' : 'bg-green-500'} text-[13px] px-3 py-1 rounded-sm outline-none`}
                  readOnly 
                />
              </div>
            </div>
            <div className='w-full px-5 py-5 border-t-1 border-dashed border-gray-400'>
              <p className='text-[14px] font-medium text-blue-900'>Stock In / Stock Out History</p>
              <table className='w-full mt-5 border-collapse'>
                <thead>
                  <tr className='text-left text-[13px] rounded-md'>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>User</th>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>Action</th>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>Quantity</th>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    [
                      {user: 'Jack Frost', action: 'Stock in', quantity: '0', dateTime: '0000-00-00, 00:00'},
                      {user: 'Jack Frost', action: 'Stock out', quantity: '0', dateTime: '0000-00-00, 00:00'},
                      {user: 'Jack Frost', action: 'Stock out', quantity: '0', dateTime: '0000-00-00, 00:00'},
                      {user: 'Jack Frost', action: 'Stock out', quantity: '0', dateTime: '0000-00-00, 00:00'},
                      {user: 'Jack Frost', action: 'Stock out', quantity: '0', dateTime: '0000-00-00, 00:00'},
                      {user: 'Jack Frost', action: 'Stock out', quantity: '0', dateTime: '0000-00-00, 00:00'},
                    ].map((data, index) => (
                      <tr key={index} className='text-[13px]'>
                        <td className='px-3 py-2 border-b border-gray-200'>{data.user}</td>
                        <td className='px-3 py-2 border-b border-gray-200'>{data.action}</td>
                        <td className='px-3 py-2 border-b border-gray-200'>{data.quantity}</td>
                        <td className='px-3 py-2 border-b border-gray-200'>{data.dateTime}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && selectedRow && (
        <div
          className="fixed inset-0 flex items-center justify-center z-1000"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        >
          <div className="min-w-[800px] max-w-[800px] bg-white pb-5 rounded-sm shadow-lg">
            <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-8 p-5">
              Update Product
              <span className="text-gray-800 hover:text-gray-600 font-normal">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="cursor-pointer"
                >
                  <X size={20} />
                </button>
              </span>
            </p>
            <div className='grid grid-cols-2 gap-7 w-full px-5 mb-12 flex-wrap'>
              <div className='flex flex-col w-full space-y-2 mx-auto'>
                <label for="productName" className='text-[14px] font-medium text-blue-800'>Product Name <span className='text-red-700'>*</span></label>
                <input
                  id='productName'
                  type='text'
                  value={selectedRow.name || ''}
                  className='w-full text-[13px] border border-gray-400 px-3 py-1 rounded-sm focus:outline-gray-500'
                />
              </div>
              <div className='flex flex-col w-full space-y-2 mx-auto'>
                <label for="category" className='text-[14px] font-medium text-blue-800'>Category <span className='text-red-700'>*</span></label>
                <select
                  id="category"
                  className='w-full text-[13px] border border-gray-400 px-3 py-1 rounded-sm focus:outline-gray-500'
                >
                  {['Water', 'Container'].map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className='flex flex-col w-full space-y-2 mx-auto'>
                <label for="price" className='text-[14px] font-medium text-blue-800'>Price (₱) <span className='text-red-700'>*</span></label>
                <input
                  id='price'
                  type='text'
                  value={selectedRow.price.toFixed(2) || 0}
                  className='w-full text-[13px] border border-gray-400 px-3 py-1 rounded-sm focus:outline-gray-500'
                />
              </div>
              <div className='flex flex-col w-full space-y-2 mx-auto'>
                <label for="stock" className='text-[14px] font-medium text-blue-800'>Stock qty. <span className='text-red-700'>*</span></label>
                <input
                  id='stock'
                  type='text'
                  value={selectedRow.stock_quantity || 0}
                  className='w-full text-[13px] border border-gray-400 px-3 py-1 rounded-sm focus:outline-gray-500'
                />
              </div>
            </div>
            <div className='flex justify-end w-full space-x-2 px-5'>
              <button 
                onClick={() => setShowUpdateModal(false)}
                className='text-[12px] text-white bg-blue-500 rounded-md px-3 py-2 cursor-pointer hover:bg-blue-800'>
                Cancel
              </button>
              <button 
                onClick={() => setShowUpdateModal(false)}
                className='text-[12px] text-white bg-blue-900 rounded-md px-3 py-2 cursor-pointer hover:bg-blue-800'>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedRow && (
        <div
          className="fixed inset-0 flex items-center justify-center z-1000"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        >
          <div className="min-w-[400px] max-w-[400px] bg-white pb-5 rounded-sm shadow-lg">
            <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-8 p-5">
              Delete Product
              <span className="text-gray-800 hover:text-gray-600 font-normal">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="cursor-pointer"
                >
                  <X size={20} />
                </button>
              </span>
            </p>
            <div className='w-full px-5 space-y-7 mb-15'>
              <p className='font-medium text-center'>Are you sure you want to delete this product?</p>
              <div className='w-full text-center'>
                <p className='text-[20px] text-blue-700 font-bold mb-3'>"{selectedRow.name || ''}"</p>
                <div className='w-full border border-gray-300'></div>
              </div>
            </div>
            <div className='flex justify-end w-full text-[12px] space-x-2 px-5'>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className='text-white bg-blue-500 px-4 py-[] rounded-md cursor-pointer hover:bg-blue-400'>
                Cancel
              </button>
              <button className='text-white bg-blue-950 px-4 py-[6px] rounded-md cursor-pointer hover:bg-blue-900'>
                Confirm
              </button>
            </div>
          </div>
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

      {/* Add product modal */}
      <div 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} 
            className={`fixed inset-0 flex items-center justify-center z-1000 transition-opacity duration-300
                ${showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div className={`min-w-[500px] bg-white pb-5 rounded-sm shadow-lg transform transition-transform duration-300
                ${showModal ? 'scale-100' : 'scale-95'}`
            }>
                <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-8 p-5">
                  Add Product
                  <span className="text-gray-800 hover:text-gray-600 font-normal">
                    <button
                      onClick={() => setShowModal(false)}
                      className="cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </span>
                </p>
                <form className='flex flex-col gap-7 p-5 mb-5'>
                  <div className='flex flex-col w-full space-y-2 mx-auto'>
                    <label for="product_name" className='text-[14px] font-medium text-blue-800'>Product Name <span className='text-red-700'>*</span></label>
                    <input
                      id='product_name'
                      type='text'
                      className='w-full text-[13px] border border-gray-400 px-3 py-1 rounded-sm focus:outline-gray-500'
                    />
                  </div>
                  <div className='flex flex-col w-full space-y-2 mx-auto'>
                    <label for="price" className='text-[14px] font-medium text-blue-800'>Price <span className='text-red-700'>*</span></label>
                    <input
                      id='price'
                      type='number'
                      min={1}
                      className='w-full text-[13px] border border-gray-400 px-3 py-1 rounded-sm focus:outline-gray-500'
                    />
                  </div>
                  <div className='flex flex-col w-full space-y-2 mx-auto'>
                    <label for="category" className='text-[14px] font-medium text-blue-800'>Category <span className='text-red-700'>*</span></label>
                    <select id='category' className='w-full text-[13px] border border-gray-400 px-3 py-1 rounded-sm focus:outline-gray-500'>
                      {["Water", "Container"].map((category, index) => (
                        <option 
                          key={index} 
                          value={category}
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='flex flex-col w-full space-y-2 mx-auto'>
                    <label for="stock" className='text-[14px] font-medium text-blue-800'>Stock <span className='text-red-700'>*</span></label>
                    <input
                      id='stock'
                      type='number'
                      min={1}
                      className='w-full text-[13px] border border-gray-400 px-3 py-1 rounded-sm focus:outline-gray-500'
                    />
                  </div>
                </form>
                <div className='flex justify-end w-full px-5'>
                  <button className='text-[12px] text-white bg-blue-900 px-4 py-2 rounded-sm hover:bg-blue-800 cursor-pointer'>
                    Add Product
                  </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default InventoryTable;
