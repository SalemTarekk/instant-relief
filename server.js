const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const executionPrompt = require("./prompts/executionPrompt");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Server working");
});

// Main AI endpoint
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
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = response.data.choices[0].message.content;

    // Ensure clean JSON output
    let parsed;

try {
  // clean possible markdown or extra text
  const cleaned = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  parsed = JSON.parse(cleaned);

} catch (err) {
  console.log("RAW AI OUTPUT:", content);

  return res.json({
    do: "Error: AI returned invalid format",
    dont: "",
    action: "Try again"
  });
}

    // Send structured response to frontend
    res.json(parsed);

  } catch (error) {
    console.error("Server error:", error.message);

    res.status(500).json({
      do: "",
      dont: "",
      action: "Server error"
    });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});