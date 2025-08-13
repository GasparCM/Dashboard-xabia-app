import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartData } from '../../types';

interface LineChartProps {
  data: ChartData;
  height?: number;
}

export const CustomLineChart: React.FC<LineChartProps> = ({ data, height = 300 }) => {
  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.datasets[0]?.data[index] || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="name" 
          stroke="#696969"
          fontSize={12}
        />
        <YAxis 
          stroke="#696969"
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
          }}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#00788A" 
          strokeWidth={2}
          dot={{ fill: '#00788A', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: '#005E6B' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};