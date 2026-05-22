const btn = document.getElementById("btn");

btn.addEventListener("click", async () => {
  const text = document.getElementById("input").value;

  const doEl = document.getElementById("do");
  const dontEl = document.getElementById("dont");
  const actionEl = document.getElementById("action");

  doEl.innerText = "Loading...";
  dontEl.innerText = "Loading...";
  actionEl.innerText = "Thinking...";

  try {
    const res = await fetch("https://instant-relief.onrender.com/api/relief", {
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
    doEl.innerText = "-";
    dontEl.innerText = "-";
    actionEl.innerText = "Error connecting to server";
    console.error(err);
  }
});


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
    status.innerText = "Failed to send feedback.";
    console.error(err);
  }
});
