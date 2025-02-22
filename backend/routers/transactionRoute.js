import express from "express";

import {initializeDatabase,getBarChartData,getCombinedData,getPieChartData,getStatistics,getTransactions}from "../controllers/transactionController.js";
const router = express.Router();

router.get("/init", initializeDatabase);
router.get("/transactions", getTransactions);
router.get("/statistics", getStatistics);
router.get("/bar-chart", getBarChartData);
router.get("/pie-chart", getPieChartData);
router.get("/combined", getCombinedData);

export default router;
