import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fetchBarChart } from "../services/api"; // ✅ Correct API function
import Spinner from "./Spinner";
const BarChartComponent = ({ month }) => {
    const [barChartData, setBarChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBarChartData = async () => {
            setLoading(true);
            setError(""); // Reset error before fetching

            try {
                const response = await fetchBarChart(month);
                console.log("Fetched Bar Chart Data:", response.data);

                // Ensure the data is in the correct format
                const formattedData = Array.isArray(response.data)
                    ? response.data
                    : Object.keys(response.data).map((range) => ({
                          priceRange: range,
                          count: response.data[range],
                      }));

                setBarChartData(formattedData);
            } catch (error) {
                console.error("Error fetching bar chart data:", error);
                setError("Failed to load bar chart data.");
            } finally {
                setLoading(false);
            }
        };

        fetchBarChartData();
    }, [month]);

    if (loading) return <Spinner/>;
    if (error) return <p className="error-message">{error}</p>;
    if (!barChartData.length) return <p className="error-message">No price range data available for {month}</p>;

    return (
        <div className="bar-chart-container" style={{ width: "100%", maxWidth: "600px", margin: "auto" }}>
            <h2 className="bar-chart-title">Price Range Distribution for {month}</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="priceRange" tick={{ fontSize: 14 }} />
                    <YAxis tick={{ fontSize: 14 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4F46E5" radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartComponent;
