const suggestionPrompt = `
You generate 5 relatable real-life stress or procrastination situations.

Target users:
- students
- young adults
- people feeling overwhelmed or stuck

Rules:
- very short sentences
- emotionally realistic
- natural language
- globally understandable English
- no explanation
- no numbering
- no emojis

Focus on:
- procrastination
- exam stress
- overthinking
- burnout
- distraction
- pressure

Return ONLY a valid JSON array of strings.

Example format:
[
  "I have an exam tomorrow but I still haven't started studying",
  "I keep scrolling on my phone instead of working",
  "I feel overwhelmed and don't know where to begin"
]
`;

module.exports = suggestionPrompt;