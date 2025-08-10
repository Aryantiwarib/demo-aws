import { Line } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'

const FeeSummaryChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Fee Collection (₹)',
        data: [45000, 52000, 48000, 61000, 58000, 72000],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString()
          }
        }
      }
    }
  }

  return <Line data={data} options={options} />
}

export default FeeSummaryChart