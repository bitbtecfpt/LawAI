import { useState, useEffect } from "react";
import ChatArea from "./components/ChatArea";
import Sidebar from "./components/Sidebar";
import { ChatService } from "./services/ChatService";

const App = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const token = process.env.REACT_APP_OPENAI_API_KEY;
  
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await ChatService.createChat(token);
        setChats(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setChats([]);
      }
    };
    fetchChats();
  }, [token]);
  
  const handleNewChat = async () => {
    try {
      const newChat = await ChatService.createChat(token);
      if (!newChat || !newChat.id) return;
      setChats((prevChats) => [...prevChats, newChat]);
      setCurrentChat(newChat);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };
  
  return (
    <div className="flex h-screen">
      <Sidebar
        chats={chats}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
        onNewChat={handleNewChat}
        setChats={setChats}
      />
      {currentChat && (
        <ChatArea chat={chats.find(c => c.id === currentChat.id)} setChats={setChats} />
      )}
    </div>
  );
};

export default App;