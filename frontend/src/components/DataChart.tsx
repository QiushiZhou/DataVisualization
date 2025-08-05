'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import dayjs from 'dayjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DataEntry {
  id: number;
  date: string;
  type: string;
  value: number;
}

interface DataType {
  id: number;
  name: string;
}

interface DataChartProps {
  data: DataEntry[];
  dataTypes: DataType[];
}

const DataChart: React.FC<DataChartProps> = ({ data, dataTypes }) => {
  // Sort data by date first
  const sortedData = [...data].sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
  
  // Get unique dates and format them properly
  const labels = Array.from(new Set(sortedData.map(entry => dayjs(entry.date).format('YYYY-MM-DD')))).sort();

  const getChartData = () => {
    const datasets = dataTypes.map(type => {
      const typeData = labels.map(label => {
        const entry = sortedData.find(d => dayjs(d.date).format('YYYY-MM-DD') === label && d.type === type.name);
        return entry ? entry.value : null;
      });

      const colorMap: { [key: string]: string } = {
        'Type 1': '#8884d8', // Purple
        'Type 2': '#82ca9d', // Green
        'Type 3': '#ffc658', // Orange
        // Add more colors for other types if needed
      };

      const defaultColors = [
        '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'
      ];
      const typeColor = colorMap[type.name] || defaultColors[type.id % defaultColors.length];

      return {
        label: type.name,
        data: typeData,
        borderColor: typeColor,
        backgroundColor: typeColor,
        fill: false,
        tension: 0.1,
      };
    });

    return {
      labels,
      datasets,
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Data Entries Over Time',
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const date = context[0].label;
            return dayjs(date).format('MMM DD, YYYY');
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
        ticks: {
          callback: (value: any, index: number) => {
            const date = labels[index];
            return dayjs(date).format('MM/DD');
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  return <Line data={getChartData()} options={options} />;
};

export default DataChart;