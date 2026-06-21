import { useState } from "react";
import { readJsonResponse } from "../utils/api";

export function FloatingAgentChat({ role }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(event) {
    event.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessages((current) => [...current, { from: "You", text: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, role }),
      });
      const data = await readJsonResponse(response);
      setMessages((current) => [...current, { from: "Exam Agent", text: data.reply || data.message }]);
    } catch (error) {
      setMessages((current) => [...current, { from: "Exam Agent", text: error.message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="floating-agent">
      {open && (
        <section className="floating-agent-panel" aria-label="Exam chatbot">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Website Chatbot</p>
              <h2>Portal Assistant</h2>
            </div>
            <button className="secondary-btn" onClick={() => setOpen(false)}>Close</button>
          </div>
          <div className="floating-chat-log">
            {messages.length === 0 && <p className="muted">Ask anything about using this examination portal.</p>}
            {messages.map((item, index) => (
              <div className={`chat-message ${item.from === "You" ? "user" : "agent"}`} key={index}>
                <strong>{item.from}</strong>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
          <form className="chat-form" onSubmit={sendMessage}>
            <input
              placeholder="Ask about this portal..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
            <button className="primary-btn" disabled={loading} type="submit">{loading ? "..." : "Send"}</button>
          </form>
        </section>
      )}
      <button className="floating-agent-button" onClick={() => setOpen((value) => !value)}>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="chatbot-icon">
          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 8.8 8.8 0 0 1-3.9-.9L3 20l1.2-4.2A8.4 8.4 0 1 1 21 11.5Z" />
          <path d="M8 11h.01M12 11h.01M16 11h.01" />
        </svg>
      </button>
    </div>
  );
}
