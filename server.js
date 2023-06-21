import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

// routes
import userRoute from "./routes/userRoute.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use("/api/users", userRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log("listening on port", PORT));
