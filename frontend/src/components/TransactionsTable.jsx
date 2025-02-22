
import React, { useState, useEffect } from "react";
import { fetchTransactions } from "../services/api";


const TransactionsTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [month, setMonth] = useState("March");

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setDebouncedSearch(search.trim());  
        }, 300); 
    
        return () => clearTimeout(delayDebounce);
    }, [search]);
    


    useEffect(() => {
        const fetchFilteredTransactions = async () => {
            try {
                console.log("Fetching transactions for:", { month, debouncedSearch, page });
    
                const response = await fetchTransactions(month, debouncedSearch, page);
                
                console.log("Full API Response:", response);
                if (Array.isArray(response.transactions)) {
                    setTransactions(response.transactions);
                    setTotalPages(response.totalPages || 1);
                } else {
                    setTransactions([]); 
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setTransactions([]); 
            }
        };
    
        fetchFilteredTransactions();
    }, [month, debouncedSearch, page]); 
    

    return (
        <div className="transactions-container">
            <h2 className="transactions-title">Transactions for {month}</h2>
            <select className="month-selector" value={month} onChange={(e) => { setMonth(e.target.value); setPage(1); }}>
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                    .map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input className="search-input" type="text" placeholder="Search transactions..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            {transactions.length > 0 ? (
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Sold</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id}>
                                <td>{tx.title}</td>
                                <td>${tx.price}</td>
                                <td>{tx.category}</td>
                                <td>{tx.sold ? "Yes" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-results">No Transactions Found</p>
            )}

            <div className="pagination-buttons">
                <button 
                    className="pagination-btn prev" 
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
                    disabled={page === 1}
                >
                    ❮ Previous
                </button>

                <span className="page-info">Page {page} of {totalPages}</span>

                <button 
                    className="pagination-btn next" 
                    onClick={() => setPage(prev => (prev < totalPages ? prev + 1 : prev))} 
                    disabled={page >= totalPages}
                >
                    Next ❯
                </button>
            </div>

        </div>
    );
};

export default TransactionsTable;
