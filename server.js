import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import Ticket from "./models/ticketModel.js";

// routes
import userRoute from "./routes/userRoute.js";
import ticketRoute from "./routes/ticketRoute.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://peaceful-cranachan-00a32d.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
const server = http.createServer(app);

const connectedSockets = new Set();

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  connectedSockets.add(socket);
  function emitToAllConnectedDevices(event, data) {
    connectedSockets.forEach((socket) => {
      socket.emit(event, data);
    });
  }
  console.log(`User Connected: ${socket.id}`);

  socket.on("chat", (payload) => {
    console.log(payload, "chat");
    Ticket.find({ _id: payload.ticketId }).then((data) => {
      console.log(`Ticket: ${data}`);
      emitToAllConnectedDevices("newMessage", data[0].messages);
    });
  });

  socket.on("sendChat", (payload) => {
    Ticket.updateOne(
      { _id: payload.ticketId },
      {
        $push: {
          messages: { sender: payload.sender, content: payload.content },
        },
      }
    ).then((data) => {
      Ticket.find({ _id: payload.ticketId }).then((updatedTicket) => {
        emitToAllConnectedDevices("updatedMessage", updatedTicket[0].messages);
      });
    });
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
    connectedSockets.delete(socket);
  });
});
app.use("/api/users", userRoute);
app.use("/api/tickets", ticketRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8081;
server.listen(PORT, () => console.log("listening on port", PORT));
