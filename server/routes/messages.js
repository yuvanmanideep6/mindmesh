const express = require("express");
const mongoose = require("mongoose");
const Groq = require("groq-sdk");

const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { workspaceId, content } = req.body;

    const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);

    const userMessage = await Message.create({
      workspace: workspaceObjectId,
      sender: "user",
      content
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: content
        }
      ]
    });

    const aiText = completion.choices[0].message.content;

    const aiMessage = await Message.create({
      workspace: workspaceObjectId,
      sender: "ai",
      content: aiText
    });

    res.json({
      userMessage,
      aiMessage
    });

  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:workspaceId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      workspace: req.params.workspaceId
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;