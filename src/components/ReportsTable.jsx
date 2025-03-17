import React, { useState } from 'react';
import DateRangeFilter from './DateRangeFilter';
import SalesSummary from './SalesSummary';
import SalesTrendChart from './SalesTrendChart';
import ExpensesVsRevenueChart from './ExpensesVsRevenueChart';
import RevenueDistributionChart from './RevenueDistributionChart';
import ExpensesTable from './ExpensesTable';

const ReportsTable = () => {
  const [startDate, setStartDate] = useState('2023-10-01');
  const [endDate, setEndDate] = useState('2023-10-05');
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2023-10-01', category: 'Utilities', amount: 2000, description: 'Electricity bill' },
    { id: 2, date: '2023-10-02', category: 'Marketing', amount: 5000, description: 'Facebook ads' },
  ]);

  // Sample sales data
  const salesData = [
    { date: '2023-10-01', sales: 5000 },
    { date: '2023-10-02', sales: 7000 },
    { date: '2023-10-03', sales: 6000 },
    { date: '2023-10-04', sales: 8000 },
    { date: '2023-10-05', sales: 9000 },
  ];

  // Filter sales data based on the selected date range
  const filteredSalesData = salesData.filter(
    (entry) => entry.date >= startDate && entry.date <= endDate
  );

  // Calculate sales metrics
  const totalSales = filteredSalesData.reduce((sum, entry) => sum + entry.sales, 0);
  const numberOfTransactions = filteredSalesData.length;
  const averageSalePerTransaction = numberOfTransactions > 0 ? totalSales / numberOfTransactions : 0;

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Revenue distribution by product
  const revenueByProduct = [
    { productName: '5-Gallon Bottle', revenue: 5000 },
    { productName: '10-Liter Bottle', revenue: 3000 },
  ];

  // Handle adding a new expense
  const handleAddExpense = (newExpense) => {
    const expenseWithId = { ...newExpense, id: expenses.length + 1 };
    setExpenses([...expenses, expenseWithId]);
  };

  // Handle deleting an expense by ID
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>

      {/* Date Range Filter */}
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={(e) => setStartDate(e.target.value)}
        onEndDateChange={(e) => setEndDate(e.target.value)}
      />

      {/* Sales Summary */}
      <SalesSummary
        totalSales={totalSales}
        numberOfTransactions={numberOfTransactions}
        averageSalePerTransaction={averageSalePerTransaction}
      />

      {/* Sales Trend Chart */}
      <SalesTrendChart salesData={filteredSalesData} />

      {/* Expenses Table */}
      <ExpensesTable
        expenses={expenses}
        onAddExpense={handleAddExpense}
        onDeleteExpense={handleDeleteExpense}
      />

      {/* Expenses vs Revenue Chart */}
      <ExpensesVsRevenueChart totalSales={totalSales} totalExpenses={totalExpenses} />

      {/* Revenue Distribution Chart */}
      <RevenueDistributionChart revenueByProduct={revenueByProduct} />
    </div>
  );
};

export default ReportsTable;
