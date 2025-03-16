import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel } from '@tanstack/react-table';

const InventoryTable = () => {
  // Function to calculate stock status
  const calculateStockStatus = (quantity) => {
    return quantity <= 30 ? 'Low Stock' : 'In Stock';
  };

  // Sample inventory data with stock status
  const [inventoryData, setInventoryData] = useState([
    { id: 1, productName: '5-Gallon Bottle', quantity: 100, price: 50.0, stockStatus: calculateStockStatus(100) },
    { id: 2, productName: '10-Liter Bottle', quantity: 75, price: 30.0, stockStatus: calculateStockStatus(75) },
    { id: 3, productName: '20-Liter Bottle', quantity: 50, price: 20.0, stockStatus: calculateStockStatus(50) },
    { id: 4, productName: '1-Liter Bottle', quantity: 200, price: 10.0, stockStatus: calculateStockStatus(200) },
  ]);

  // State for the new item form
  const [newItem, setNewItem] = useState({
    productName: '',
    quantity: 0,
    price: 0,
  });

  // State for the remove/edit section
  const [selectedId, setSelectedId] = useState('');
  const [editItem, setEditItem] = useState({
    productName: '',
    quantity: 0,
    price: 0,
  });

  // State for the search term
  const [searchTerm, setSearchTerm] = useState('');

  // State for the stock status filter
  const [stockStatusFilter, setStockStatusFilter] = useState('all'); // 'all', 'Low Stock', 'In Stock'

  // Handle form input changes for new item
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) || 0 : value, // Parse values
    });
  };

  // Handle input change for selected ID
  const handleSelectedIdChange = (e) => {
    setSelectedId(e.target.value);
  };

  // Handle input changes for edit item
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditItem({
      ...editItem,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) || 0 : value, // Parse values
    });
  };

  // Add a new item to the inventory
  const addNewItem = () => {
    if (!newItem.productName || !newItem.quantity || !newItem.price) {
      alert('Please fill out all fields.');
      return;
    }

    const newRow = {
      id: inventoryData.length + 1,
      ...newItem,
      stockStatus: calculateStockStatus(newItem.quantity), // Calculate stock status
    };
    setInventoryData([...inventoryData, newRow]);

    // Reset the form
    setNewItem({
      productName: '',
      quantity: 0,
      price: 0,
    });
  };

  // Remove an item from the inventory
  const removeItem = () => {
    if (!selectedId) {
      alert('Please enter an ID to remove.');
      return;
    }

    const updatedData = inventoryData.filter((item) => item.id !== parseInt(selectedId));
    setInventoryData(updatedData);
    setSelectedId(''); // Reset the selected ID
  };

  // Edit an item in the inventory
  const editItemInInventory = () => {
    if (!selectedId) {
      alert('Please enter an ID to edit.');
      return;
    }

    const updatedData = inventoryData.map((item) => {
      if (item.id === parseInt(selectedId)) {
        return {
          ...item,
          productName: editItem.productName,
          quantity: editItem.quantity,
          price: editItem.price,
          stockStatus: calculateStockStatus(editItem.quantity), // Recalculate stock status
        };
      }
      return item;
    });

    setInventoryData(updatedData);
    setSelectedId(''); // Reset the selected ID
    setEditItem({ productName: '', quantity: 0, price: 0 }); // Reset the edit form
  };

  // Define columns for the table
  const columns = useMemo(
    () => [
      {
        header: 'ID',
        accessorKey: 'id',
      },
      {
        header: 'Product Name',
        accessorKey: 'productName',
      },
      {
        header: 'Quantity',
        accessorKey: 'quantity',
      },
      {
        header: 'Price',
        accessorKey: 'price',
        cell: (info) => `₱${parseFloat(info.getValue()).toFixed(2)}`, // Format to 2 decimal places
      },
      {
        header: 'Stock Status',
        accessorKey: 'stockStatus',
        cell: (info) => {
          const stockStatus = info.getValue();
          return (
            <span
              className={`px-2 py-1 rounded ${
                stockStatus === 'Low Stock' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}
            >
              {stockStatus}
            </span>
          );
        },
      },
    ],
    []
  );

  // Filter data based on search term and stock status
  const filteredData = useMemo(() => {
    return inventoryData.filter((item) => {
      const matchesSearchTerm = item.productName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStockStatus =
        stockStatusFilter === 'all' || item.stockStatus === stockStatusFilter;
      return matchesSearchTerm && matchesStockStatus;
    });
  }, [inventoryData, searchTerm, stockStatusFilter]);

  // Use React Table
  const table = useReactTable({
    columns,
    data: filteredData, // Use filtered data
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchTerm, // Add global filter for search
    },
    onGlobalFilterChange: setSearchTerm, // Update search term
  });

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>

      {/* Add New Item Form */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-7">Add New Item</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] ml-2">Product Name</label>
            <input
              type="text"
              name="productName"
              value={newItem.productName}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] ml-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={newItem.quantity}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] ml-2">Price</label>
            <input
              type="number"
              name="price"
              value={newItem.price}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <button
          onClick={addNewItem}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Item
        </button>
      </div>

      {/* Remove/Edit Section */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Remove / Edit Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] ml-2">Enter ID</label>
            <input
              type="number"
              value={selectedId}
              onChange={handleSelectedIdChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] ml-2">Product Name</label>
            <input
              type="text"
              name="productName"
              value={editItem.productName}
              onChange={handleEditInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] ml-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={editItem.quantity}
              onChange={handleEditInputChange}
              className="p-2 border border-gray-300 rounded"
              placeholder="Quantity"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] ml-2">Price</label>
            <input
              type="number"
              name="price"
              value={editItem.price}
              onChange={handleEditInputChange}
              className="p-2 border border-gray-300 rounded"
              placeholder="Price"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-4 mb-10">
          <button
            onClick={removeItem}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Remove Item
          </button>
          <button
            onClick={editItemInInventory}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Edit Item
          </button>
        </div>
      </div>

      {/* Search Bar and Stock Status Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-1/3"
        />
        <select
          value={stockStatusFilter}
          onChange={(e) => setStockStatusFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-1/4"
        >
          <option value="all">All Stock Status</option>
          <option value="Low Stock">Low Stock</option>
          <option value="In Stock">In Stock</option>
        </select>
      </div>

      {/* React Table */}
      <div className="overflow-x-auto mb-6">
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

export default InventoryTable;
