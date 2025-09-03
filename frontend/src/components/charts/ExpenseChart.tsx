import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchExpenses } from 'src/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

type ExpenseChartProps = {
    groupId?: number;
    width?: number;
    height?: number;
};

const ExpenseChart: React.FC<ExpenseChartProps> = ({ groupId, width = 400, height = 400 }) => {
    if (!groupId) return <div>Please provide a groupId to load expenses.</div>;

    const { data = [], isLoading, error } = useQuery(
        ['groupExpenses', groupId],
        () => fetchExpenses(groupId),
        { enabled: !!groupId }
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading expenses</div>;
    if (!data.length) return <div>No expenses to display</div>;

    const pieData = data.map((expense: any) => ({
        name: expense.description || `Expense #${expense.id}`,
        value: Number(expense.total_amount ?? expense.total_value ?? 0),
    }));

    return (
        <PieChart width={width} height={height}>
            <Pie
                data={pieData}
                cx={width / 2}
                cy={height / 2}
                labelLine={false}
                label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={Math.min(width, height) / 4}
                fill="#8884d8"
                dataKey="value"
            >
                {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
};

export default ExpenseChart;