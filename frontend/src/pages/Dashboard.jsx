import React, { useEffect, useState } from "react";
import { fetchCombinedData } from "../services/api";
import TransactionsTable from "../components/TransactionsTable";
import StatisticsCard from "../components/StatisticsCard";
import BarChartComponent from "../components/BarChart";
import PieChartComponent from "../components/PieChart";
import Spinner from "../components/Spinner";

const Dashboard = () => {
    const [month, setMonth] = useState("March");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCombinedData(month).then((response) => setData(response.data));
        setLoading(false);
    }, [month]);
    return (
        <div className="dashboard-bg-container">
            <h1>Transactions Dashboard</h1>
            <div className="month-select-container">
                <select 
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="select-month"
                >
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                        .map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>
            
            {loading ? <Spinner/> : data && (
                <div className="dashboard-content">
                        <StatisticsCard statistics={data.statistics}  month={month} />
                        <BarChartComponent barChartData={data.barChart} month = {month}/>
                        <PieChartComponent pieChartData={data.pieChart} month = {month}/>
                        <TransactionsTable month={month} />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
