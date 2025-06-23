import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import api from "../api/axios";
import LoadingAnimation from './LoadingAnimation';

const SalesGraph = ({ range = 'last_month' }) => {
  const [chartData, setChartData] = useState({
    sales: [],
    expenses: [],
    categories: [],
    lastUpdated: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Use the dynamic endpoint with range parameter
        const response = await api.get('/dashboard-graph', {
          params: { range: range }
        });
        
        if (!response.data) {
          throw new Error('No data received from API');
        }
        
        const data = response.data;
        
        // Transform the data for the chart
        const transformedData = {
          sales: data.monthlyData.map(item => item.sales),
          expenses: data.monthlyData.map(item => item.expenses),
          categories: data.monthlyData.map(item => item.label),
          lastUpdated: new Date(data.updatedAt).toLocaleString()
        };
        
        setChartData(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching graph data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [range]); // Re-fetch when range changes

  const options = {
    series: [{
      name: 'Sales',
      data: chartData.sales,
      color: '#0d00c7'
    }, {
      name: 'Expenses',
      data: chartData.expenses,
      color: '#000540'
    }],
    chart: {
      type: 'bar',
      height: 540,
      width: 980,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '75%',
        endingShape: 'rounded',
        dataLabels: {
          position: 'top'
        }
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: '#333',
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: true,
        color: '#78909C'
      },
      axisTicks: {
        show: true,
        color: '#78909C'
      }
    },
    yaxis: {
      title: {
        text: 'Amount (₱)',
        style: {
          color: '#333',
          fontSize: '15px'
        }
      },
      labels: {
        style: {
          colors: '#333',
          fontSize: '12px'
        },
        formatter: function (value) {
          return '₱' + value.toLocaleString();
        }
      },
      axisBorder: {
        show: true,
        color: '#78909C'
      }
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      y: {
        formatter: function (val) {
          return '₱' + val.toLocaleString();
        }
      },
      style: {
        fontSize: '12px'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '14px',
      fontFamily: 'Helvetica, Arial',
      fontWeight: 100,
      labels: {
        colors: '#333',
        useSeriesColors: false
      },
      markers: {
        width: 12,
        height: 12,
        radius: 12
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      },
      onItemClick: {
        toggleDataSeries: true
      },
      onItemHover: {
        highlightDataSeries: true
      }
    },
    grid: {
      row: {
        colors: ['#cccccc', 'transparent'],
        opacity: 0.5
      },
      borderColor: '#f1f1f1'
    },
    responsive: [{
      breakpoint: 1000,
      options: {
        chart: {
          width: '100%'
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  if (loading) {
    return (
      <div className="w-full h-full chart-container border border-gray-400 rounded-lg">
        <div className='flex border-b-1 border-gray-300 p-5'>
          <p className='text-blue-950 font-medium rounded-sm'>Sales vs Expenses</p>
        </div>
        <div className="w-full h-full flex justify-center items-center p-10">
          <LoadingAnimation />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full chart-container border border-gray-400 rounded-lg">
        <div className='flex border-b-1 border-gray-300 p-5'>
          <p className='text-blue-950 font-medium rounded-sm'>{getTitle()}</p>
        </div>
        <div className="w-full h-full flex justify-center items-center p-10 text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full chart-container border border-gray-400 rounded-lg">
      <div className='flex border-b-1 border-gray-300 p-5'>
        <p className='text-blue-950 font-medium rounded-sm'>Sales vs Expenses</p>
      </div>
      <div className="w-full overflow-x-auto chart-wrapper p-3">
        <div className='min-w-[980px] w-full'>
          <Chart 
            options={options} 
            series={options.series} 
            type="bar"
            height={400}
            width="100%"
          />
        </div>
      </div>
      <div className="text-right text-xs text-gray-500 p-2">
        Last updated: {chartData.lastUpdated}
      </div>
    </div>
  );
};

export default SalesGraph;
