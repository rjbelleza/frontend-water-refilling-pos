import React from 'react';
import ReactApexChart from 'react-apexcharts';

const LineChart = () => {
  // Chart configuration
  const chartOptions = {
    series: [{
      name: 'Sales',
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125] // Your data values
    }],
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    stroke: {
      curve: 'smooth', // Smooth lines
      width: 2
    },
    colors: ['#3B82F6'], // Custom color
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], // X-axis labels
    },
    markers: {
      size: 5,
      colors: ['#3B82F6'],
      strokeWidth: 0
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => `$${value}K` // Custom tooltip format
      }
    }
  };

  return (
    <div>
      <ReactApexChart 
        options={chartOptions} 
        series={chartOptions.series} 
        type="line" 
        height={350} 
      />
    </div>
  );
};

export default LineChart;
