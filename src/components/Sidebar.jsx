import { useState } from "react";  
import { ChatService } from "../services/ChatService";  

const Sidebar = ({ chats = [], currentChat, setCurrentChat, onNewChat, setChats }) => {  
  const [editChatId, setEditChatId] = useState(null);  
  const [newTitles, setNewTitles] = useState({});  
  
  const handleRename = async (chatId) => {
    const newTitle = newTitles[chatId] || "";
    if (!newTitle.trim()) return;
    setChats((prevChats) => prevChats.map(chat => chat.id === chatId ? { ...chat, title: newTitle } : chat));
    setEditChatId(null);
  };

  const handleDelete = async (chatId) => {  
    try {  
      await ChatService.deleteChat(chatId);  
      
      setChats((prevChats) => prevChats.filter(chat => chat.id !== chatId));  
      if (currentChat?.id === chatId) {  
        setCurrentChat(null);  
      }  
    } catch (error) {  
      console.error("Error deleting chat:", error);  
    }  
  };

  return (  
    <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col shadow-lg shadow-gray-700/50 ">  
      <button className="p-2 bg-gray-700 rounded-lg mb-4 shadow-md" onClick={onNewChat}>
        + New Chat
      </button>  
      <ul>  
        {chats.length > 0 ? (  
          chats.map((chat) => (  
            <li key={chat.id} className="flex justify-between items-center p-2 bg-gray-700 rounded-lg mb-2 shadow-md">  
              {editChatId === chat.id ? (  
                <input  
                  className="text-black flex-grow bg-gray-600 text-white p-1 rounded"
                  value={newTitles[chat.id] || chat.title}  
                  onChange={(e) => setNewTitles({ ...newTitles, [chat.id]: e.target.value })}  
                  onBlur={() => handleRename(chat.id)}  
                  autoFocus  
                />  
              ) : (  
                <span className="flex-grow cursor-pointer" onClick={() => setCurrentChat(chat)}>{chat.title}</span>  
              )}  
              <div className="flex space-x-2">  
                <button onClick={() => setEditChatId(chat.id)}>✏</button>  
                <button onClick={() => handleDelete(chat.id)}>🗑</button>  
              </div>  
            </li>  
          ))  
        ) : (  
          <p className="text-gray-400">No chats available</p>  
        )}  
      </ul>  
    </div>  
  );  
};  

export default Sidebar;
