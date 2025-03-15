import React, { useMemo } from 'react';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import ReactApexChart from 'react-apexcharts';

const ReportsTable = () => {
  // Sample data for reports
  const salesData = [
    { date: '2023-10-01', sales: 5000 },
    { date: '2023-10-02', sales: 7000 },
    { date: '2023-10-03', sales: 6000 },
    { date: '2023-10-04', sales: 8000 },
    { date: '2023-10-05', sales: 9000 },
  ];

  const productData = [
    { productName: '5-Gallon Bottle', quantitySold: 100, price: 50, cost: 30 },
    { productName: '10-Liter Bottle', quantitySold: 75, price: 30, cost: 20 },
    { productName: '20-Liter Bottle', quantitySold: 50, price: 20, cost: 15 },
    { productName: '1-Liter Bottle', quantitySold: 200, price: 10, cost: 5 },
  ];

  const customerData = [
    { customerName: 'John Doe', totalSpent: 15000 },
    { customerName: 'Jane Smith', totalSpent: 12000 },
    { customerName: 'Alice Johnson', totalSpent: 10000 },
  ];

  // Financial Metrics Data
  const financialData = [
    { metric: 'Cash Inflow', amount: 50000, description: 'Revenue from sales' },
    { metric: 'Cash Outflow', amount: 30000, description: 'Operational expenses' },
    { metric: 'Net Cash Flow', amount: 20000, description: 'Inflow - Outflow' },
    { metric: 'Marketing Expenses', amount: 5000, description: 'Ads and campaigns' },
    { metric: 'Salaries', amount: 15000, description: 'Employee wages' },
    { metric: 'Utilities', amount: 2000, description: 'Electricity, water, etc.' },
    { metric: 'Break-Even Point', amount: 25000, description: 'Revenue needed to cover costs' },
  ];

  // Calculate sales summary
  const totalSales = salesData.reduce((sum, entry) => sum + entry.sales, 0);
  const numberOfTransactions = salesData.length;
  const averageSalePerTransaction = totalSales / numberOfTransactions;

  // Calculate revenue and profit by product
  const revenueByProduct = productData.map((product) => ({
    productName: product.productName,
    revenue: product.quantitySold * product.price,
    profit: product.quantitySold * (product.price - product.cost),
  }));

  // ApexCharts configuration for Sales Trend
  const salesTrendOptions = {
    chart: {
      type: 'line',
      height: 350,
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: salesData.map((entry) => entry.date), // Dates on the x-axis
    },
    yaxis: {
      title: {
        text: 'Sales (₱)',
      },
    },
    title: {
      text: 'Sales Over Time',
      align: 'left',
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => `₱${value.toLocaleString()}`,
      },
    },
  };

  const salesTrendSeries = [
    {
      name: 'Sales',
      data: salesData.map((entry) => entry.sales), // Sales data for the y-axis
    },
  ];

  // Define columns for revenue by product table
  const revenueColumns = useMemo(
    () => [
      {
        header: 'Product Name',
        accessorKey: 'productName',
      },
      {
        header: 'Revenue',
        accessorKey: 'revenue',
        cell: (info) => `₱${info.getValue().toLocaleString()}`,
      },
      {
        header: 'Profit',
        accessorKey: 'profit',
        cell: (info) => `₱${info.getValue().toLocaleString()}`,
      },
    ],
    []
  );

  // Define columns for sales by product table
  const salesColumns = useMemo(
    () => [
      {
        header: 'Product Name',
        accessorKey: 'productName',
      },
      {
        header: 'Quantity Sold',
        accessorKey: 'quantitySold',
      },
      {
        header: 'Price per Unit',
        accessorKey: 'price',
        cell: (info) => `₱${info.getValue().toFixed(2)}`,
      },
    ],
    []
  );

  // Define columns for top customers table
  const topCustomersColumns = useMemo(
    () => [
      {
        header: 'Customer Name',
        accessorKey: 'customerName',
      },
      {
        header: 'Total Spent',
        accessorKey: 'totalSpent',
        cell: (info) => `₱${info.getValue().toLocaleString()}`,
      },
    ],
    []
  );

  // Define columns for financial metrics table
  const financialColumns = useMemo(
    () => [
      {
        header: 'Metric',
        accessorKey: 'metric',
      },
      {
        header: 'Amount (₱)',
        accessorKey: 'amount',
        cell: (info) => `₱${info.getValue().toLocaleString()}`,
      },
      {
        header: 'Description',
        accessorKey: 'description',
      },
    ],
    []
  );

  // Use React Table for revenue by product
  const revenueTable = useReactTable({
    columns: revenueColumns,
    data: revenueByProduct,
    getCoreRowModel: getCoreRowModel(),
  });

  // Use React Table for sales by product
  const salesTable = useReactTable({
    columns: salesColumns,
    data: productData,
    getCoreRowModel: getCoreRowModel(),
  });

  // Use React Table for top customers
  const topCustomersTable = useReactTable({
    columns: topCustomersColumns,
    data: customerData,
    getCoreRowModel: getCoreRowModel(),
  });

  // Use React Table for financial metrics
  const financialTable = useReactTable({
    columns: financialColumns,
    data: financialData,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>

      {/* Sales Summary */}
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

      {/* Sales Trend Chart */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Sales Trend</h2>
        <ReactApexChart
          options={salesTrendOptions}
          series={salesTrendSeries}
          type="line"
          height={350}
        />
      </div>

      {/* Revenue by Product Table */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Revenue by Product</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              {revenueTable.getHeaderGroups().map((headerGroup) => (
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
              {revenueTable.getRowModel().rows.map((row) => (
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

      {/* Sales by Product Table */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Sales by Product</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              {salesTable.getHeaderGroups().map((headerGroup) => (
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
              {salesTable.getRowModel().rows.map((row) => (
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

      {/* Top Customers Table */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Top Customers</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              {topCustomersTable.getHeaderGroups().map((headerGroup) => (
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
              {topCustomersTable.getRowModel().rows.map((row) => (
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

      {/* Financial Metrics Table */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Financial Metrics</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              {financialTable.getHeaderGroups().map((headerGroup) => (
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
              {financialTable.getRowModel().rows.map((row) => (
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
    </div>
  );
};

export default ReportsTable;
