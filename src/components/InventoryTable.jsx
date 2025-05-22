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
import LoadingAnimation from './LoadingAnimation';

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
  const [currentStock, setCurrentStock] = useState(0);
  const [newStock, setNewStock] = useState(currentStock);
  const [stockAction, setStockAction] = useState('');
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: ''});
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [message, setMessage ] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // Refresh trigger
  const [loading, setLoading] = useState(true);
  const [selectionModal, setSelectionModal] = useState(false);
  const [selectRow, setSelectRow] = useState(null);
  const [showUpdateStockModal, setShowUpdateStockModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [responseStatus, setResponseStatus] = useState('');


  // New Product States
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    unit: '',
  });


  const [newDetails, setNewDetails] = useState({
    name: '',
    price: '',
    category_id: '',
    unit: ''
  });

  const deleteProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch(`/product/delete/${selectedRow.id}`);
      setMessage(response.data?.message);
      setResponseStatus(response.data?.status);
      setShowDeleteModal(false);
      setRefreshKey(prev => prev + 1);
      setShowSnackbar(true);
    } catch (error) {
      setMessage(error.response?.data?.message);
      setResponseStatus(error.response?.data?.status);
      setShowDeleteModal(false);
      setShowSnackbar(true);
    }
  };


  const AddProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/product', newProduct);
      setMessage(response.data?.message);
      setResponseStatus(response.data?.status)
      setShowModal(false); 
      setRefreshKey(prev => prev + 1);
      setNewProduct({
        name: '',
        price: '',
        stock_quantity: 0,
        category_id: '',
        unit: ''});
      setShowSnackbar(true);
    } catch (error) {
      setMessage(error.response?.data?.message);
      setResponseStatus(error.response?.data?.status);
      setNewProduct({
        name: '',
        price: '',
        stock_quantity: 0,
        category_id: '', 
        unit: ''});
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
      setMessage(error.response?.data?.message);
      setResponseStatus(error.response?.data?.status);
      setShowSnackbar(true);
    }
  };


  // New product input onChange handler
const handleNewProductChange = (e) => {
  const { name, value } = e.target;
  
  let processedValue = value;
  
  // Process value based on field type
  if (name === 'category_id') {
    processedValue = value === '' ? null : Number(value);
  } else if (name === 'price' || name === 'stock_quantity') {
    processedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
  }
  
  setNewProduct(prev => ({
    ...prev, 
    [name]: processedValue
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
            return;
        }

        const response = await api.put(`/product/${selectedRow.id}`, newDetails);
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


  useEffect(() => {
    const curr = Number(currentStock);
    const to = Number(toStock);

    if (isNaN(curr) || isNaN(to)) return;

    if (stockAction === 'stock-in') {
      setNewStock(curr + to);
    } else if (stockAction === 'stock-out') {
      setNewStock(curr - to);
    }
  }, [toStock, stockAction, currentStock]);

  const handleToStockChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      setToStock(value);
    }
  };

  const handleUpdateClick = (row) => {
    setSelectedRow(row.original);
    setNewDetails({
      name: row.original.name,
      price: row.original.price,
      category_id: row.original.category_id,
      unit: row.original.unit
    });
    setShowUpdateModal(true);
    setSelectionModal(false);
  };


  const handleUpdateStockClick = (row) => {
    setSelectRow(row.original);
    setShowUpdateStockModal(true);
    setSelectionModal(false);
    setCurrentStock(row.original.stock_quantity);
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
      setMessage(response.data?.message);
      setResponseStatus(response.data?.status);
      setNewCategory({ name: '' });
      setShowCategoryModal(false);
      setShowSnackbar(true);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      setMessage(error.response?.data?.message);
      setResponseStatus(error.response?.data?.status);
      setNewCategory({ name: '' });
      setShowCategoryModal(false);
      setShowSnackbar(true);
    }
  };

  
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data?.data);
    } catch (error) {
      setMessage(error.response?.data?.message);
      setResponseStatus(error.response?.data?.status);
      setShowSnackbar(true);
    }
  }


  const deleteCategory = async (id) => {
    try {
      const response = await api.patch(`/category/disable/${id}`);
      setMessage(response.data?.message);
      setResponseStatus(response.data?.status);
      setShowCategoryModal(false);
      setRefreshKey(prev => prev + 1);
      setShowSnackbar(true);
    } catch (error) {
      setMessage(error.response?.data?.message);
      setResponseStatus(error.response?.data?.status);
      setShowSnackbar(true);
    }
  }


  const updateStock = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(`product/${selectRow.id}/update-stock`, {
        stockAction,
        toStock
      }); 
      setMessage(response.data?.message);
      setResponseStatus(response.data?.status);
      setShowUpdateStockModal(false);
      setRefreshKey(prev => prev + 1);
      setShowSnackbar(true);
      setToStock(0);
      setStockAction('');
    } catch (error) {
      setMessage(error.response?.data?.message);
      console.log(error);
      setResponseStatus(error.response?.data?.status)
      setShowUpdateStockModal(false);
      setShowSnackbar(true);
    }
  };


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
        id: 'name',
        accessorKey: 'name',
        header: 'Name',
        cell: info => info.getValue(),
        size: 290,
      },
      {
        id: 'category.name',
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
              className="text-white bg-primary hover:bg-primary-100 cursor-pointer rounded-sm px-2 py-2"
            >
              <Eye size={15} />
            </button>
            <button 
              onClick={() => {setSelectionModal(true); setSelectRow(row)}}
              className="text-white bg-primary hover:bg-primary-100 cursor-pointer rounded-sm px-2 py-2"
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

  const columnFilters = useMemo(() => {
    const filters = [];
  
    if (nameFilter) {
      filters.push({ id: 'name', value: nameFilter });
    }
  
    if (categoryFilter) {
      filters.push({ id: 'category.name', value: categoryFilter });
    }
  
    return filters;
  }, [nameFilter, categoryFilter]);
  
  // Initialize the table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      columnFilters,
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

      <div className='flex justify-between'>
        <div></div>
          <div className='w-fit pb-3'>
            <div className='flex gap-1'>
                <div className='flex items-center h-[35px]'>
                    <div className='relative'>
                      <Search size={20} className='absolute top-2 left-2 text-gray-500' />
                      <input 
                          type='text' 
                          placeholder='Search' 
                          value={nameFilter}
                          onChange={(e) => setNameFilter(e.target.value)}
                          className='text-[13px] h-[35px] border border-gray-400 pl-9 pr-2 py-1 rounded-sm' 
                      />
                    </div>
                </div>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className='h-[35px] border border-gray-400 rounded-sm px-2'>
                    <option value="">All</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
                <button 
                    onClick={() => setShowModal(true)}
                    className='flex items-center gap-2 h-[35px] bg-primary text-white text-[13px] font-medium px-5 rounded-md cursor-pointer hover:bg-primary-100'>
                    <CirclePlus size={13} />
                    Add Product
                </button>
                <button className='bg-primary px-2 rounded-md'>
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
              className='flex flex-col gap-3 justify-center items-center bg-primary hover:bg-primary-100 h-full w-full col-span-1 rounded-sm cursor-pointer shadow-md shadow-black'>
              <p className='font-medium text-white'>Update Details</p>
              <Notebook size={30} className='text-white' />
            </button>
            <button
              onClick={() => handleUpdateStockClick(selectRow)}
              type='button' 
              className='flex flex-col gap-3 justify-center items-center bg-primary hover:bg-primary-100 h-full w-full col-span-1 rounded-sm cursor-pointer shadow-md shadow-black'>
              <p className='font-medium text-white'>Update Stock</p>
              <Package size={30} className='text-white' />
            </button>
          </div>
        </div>
      )}


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
            <div className='grid grid-cols-2 gap-8 w-full px-5 mb-10 text-white'>
              <div className='flex flex-col w-full space-y-2'>
                <label htmlFor="productName" className='text-[14px] font-medium text-blue-800'>Product Name</label>
                <input 
                  id='productName'
                  value={selectedRow.name || ''}
                  className='w-full text-[15px] bg-primary-100 px-3 py-2 rounded-sm outline-none'
                  readOnly 
                />
              </div>
              <div className='flex flex-col w-full space-y-2'>
                <label htmlFor="category" className='text-[14px] font-medium text-blue-800'>Category</label>
                <input 
                  id='category'
                  value={selectedRow.category.name || ''}
                  className='w-full text-[15px] bg-primary-100 px-3 py-2 rounded-sm outline-none'
                  readOnly 
                />
              </div>
              <div className='flex flex-col w-full space-y-2'>
                <label htmlFor="price" className='text-[14px] font-medium text-blue-800'>Price (₱)</label>
                <input 
                  id='price'
                  value={selectedRow.price || ''}
                  className='w-full text-[15px] bg-primary-100 px-3 py-2 rounded-sm outline-none'
                  readOnly 
                />
              </div>
              <div className='flex flex-col w-full space-y-2'>
                <label htmlFor="added_by" className='text-[14px] font-medium text-blue-800'>Added By</label>
                <input 
                  id='added_by'
                  value={`${selectedRow.user.fname} ${selectedRow.user.lname} - ${capitalize(selectedRow.user.role)}`}
                  className='w-full text-[15px] bg-primary-100 px-3 py-2 rounded-sm outline-none'
                  readOnly 
                />
              </div>
              <div className='flex flex-col w-full space-y-2'>
                <label htmlFor="stock_quantity" className='text-[14px] font-medium text-blue-800'>Current Stock</label>
                <input 
                  id='stock_quantity'
                  value={selectedRow.stock_quantity || 0}
                  className='w-full text-[15px] bg-primary-100 px-3 py-2 rounded-sm outline-none'
                  readOnly 
                />
              </div>
              <div className='flex flex-col w-full space-y-2'>
                <label htmlFor="added_by" className='text-[14px] font-medium text-blue-800'>Unit</label>
                <input 
                  id='added_by'
                  value={selectedRow.unit}
                  className='w-full text-[15px] bg-primary-100 px-3 py-2 rounded-sm outline-none'
                  readOnly 
                />
              </div>
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
                  className='w-full text-[17px] border border-gray-400 px-3 py-2 rounded-sm focus:outline-gray-500'
                />
              </div>
              <div className='flex flex-col w-full space-y-2 mx-auto'>
                <label htmlFor="category" className='text-[14px] font-medium text-blue-800'>Category <span className='text-red-700'>*</span></label>
                <select
                  id="category"
                  name='category_id'
                  value={newDetails.category_id || ''}
                  onChange={handleNewDetailsChange}
                  className='w-full text-[17px] border border-gray-400 px-3 py-2 rounded-sm focus:outline-gray-500'
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
                  type='number'
                  name='price'
                  value={newDetails.price || 0}
                  onChange={handleNewDetailsChange}
                  className='w-full text-[17px] border border-gray-400 px-3 py-2 rounded-sm focus:outline-gray-500'
                />
              </div>
              <div className='flex flex-col w-full space-y-2 mx-auto'>
                <label htmlFor="unit" className='text-[14px] font-medium text-blue-800'>Unit <span className='text-red-700'>*</span></label>
                <input
                  id='unit'
                  type='text'
                  name='unit'
                  value={newDetails.unit || ''}
                  onChange={handleNewDetailsChange}
                  className='w-full text-[17px] border border-gray-400 px-3 py-2 rounded-sm focus:outline-gray-500'
                />
              </div>
            </div>
            <div className='flex w-full space-x-2 px-5'>
              <button 
                type='submit'
                className='text-[15px] w-full font-medium text-white bg-primary rounded-sm px-3 py-2 cursor-pointer hover:bg-primary-100'>
                SAVE CHANGES
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
          <form onSubmit={updateStock} className="min-w-[400px] max-w-[400px] bg-white pb-5 rounded-sm shadow-lg">
            <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-8 p-5">
              Update Stock
              <span className="text-gray-800 hover:text-gray-600 font-normal">
                <button
                  onClick={() => {setShowUpdateStockModal(false); setStockAction('')}}
                  className="cursor-pointer"
                >
                  <X size={20} />
                </button>
              </span>
            </p>
            <div className='flex flex-col gap-3 w-full px-5'>
              <p className='text-[15px] font-medium'>Select action</p>
              <div className='flex gap-2 w-full'>
                <button
                  type='button'
                  onClick={() => setStockAction('stock-in')} 
                  className={`${stockAction == 'stock-in' ? 'bg-primary-100' : stockAction == 'stock-out' ? 'bg-gray-500' : 'bg-primary'} hover:bg-primary-100 w-full text-white rounded-sm cursor-pointer px-3 py-2`}>
                  Restock
                </button>
                <button
                  type='button' 
                  onClick={() => setStockAction('stock-out')} 
                  className={`${stockAction == 'stock-out' ? 'bg-primary-100' : stockAction == 'stock-in' ? 'bg-gray-500' : 'bg-primary'} hover:bg-primary-100 w-full text-white rounded-sm cursor-pointer px-3 py-2`}>
                  Deduct
                </button>
              </div>
              <div className='w-full'>
                <input 
                  value={toStock}
                  onChange={handleToStockChange}
                  disabled={!stockAction}
                  className={`${stockAction ? 'border border-gray-500 w-full px-4 py-2 rounded-sm' : 'hidden'}`}
                  placeholder={!stockAction ? '' : 'Enter Quantity'}
                />
              </div> 
              <div className={`${stockAction ? 'grid grid-cols-2 w-full mt-5 mb-3 text-[14px] space-y-2' : 'hidden'}`}>
                <p>Unit:</p>
                <p className='font-medium text-right'>{selectRow.unit}</p>
                <p>Current Stock:</p>
                <p className='font-medium text-right'>{selectRow.stock_quantity.toLocaleString()}</p>
                <p className='font-bold text-[20px]'>New Stock:</p>
                <p className={`font-bold text-[20px] text-right ${newStock < toStock ? 'text-red-600' : ''}`}>{newStock.toLocaleString()}</p>
              </div>
              <div className='flex w-full'>
                <button 
                  type='submit'
                  disabled={newStock < toStock}
                  className={`${!stockAction && 'hidden'} ${newStock < toStock ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-primary-100 cursor-pointer'} text-white w-full font-medium px-3 py-2 rounded-sm text-[15px]`}
                >
                  CONFIRM
                </button>
            </div>
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
                  {loading ? <LoadingAnimation /> : 'No product available'}
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
            className={`fixed inset-0 flex items-center justify-center z-1000 transition-opacity duration-300 scrollbar-thin overflow-y-auto
                ${showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <form 
                onSubmit={AddProduct}
                className={`min-w-[700px] bg-white pb-5 rounded-sm shadow-lg transform transition-transform duration-300
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
                <div className='grid grid-cols-2 gap-7 p-5 mb-5'>
                  <div className='flex flex-col w-full space-y-2 mx-auto'>
                    <label htmlFor="product_name" className='text-[15px] font-medium text-blue-800'>Product Name <span className='text-red-700'>*</span></label>
                    <input
                      id='product_name'
                      name='name'
                      type='text'
                      onChange={handleNewProductChange}
                      value={newProduct.name}
                      className='w-full text-[15px] border border-gray-400 px-3 py-2 rounded-sm focus:outline-gray-500'
                    />
                  </div>
                  <div className='flex flex-col w-full space-y-2 mx-auto'>
                    <label htmlFor="price" className='text-[15px] font-medium text-blue-800'>Price <span className='text-red-700'>*</span></label>
                    <input
                      id='price'
                      name='price'
                      type='text'
                      step="any"
                      onChange={handleNewProductChange}
                      value={newProduct.price}
                      min={1}
                      className='w-full text-[15px] border border-gray-400 px-3 py-2 rounded-sm focus:outline-gray-500'
                    />
                  </div>
                  <div className='flex flex-col w-full space-y-2 mx-auto'>
                    <label htmlFor="category" className='text-[15px] font-medium text-blue-800'>Category <span className='text-red-700'>*</span></label>
                    <select 
                      onChange={handleNewProductChange}
                      value={newProduct.category_id}
                      id='category' 
                      name='category_id'
                      className='w-full text-[15px] border border-gray-400 px-3 py-2 rounded-sm focus:outline-gray-500'
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
                    <label htmlFor="stock" className='text-[15px] font-medium text-blue-800'>Stock <span className='text-red-700'>*</span></label>
                    <input
                      id='stock'
                      type='text'
                      name='stock_quantity'
                      onChange={handleNewProductChange}
                      value={newProduct.stock_quantity}
                      min={1}
                      className='w-full text-[15px] border border-gray-400 px-3 py-2 rounded-sm focus:outline-gray-500'
                    />
                  </div>
                </div>
                <div className='flex w-full px-5'>
                  <button 
                    type='submit'
                    disabled={((!newProduct.name && !newProduct.price) && (!newProduct.category_id && !newProduct.unit)) && !newProduct.stock_quantity}
                    className='text-[15px] text-white w-full bg-primary px-4 py-3 rounded-sm hover:bg-primary-100 cursor-pointer font-medium
                                disabled:bg-gray-500 disabled:cursor-not-allowed
                    '>
                    ADD PRODUCT
                  </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default InventoryTable;
