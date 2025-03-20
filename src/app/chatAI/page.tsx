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
import { IoIosAttach } from "react-icons/io";
import { getMessageChat } from "@/services/AI/getMessagesChat";

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
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const USER_AVATAR = "tourists.jpg"; 
  const AI_AVATAR = "cityscoutlogo.jpg";

  // Fetch initial messages from API
  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await getMessageChat();
        const messagePairs = response.data.map((msg: { prompt: string; response: string }) => [
          { role: "user", content: msg.prompt, id: Date.now().toString() + Math.random() },
          { role: "assistant", content: msg.response, id: Date.now().toString() + Math.random() },
        ]);
        const fetchedMessages = messagePairs.reverse().flat(); // Đảo ngược các cặp, rồi làm phẳng
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Lỗi khi lấy tin nhắn:", error);
      }
    }
    fetchMessages();
  }, []);

  async function handleSendMessage() {
    if (!input.trim()) return;
  
    try {
      setIsLoading(true);
      const messageContent = input;
      setInput("");
  
      const userMessage: Message = {
        id: Date.now().toString(),
        content: messageContent,
        role: "user",
        ...(attachment ? { experimental_attachments: [attachment] } : {}),
      };
      setMessages((prev) => [...prev, userMessage]);
      setAttachment(null);
  
      const response = await sendMessage(messageContent);
      const assistantContent = response.data.response || response.data.message || "No response received";
  
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: assistantContent,
        role: "assistant",
      };
      setMessages((prev) => [...prev, assistantMessage]);
  
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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

  async function handleSuggestionClick(content: string) {
    try {
      setIsLoading(true);
      const userMessage: Message = { id: Date.now().toString(), content, role: "user" };
      setMessages((prev) => [...prev, userMessage]);
  
      const response = await sendMessage(content);
      const assistantContent = response.data.response || response.data.message || "No response received";
  
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: assistantContent,
        role: "assistant",
      };
      setMessages((prev) => [...prev, assistantMessage]);
  
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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
      <div className="flex w-full max-w-[1200px] items-center gap-6">
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
      <div className="flex w-full max-w-[1200px] mt-[15px] flex-col items-start">
        {/* Chat container */}
        <div
          ref={chatContainerRef}
          className="chat-container h-[calc(100vh-300px)] overflow-y-auto pb-4"
        >
          <div className="flex w-full flex-col items-start gap-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-wrapper ${message.role === "user" ? "user" : "assistant"}`}
              >
                <AiChatSent
                  avatar={message.role === "user" ? USER_AVATAR : AI_AVATAR}
                  className={`message-content ${message.role === "user" ? "user" : "assistant"}`}
                  onError={(e) => console.log(`Avatar failed to load for ${message.role}:`, e)}
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
                          onError={(e) => console.log(`Attachment failed to load:`, e)}
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
                      Start chatting with CityScout! Pick a suggestion below or type your message.
                    </span>
                  </div>
                </AiChatSent>
                <AiChatSuggestion
                  text="Điểm du lịch nổi bật"
                  onClick={() =>
                    handleSuggestionClick(
                      "Bạn có thể giới thiệu cho tôi một số điểm du lịch nổi bật ở Việt Nam không? Hãy gợi ý cả địa điểm thiên nhiên và văn hóa nhé!"
                    )
                  }
                />
                <AiChatSuggestion
                  text="Lịch trình du lịch 3 ngày"
                  onClick={() =>
                    handleSuggestionClick(
                      "Tôi muốn lên lịch trình du lịch 3 ngày ở Việt Nam. Bạn có thể gợi ý những địa điểm đẹp, món ăn ngon và các hoạt động thú vị không?"
                    )
                  }
                />
                <AiChatSuggestion
                  text="Món ăn đường phố Việt Nam"
                  onClick={() =>
                    handleSuggestionClick(
                      "Gợi ý cho tôi một số món ăn đường phố ngon nhất ở Việt Nam mà du khách không nên bỏ lỡ!"
                    )
                  }
                />
                <AiChatSuggestion
                  text="Bãi biển đẹp ở Việt Nam"
                  onClick={() =>
                    handleSuggestionClick(
                      "Bạn có thể giới thiệu cho tôi một số bãi biển đẹp nhất ở Việt Nam không? Tôi muốn tìm nơi thư giãn và tận hưởng thiên nhiên."
                    )
                  }
                />
                <AiChatSuggestion
                  text="Trải nghiệm văn hóa Việt Nam"
                  onClick={() =>
                    handleSuggestionClick(
                      "Tôi muốn tìm hiểu về văn hóa Việt Nam. Bạn có thể gợi ý những hoạt động hoặc lễ hội mà tôi nên tham gia không?"
                    )
                  }
                />
              </div>
            )}
          </div>
        </div>
        <div className="w-full max-w-[1200px] mx-auto bg-white shadow-lg rounded-2xl p-3 mt-3 mb-2">
          {/* Attachment Preview */}
          {attachment && (
            <div className="flex items-center gap-3 p-2 bg-gray-100 rounded-lg mb-2 relative">
              <img
                src={attachment.url}
                alt={attachment.name}
                className="h-14 w-14 object-cover rounded-md"
              />
              <button
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                onClick={() => setAttachment(null)}
              >
                X
              </button>
            </div>
          )}

          {/* Chat Input & Button Container */}
          <div className="flex items-center gap-4 bg-gray-100 rounded-full p-5">
            {/* Input + Attachment Button */}
            <div className="flex items-center flex-grow gap-3">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => fileInputRef.current?.click()}
              >
                <IoIosAttach size={24} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".png,.jpeg,.gif,.webp"
                onChange={(event) => {
                  if (!event.target.files) return;
                  const file = event.target.files[0];
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    if (e.target?.result && typeof e.target.result === "string") {
                      setAttachment({ name: file.name, url: e.target.result });
                    }
                  };
                  reader.readAsDataURL(file);
                }}
              />
              <input
                type="text"
                placeholder="Chat with me..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-500"
              />
            </div>
            {/* Send Button */}
            <div>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-full 
                          hover:bg-blue-600 hover:shadow-lg hover:scale-105 
                          transition-all duration-300 ease-in-out"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-2">
            AI can make mistakes. Always double-check the source.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AiChat;