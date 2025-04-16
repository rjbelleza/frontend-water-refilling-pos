import React from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChart = () => {
  // Sample sales data for each product
  const series = [12500, 8400, 6200, 9300]; // Sales amounts
  
  const options = {
    chart: {
      type: 'donut',
    },
    labels: ['5-Gallon Bottle', '2-Gallon Bottle', '500ml Bottle', '5-Gallon Container'],
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          size: '45%',
        }
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'left',
      fontSize: '14px',
      fontWeight: 'bold',
      markers: {
        width: 12,
        height: 12,
        radius: 12,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          width: '100%'
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    tooltip: {
      y: {
        formatter: function (value) {
          return value.toLocaleString() + ' units';
        }
      }
    }
  };

  return (
    <div className="max-w-[800px] mx-auto flex flex-col items-center justify-center">
      <h2 className="text-center mb-5">Product Sales Comparison</h2>
      <div className="w-full mb-5">
        <ReactApexChart 
          options={options} 
          series={series} 
          type="donut" 
          height={350}
          width={250}
        />
      </div>
    </div>
  );
};

export default PieChart;
