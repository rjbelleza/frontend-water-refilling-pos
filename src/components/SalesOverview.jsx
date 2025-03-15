// SalesOverview.js

import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const SalesOverview = () => {
  // Data for the chart
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const salesData = [300, 400, 250, 500, 600, 700, 400, 300, 450, 600, 590, 620];
  const profitData = [150, 200, 100, 300, 350, 500, 300, 200, 300, 350, 380, 400];
  const growthData = [200, 250, 300, 350, 400, 450, 500, 400, 470, 520, 600, 610];

  // Chart data and configuration
  const data = {
    labels,
    datasets: [
      {
        label: 'Sales',
        data: salesData,
        borderColor: 'rgba(255, 0, 255, 0.6)',
        backgroundColor: 'rgba(255, 0, 255, 0.1)',
        type: 'line',
        tension: 0.4,
      },
      {
        label: 'Profit',
        data: profitData,
        borderColor: 'rgba(255, 255, 255, 0.6)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        type: 'line',
        tension: 0.4,
      },
      {
        label: 'Growth',
        data: growthData,
        borderColor: 'rgba(0, 0, 255, 0.6)',
        backgroundColor: 'rgba(0, 0, 255, 0.1)',
        type: 'bar',
        backgroundColor: 'rgba(0, 0, 255, 0.5)',
      },
    ],
  };

  // Options for the chart
  const options = {
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '100%', margin: 'auto', paddingTop: '20px', backgroundColor: 'rgb(213, 237, 236)', 
        borderRadius: '10px', padding: '20px' }}>
      <h2 className='font-bold'>Sales Overview</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default SalesOverview;
    