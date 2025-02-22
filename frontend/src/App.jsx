import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TransactionsTable from "./components/TransactionsTable";
import Navbar from "./components/Navbar";


import "./style/style.css";

const App = () => {
    return (
        <Router>
              <Navbar />
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/transactions" element={<TransactionsTable month="March" />} />
                    <Route path="*" element={<h2>404 - Page Not Found</h2>} />
                </Routes>
        </Router>
    );
};

export default App;
