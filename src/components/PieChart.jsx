import React, { useState } from "react";
import Chart from "react-apexcharts";


const PieChart = () => {
    const [chartOptions, setChartOptions] = useState({
        labels: ["5-Gallon Bottles", "1-Liter Bottles", "500ml Bottles"],
        colors: ["#16325B", "#227B94", "#78B7D0"],
        chart: {
            id: "basic-pie",
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "50%", 
                },
            },
        },
        legend: {
            position: "bottom",
            verticalAlign: "middle",
        },
    });

    const [chartSeries, setChartSeries] = useState([60.0, 45.3, 20.78]);

    return (
        <div className="flex justify-center mt-15 h-full w-full">
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="pie" 
            />
        </div>
    );
}

export default PieChart;
