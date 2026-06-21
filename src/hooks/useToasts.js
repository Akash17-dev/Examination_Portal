import { useState } from "react";

export function useToasts() {
  const [messages, setMessages] = useState([]);

  function pushToast(text) {
    const id = Date.now();
    setMessages((current) => [...current, { id, text }]);
    window.setTimeout(() => {
      setMessages((current) => current.filter((message) => message.id !== id));
    }, 2400);
  }

  return { messages, pushToast };
}
