import React from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChart = () => {
  // Static/dummy data for sales distribution by product
  const chartOptions = {
    series: [35, 25, 20, 15, 5], // Sales percentages for each product
    labels: ['5-Gallon Bottles', '10-Gallon Bottles', 'Bottled Water (500ml)', 'Bottled Water (1L)', 'Other Products'], // Product labels
    chart: {
      type: 'pie',
      height: 350,
    },
    colors: ['#3B82F6', '#6366F1', '#10B981', '#F59E0B', '#EF4444'], // Custom colors
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    legend: {
      position: 'bottom', // Position the legend at the bottom
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}%`, // Display percentage in tooltip
      },
    },
  };

  return (
    <div>
      <ReactApexChart 
        options={chartOptions} 
        series={chartOptions.series} 
        type="pie" 
        height={350} 
      />
    </div>
  );
};

export default PieChart;
