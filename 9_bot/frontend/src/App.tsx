import { useState } from "react";
import {
  Chat,
  ChatMessages,
  ChatMessage,
  ChatInput,
} from "mantine-chat-components";
import { Container } from "@mantine/core";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessages),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, data]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Chat h={400}>
        <ChatMessages>
          {messages
            .filter((m) => m.role !== "system")
            .map((m, i) => (
              <ChatMessage
                key={i}
                sender={m.role === "user" ? "user" : "assistant"}
              >
                {m.content}
              </ChatMessage>
            ))}

          {loading && (
            <ChatMessage sender="assistant">Assistant is typing...</ChatMessage>
          )}
        </ChatMessages>

        <ChatInput
          withEmojiPicker={false}
          withFileUpload={false}
          value={input}
          onValueChange={setInput}
          onSubmit={sendMessage}
        />
      </Chat>
    </Container>
  );
}
