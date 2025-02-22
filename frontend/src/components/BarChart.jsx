import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const BarChartComponent = ({ barChartData, month }) => {
    const chartData = Object.keys(barChartData).map((range) => ({
        priceRange: range,
        count: barChartData[range],
    }));

    return (
        <div className="bar-chart-container">
            <h2 className="bar-chart-title">Price Range Distribution for {month}</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} barSize={50}>
                    <XAxis dataKey="priceRange" tick={{ fontSize: 14 }} />
                    <YAxis tick={{ fontSize: 14 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4F46E5" radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartComponent;
