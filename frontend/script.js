const API_BASE = "https://instant-relief.onrender.com";

// ------------------------------
// ELEMENTS
// ------------------------------
const btn = document.getElementById("btn");

const doEl = document.getElementById("do");
const dontEl = document.getElementById("dont");
const actionEl = document.getElementById("action");

const suggestionsContainer = document.getElementById("suggestions");

// ------------------------------
// RELIEF ACTION
// ------------------------------
btn.addEventListener("click", async () => {
  const text = document.getElementById("input").value;

  btn.innerText = "Thinking...";
  btn.disabled = true;

  doEl.innerText = "Loading...";
  dontEl.innerText = "Loading...";
  actionEl.innerText = "Thinking...";

  try {
    const res = await fetch(`${API_BASE}/api/relief`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    doEl.innerText = data.do || "-";
    dontEl.innerText = data.dont || "-";
    actionEl.innerText = data.action || "No action returned";

  } catch (err) {
    console.error(err);
    doEl.innerText = "-";
    dontEl.innerText = "-";
    actionEl.innerText = "Server error";
  }

  btn.innerText = "Get Action Plan";
  btn.disabled = false;
});


// ------------------------------
// SUGGESTIONS
// ------------------------------
async function loadSuggestions() {
  try {
    const res = await fetch(`${API_BASE}/api/suggestions`);
    const data = await res.json();

    suggestionsContainer.innerHTML = "";

    (data.suggestions || []).forEach(item => {
      const btn = document.createElement("button");
      btn.innerText = item;

      btn.addEventListener("click", () => {
        document.getElementById("input").value = item;
      });

      suggestionsContainer.appendChild(btn);
    });

  } catch (err) {
    console.error("Suggestions failed:", err);
  }
}

// Load on page start
loadSuggestions();


// ------------------------------
// FEEDBACK (EMAILJS)
// ------------------------------
const sendBtn = document.getElementById("sendFeedbackBtn");

sendBtn.addEventListener("click", async () => {
  const feedback = document.getElementById("feedbackInput").value;
  const status = document.getElementById("feedbackStatus");

  if (!feedback.trim()) {
    status.innerText = "Please write feedback first.";
    return;
  }

  status.innerText = "Sending...";

  try {
    await emailjs.send(
      "service_rn89e0o",
      "template_80u0g9o",
      {
        message: feedback
      }
    );

    status.innerText = "Thanks! Feedback sent 🙌";
    document.getElementById("feedbackInput").value = "";

  } catch (err) {
    console.error(err);
    status.innerText = "Failed to send feedback.";
  }
});