import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Filler, Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const HistoryChart = ({ transactions = [] }) => {
  const sortedData = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  const labels = sortedData.map(tx =>
    new Date(tx.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
  );
  const incomeData = sortedData.map(tx => tx.type === 'income' ? tx.amount : 0);
  const expenseData = sortedData.map(tx => tx.type === 'expense' ? tx.amount : 0);

  const data = {
    labels: labels.length > 0 ? labels : ['No Data'],
    datasets: [
      {
        fill: true, label: 'Income',
        data: incomeData,
        borderColor: '#059669',
        backgroundColor: 'rgba(5,150,105,0.08)',
        tension: 0.4, borderWidth: 2,
        pointBackgroundColor: '#059669',
        pointRadius: 3,
      },
      {
        fill: true, label: 'Expenses',
        data: expenseData,
        borderColor: '#f87171',
        backgroundColor: 'rgba(248,113,113,0.08)',
        tension: 0.4, borderWidth: 2,
        pointBackgroundColor: '#f87171',
        pointRadius: 3,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 16,
          font: { weight: 'bold', size: 11 },
          color: '#6B7280'
        }
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#111827',
        bodyColor: '#6B7280',
        borderColor: '#E5EDE9',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: ctx => ` ₹${ctx.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#F0F4F3' },
        ticks: { color: '#9CA3AF', font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9CA3AF', font: { size: 11 } }
      }
    }
  };

  return <Line data={data} options={options}/>;
};

export default HistoryChart;