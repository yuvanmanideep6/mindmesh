require("dotenv").config();

const express = require("express");
const cors = require("cors");

const messageRoutes = require("./routes/messages");
const connectDB = require("./config/db");
const authMiddleware = require("./middleware/authMiddleware");
const authRoutes = require("./routes/auth");
const workspaceRoutes = require("./routes/workspace");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/messages", messageRoutes);

// Protected test route
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed protected route",
    user: req.user
  });
});

app.get("/", (req, res) => {
  res.send("MindMesh API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});