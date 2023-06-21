import express from "express";
const router = express.Router();

import { createTicket } from "../controllers/ticketController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

router.route("/").post(protect, createTicket);

export default router;
