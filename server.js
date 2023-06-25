import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import cors from "cors";
// routes
import userRoute from "./routes/userRoute.js";
import ticketRoute from "./routes/ticketRoute.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/tickets", ticketRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log("listening on port", PORT));
