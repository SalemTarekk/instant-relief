const API_BASE = "https://instant-relief.onrender.com";

const btn = document.getElementById("btn");

const doEl = document.getElementById("do");
const dontEl = document.getElementById("dont");
const actionEl = document.getElementById("action");

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    doEl.innerText = data.do || "-";
    dontEl.innerText = data.dont || "-";
    actionEl.innerText = data.action || "No action returned";

  } catch (err) {
    doEl.innerText = "-";
    dontEl.innerText = "-";
    actionEl.innerText = "Server error";
  }

  btn.innerText = "Get Action Plan";
  btn.disabled = false;
});


// ------------------------------
// SUGGESTIONS (FIXED)
// ------------------------------
async function loadSuggestions() {
  try {
    const res = await fetch(`${API_BASE}/api/suggestions`);
    const data = await res.json();

    const container = document.getElementById("suggestions");

    container.innerHTML = (data.suggestions || [])
      .map(item => `<button onclick="fillInput('${item}')">${item}</button>`)
      .join("");

  } catch (err) {
    console.log("Suggestions failed", err);
  }
}

function fillInput(text) {
  document.getElementById("input").value = text;
}

loadSuggestions();


// ------------------------------
// FEEDBACK
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
      { message: feedback }
    );

    status.innerText = "Thanks! Feedback sent 🙌";
    document.getElementById("feedbackInput").value = "";

  } catch (err) {
    status.innerText = "Failed to send feedback.";
  }
});