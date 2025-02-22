import React from "react";
import { useState } from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { Link } from "react-router-dom";
import { GrTransaction } from "react-icons/gr";
import { MdLightMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
const Navbar = () => {
    const[mode, setMode] = useState("darkMode");
    return (
        <nav className="navbg-container">
            <ul className="navbar-list">
                <Link to="/dashboard" className="navbar-list-link"><li className="navbar-list-item"> <MdSpaceDashboard  className="navbar-icons"/>Dashboard</li></Link>
                <Link to="/transactions" className="navbar-list-link"><li className="navbar-list-item"><GrTransaction className="navbar-icons"/> Transactions</li></Link>
               
            </ul>
        </nav>
    );
};

export default Navbar;




