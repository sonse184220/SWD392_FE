"use client";

import { Attachment } from "@ai-sdk/ui-utils";
import { Message } from "ai";
import React, { useRef, useState, useEffect } from "react";
import * as SubframeCore from "@subframe/core";
import { Button } from "@/subframe/components/Button";
import { DropdownMenu } from "@/subframe/components/DropdownMenu";
import { IconButton } from "@/subframe/components/IconButton";
import { AiChatSent } from "@/subframe/components/AiChatSent";
import { AiChatSuggestion } from "@/subframe/components/AiChatSuggestion";
import { MODEL_TO_FRIENDLY_NAME, SUPPORTED_MODELS } from "../../model-helpers";
import { axiosInstance } from "../../../axiosInstance";

// API function for sending messages to the backend
async function sendMessage(messageContent: string) {
  try {
    const response = await axiosInstance.post("/cityscout/ai/send-message", { message: messageContent });
    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

function AiChat() {
  const [model, setModel] = useState<SUPPORTED_MODELS>("gpt-4o-mini");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Define avatar URLs with fallback
  const USER_AVATAR = "tourists.jpg"; // Placeholder cho user avatar
  const AI_AVATAR = "cityscoutlogo.jpg"; // Placeholder cho AI avatar

  // Add a welcome message when the component mounts
  useEffect(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: "Hello! I'm your AI assistant. How can I help you today?",
      role: "assistant",
    };
    setMessages([welcomeMessage]);
  }, []);

  // Handle sending messages with custom API
  async function handleSendMessage() {
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      const messageContent = input;
      console.log("Sending message:", messageContent);
      setInput("");

      // Add user message to the chat
      const userMessage: Message = {
        id: Date.now().toString(),
        content: messageContent,
        role: "user",
        ...(attachment ? { experimental_attachments: [attachment] } : {}),
      };
      setMessages((prev) => [...prev, userMessage]);
      setAttachment(null);

      // Call the custom API endpoint
      const response = await sendMessage(messageContent);
      console.log("API Response:", response.data);

      // Add assistant response to the chat
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: response.data.message || response.data || "No response received",
        role: "assistant",
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Scroll to the latest message only if user is already at the bottom
      if (chatContainerRef.current) {
        const isAtBottom = chatContainerRef.current.scrollHeight - chatContainerRef.current.scrollTop === chatContainerRef.current.clientHeight;
        if (isAtBottom) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, there was an error processing your request. Please try again.",
        role: "assistant",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle suggestion clicks
  async function handleSuggestionClick(content: string) {
    try {
      setIsLoading(true);
      const userMessage: Message = { id: Date.now().toString(), content, role: "user" };
      setMessages((prev) => [...prev, userMessage]);

      const response = await sendMessage(content);
      console.log("API Response from suggestion:", response.data);

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: response.data.message || response.data || "No response received",
        role: "assistant",
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Scroll to the latest message only if user is already at the bottom
      if (chatContainerRef.current) {
        const isAtBottom = chatContainerRef.current.scrollHeight - chatContainerRef.current.scrollTop === chatContainerRef.current.clientHeight;
        if (isAtBottom) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }
    } catch (error) {
      console.error("Failed to handle suggestion:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), content: "Error processing suggestion.", role: "assistant" },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container max-w-none flex h-full w-full flex-col items-center gap-8 bg-default-background pt-16 pr-8 pl-8">
      <div className="flex w-full max-w-[768px] items-center gap-6">
        <div className="flex grow shrink-0 basis-0 items-center gap-3">
          <SubframeCore.Icon
            className="text-heading-2 font-heading-2 text-default-background"
            name="FeatherMessageCircle"
          />
          <SubframeCore.DropdownMenu.Root>
            <SubframeCore.DropdownMenu.Trigger asChild={true}>
              <Button variant="neutral-tertiary">{MODEL_TO_FRIENDLY_NAME[model]}</Button>
            </SubframeCore.DropdownMenu.Trigger>
            <SubframeCore.DropdownMenu.Portal>
              <SubframeCore.DropdownMenu.Content side="bottom" align="start" sideOffset={4} asChild={true}>
                <DropdownMenu>
                  {Object.entries(MODEL_TO_FRIENDLY_NAME).map(([key, value]) => (
                    <DropdownMenu.DropdownItem
                      key={key}
                      icon={null}
                      onSelect={() => setModel(key as SUPPORTED_MODELS)}
                    >
                      {value}
                    </DropdownMenu.DropdownItem>
                  ))}
                </DropdownMenu>
              </SubframeCore.DropdownMenu.Content>
            </SubframeCore.DropdownMenu.Portal>
          </SubframeCore.DropdownMenu.Root>
        </div>
        <div className="flex items-center gap-3">
          <SubframeCore.DropdownMenu.Root>
            <SubframeCore.DropdownMenu.Trigger asChild={true}>
              <IconButton icon="FeatherMoreHorizontal" />
            </SubframeCore.DropdownMenu.Trigger>
            <SubframeCore.DropdownMenu.Portal>
              <SubframeCore.DropdownMenu.Content side="bottom" align="start" sideOffset={4} asChild={true}>
                <DropdownMenu>
                  <DropdownMenu.DropdownItem icon={null} onClick={() => setMessages([])}>
                    Delete
                  </DropdownMenu.DropdownItem>
                </DropdownMenu>
              </SubframeCore.DropdownMenu.Content>
            </SubframeCore.DropdownMenu.Portal>
          </SubframeCore.DropdownMenu.Root>
        </div>
      </div>
      <div className="flex w-full max-w-[768px] flex-col items-start">
        {/* Chat container with fixed height and scroll */}
        <div
          ref={chatContainerRef}
          className="chat-container h-[calc(100vh-300px)] overflow-y-auto pb-4"
        >
          <div className="flex w-full flex-col items-start gap-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-wrapper ${message.role === "user" ? "user" : "assistant"}`}
              >
                <AiChatSent
                  avatar={message.role === "user" ? USER_AVATAR : AI_AVATAR}
                  className={`message-content ${message.role === "user" ? "user" : "assistant"}`}
                  onError={(e) => console.log(`Avatar failed to load for ${message.role}:`, e)} // Xử lý lỗi tải avatar
                >
                  <div className="flex flex-col gap-3">
                    <span className="grow shrink-0 basis-0 text-body font-body text-default-font">
                      {message.content}
                    </span>
                    {message.experimental_attachments && (
                      <div className="flex items-center gap-3">
                        <img
                          className="h-12 w-12 flex-none object-cover rounded-md"
                          alt={message.experimental_attachments[0].name}
                          src={message.experimental_attachments[0].url}
                          onError={(e) => console.log(`Attachment failed to load:`, e)} // Xử lý lỗi tải attachment
                        />
                      </div>
                    )}
                  </div>
                </AiChatSent>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="flex flex-wrap items-start gap-4 self-center">
                <AiChatSent
                  avatar={AI_AVATAR}
                  className="message-content assistant"
                  onError={(e) => console.log(`Welcome avatar failed to load:`, e)}
                >
                  <div className="flex flex-col gap-3">
                    <span className="grow shrink-0 basis-0 text-body font-body text-default-font">
                      Start chatting with me! Pick a suggestion below or type your message.
                    </span>
                  </div>
                </AiChatSent>
                <AiChatSuggestion
                  text="Plan a relaxing day"
                  onClick={() =>
                    handleSuggestionClick(
                      "Could you help me plan a relaxing day that focuses on activities for rejuvenation? To start, can you ask me what my favorite forms of relaxation are?"
                    )
                  }
                />
                <AiChatSuggestion
                  text="Thank my interviewer"
                  onClick={() =>
                    handleSuggestionClick(
                      "Write 2-3 sentences to thank my interviewer, reiterating my excitement for the job opportunity while keeping it cool. Don't make it too formal."
                    )
                  }
                />
                <AiChatSuggestion
                  text="Fun fact about Roman Empire"
                  onClick={() => handleSuggestionClick("Tell me a random fun fact about the Roman Empire")}
                />
              </div>
            )}
          </div>
        </div>
        {/* Input container fixed at the bottom */}
        <div className="w-full max-w-[768px] bg-default-background p-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".png,.jpeg,.gif,.webp"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (!event.target.files) return;
              const file = event.target.files[0];
              const reader = new FileReader();
              reader.onload = (e) => {
                if (e.target?.result && typeof e.target.result === "string") {
                  setAttachment({
                    name: file.name,
                    url: e.target.result,
                    contentType: file.type,
                  });
                }
              };
              reader.readAsDataURL(file);
            }}
          />
          <div className="flex w-full items-end gap-3 overflow-hidden rounded-2xl bg-neutral-100 pt-4 pr-6 pb-4 pl-6">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <IconButton variant="brand-tertiary" />
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content side="top" align="start" sideOffset={4} asChild={true}>
                  <DropdownMenu>
                    <DropdownMenu.DropdownItem
                      icon="FeatherImage"
                      onSelect={() => fileInputRef.current?.click()}
                    >
                      Add image
                    </DropdownMenu.DropdownItem>
                  </DropdownMenu>
                </SubframeCore.DropdownMenu.Content>
              </SubframeCore.DropdownMenu.Portal>
            </SubframeCore.DropdownMenu.Root>
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6">
              {attachment && (
                <div className="flex flex-col items-start gap-3 pl-6">
                  <div className="flex items-start gap-3 relative group">
                    <img
                      className="h-12 w-12 flex-none object-cover rounded-md"
                      alt={attachment.name}
                      src={attachment.url}
                      onError={(e) => console.log(`Attachment preview failed to load:`, e)}
                    />
                    <IconButton
                      className="absolute -right-2 -top-2 hidden group-hover:flex rounded-full"
                      variant="neutral-primary"
                      size="small"
                      icon="FeatherX"
                      onClick={() => setAttachment(null)}
                    />
                  </div>
                </div>
              )}
              <div className="flex w-full items-center gap-3">
                <input
                  type="text"
                  placeholder="Chat with me..."
                  value={input}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setInput(event.target.value)}
                  onKeyDown={async (event) => {
                    if (event.key === "Enter" && !isLoading) {
                      await handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                  className="chat-input h-auto grow shrink-0 basis-0 rounded-lg border border-gray-300 p-2"
                />
              </div>
            </div>
          </div>
          <span className="w-full text-caption font-caption text-subtext-color text-center mt-2">
            AI can make mistakes. Always double check the source.
          </span>
        </div>
      </div>
    </div>
  );
}

export default AiChat;