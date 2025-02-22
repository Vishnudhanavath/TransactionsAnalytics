import React from "react";

const StatisticsCard = ({ statistics, month }) => {
    return (
        <div className="statistics-card">
            <h2>Statistics for {month}</h2>
            <p><strong>Total Sales Amount:</strong> ${statistics.totalSalesAmount}</p>
            <p><strong>Total Sold Items:</strong> {statistics.totalSoldItems}</p>
            <p><strong>Total Not Sold Items:</strong> {statistics.totalNotSoldItems}</p>
        </div>
    );
};

export default StatisticsCard;
