# 🧠 Mini AI Summarizer (Local Phi-3 Browser Extension)

A Chrome extension that summarizes any webpage using a **local AI model (Phi-3 via Ollama)** — no API key, no cloud, 100% offline!

---

## 🚀 Features
- 🧩 Works with local models like **Phi-3**, **Llama3**, etc. through [Ollama](https://ollama.ai/)
- 🌐 Extracts and summarizes webpage content directly
- 🖥️ Clean popup UI (copy, clear, dark mode)
- 🔒 100% private — all processing runs locally

---

## 🏗️ Tech Stack
- **Frontend:** Chrome Extension (HTML, CSS, JS)
- **Backend:** Node.js + Express
- **AI Engine:** [Ollama](https://ollama.ai/) with **Phi-3**
- **Language:** JavaScript (ES Modules)

---

## ⚙️ Setup Instructions

### 1. Run Local AI Server
Make sure you have [Ollama](https://ollama.ai/) installed and pull a model:
```bash
ollama pull phi3
