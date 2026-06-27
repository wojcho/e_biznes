import { useState } from "react";
import {
  Chat,
  ChatMessages,
  ChatMessage,
  ChatInput,
} from "mantine-chat-components";
import { Container, Input, Stack } from "@mantine/core";
import { Select } from "@mantine/core";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  categoryId: number;
};

type Category = {
  id: number;
  name: string,
};

const API_BASE = "http://localhost:8080";

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products`);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`);

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

type ConversationPreset = {
  value: string;
  label: string;
  systemPrompt: string;
  initialUserMessage?: string;
};

const CONVERSATION_PRESETS: ConversationPreset[] = [
  {
    value: "general",
    label: "General assistant",
    systemPrompt: "You are a helpful assistant.",
    initialUserMessage: "",
  },
  {
    value: "catalog",
    label: "List products with categories",
    systemPrompt: "You are a shop assistant. You explain products clearly with prices and categories.",
    initialUserMessage: "Could you describe what products are available?",
  },
  {
    value: "categories",
    label: "Explain product categories",
    systemPrompt: "You are a shop assistant. You explain product categories with examples. Your description are imaginative and creative, to make the users more interested in these categories.",
    initialUserMessage: "Could you describe the product categories and give example products?",
  },
  {
    value: "cheapest",
    label: "Cheapest products",
    systemPrompt: "You are a shop assistant. You help users find the cheapest products. You appeal to thriftiness of users, and make them see how you help them choose best offers.",
    initialUserMessage: "What are the cheapest products you have?",
  },
  {
    value: "recommendations",
    label: "Recommended products",
    systemPrompt: "You are a shop assistant. You recommend products based on value. Do not write in a dry way. You can describe products fancifully, so the products would sell well.",
    initialUserMessage: "What products do you recommend?",
  },
];

const buildSystemPrompt = (
  preset: ConversationPreset,
  products: Product[],
  categories: Category[]
) => {
  const categoryMap = new Map(categories.map(c => [c.id, c.name]));

  const productLines = products.map(p => {
    const category = categoryMap.get(p.categoryId) ?? "Unknown";
    return `- ${p.name} | ${p.price} PLN/kg | Category: ${category}`;
  });

  return `
${preset.systemPrompt}

You have access to the following store data:

PRODUCTS:
${productLines.join("\n")}

CATEGORIES:
${categories.map(c => `- ${c.name}`).join("\n")}

Use this data when answering user questions.
  `.trim();
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("Username is required to use chat");
  const [preset, setPreset] = useState<string>("general");

  const applyPreset = async (presetValue: string) => {
    const selected = CONVERSATION_PRESETS.find(
      (p) => p.value === presetValue
    );

    if (!selected) return;

    try {
      const [products, categories] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);

      const systemPrompt = buildSystemPrompt(
        selected,
        products,
        categories
      );

      const newMessages: Message[] = [
        {
          role: "system",
          content: systemPrompt,
        },
      ];

      setMessages(newMessages);
      setInput(selected.initialUserMessage);

    } catch (err) {
      console.error("Failed to initialize conversation preset:", err);
    }
  };

  const appendStateMessage = async (newMessage: Message) => {
    setMessages(prev => {
      return [...prev, newMessage];
    });

    // Substitute user indicator for username when sending to message forwarding service
    const from =
      newMessage.role === "user"
        ? username
        : "assistant";

    const to =
      newMessage.role === "user"
        ? "assistant"
        : username;

    const payload = new URLSearchParams();
    payload.append("from", from);
    payload.append("to", to);
    payload.append("content", newMessage.content);
    payload.append("priority", "High"); // Always high priority for now

    try {
      await fetch("http://localhost:8080/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload.toString(),
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
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
              if (e.currentTarget.value.trim() === "assistant") {
                setUsernameError("User cannot be named assistant");
              }
              setUsername(e.currentTarget.value);
            }}
            error={usernameError}
          />
        </Input.Wrapper>

        { messages.length <= 1 && (<Select
          label="Conversation starter"
          value={preset}
          data={CONVERSATION_PRESETS.map((p) => ({
            value: p.value,
            label: p.label,
          }))}
          onChange={(value) => {
            if (!value) return;
            setPreset(value);
            applyPreset(value);
          }}
          disabled={!canUseChat}
        />)
        }
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
          loading={loading}
        />
      </Chat>
    </Container>
  );
}
