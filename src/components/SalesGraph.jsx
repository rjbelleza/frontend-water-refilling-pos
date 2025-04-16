import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const SalesGraph = () => {
  const [chartData, setChartData] = useState({
    sales: [],
    expenses: [],
    months: [],
    lastUpdated: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/sales.json'); // Changed path to be served from public folder
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the data for the chart
        const transformedData = {
          sales: data.monthlyData.map(item => item.sales),
          expenses: data.monthlyData.map(item => item.expenses),
          months: data.monthlyData.map(item => item.month),
          lastUpdated: new Date(data.updatedAt).toLocaleString()
        };
        
        setChartData(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

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
      categories: chartData.months,
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
          fontSize: '12px'
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
      <div className="chart-container">
        <h2>Monthly Sales & Expenses</h2>
        <div className="loading-message">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <h2>Monthly Sales & Expenses</h2>
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full chart-container">
      <div className="w-full chart-wrapper border-1 border-gray-400 rounded-lg p-3">
        <p className='w-fit text-blue-900 font-medium py-2 px-5 rounded-sm'>Monthly Sales & Expenses</p>
        <Chart 
          options={options} 
          series={options.series} 
          type="bar"
          height="400px"
          width="100%"
        />
      </div>
    </div>
  );
};

export default SalesGraph;
