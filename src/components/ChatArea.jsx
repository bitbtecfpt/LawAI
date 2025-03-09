import { useState, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { ChatService } from "../services/ChatService";

const ChatArea = ({ chat, setChats }) => {
  const [input, setInput] = useState("");
  const [chatTitle, setChatTitle] = useState(chat?.title || "Untitled Chat");
  const [isTyping, setIsTyping] = useState(false); // Effect "bot sending..."
  const token =  process.env.REACT_APP_OPENAI_API_KEY;

  useEffect(() => {
    setChatTitle(chat?.title || "Untitled Chat");
  }, [chat]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { 
      id: Date.now(), 
      text: input, 
      sender: "user", 
      timestamp: new Date().toISOString() 
    };
    setInput("");

    // Hiển thị tin nhắn của user ngay lập tức
    setChats((prevChats) =>
      prevChats.map((c) =>
        c.id === chat.id ? { ...c, messages: [...(c.messages || []), userMessage] } : c
      )
    );

    setIsTyping(true); // Hiển thị hiệu ứng "Bot đang gõ..."

    try {
      console.log("Gửi tin nhắn:", input);
      const response = await ChatService.sendMessage(chat.id, input, token);

      if (response && response.message) {
        console.log("Phản hồi từ API:", response.message);

        const botMessage = { 
          id: Date.now() + 1, 
          text: response.message, 
          sender: "bot", 
          timestamp: new Date().toISOString() 
        };

        setChats((prevChats) =>
          prevChats.map((c) =>
            c.id === chat.id
              ? { ...c, messages: [...(c.messages || []), botMessage] }
              : c
          )
        );
      } else {
        console.warn("API không trả về tin nhắn hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    } finally {
      setIsTyping(false); // Tắt hiệu ứng "Bot đang gõ..."
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      {/* Tiêu đề chat */}
      <h1 className="text-2xl font-bold text-center bg-green-600 text-white p-4">
        {chatTitle}
      </h1>

      {/* Khu vực hiển thị tin nhắn */}
      <div className="flex-1 p-4 overflow-y-auto">
        {chat?.messages?.length > 0 ? (
          chat.messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              text={msg.text} 
              sender={msg.sender} 
              timestamp={msg.timestamp} 
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">No messages yet</p>
        )}

        {/* Hiển thị hiệu ứng "Bot đang gõ..." */}
        {isTyping && (
          <p className="text-gray-500 italic text-sm text-center">Bot sending...</p>
        )}
      </div>

      {/* Ô nhập tin nhắn */}
      <div className="p-4 bg-gray-200 flex items-center">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Enter a message..."
        />
        <button className="ml-2 p-2 bg-green-700 text-white rounded-lg" onClick={sendMessage}>
           ▶
        </button>
      </div>
    </div>
  );
};

export default ChatArea;