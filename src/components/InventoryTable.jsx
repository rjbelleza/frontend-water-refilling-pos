import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { X, SquarePen, Search, CirclePlus, Eye, Tags, Trash2, Settings, Notebook, Package, Trash } from 'lucide-react';
import api from '../api/axios';
import Snackbar from './Snackbar';

const InventoryTable = () => {
  // Data state
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUpdateModal,setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [toStock, setToStock] = useState(0);
  const [newStock, setNewStock] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);
  const [stockAction, setStockAction] = useState('');
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: ''});
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [message, setMessage ] = useState([]);
  const [error, setError] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // Refresh trigger
  const [loading, setLoading] = useState(true);
  const [selectionModal, setSelectionModal] = useState(false);
  const [selectRow, setSelectRow] = useState(null);
  const [showUpdateStockModal, setShowUpdateStockModal] = useState(false);


  // New Product States
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock_quantity: 0,
    category_id: '',
  });


  const [newDetails, setNewDetails] = useState({
    name: '',
    price: '',
    category_id: '',
  });

  const deleteProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch(`/product/delete/${selectedRow.id}`);
      setMessage(response.data.message);
      setShowDeleteModal(false);
      setRefreshKey(prev => prev + 1);
      setShowSnackbar(true);
    } catch (error) {
      setError(error.response.data.message);
      setShowDeleteModal(false);
      setShowSnackbar(true);
    }
  };


  const AddProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/product', newProduct);
      setMessage(response.data.message);
      setShowModal(false); 
      setRefreshKey(prev => prev + 1);
      setNewProduct({
        name: '',
        price: '',
        stock_quantity: 0,
        category_id: ''});
      console.log(newProduct);
      setShowSnackbar(true);
    } catch (error) {
      setError(error.response.data.message);
      setNewProduct({
        name: '',
        price: '',
        stock_quantity: 0,
        category_id: ''});
      console.log(newProduct);
      setShowModal(false);
      setShowSnackbar(true);
    }
  };


  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(response.data.error);
      setShowSnackbar(true);
    }
  };


  // New product input onChange handler
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev, [name]: name === 'category_id' ? (value === '' ? null : Number(value)) : value
    }));
  };


  const handleNewDetailsChange = (e) => {
    const { name, value } = e.target;
    setNewDetails(prev => ({
      ...prev, [name]: name === 'category_id' ? (value === '' ? null : Number(value)) : value
    }));
  };


  const handleSaveChanges = async (e) => {
    e.preventDefault();    
    try {
        if (!selectedRow || !selectedRow.id) {
            console.error('No product selected for update');
            return;
        }

        const response = await api.put(`/product/${selectedRow.id}`, newDetails);
        setMessage(response.data.message);
        setShowUpdateModal(false);
        setShowSnackbar(true);
        setRefreshKey(prev => prev + 1);
    } catch (error) {
        setError(error.response.data.message);
        console.error('Failed to update product:', error);
    }
  };


useEffect(() => {
  if(stockAction == 'stock-in') {
    setNewStock(Number(currentStock) + Number(toStock));
  }
  else if (stockAction == 'stock-out') {
    setNewStock(Number(currentStock) - Number(toStock));
  }
}, [toStock, stockAction])


  const handleUpdateClick = (row) => {
    setSelectedRow(row.original);
    setNewDetails({
      name: row.original.name,
      price: row.original.price,
      category_id: row.original.category_id
    });
    setShowUpdateModal(true);
    setSelectionModal(false);
  };


  const handleUpdateStockClick = (row) => {
    setSelectRow(row.original);
    setShowUpdateStockModal(true);
    setSelectionModal(false);
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


  // Fetch categories in mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [refreshKey]);


  const newCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  const CreateCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/category', newCategory);
      setMessage(response.data.message);
      setNewCategory({ name: '' });
      setShowCategoryModal(false);
      setShowSnackbar(true);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      setError(error.response.data.message);
      setNewCategory({ name: '' });
      setShowCategoryModal(false);
      setShowSnackbar(true);
    }
  };

  
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      setError(error.response.data.error);
      setShowSnackbar(true);
    }
  }


  const deleteCategory = async (id) => {
    try {
      const response = await api.patch(`/category/disable/${id}`);
      setMessage(response.data.message);
      setShowCategoryModal(false);
      setRefreshKey(prev => prev + 1);
      setShowSnackbar(true);
    } catch (error) {
      setError(error.message);
      setShowSnackbar(true);
    }
  }

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
        accessorKey: 'category.name',
        header: 'Category',
        cell: info => info.getValue(),
        size: 160,
      },
      {
        accessorKey: 'price',
        header: 'Price (₱)',
        cell: info => info.getValue(),
        size: 260,
      },
      {
        accessorKey: 'stock_quantity',
        header: 'Stock',
        cell: info => info.getValue(),
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
              onClick={() => {setSelectionModal(true); setSelectRow(row);}}
              className="text-white bg-blue-700 hover:bg-blue-500 cursor-pointer rounded-sm px-2 py-2"
            >
              <SquarePen size={15} />
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
          message={message.length > 0 ? message : error.length > 0 ? error : ''}
          type={message.length > 0 ? 'success' : error.length > 0 ? 'error' : ''}
          onClose={() => setShowSnackbar(false)}
        />
      )}

      <div className='flex justify-between w-full'>
        <div className='flex justify-between w-full gap-20 border border-gray-300 p-3 pl-5 rounded-2xl mb-4'>
          <div className='text-[23px] font-medium text-sky-800'>Products List</div>
            <div className='flex gap-1'>
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
                    {categories.map((category) => (
                      <option key={category.id}>{category.name}</option>
                    ))}
                </select>
                <button 
                  onClick={() => {setShowCategoryModal(true); fetchCategories();}}
                  className='flex items-center gap-2 h-[35px] bg-blue-800 text-white text-[13px] font-medium px-5 rounded-md cursor-pointer hover:bg-blue-700'>
                  <Tags size={15} />
                  Categories
                </button>
                <button 
                    onClick={() => setShowModal(true)}
                    className='flex items-center gap-2 h-[35px] bg-blue-800 text-white text-[13px] font-medium px-5 rounded-md cursor-pointer hover:bg-blue-700'>
                    <CirclePlus size={13} />
                    Add Product
                </button>
                <button className='bg-blue-800 px-2 rounded-md'>
                  <Settings size={20} className='text-white' />
                </button>
            </div>
          </div>
      </div>

      {/* Update Selection Modal */}
      {selectionModal && (
        <div
          className="fixed h-screen inset-0 flex flex-col items-center justify-center z-1000"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className='flex justify-end w-[400px] mb-2'>
            <button 
              onClick={() => setSelectionModal(false)}
              className='bg-gray-700 rounded-full p-1 cursor-pointer'
            >
              <X size={18} className='text-gray-200' />
            </button>
          </div>
          <div className='grid grid-cols-2 gap-3 bg-white w-[400px] h-[200px] p-5 rounded-sm'>
            <button
              onClick={() => handleUpdateClick(selectRow)}
              type='button' 
              className='flex flex-col gap-3 justify-center items-center bg-blue-600 hover:bg-blue-500 h-full w-full col-span-1 rounded-sm cursor-pointer shadow-md shadow-blue-800'>
              <p className='font-medium text-white'>Update Details</p>
              <Notebook size={30} className='text-white' />
            </button>
            <button
              onClick={() => handleUpdateStockClick(selectRow)}
              type='button' 
              className='flex flex-col gap-3 justify-center items-center bg-blue-600 hover:bg-blue-500 h-full w-full col-span-1 rounded-sm cursor-pointer shadow-md shadow-blue-800'>
              <p className='font-medium text-white'>Update Stock</p>
              <Package size={30} className='text-white' />
            </button>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      <div 
         style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} 
         className={`fixed inset-0 flex items-center justify-center z-1000 transition-opacity duration-300
             ${showCategoryModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
         <form
             onSubmit={CreateCategory} 
             className={`min-w-[500px] bg-white pb-5 rounded-sm shadow-lg transform transition-transform duration-300
             ${showCategoryModal ? 'scale-100' : 'scale-95'}`
         }>
           <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-8 p-5">
             Categories
             <span className="text-gray-800 hover:text-gray-600 font-normal">
               <button
                 type='button'
                 onClick={() => setShowCategoryModal(false)}
                 className="cursor-pointer"
               >
                 <X size={20} />
               </button>
             </span>
           </p>
           <div className='flex flex-col w-full p-5'>
              <div className='w-full'>
                {categories.length < 1 ? (
                  <p className='w-full text-center mb-10'>No categories added</p>
                ) : categories.map((category) => (
                  <div key={category.id} className='flex justify-between items-center w-full text-[14px] border border-gray-400 px-3 py-1 rounded-sm outline-gray-500 mb-2'>
                    {category.name}
                    <Trash2 onClick={() => deleteCategory(category.id)} size={20} className='cursor-pointer hover:text-gray-700' />
                  </div>
                ))}
              </div>
              <input
                type='text'
                name='name'
                value={newCategory.name}
                onChange={newCategoryChange}
                placeholder='Add category'
                className='w-full text-[14px] border border-gray-400 px-3 py-1 rounded-sm outline-gray-500'
                required
              />
           </div>
           <div className='flex justify-end w-full px-5 mt-5'>
              <button
                type='submit'
                className={`text-white px-3 py-2 text-[13px] rounded-sm
                            ${newCategory.name == '' ? 'bg-gray-500' : 'bg-blue-900 hover:bg-blue-800 cursor-pointer'}`}
                disabled={newCategory.name == ''}
              >
                Submit
              </button>
           </div>
          </form>
        </div>

      {/* View Modal */}
      {showViewModal && selectedRow && (
        <div
          className="fixed h-screen inset-0 flex items-center justify-center z-1000 overflow-y-auto pt-40 pb-15 scrollbar-thin"
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
                <label htmlFor="productName" className='text-[14px] font-medium text-blue-800'>Product Name</label>
                <input 
                  id='productName'
                  value={selectedRow.name || ''}
                  className='w-full text-[18px] bg-gray-200 px-3 py-1 rounded-sm outline-none'
                  readOnly 
                />
              </div>
              <div className='flex flex-col w-full space-y-2'>
                <label htmlFor="category" className='text-[14px] font-medium text-blue-800'>Category</label>
                <input 
                  id='category'
                  value={selectedRow.category.name || ''}
                  className='w-full text-[18px] bg-gray-200 px-3 py-1 rounded-sm outline-none'
                  readOnly 
                />
              </div>
              <div className='flex flex-col w-full space-y-2'>
                <label htmlFor="price" className='text-[14px] font-medium text-blue-800'>Price (₱)</label>
                <input 
                  id='price'
                  value={selectedRow.price || ''}
                  className='w-full text-[18px] bg-gray-200 px-3 py-1 rounded-sm outline-none'
                  readOnly 
                />
              </div>
              <div className='flex flex-col w-full space-y-2'>
                <label htmlFor="added_by" className='text-[14px] font-medium text-blue-800'>Added By</label>
                <input 
                  id='added_by'
                  value={`${selectedRow.user.fname} ${selectedRow.user.lname} - ${capitalize(selectedRow.user.role)}`}
                  className='w-full text-[18px] bg-gray-200 px-3 py-1 rounded-sm outline-none'
                  readOnly 
                />
              </div>
              <div className='flex flex-col w-full space-y-2'>
                <label htmlFor="stock_quantity" className='text-[14px] font-medium text-blue-800'>Current Stock</label>
                <input 
                  id='stock_quantity'
                  value={selectedRow.stock_quantity || 0}
                  className='w-full text-[18px] bg-gray-200 px-3 py-1 rounded-sm outline-none'
                  readOnly 
                />
              </div>
            </div>
            <div className='w-full px-5 py-5 border-t-1 border-dashed border-gray-400'>
              <p className='text-[14px] font-medium text-blue-900'>Update History</p>
              <table className='w-full mt-5 border-collapse'>
                <thead>
                  <tr className='text-left text-[13px] rounded-md'>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>User</th>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>Field Changed</th>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>Old Value</th>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>New Value</th>
                    <th className='bg-gray-200 font-medium py-2 px-3 border border-gray-200'>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Update Details Modal */}
      {showUpdateModal && selectedRow && (
        <div
          className="fixed inset-0 flex items-center justify-center z-1000"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        >
          <form 
            onSubmit={handleSaveChanges}
            className="min-w-[500px] max-w-[500px] bg-white pb-5 rounded-sm shadow-lg"
          >
            <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-8 p-5">
              Update Product Details
              <span className="text-gray-800 hover:text-gray-600 font-normal">
                <button
                  type='button'
                  onClick={() => {setShowUpdateModal(false); setStockAction('none')}}
                  className="cursor-pointer"
                >
                  <X size={20} />
                </button>
              </span>
            </p>
            <div className='grid grid-cols-1 gap-7 w-full px-5 mb-12 flex-wrap'>
              <div className='flex flex-col w-full space-y-2 mx-auto'>
                <label htmlFor="productName" className='text-[14px] font-medium text-blue-800'>Product Name <span className='text-red-700'>*</span></label>
                <input
                  id='productName'
                  type='text'
                  name='name'
                  value={newDetails.name || ''}
                  onChange={handleNewDetailsChange}
                  className='w-full text-[17px] border border-gray-400 px-3 py-1 rounded-sm focus:outline-gray-500'
                />
              </div>
              <div className='flex flex-col w-full space-y-2 mx-auto'>
                <label htmlFor="category" className='text-[14px] font-medium text-blue-800'>Category <span className='text-red-700'>*</span></label>
                <select
                  id="category"
                  name='category_id'
                  value={newDetails.category_id || ''}
                  onChange={handleNewDetailsChange}
                  className='w-full text-[17px] border border-gray-400 px-3 py-1 rounded-sm focus:outline-gray-500'
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className='flex flex-col w-full space-y-2 mx-auto'>
                <label htmlFor="price" className='text-[14px] font-medium text-blue-800'>Price (₱) <span className='text-red-700'>*</span></label>
                <input
                  id='price'
                  type='text'
                  name='price'
                  value={newDetails.price || ''}
                  onChange={handleNewDetailsChange}
                  className='w-full text-[17px] border border-gray-400 px-3 py-1 rounded-sm focus:outline-gray-500'
                />
              </div>
            </div>
            <div className='flex justify-end w-full space-x-2 px-5'>
              <button 
                type='submit'
                className='text-[12px] text-white bg-blue-900 rounded-md px-3 py-2 cursor-pointer hover:bg-blue-800'>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Update Stock Modal */}
      {showUpdateStockModal && selectRow && (
        <div
          className="fixed inset-0 flex items-center justify-center z-1000"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        >
          <div className="min-w-[400px] max-w-[400px] bg-white pb-5 rounded-sm shadow-lg">
            <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-8 p-5">
              Update Stock
              <span className="text-gray-800 hover:text-gray-600 font-normal">
                <button
                  onClick={() => setShowUpdateStockModal(false)}
                  className="cursor-pointer"
                >
                  <X size={20} />
                </button>
              </span>
            </p>
          </div>
        </div>
      )}


      {/* Delete Modal */}
      {showDeleteModal && selectedRow && (
        <div
          className="fixed inset-0 flex items-center justify-center z-1000"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        >
          <form
            onSubmit={deleteProduct} 
            className="min-w-[400px] max-w-[400px] bg-white pb-5 rounded-sm shadow-lg">
            <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-8 p-5">
              Remove Product
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
              <p className='text-center'>Are you sure you want to remove this product?</p>
              <div className='w-full text-center'>
                <p className='text-[20px] text-blue-700 font-bold mb-3'>"{selectedRow.name || ''}"</p>
              </div>
            </div>
            <div className='flex justify-end w-full text-[12px] space-x-2 px-5'>
              <button
                type='submit' 
                className='text-white bg-blue-950 px-4 py-2 rounded-md cursor-pointer hover:bg-blue-900'>
                Confirm
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
                  {loading ? 'Fetching Products...' : 'No product available'}
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
            <form 
                onSubmit={AddProduct}
                className={`min-w-[500px] bg-white pb-5 rounded-sm shadow-lg transform transition-transform duration-300
                ${showModal ? 'scale-100' : 'scale-95'}`
            }>
                <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-8 p-5">
                  Add Product
                  <span className="text-gray-800 hover:text-gray-600 font-normal">
                    <button
                      type='button'
                      onClick={() => setShowModal(false)}
                      className="cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </span>
                </p>
                <div className='flex flex-col gap-7 p-5 mb-5'>
                  <div className='flex flex-col w-full space-y-2 mx-auto'>
                    <label htmlFor="product_name" className='text-[14px] font-medium text-blue-800'>Product Name <span className='text-red-700'>*</span></label>
                    <input
                      id='product_name'
                      name='name'
                      type='text'
                      onChange={handleNewProductChange}
                      value={newProduct.name}
                      className='w-full text-[13px] border border-gray-400 px-3 py-1 rounded-sm focus:outline-gray-500'
                    />
                  </div>
                  <div className='flex flex-col w-full space-y-2 mx-auto'>
                    <label htmlFor="price" className='text-[14px] font-medium text-blue-800'>Price <span className='text-red-700'>*</span></label>
                    <input
                      id='price'
                      name='price'
                      type='number'
                      step="any"
                      onChange={handleNewProductChange}
                      value={newProduct.price}
                      min={1}
                      className='w-full text-[13px] border border-gray-400 px-3 py-1 rounded-sm focus:outline-gray-500'
                    />
                  </div>
                  <div className='flex flex-col w-full space-y-2 mx-auto'>
                    <label htmlFor="category" className='text-[14px] font-medium text-blue-800'>Category <span className='text-red-700'>*</span></label>
                    <select 
                      onChange={handleNewProductChange}
                      value={newProduct.category_id}
                      id='category' 
                      name='category_id'
                      className='w-full text-[13px] border border-gray-400 px-3 py-1 rounded-sm focus:outline-gray-500'
                    >
                      <option value=''>-- Select Category --</option> 
                      {categories.map((category) => (
                        <option 
                          key={category.id} 
                          value={category.id}
                        > 
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='flex flex-col w-full space-y-2 mx-auto'>
                    <label htmlFor="stock" className='text-[14px] font-medium text-blue-800'>Stock <span className='text-red-700'>*</span></label>
                    <input
                      id='stock'
                      type='number'
                      name='stock_quantity'
                      onChange={handleNewProductChange}
                      value={newProduct.stock_quantity}
                      min={1}
                      className='w-full text-[13px] border border-gray-400 px-3 py-1 rounded-sm focus:outline-gray-500'
                    />
                  </div>
                </div>
                <div className='flex justify-end w-full px-5'>
                  <button 
                    type='submit'
                    className='text-[12px] text-white bg-blue-900 px-4 py-2 rounded-sm hover:bg-blue-800 cursor-pointer'>
                    Add Product
                  </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default InventoryTable;
