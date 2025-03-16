import React, { useState } from 'react';

const TransactionTable = () => {
  // Initial data for water refilling transactions
  const initialData = [
    { id: 1, customerName: 'John Doe', bottleSize: '5 Gallons', quantity: 2, price: 100, date: '2023-10-01' },
    { id: 2, customerName: 'Jane Smith', bottleSize: '10 Liters', quantity: 1, price: 50, date: '2023-10-02' },
    { id: 3, customerName: 'Alice Johnson', bottleSize: '20 Liters', quantity: 3, price: 150, date: '2023-10-03' },
  ];

  // State for the table data
  const [data, setData] = useState(initialData);
  const [selectedId, setSelectedId] = useState(null);

  // State for the new transaction form
  const [newTransaction, setNewTransaction] = useState({
    customerName: '',
    bottleSize: '',
    quantity: 0,
    price: 0,
    date: '',
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: value,
    });
  };

  // Add a new transaction
  const addNewTransaction = () => {
    if (
      !newTransaction.customerName ||
      !newTransaction.bottleSize ||
      !newTransaction.quantity ||
      !newTransaction.price ||
      !newTransaction.date
    ) {
      alert('Please fill out all fields.');
      return;
    }

    const newRow = {
      id: data.length + 1,
      ...newTransaction,
    };
    setData([...data, newRow]);

    // Reset the form
    setNewTransaction({
      customerName: '',
      bottleSize: '',
      quantity: 0,
      price: 0,
      date: '',
    });
  };

  // Remove a transaction
  const removeTransaction = () => {
    if (selectedId) {
      setData(data.filter(item => item.id !== selectedId));
      setSelectedId(null);
    }
  };

  // Empty the table
  const emptyTable = () => {
    setData([]);
  };

  // Reset the table to initial data
  const resetTable = () => {
    setData(initialData);
  };

  return (
    <div className="p-5">

      {/* Form for adding new transactions */}
      <div className="mb-20 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-8">Record New Transaction</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className='flex flex-col gap-2'>
            <label className='text-[13px] ml-2'>Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={newTransaction.customerName}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className='flex flex-col gap-2'>
              <label className='text-[13px] ml-2'>Product Name</label>
              <input 
                type='text'
                name='bottleSize'
                value={newTransaction.bottleSize}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded" 
              />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-[13px] ml-2'>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={newTransaction.quantity}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded"
            />          
          </div>
  
          <div className='flex flex-col gap-2'> 
            <label className='text-[13px] ml-2'>Price</label>
            <input
              type="number"
              name="price"
              value={newTransaction.price}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-[13px] ml-2'>Date</label>
            <input
              type="date"
              name="date"
              value={newTransaction.date}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <button
          onClick={addNewTransaction}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
        >
          Add Transaction
        </button>
      </div>


      {/* Action buttons */}
      <div className="flex items-between justify-between space-x-4 mb-6">
        <h1 className="text-2xl font-bold mb-3">Transaction History</h1>
        <div className='flex gap-3 items-center'>
          <button 
              onClick={removeTransaction}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
            >
              Remove Transaction
            </button>
            <button
              onClick={resetTable}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-500 cursor-pointer"
            >
              Reset Table
            </button>
            <button
              onClick={emptyTable}
              className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary-500 cursor-pointer"
            >
              Empty Table
            </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border border-gray-200">Customer Name</th>
            <th className="p-3 border border-gray-200">Bottle Size</th>
            <th className="p-3 border border-gray-200">Quantity</th>
            <th className="p-3 border border-gray-200">Price</th>
            <th className="p-3 border border-gray-200">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => setSelectedId(row.id)}
              className={`cursor-pointer ${
                selectedId === row.id ? 'bg-gray-200' : 'hover:bg-gray-50'
              }`}
            >
              <td className="p-3 border border-gray-200">{row.customerName}</td>
              <td className="p-3 border border-gray-200">{row.bottleSize}</td>
              <td className="p-3 border border-gray-200">{row.quantity}</td>
              <td className="p-3 border border-gray-200">${row.price}</td>
              <td className="p-3 border border-gray-200">{row.date}</td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan="5" className="p-3 border border-gray-200 text-center">
                No transactions available
              </td>
            </tr>
          )}
        </tbody>      
      </table>
    </div>
  );
};

export default TransactionTable;
