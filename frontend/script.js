const API_BASE = "https://instant-relief.onrender.com";

// ELEMENTS
const btn = document.getElementById("btn");

const doEl = document.getElementById("do");
const dontEl = document.getElementById("dont");
const actionEl = document.getElementById("action");

const suggestionsContainer = document.getElementById("suggestions");

const followupText = document.getElementById("followupText");

// ------------------------------
// RELIEF ACTION
// ------------------------------
btn.addEventListener("click", async () => {
  const text = document.getElementById("input").value;

  btn.innerText = "Thinking...";
  btn.disabled = true;

  actionEl.classList.add("loading");

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

    saveHistory(text, data.action);

  } catch (err) {
    console.error(err);

    doEl.innerText = "-";
    dontEl.innerText = "-";
    actionEl.innerText = "Server error";
  }

  actionEl.classList.remove("loading");

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

loadSuggestions();

// ------------------------------
// FOLLOW-UP
// ------------------------------
async function requestFollowup(type) {
  const text = document.getElementById("input").value;

  const currentAction = actionEl.innerText;

  followupText.innerText = "Thinking...";

  try {
    const res = await fetch(`${API_BASE}/api/followup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        currentAction,
        type
      })
    });

    const data = await res.json();

    followupText.innerText = data.reply;

  } catch (err) {
    console.error(err);

    followupText.innerText =
      "Take an even smaller step.";
  }
}

document
  .getElementById("smallerStepBtn")
  .addEventListener("click", () => {
    requestFollowup("smaller");
  });

document
  .getElementById("stuckBtn")
  .addEventListener("click", () => {
    requestFollowup("stuck");
  });

// ------------------------------
// HISTORY
// ------------------------------
function saveHistory(input, action) {
  const history =
    JSON.parse(localStorage.getItem("reliefHistory")) || [];

  history.unshift({
    input,
    action
  });

  localStorage.setItem(
    "reliefHistory",
    JSON.stringify(history.slice(0, 10))
  );

  renderHistory();
}

function renderHistory() {
  const container = document.getElementById("history");

  const history =
    JSON.parse(localStorage.getItem("reliefHistory")) || [];

  container.innerHTML = "";

  history.forEach(item => {
    const div = document.createElement("div");

    div.className = "history-item";

    div.innerHTML = `
      <strong>${item.input}</strong>
      <p>${item.action}</p>
    `;

    container.appendChild(div);
  });
}

renderHistory();

// ------------------------------
// THEME TOGGLE
// ------------------------------
const themeBtn = document.getElementById("themeToggle");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// ------------------------------
// FEEDBACK
// ------------------------------
const sendBtn =
  document.getElementById("sendFeedbackBtn");

sendBtn.addEventListener("click", async () => {
  const feedback =
    document.getElementById("feedbackInput").value;

  const status =
    document.getElementById("feedbackStatus");

  if (!feedback.trim()) {
    status.innerText =
      "Please write feedback first.";

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

    status.innerText =
      "Thanks! Feedback sent 🙌";

    document.getElementById("feedbackInput").value = "";

  } catch (err) {
    console.error(err);

    status.innerText =
      "Failed to send feedback.";
  }
});