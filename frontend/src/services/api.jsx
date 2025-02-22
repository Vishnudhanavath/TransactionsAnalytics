import axios from "axios";

const API_BASE_URL = "https://transactionsanalytics-1.onrender.com/api/v1";

export const fetchTransactions = async (month = "", search = "", page = 1, perPage = 10) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/transactions`, { 
            params: { month, search, page, perPage } 
        });

        console.log("API Response Data:", response.data);
        return {
            transactions: response.data.transactions || response.data || [], 
            totalPages: response.data.totalPages || 1
        };
    } catch (error) {
        console.error("API Error:", error);
        return { transactions: [], totalPages: 1 };
    }
};

export const fetchStatistics = (month) => {
    return axios.get(`${API_BASE_URL}/statistics`, { params: { month } });
    
};

export const fetchBarChart = (month) => {
    return axios.get(`${API_BASE_URL}/bar-chart`, { params: { month } });
};

export const fetchPieChart = (month) => {
    return axios.get(`${API_BASE_URL}/pie-chart`, { params: { month } });
};

export const fetchCombinedData = (month) => {
    return axios.get(`${API_BASE_URL}/combined`, { params: { month } });
};
