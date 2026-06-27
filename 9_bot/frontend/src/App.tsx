import { useState } from "react";
import {
  Chat,
  ChatMessages,
  ChatMessage,
  ChatInput,
} from "mantine-chat-components";
import { Container, Input, Button, Stack } from "@mantine/core";

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
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("Username is required to use chat");

  const appendStateMessage = async (newMessage: Message) => {
    setMessages(prev => {
      const next = [...prev, newMessage];

      // void fetch("http://localhost:8000/", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(newMessage),
      // });

      return next;
    });
  };

  const sendMessage = async () => {
    if (!username.trim()) {
      setUsernameError("Username is required to use chat");
      return;
    }

    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setInput("");
    setLoading(true);

    appendStateMessage(userMessage);

    try {
      const res = await fetch("http://localhost:8000/api/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([...messages, userMessage]),
      });

      const assistantMessage = await res.json();

      appendStateMessage(assistantMessage);
    } finally {
      setLoading(false);
    }
  };

  const canUseChat = username.trim().length > 0;

  return (
    <Container size="sm" py="xl">
      <Stack mb="md">
        <Input.Wrapper
          label="Username"
          error={usernameError}
          required
        >
          <Input
            placeholder="Enter your username..."
            value={username}
            onChange={(e) => {
              if (e.currentTarget.value.trim()) {
                setUsernameError("");
              } else {
                setUsernameError("Username is required to use chat");
              }
              setUsername(e.currentTarget.value);
            }}
            error={usernameError}
          />
        </Input.Wrapper>
      </Stack>

      {/* Chat */}
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
            <ChatMessage sender="assistant">
              Assistant is typing...
            </ChatMessage>
          )}
        </ChatMessages>

        <ChatInput
          withEmojiPicker={false}
          withFileUpload={false}
          value={input}
          onValueChange={setInput}
          onSubmit={sendMessage}
          disabled={!canUseChat}
        />
      </Chat>
    </Container>
  );
}