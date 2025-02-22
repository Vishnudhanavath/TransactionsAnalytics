import mongoose from "mongoose";

const transactionScehma = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    category: String,
    sold: Boolean,
    dateOfSale: { type: Date, required: true }
},{timestamps:true});

const  Transaction = mongoose.model("Transaction",transactionScehma);
export default Transaction;