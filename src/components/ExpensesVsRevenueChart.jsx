import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ExpensesVsRevenueChart = ({ totalSales, totalExpenses }) => {
  const options = {
    chart: { type: 'bar', height: 350 },
    xaxis: { categories: ['Oct 2023'] },
    yaxis: { title: { text: 'Amount (₱)' } },
    title: { text: 'Expenses vs Revenue', align: 'left' },
  };

  const series = [
    { name: 'Revenue', data: [totalSales] },
    { name: 'Expenses', data: [totalExpenses] },
  ];

  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Expenses vs Revenue</h2>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default ExpensesVsRevenueChart;
