import React from 'react';

const SalesSummary = ({ totalSales, numberOfTransactions, averageSalePerTransaction }) => {
  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Sales Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 rounded-lg">
          <p className="text-gray-700">Total Sales</p>
          <p className="text-2xl font-bold">₱{totalSales.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg">
          <p className="text-gray-700">Number of Transactions</p>
          <p className="text-2xl font-bold">{numberOfTransactions}</p>
        </div>
        <div className="p-4 bg-purple-100 rounded-lg">
          <p className="text-gray-700">Average Sale per Transaction</p>
          <p className="text-2xl font-bold">₱{averageSalePerTransaction.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default SalesSummary;
