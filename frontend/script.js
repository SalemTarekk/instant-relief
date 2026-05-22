const input = document.getElementById("userInput");
const button = document.getElementById("generateBtn");
const output = document.getElementById("output");

button.addEventListener("click", async () => {
  const text = input.value.trim();

  if (!text) return;

  // 1. INSTANT FEEDBACK (IMPORTANT FOR SPEED PERCEPTION)
  button.innerText = "Generating...";
  button.disabled = true;

  output.innerHTML = `
    <div class="card do">DO: understanding situation...</div>
    <div class="card dont">DON'T: filtering distractions...</div>
    <div class="card action">ACTION: thinking...</div>
  `;

  // 2. MICRO LOADING EVOLUTION (FEELS FAST)
  setTimeout(() => {
    document.querySelector(".action").innerText = "ACTION: analyzing problem...";
  }, 300);

  setTimeout(() => {
    document.querySelector(".action").innerText = "ACTION: building your plan...";
  }, 700);

  try {
    // 3. CALL BACKEND
    const res = await fetch("https://instant-relief.onrender.com/api/relief", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    // 4. FINAL RESULT (REPLACE UI)
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
        <h3>ACTION (2 MIN)</h3>
        <p>${data.action}</p>
      </div>
    `;

  } catch (err) {
    output.innerHTML = `
      <div class="card dont">
        Something went wrong. Try again.
      </div>
    `;
  }

  // 5. RESET BUTTON
  button.innerText = "Generate";
  button.disabled = false;
});
