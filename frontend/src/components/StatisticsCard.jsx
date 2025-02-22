import React, { useState, useEffect } from "react";
import { fetchStatistics } from "../services/api";
import Spinner from "./Spinner";
const StatisticsCard = ({ month }) => {
    const [statistics, setStatistics] = useState([]); // Initialize as null for better error handling
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStatisticsData = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await fetchStatistics(month);
                console.log("Fetched Statistics:", response.data);

                if (!response.data) {
                    throw new Error("No data returned from API");
                }

                // Assuming response.data has the fields you need
                setStatistics(response.data);
            } catch (error) {
                console.error("Error fetching statistics:", error);
                setError("Failed to load statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchStatisticsData();
    }, [month]);

    if (loading) return <Spinner/>;
    if (error) return <p className="error-message">{error}</p>;
    if (!statistics) return <p className="error-message">No data available for {month}</p>;

    return (
        <div className="statistics-card">
            <h2>Statistics for {month}</h2>
            <p><strong>Total Sales Amount:</strong> ${statistics.totalSalesAmount || 0}</p>
            <p><strong>Total Sold Items:</strong> {statistics.totalSoldItems || 0}</p>
            <p><strong>Total Not Sold Items:</strong> {statistics.totalNotSoldItems || 0}</p>
        </div>
    );
};

export default StatisticsCard;
