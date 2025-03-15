import { Doughnut } from 'react-chartjs-2';

const VerticalHalfDonut = () => {
  const data = {
    labels: ['Used', 'Remaining'],
    datasets: [{
      data: [65, 35],
      backgroundColor: ['#4CAF50', '#e0e0e0'],
      borderWidth: 0,
    }]
  };

  const options = {
    rotation: -90, // Start from top
    circumference: 180, // Half-circle
    cutout: '70%', // Donut hole
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  return (
    <div style={{ width: 300, height: 150 }}> {/* Half-height container */}
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default VerticalHalfDonut;