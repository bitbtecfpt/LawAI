export const MockChatService = {
     
    async getChats() {
        return [
            { id: 1, title: "JuriAI", messages: [] }
        ];
    },

    async createChat() {
        const id = Date.now();
        console.log("Tạo chat mới với ID:", id);
        return { id, title: `New Chat`, messages: [] };
    },    
  
    async sendMessage(chatId, prompt) {
        try {
            console.log("Gửi tin nhắn đến mock API:", prompt);

            const apiKey = process.env.REACT_APP_OPENAI_API_KEY || "";
    
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "gpt-4-turbo",
                    messages: [
                        { role: "system", content: "Bạn là trợ lý tư vấn Bất động sản." },
                        { role: "user", content: prompt }
                    ]
                })
            });
    
            console.log("Phản hồi từ OpenAI API:", response);
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("Dữ liệu nhận được:", data);
    
            const botMessage = data.choices?.[0]?.message?.content || "Xin lỗi, tôi không thể trả lời ngay lúc này.";
    
            return {
                id: chatId,
                messages: [
                    { id: Date.now(), text: prompt, sender: "user" },
                    { id: Date.now() + 1, text: botMessage, sender: "bot" }
                ]
            };
        } catch (error) {
            console.error("Lỗi gửi tin nhắn tới chatbot API:", error);
            return {
                id: chatId,
                messages: [
                    { text: "Lỗi kết nối API, vui lòng thử lại sau.", sender: "bot" }
                ]
            };
        }
    }    
};
