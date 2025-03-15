import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';

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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
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
  const removeItem = (id) => {
    const updatedData = inventoryData.filter((item) => item.id !== id);
    setInventoryData(updatedData);
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
      {
        header: 'Actions',
        accessorKey: 'id', // Use the row ID for actions
        cell: (info) => {
          const id = info.getValue(); // Get the row ID
          return (
            <button
              onClick={() => removeItem(id)}
              className="text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          );
        },
      },
    ],
    [inventoryData] // Ensure it re-renders when data changes
  );

  // Use React Table
  const table = useReactTable({
    columns,
    data: inventoryData,
    getCoreRowModel: getCoreRowModel(),
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

      {/* React Table */}
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

export default InventoryTable;
