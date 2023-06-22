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

// @desc    Get all Tickets
// @route   POST /api/tickets/getAllTickets
// @access  Admin
const getAllTickets = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number, defaults to 1
  const perPage = 1; // Number of items per page
  const skip = (page - 1) * perPage; // Number of items to skip

  const tickets = await Ticket.find().skip(skip).limit(perPage).exec();

  // Count total number of tickets
  const totalTickets = await Ticket.countDocuments().exec();

  res.json({
    tickets,
    currentPage: page,
    totalPages: Math.ceil(totalTickets / perPage),
  });
});

// @desc    Get all Tickets
// @route   POST /api/tickets/getUserTickets
// @access  Private
const getUserTickets = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number, defaults to 1
  const perPage = 1; // Number of items per page
  const skip = (page - 1) * perPage; // Number of items to skip

  const tickets = await Ticket.find({ user: req.user._id })
    .skip(skip)
    .limit(perPage)
    .exec();

  // Count total number of tickets
  const totalTickets = await Ticket.find({ user: req.user._id })
    .countDocuments()
    .exec();

  res.json({
    tickets,
    currentPage: page,
    totalPages: Math.ceil(totalTickets / perPage),
  });
});

export { createTicket, getAllTickets, getUserTickets };
