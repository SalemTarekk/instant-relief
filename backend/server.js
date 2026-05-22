const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const executionPrompt = require("./prompts/executionPrompt");
const suggestionPrompt = require("./prompts/suggestionPrompt");

const app = express();

// ---------------------
// MIDDLEWARE
// ---------------------
app.use(cors());
app.use(express.json());

// ---------------------
// HEALTH CHECK
// ---------------------
app.get("/", (req, res) => {
  res.send("Server working");
});

// ---------------------
// RELIEF ENDPOINT
// ---------------------
app.post("/api/relief", async (req, res) => {
  try {
    const userText = req.body.text;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: executionPrompt },
          { role: "user", content: userText }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = response.data.choices[0].message.content;

    try {
      const cleaned = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return res.json(JSON.parse(cleaned));
    } catch (err) {
      console.log("RAW AI OUTPUT:", content);

      return res.json({
        do: ["Start small"],
        dont: ["Avoid overthinking"],
        action: "Do the first tiny step only"
      });
    }
  } catch (error) {
    console.error("Relief error:", error.message);

    return res.status(500).json({
      do: [],
      dont: [],
      action: "Server error"
    });
  }
});

// ---------------------
// SUGGESTIONS ENDPOINT
// ---------------------
app.get("/api/suggestions", async (req, res) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: suggestionPrompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = response.data.choices[0].message.content;

    try {
      const parsed = JSON.parse(content);
      return res.json({ suggestions: parsed });
    } catch (err) {
      console.log("RAW SUGGESTIONS:", content);

      return res.json({
        suggestions: [
          "I have an exam tomorrow but I haven't started",
          "I keep procrastinating",
          "I feel overwhelmed",
          "I waste time on my phone",
          "I don’t know where to start"
        ]
      });
    }
  } catch (error) {
    console.error("Suggestions error:", error.message);

    return res.json({
      suggestions: []
    });
  }
});

// ---------------------
// START SERVER (IMPORTANT FIX)
// ---------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});