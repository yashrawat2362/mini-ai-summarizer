console.log("✅ content script loaded");

try {
  const documentClone = document.cloneNode(true);
  const article = new Readability(documentClone).parse();
  const cleanText = article?.textContent || document.body.innerText;

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "GET_PAGE_TEXT") {
      sendResponse({ text: cleanText });
    }
  });
} catch (err) {
  console.error("❌ Readability error:", err);
}
