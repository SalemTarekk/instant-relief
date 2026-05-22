const input = document.getElementById("userInput");
const button = document.getElementById("generateBtn");
const output = document.getElementById("output");

button.addEventListener("click", async () => {
  const text = input.value.trim();
  if (!text) return;

  // INSTANT FEEDBACK
  button.innerText = "Thinking...";
  button.disabled = true;

  output.innerHTML = `
    <div class="card do">DO: analyzing...</div>
    <div class="card dont">DON'T: filtering distractions...</div>
    <div class="card action">ACTION: thinking...</div>
  `;

  // MICRO LOADING (INSIDE FUNCTION)
  setTimeout(() => {
    const actionBox = document.querySelector(".action");
    if (actionBox) actionBox.innerText = "ACTION: building your plan...";
  }, 400);

  try {
    const res = await fetch("https://instant-relief.onrender.com/api/relief", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    // FINAL RESULT
    output.innerHTML = `
      <div class="card do">
        <h3>DO</h3>
        <p>${data.do}</p>
      </div>

      <div class="card dont">
        <h3>DON'T</h3>
        <p>${data.dont}</p>
      </div>

      <div class="card action">
        <h3>ACTION</h3>
        <p>${data.action}</p>
      </div>
    `;

  } catch (err) {
    output.innerHTML = `
      <div class="card dont">
        Error. Try again.
      </div>
    `;
  }

  // RESET BUTTON
  button.innerText = "Generate";
  button.disabled = false;
});
