import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ transactions = [], onCategoryClick }) => {
  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      const cat = curr.category || 'General';
      acc[cat] = (acc[cat] || 0) + curr.amount;
      return acc;
    }, {});

  if (Object.keys(categoryTotals).length === 0) {
    return (
      <div className="h-full flex items-center justify-center"
        style={{ color: '#9CA3AF', fontSize: '13px' }}>
        No expense data yet
      </div>
    );
  }

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: ['#059669','#f59e0b','#6366f1','#ec4899','#06b6d4','#f97316','#8b5cf6','#6B7280'],
      hoverOffset: 12,
      borderWidth: 2,
      borderColor: '#FFFFFF',
    }],
  };

  const options = {
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 14,
          font: { weight: 'bold', size: 10 },
          color: '#6B7280'
        }
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#111827',
        bodyColor: '#6B7280',
        borderColor: '#E5EDE9',
        borderWidth: 1,
        callbacks: {
          label: ctx => ` ₹${ctx.raw.toLocaleString()}`
        }
      }
    },
    maintainAspectRatio: false,
    onClick: (event, elements) => {
      if (elements.length > 0 && onCategoryClick) {
        onCategoryClick(data.labels[elements[0].index]);
      }
    },
    onHover: (event, elements) => {
      event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    }
  };

  return <Doughnut data={data} options={options}/>;
};

export default CategoryChart;