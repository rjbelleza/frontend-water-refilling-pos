import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Calendar } from 'lucide-react';

const PieChart = () => {
  // Sample sales data for each product
  const series = [12500, 8400, 6200, 9300]; // Sales amounts
  
  const options = {
    chart: {
      type: 'donut',
    },
    labels: ['5-Gallon Bottle', '2-Gallon Bottle', '500ml Bottle', '5-Gallon Container'],
    colors: ['#221959', '#1a02ba', '#513cde', '#a094f2'],
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
      fontSize: '13px',
      fontWeight: 'normal',
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
    <div className="flex flex-col justify-center gap-5">
      <div className="flex justify-between w-full border-b-1 border-gray-300 p-5">
            <div>
                <h2 className="text-left text-blue-950 font-medium text-[13px]">Product Sales</h2>
                <h2 className="text-left text-blue-950 font-medium text-[13px]">Comparison</h2>
            </div>
            <button className="flex items-center gap-2 h-fit text-[12px] border border-gray-400 px-3 py-1 rounded-md cursor-pointer"> 
                <Calendar size={13} />
                This Week
            </button>
        </div>
      <div className="flex justify-center w-full h-full">
        <ReactApexChart 
          options={options} 
          series={series} 
          type="donut" 
          height={330}
          width={230}
        />
      </div>
    </div>
  );
};

export default PieChart;
