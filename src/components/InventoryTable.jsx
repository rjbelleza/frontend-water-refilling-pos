import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { X, SquarePen, Search, CirclePlus, Settings, Notebook, Package, Trash, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import Snackbar from './Snackbar';
import LoadingAnimation from './LoadingAnimation';
import AlertPopUp from './AlertPopUp';
import StockSettings from './StockSettings';


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
  const [toStock, setToStock] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);
  const [newStock, setNewStock] = useState(currentStock);
  const [stockAction, setStockAction] = useState('');
  const [categories, setCategories] = useState([]);
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
  const [showSettings, setShowSettings] = useState(false);
  const [lowStock, setLowStock] = useState({ low_stock_threshold: '' });
  const [lowStockThreshold, setLowStockThreshold] = useState(0);



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

    let processedValue = value;
    
    // Process value based on field type
    if (name === 'category_id') {
      processedValue = value === '' ? null : Number(value);
      // Find the selected category to get its name
      const selectedCategory = categories.find(cat => cat.id === processedValue);
      
      setNewDetails(prev => ({
        ...prev, 
        [name]: processedValue,
        category_name: selectedCategory ? selectedCategory.name : prev.category_name
      }));
    } else if (name === 'price') {
      processedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
      setNewDetails(prev => ({
        ...prev, [name]: processedValue
      }));
    } else {
      setNewDetails(prev => ({
        ...prev, [name]: value
      }));
    }
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
      category_name: row.original.category.name,
      unit: row.original.unit
    });
    setShowUpdateModal(true);
    setSelectionModal(false); //
  };


  const handleUpdateStockClick = (row) => {
    setSelectRow(row.original);
    setShowUpdateStockModal(true);
    setSelectionModal(false);
    setCurrentStock(row.original.stock_quantity);
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row.original);
    setShowDeleteModal(true);
  }


  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  // Fetch categories in mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchLowStocks();
  }, [refreshKey]);

  
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


  const fetchLowStocks = async () => {
      try {
          const res = await api.get('/alert/low_stock_products');
          setLowStockThreshold(res.data?.threshold);
      } catch (err) {
          setMessage('Error fetching low stock threshold.');
          setShowAlert(true);
      }
  };


  const updateLowStockThreshold = async (e) => {
      e.preventDefault();

      try {
        const res = await api.put('/low_stock/update', lowStock);
        setResponseStatus('success');        
        setMessage('Low Stock Alert Updated.');  
        setRefreshKey(prev => prev + 1);
      } catch (err) {
        setResponseStatus('error');
        setMessage(err.response?.data?.message);
      } finally {
        setShowSnackbar(true);
        setShowSettings(false);
        setLowStock({ low_stock_threshold: '' });
      }
  }; 


  const handleSetLowStockChange = (e) => {
    const { name, value } = e.target;

    setLowStock((prev) => ({
            ...prev, 
            [name]: Number(value.replace(/[^0-9]/g, ''))
        })
    );
  };


  const showLowStockProducts = (stock) => {
    if (Number(stock) <= 0) {
      return <div className='flex items-center gap-3'>
                <p className='text-red-600'>{stock}</p> 
                <AlertCircle size={17} className='text-red-600' />
              </div>
    } if(Number(stock) <= Number(lowStockThreshold)) {
      return <div className='flex items-center gap-3'>
                <p className='text-yellow-600'>{stock}</p> 
                <AlertCircle size={17} className='text-yellow-600' />
              </div> 
    } else {
      return stock
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
        cell: info => Number(info.getValue()).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        size: 260,
      },
      {
        accessorKey: 'stock_quantity',
        header: 'Stock',
        cell: ({ row, getValue }) =>
          row.original.track_stock ? showLowStockProducts(getValue()) : '∞',
        size: 260,
      },
      {
        id: 'user',
        accessorFn: row => `${row.user?.fname || ''} ${row.user?.lname || ''} - ${capitalize(row.user?.role || '')}`,
        header: 'Created by',
        cell: info => info.getValue(),
        size: 260,
      },
      {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex space-x-1'>
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
    [lowStockThreshold]
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
    <div className="w-full overflow-x-hidden">

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

      <div className='flex justify-between'>
        <div></div>
          <div className='w-full md:w-fit pb-3'>
            <div className='flex justify-between md:gap-1'>
                <div className='flex items-center h-[35px]'>
                    <div className='relative'>
                      <Search size={20} className='absolute top-2 left-2 text-gray-500' />
                      <input 
                          type='text' 
                          placeholder='Search' 
                          value={nameFilter}
                          onChange={(e) => setNameFilter(e.target.value)}
                          className='text-[13px] h-[35px] min-w-[100px] max-w-[180px] border border-gray-400 pl-9 pr-2 py-1 rounded-sm' 
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
                    className='flex items-center gap-2 h-[35px] bg-primary text-white text-[13px] font-medium px-2 md:px-5 rounded cursor-pointer hover:bg-primary-100'>
                    <CirclePlus className='h-[20px] w-[20px] md:h-[13px] md:w-[13px]' />
                    <p className='hidden md:block'>
                      Add Product
                    </p>
                </button>
                <button
                  type="button" 
                  onClick={() => setShowSettings(true)}
                  className='bg-primary py-1 px-2 rounded cursor-pointer hover:bg-primary-100'>
                  <Settings size={20} className='text-white' />
                </button>
            </div>
        </div>
      </div>

      {showSettings && (
        <StockSettings 
          handleInputChange={handleSetLowStockChange} 
          setShow={setShowSettings} 
          lowStock={lowStock} 
          handleSubmit={updateLowStockThreshold}
          currentThrshld={lowStockThreshold}
        />
      )}

      {/* Update Selection Modal */}
      {selectionModal && (
        <div
          className="fixed h-screen inset-0 flex flex-col items-center justify-center z-1000"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className='flex justify-end w-[90%] md:w-[400px] mb-2'>
            <button 
              onClick={() => setSelectionModal(false)}
              className='bg-gray-700 rounded-full p-1 cursor-pointer'
            >
              <X size={18} className='text-gray-200' />
            </button>
          </div>
          <div className='grid grid-cols-2 gap-3 bg-white w-[90%] md:w-[400px] h-[200px] p-5 rounded-sm'>
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
              disabled={selectRow.original.track_stock == 0}
              className='flex flex-col gap-3 justify-center items-center disabled:bg-gray-500 disabled:cursor-not-allowed bg-primary hover:bg-primary-100 h-full w-full col-span-1 rounded-sm cursor-pointer shadow-md shadow-black'>
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
          <div className="w-[90%] md:w-[800px] bg-white pb-5 rounded-sm shadow-lg">
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
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-5 mb-10 text-white'>
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
                  value={selectedRow.track_stock == 0 ? '∞' : selectedRow.stock_quantity}
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
            className="w-[90%] md:w-[500px] bg-white pb-5 rounded-sm shadow-lg"
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
                <label htmlFor="productName" className='text-[14px] font-medium text-blue-800'>Product Name</label>
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
                <label htmlFor="productName" className='text-[14px] font-medium text-blue-800'>Category</label>
                <select
                  value={newDetails.category_id}
                  onChange={handleNewDetailsChange}
                  name="category_id"
                  className='w-full text-[17px] border border-gray-400 px-3 py-2 rounded-sm focus:outline-gray-500'
                >
                   <option value={newDetails.category_id}>{newDetails.category_name}</option>
                    {categories.map((cat) => (
                      cat.id !== newDetails.category_id && (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      )
                    ))}
                </select>
              </div>
              <div className='flex flex-col w-full space-y-2 mx-auto'>
                <label htmlFor="price" className='text-[14px] font-medium text-blue-800'>Price (₱)</label>
                <input
                  id='price'
                  type='text'
                  name='price'
                  value={newDetails.price || 0}
                  onChange={handleNewDetailsChange}
                  className='w-full text-[17px] border border-gray-400 px-3 py-2 rounded-sm focus:outline-gray-500'
                />
              </div>
            </div>
            <div className='flex w-full space-x-2 px-5'>
              <button 
                type='submit'
                className='text-[15px] w-full font-medium text-white bg-primary rounded-sm px-3 py-3 cursor-pointer hover:bg-primary-100'>
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
          <form onSubmit={updateStock} className="w-[90%] md:w-[400px] bg-white pb-5 rounded-sm shadow-lg">
            <p className="flex justify-between w-full text-[19px] border-b-1 border-dashed border-gray-400 font-medium text-primary mb-8 p-5">
              Update Stock
              <span className="text-gray-800 hover:text-gray-600 font-normal">
                <button
                  type='button'
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
                <p>Current Stock:</p>
                <p className='font-medium text-right'>{selectRow.stock_quantity.toLocaleString()}</p>
                <p className='font-bold text-[20px]'>New Stock:</p>
                <p className={`font-bold text-[20px] text-right ${newStock < 0 ? 'text-red-600' : ''}`}>{newStock.toLocaleString()}</p>
              </div>
              <div className='flex w-full'>
                <button 
                  type='submit'
                  className={`${!stockAction && 'hidden'} ${newStock < 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-primary-100 cursor-pointer'} text-white w-full font-medium px-3 py-2 rounded-sm text-[15px]`}
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
            className="w-[90%] m:w-[400px] bg-white pb-5 rounded-sm shadow-lg">
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
        <div className="flex-1 flex justify-center md:justify-between sm:hidden">
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
                className={`w-[90%] md:w-[700px] bg-white pb-5 rounded-sm shadow-lg transform transition-transform duration-300
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
                <div className='grid grid-cols-1 md:grid-cols-2 gap-7 p-5 mb-5'>
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
                    <label htmlFor="stock" className={`text-[15px] font-medium ${newProduct.category_id == 1 ? 'text-gray-200' : 'text-blue-800'}`}>Stock <span className={`${newProduct.category_id == 1 ? 'text-gray-200' : 'text-red-700'}`}>*</span></label>
                    <input
                      id='stock'
                      type='text'
                      onChange={handleNewProductChange}
                      name='stock_quantity'
                      value={newProduct.stock_quantity}
                      min={1}
                      className='w-full text-[15px] border border-gray-400 px-3 py-2 rounded-sm focus:outline-gray-500 disabled:border-gray-200'
                      disabled={newProduct.category_id == 1}
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
