import React from 'react';
import ReactApexChart from 'react-apexcharts';

const SalesTrendChart = ({ salesData }) => {
  const options = {
    chart: {
      type: 'line',
      height: 350,
      zoom: { enabled: false },
    },
    stroke: { curve: 'smooth' },
    xaxis: { categories: salesData.map((entry) => entry.date) },
    yaxis: { title: { text: 'Sales (₱)' } },
    title: { text: 'Sales Over Time', align: 'left' },
    tooltip: {
      enabled: true,
      y: { formatter: (value) => `₱${value.toLocaleString()}` },
    },
  };

  const series = [
    { name: 'Sales', data: salesData.map((entry) => entry.sales) },
  ];

  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Sales Trend</h2>
      <ReactApexChart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default SalesTrendChart;
