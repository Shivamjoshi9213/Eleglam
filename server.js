import express from "express";
import morgan from "morgan";
import colors from "colors";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/DBconfig.js";
import bodyParser from "body-parser";
import userRoute from "./routes/userRoute.js";

// dotenv config
dotenv.config();


// mongo db connection
connectDB();

const app = express();

// middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors("*"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("server is running");
});

app.use("/api/v1/user",userRoute)

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server is listining on port ${PORT}`.bgCyan);
});
