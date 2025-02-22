import axios from "axios";
import Transaction from "../models/trasactionSchema.js";



// Initialize Database
export const initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json");

        const formattedData = response.data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            category: item.category,
            sold: item.sold,
            dateOfSale: new Date(item.dateOfSale)  // Ensure proper Date object
        }));

        await Transaction.deleteMany({});
        await Transaction.insertMany(formattedData);
        res.json({ message: "Database initialized successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Transactions with Search & Pagination
export const getTransactions = async (req, res) => {
    const { month, search = "", page = 1, perPage = 10 } = req.query;

    if (!month) {
        return res.status(400).json({ error: "Month parameter is required" });
    }

    // Convert month name to month number (January = 1, December = 12)
    const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;
    if (isNaN(monthIndex)) {
        return res.status(400).json({ error: "Invalid month name" });
    }

    try {
        // console.log(`Filtering transactions for month: ${month} (Index: ${monthIndex})`); // Debugging line

        // Query transactions where `dateOfSale` matches the selected month (ignoring year)
        const transactions = await Transaction.find({
            $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] }  // Extract month from date
        })
        .skip((page - 1) * perPage)
        .limit(Number(perPage));

        // console.log("Fetched Transactions:", transactions); // Debugging output

        res.json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: error.message });
    }
};



// Get Statistics

export const getStatistics = async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ error: "Month parameter is required" });
    }

    const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;
    if (isNaN(monthIndex)) {
        return res.status(400).json({ error: "Invalid month name" });
    }

    try {
        console.log(`Fetching statistics for month: ${month} (Index: ${monthIndex})`);

        // Check if MongoDB recognizes the month correctly
        const debugTransactions = await Transaction.find({
            $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] }
        });

        // console.log("Matched Transactions:", debugTransactions); // Debugging log

        const totalSales = await Transaction.aggregate([
            { 
                $match: { 
                    $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] } 
                }
            },
            { 
                $group: { 
                    _id: null, 
                    totalAmount: { $sum: "$price" }, 
                    soldCount: { $sum: { $cond: ["$sold", 1, 0] } } 
                } 
            }
        ]);

        const totalNotSold = await Transaction.countDocuments({ 
            $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] }, 
            sold: false 
        });

        // console.log("Aggregation Result:", totalSales); // Debugging log

        res.json({
            totalSalesAmount: totalSales[0]?.totalAmount || 0,
            totalSoldItems: totalSales[0]?.soldCount || 0,
            totalNotSoldItems: totalNotSold,
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({ error: error.message });
    }
};



// Get Bar Chart Data
export const getBarChartData = async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ error: "Month parameter is required" });
    }

    // Convert month name to a number (January = 1, December = 12)
    const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;
    if (isNaN(monthIndex)) {
        return res.status(400).json({ error: "Invalid month name" });
    }

    try {
        // console.log(`Fetching Bar Chart Data for month: ${month} (Index: ${monthIndex})`);

        const priceRanges = [100, 200, 300, 400, 500, 600, 700, 800, 900];
        const priceData = {};

        for (let i = 0; i < priceRanges.length; i++) {
            const min = i === 0 ? 0 : priceRanges[i - 1] + 1;
            const max = priceRanges[i];

            priceData[`${min}-${max}`] = await Transaction.countDocuments({
                $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] }, // Match month regardless of year
                price: { $gte: min, $lte: max },
            });
        }

        // Count items priced above 900
        priceData["901+"] = await Transaction.countDocuments({
            $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
            price: { $gt: 900 },
        });

        // console.log("Generated Bar Chart Data:", priceData); // Debugging log

        res.json(priceData);
    } catch (error) {
        console.error("Error fetching bar chart data:", error);
        res.status(500).json({ error: error.message });
    }
};


// Get Pie Chart Data

export const getPieChartData = async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ error: "Month parameter is required" });
    }

    const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;
    if (isNaN(monthIndex)) {
        return res.status(400).json({ error: "Invalid month name" });
    }

    try {
        console.log(`Fetching Pie Chart Data for month: ${month} (Index: ${monthIndex})`);

        const debugTransactions = await Transaction.find({
            $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] }
        }, { title: 1, category: 1, dateOfSale: 1 });


        const categoryData = await Transaction.aggregate([
            { 
                $match: { 
                    $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] }  
                }
            },
            { 
                $group: { 
                    _id: "$category", 
                    count: { $sum: 1 }  
                } 
            }
        ]);


        res.json(categoryData);
    } catch (error) {
        console.error("Error fetching pie chart data:", error);
        res.status(500).json({ error: error.message });
    }
};


// Get Combined Data
export const getCombinedData = async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ error: "Month parameter is required" });
    }

    try {

        const [statistics, barChart, pieChart] = await Promise.allSettled([
            axios.get(`http://localhost:5000/api/v1/statistics?month=${month}`), 
            axios.get(`http://localhost:5000/api/v1/bar-chart?month=${month}`),  
            axios.get(`http://localhost:5000/api/v1/pie-chart?month=${month}`),  
        ]);

        const statisticsData = statistics.status === "fulfilled" ? statistics.value.data : { error: "Statistics API failed" };
        const barChartData = barChart.status === "fulfilled" ? barChart.value.data : { error: "Bar Chart API failed" };
        const pieChartData = pieChart.status === "fulfilled" ? pieChart.value.data : { error: "Pie Chart API failed" };

        res.json({
            statistics: statisticsData,
            barChart: barChartData,
            pieChart: pieChartData,
        });
    } catch (error) {
        console.error("Error fetching combined data:", error.message);
        res.status(500).json({ error: "Failed to fetch combined data" });
    }
};
