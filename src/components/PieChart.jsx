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
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'Total Sales',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#373d3f',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString() + ' units';
              }
            },
            value: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111',
              formatter: function (val) {
                return val.toLocaleString();
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, { seriesIndex, w }) {
        return w.config.labels[seriesIndex] + ': ' + val.toFixed(1) + '%';
      },
      dropShadow: {
        enabled: false
      }
    },
    legend: {
      position: 'right',
      fontSize: '14px',
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
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Product Sales Comparison</h2>
      <ReactApexChart 
        options={options} 
        series={series} 
        type="donut" 
        height={400} 
      />
    </div>
  );
};

export default PieChart;
