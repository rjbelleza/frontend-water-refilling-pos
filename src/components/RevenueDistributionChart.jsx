import React from 'react';
import ReactApexChart from 'react-apexcharts';

const RevenueDistributionChart = ({ revenueByProduct }) => {
  const options = {
    chart: { type: 'pie', height: 350 },
    labels: revenueByProduct.map((product) => product.productName),
    title: { text: 'Revenue Distribution by Product', align: 'left' },
  };

  const series = revenueByProduct.map((product) => product.revenue);

  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Revenue Distribution by Product</h2>
      <ReactApexChart options={options} series={series} type="pie" height={350} />
    </div>
  );
};

export default RevenueDistributionChart;
