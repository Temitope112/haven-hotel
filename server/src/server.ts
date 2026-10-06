import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import roomRoutes from "./routes/room.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Haven Hotel API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/rooms", roomRoutes);

app.use("/api/bookings", bookingRoutes);
app.use(
  "/api/admin",
  adminRoutes,
);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});