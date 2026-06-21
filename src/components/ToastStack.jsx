export function ToastStack({ messages }) {
  return (
    <div className="toast-stack" aria-live="polite">
      {messages.map((message) => (
        <div className="toast" key={message.id}>{message.text}</div>
      ))}
    </div>
  );
}
