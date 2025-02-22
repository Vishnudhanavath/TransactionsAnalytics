import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./utils/dbConnection.js";
import transactionRoute from "./routers/transactionRoute.js";
dotenv.config({});

const app = express();


// middlewares 
app.use(express.json());
app.use(cors());

const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;


app.use("/api/v1", transactionRoute);

app.listen(PORT,() => {
    dbConnection();
    console.log(`Server running at port ${PORT}`);
});