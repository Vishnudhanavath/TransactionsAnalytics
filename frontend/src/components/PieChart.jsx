import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { fetchPieChart } from "../services/api";
import Spinner from "./Spinner";
const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"];

const PieChartComponent = ({ month }) => {
    const [pieChartData, setPieChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPieChartData = async () => {
            setLoading(true);
            setError(""); // Reset error

            try {
                const response = await fetchPieChart(month);
                console.log("Fetched Pie Chart Data:", response.data);

                // Ensure the correct format
                const formattedData = response.data.map((item, index) => ({
                    name: item._id || `Category ${index + 1}`,
                    value: item.count || 0,
                    color: COLORS[index % COLORS.length],
                }));

                setPieChartData(formattedData);
            } catch (error) {
                console.error("Error fetching pie chart data:", error);
                setError("Failed to load pie chart data.");
            } finally {
                setLoading(false);
            }
        };

        fetchPieChartData();
    }, [month]);

    if (loading) return <Spinner/>;
    if (error) return <p className="error-message">{error}</p>;
    if (!pieChartData.length) return <p className="error-message">No category data available for {month}</p>;

    return (
        <div className="pie-chart-container" style={{ width: "100%", maxWidth: "400px", margin: "auto" }}>
            <h2 className="pie-chart-title">Category Distribution for {month}</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                    >
                        {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartComponent;
