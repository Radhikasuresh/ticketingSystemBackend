import asyncHandler from "express-async-handler";
import Ticket from "../models/ticketModel.js";

// @desc    Create a Ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    selectLanguage,
    availableFrom,
    availableTo,
  } = req.body;
  const ticket = new Ticket({
    user: req.user._id,
    title,
    description,
    category,
    selectLanguage,
    availableFrom,
    availableTo,
  });

  const createdTicket = await ticket.save();
  res.status(201).json(createdTicket);
});

export { createTicket };
