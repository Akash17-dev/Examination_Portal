import { useState } from "react";

export function AgentChat({ role }) {
  const [message, setMessage] = useState("Create exam instructions for a 30-minute quiz.");
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
      const data = await response.json();
      setMessages((current) => [...current, { from: "Gemini", text: data.ok ? data.reply : data.message }]);
    } catch (error) {
      setMessages((current) => [...current, { from: "Gemini", text: error.message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel wide" id="faculty-agent">
      <p className="eyebrow">Website Chatbot</p>
      <h2>Portal Assistant</h2>
      <div className="chat-window">
        {messages.length === 0 && <p className="muted">Ask about quiz setup, exam rules, or grading workflow.</p>}
        {messages.map((item, index) => (
          <div className={`chat-message ${item.from === "You" ? "user" : "agent"}`} key={index}>
            <strong>{item.from}</strong>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={sendMessage}>
        <input value={message} onChange={(event) => setMessage(event.target.value)} />
        <button className="primary-btn" disabled={loading} type="submit">{loading ? "Sending..." : "Send"}</button>
      </form>
    </section>
  );
}
