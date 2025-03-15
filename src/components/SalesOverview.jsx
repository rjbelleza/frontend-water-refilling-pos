import React from 'react';
import ReactApexChart from 'react-apexcharts';

const LineChart = () => {
  // Chart configuration
  const chartOptions = {
    series: [{
      name: 'Sales',
      data: [40012, 30768, 35678, 17890, 28759, 23460, 37870, 34591, 13425, 45643, 24516, 13241] // Your data values
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
      width: 3
    },
    colors: ['#3B82F6'], // Custom color
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // X-axis labels
    },
    markers: {
      size: 5,
      colors: ['#3B82F6'],
      strokeWidth: 0
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => `₱${value}` // Custom tooltip format
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
