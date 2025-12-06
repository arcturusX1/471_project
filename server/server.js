import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const startServer = async()=>{
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, ()=>(`Server on port ${PORT}`))
}

startServer();