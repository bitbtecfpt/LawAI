import { MockChatService } from "./MockChatService";

const API_URL = "http://localhost:8000/api/v1/chat";

export const ChatService = {

  async createChat(token, prompt = "Hello") {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
   
      const data = await response.json();
      
      // Kiểm tra dữ liệu có hợp lệ không
      if (!data || !data.id) {
        console.error("Dữ liệu không hợp lệ, Fallback mock up data.");
        return MockChatService.createChat(); // Sử dụng mock nếu API thất bại
      }
  
      return data;
    } catch (error) {
      console.error("Lỗi tạo chat mới:", error);
      return MockChatService.createChat(); // Tránh crash bằng cách sử dụng mock
    }
  },

  async renameChat(chatId, newTitle, token) {
    try {
      const response = await fetch(`${API_URL}/${chatId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: newTitle })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error renaming chat:", error);
      return null;
    }
  },
  
  async deleteChat(chatId, token) {
    try {
      const response = await fetch(`${API_URL}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return true;
    } catch (error) {
      console.error("Error deleting chat:", error);
      return false;
    }
  },
  
  async sendMessage(chatId, prompt, token) {
    try {
        const response = await fetch(`${API_URL}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Full API Response:", data);  // Log toàn bộ phản hồi API

        // Lấy dữ liệu đúng key từ API response
        if (data?.message) {
            return { message: data.data.content };
        } else if (data?.data?.response) {
            return { message: data.data.response }; 
        } else {
            throw new Error("Invalid response structure");
        }

    } catch (error) {
        console.error("Error sending message:", error);
        return null;
    }
  }
};