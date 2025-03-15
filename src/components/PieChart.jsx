import React from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChart = () => {
  // Chart configuration
  const chartOptions = {
    series: [44, 55, 13, 43], // Your data values
    labels: ['Team A', 'Team B', 'Team C', 'Team D'], // Your labels
    chart: {
      type: 'pie',
      height: 350,
    },
    colors: ['#3B82F6', '#6366F1', '#10B981', '#F59E0B'], // Custom colors
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
    }]
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
