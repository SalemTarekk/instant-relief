const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const executionPrompt = require("./prompts/executionPrompt");
const suggestionPrompt = require("./prompts/suggestionPrompt");

const app = express();

app.use(cors());
app.use(express.json());

/* -----------------------------
   HEALTH CHECK
------------------------------ */
app.get("/", (req, res) => {
  res.send("Server working");
});

/* -----------------------------
   MAIN EXECUTION ENDPOINT
   /api/relief
------------------------------ */
app.post("/api/relief", async (req, res) => {
  try {
    const userText = req.body.text;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: executionPrompt
          },
          {
            role: "user",
            content: userText
          }
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

    let parsed;

    try {
      const cleaned = content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.log("RAW AI OUTPUT:", content);

      return res.json({
        do: ["Open the task area"],
        dont: ["Don't overthink"],
        action: "Start with the smallest possible step"
      });
    }

    res.json(parsed);

  } catch (error) {
    console.error("Server error:", error.message);

    res.status(500).json({
      do: [],
      dont: [],
      action: "Server error"
    });
  }
});

/* -----------------------------
   SUGGESTIONS ENDPOINT
   /api/suggestions
------------------------------ */
app.get("/api/suggestions", async (req, res) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: suggestionPrompt
          }
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

    let suggestions;

    try {
      suggestions = JSON.parse(content);
    } catch (err) {
      console.log("RAW SUGGESTIONS:", content);

      suggestions = [
        "I have an exam tomorrow but I still haven't started studying",
        "I keep procrastinating instead of working",
        "I feel overwhelmed and don't know where to begin",
        "I waste time scrolling on my phone",
        "I have too many tasks and feel stuck"
      ];
    }

    res.json({ suggestions });

  } catch (error) {
    console.error("Suggestions error:", error.message);

    res.json({
      suggestions: []
    });
  }
});

/* -----------------------------
   START SERVER
------------------------------ */
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});