import React, { useState, useCallback } from "react";
import { pipeline } from "@xenova/transformers";

function Message({ message }) {
  return (
    <div
      style={{
        padding: "8px",
        margin: "4px",
        borderLeft:
          message.role === "user" ? "2px solid blue" : "2px solid green",
      }}
    >
      <strong>{message.role}:</strong>
      <span> {message.content}</span>
    </div>
  );
}

function Test() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleUserInput = useCallback(async () => {
    try {
      const generator = await pipeline(
        "text-generation",
        "Xenova/Qwen1.5-0.5B-Chat"
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: inputValue },
      ]);

      const text = generator.tokenizer.apply_chat_template(messages, {
        tokenize: false,
        add_generation_prompt: true,
      });

      const output = await generator(text, {
        max_new_tokens: 128,
        do_sample: false,
        return_full_text: false,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: output[0].generated_text },
      ]);
      setInputValue("");
    } catch (error) {
      console.error("Failed to generate response", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "system", content: "An error occurred." },
      ]);
    }
  }, [inputValue, messages]);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Hello, World!</h1>
      <div>
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ width: "100%", padding: "8px", margin: "4px 0" }}
      />
      <button
        onClick={handleUserInput}
        style={{
          width: "100%",
          padding: "8px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
        }}
      >
        Send
      </button>
    </div>
  );
}

export default Test;
