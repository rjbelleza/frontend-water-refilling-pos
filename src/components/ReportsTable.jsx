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

  // Sample data and calculations
  const salesData = [
    { date: '2023-10-01', sales: 5000 },
    { date: '2023-10-02', sales: 7000 },
    { date: '2023-10-03', sales: 6000 },
    { date: '2023-10-04', sales: 8000 },
    { date: '2023-10-05', sales: 9000 },
  ];

  const filteredSalesData = salesData.filter(
    (entry) => entry.date >= startDate && entry.date <= endDate
  );

  const totalSales = filteredSalesData.reduce((sum, entry) => sum + entry.sales, 0);
  const numberOfTransactions = filteredSalesData.length;
  const averageSalePerTransaction = totalSales / numberOfTransactions;

  const expenses = [
    { date: '2023-10-01', category: 'Utilities', amount: 2000, description: 'Electricity bill' },
    { date: '2023-10-02', category: 'Marketing', amount: 5000, description: 'Facebook ads' },
  ];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const revenueByProduct = [
    { productName: '5-Gallon Bottle', revenue: 5000 },
    { productName: '10-Liter Bottle', revenue: 3000 },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>

      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={(e) => setStartDate(e.target.value)}
        onEndDateChange={(e) => setEndDate(e.target.value)}
      />

      <SalesSummary
        totalSales={totalSales}
        numberOfTransactions={numberOfTransactions}
        averageSalePerTransaction={averageSalePerTransaction}
      />

      <SalesTrendChart salesData={filteredSalesData} />

      <ExpensesTable
        expenses={expenses}
        onAddExpense={(newExpense) => setExpenses([...expenses, newExpense])}
      />

      <ExpensesVsRevenueChart totalSales={totalSales} totalExpenses={totalExpenses} />

      <RevenueDistributionChart revenueByProduct={revenueByProduct} />

      {/* Add other components here */}
    </div>
  );
};

export default ReportsTable;
