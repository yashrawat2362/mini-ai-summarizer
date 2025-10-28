document.addEventListener("DOMContentLoaded", () => {
  const summarizeBtn = document.getElementById("summarize");
  const output = document.getElementById("output");

  summarizeBtn.addEventListener("click", async () => {
    output.innerText = "Extracting text...";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { type: "GET_PAGE_TEXT" },
        async (response) => {
          if (chrome.runtime.lastError) {
            output.innerText = "⚠️ Could not connect to content script. Try reloading the page.";
            console.error("Connection error:", chrome.runtime.lastError);
            return;
          }

          if (!response?.text) {
            output.innerText = "⚠️ Could not extract text. Try reloading the page.";
            return;
          }

          output.innerText = "Summarizing using Phi-3...";

          try {
            const res = await fetch("http://localhost:5050/summarize", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: response.text })
            });

            const data = await res.json();
            output.innerText =
              data.summary && data.summary.trim().length > 0
                ? data.summary
                : "No summary generated.";
          } catch (e) {
            output.innerText = "❌ Backend error: " + e.message;
          }
        }
      );
    });
  });
});
// --- Utility buttons ---
document.addEventListener("DOMContentLoaded", () => {
  const output = document.getElementById("output");
  const copyBtn = document.getElementById("copy");
  const clearBtn = document.getElementById("clear");
  const themeToggle = document.getElementById("toggle-theme");

  // Copy summary text
  copyBtn.addEventListener("click", async () => {
    const text = output.innerText.trim();
    if (!text || text === "Your summary will appear here...") {
      alert("No text to copy!");
      return;
    }
    await navigator.clipboard.writeText(text);
    copyBtn.innerText = "✅ Copied!";
    setTimeout(() => (copyBtn.innerText = "Copy"), 1500);
  });

  // Clear summary
  clearBtn.addEventListener("click", () => {
    output.innerText = "Your summary will appear here...";
  });

  // Dark/Light mode toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const mode = document.body.classList.contains("dark") ? "🌞 Light Mode" : "🌗 Dark Mode";
    themeToggle.innerText = mode;
  });
});
