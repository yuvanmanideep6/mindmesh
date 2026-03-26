const express = require("express");
const Workspace = require("../models/Workspace");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create workspace
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;

    const workspace = await Workspace.create({
      title,
      user: req.user.id
    });

    res.status(201).json(workspace);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's workspaces
router.get("/", authMiddleware, async (req, res) => {
  try {
    const workspaces = await Workspace.find({ user: req.user.id });
    res.json(workspaces);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;